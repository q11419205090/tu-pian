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

    // 创建发送给 remove.bg API 的 FormData
    const apiFormData = new FormData();
    apiFormData.append('image_file', imageFile);
    apiFormData.append('size', 'auto');

    // 调用 remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'XL22HxdYjuGsk7rYN1MuK63M',
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      return NextResponse.json(
        { error: '背景移除失败，请稍后重试' },
        { status: response.status }
      );
    }

    // 获取处理后的图片数据
    const imageBuffer = await response.arrayBuffer();

    // 返回处理后的图片
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="no-bg.png"',
      },
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
