import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：增加函数超时时间和请求体大小限制
export const maxDuration = 60; // 最大执行时间 60 秒
export const dynamic = 'force-dynamic';

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

    // 检查文件大小（Vercel 限制，Base64 编码后约增加 33%，所以限制为 3MB）
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: '图片文件过大，请上传小于3MB的图片（Vercel 部署限制）' },
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
      estimatedRequestSize: Math.round(base64Image.length / 1024) + ' KB'
    });

    // 检查 base64 大小是否会超过 Vercel 限制
    const estimatedSize = base64Image.length;
    const maxBase64Size = 4 * 1024 * 1024; // 4MB base64 限制
    if (estimatedSize > maxBase64Size) {
      return NextResponse.json(
        { error: '图片编码后过大，请尝试上传更小的图片或压缩后再上传' },
        { status: 413 }
      );
    }

    // 调用火山引擎 API
    console.log('Calling Volcano API...');
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

    // 提供更详细的错误信息
    let errorMessage = '服务器错误，请稍后重试';

    if (error instanceof Error) {
      // 检查是否是网络错误
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，图片可能过大，请尝试上传较小的图片';
      } else {
        errorMessage = `处理失败：${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
