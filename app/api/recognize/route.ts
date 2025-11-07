import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image_file') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '请上传图片文件' },
        { status: 400 }
      );
    }

    // 检查文件大小（限制为 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: '图片文件过大，请上传小于10MB的图片' },
        { status: 400 }
      );
    }

    // 将图片转换为 base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 获取图片格式
    const mimeType = imageFile.type;
    let imageFormat = 'jpeg'; // 默认格式

    if (mimeType === 'image/png') {
      imageFormat = 'png';
    } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      imageFormat = 'jpeg';
    } else if (mimeType === 'image/webp') {
      imageFormat = 'webp';
    }

    // 构建 data URL
    const dataUrl = `data:image/${imageFormat};base64,${base64Image}`;

    console.log('Image info:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      mimeType: imageFile.type,
      imageFormat: imageFormat,
      base64Length: base64Image.length,
    });

    // 调用火山引擎 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ep-20251107102053-4xcpg',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请详细识别这张图片的内容，包括：1. 图片中的主要物体和场景 2. 图片中的文字（如果有）3. 图片的整体风格和特点',
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Volcano API error:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', response.headers);
      return NextResponse.json(
        { error: `图片识别失败：${errorText || '请稍后重试'}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 提取识别结果
    const content = data.choices?.[0]?.message?.content || '无法识别图片内容';

    return NextResponse.json({
      success: true,
      content: content,
      rawData: data,
    });
  } catch (error) {
    console.error('Error recognizing image:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
