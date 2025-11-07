import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：增加函数超时时间
export const maxDuration = 60; // 最大执行时间 60 秒
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '请输入生图提示词' },
        { status: 400 }
      );
    }

    // 调用火山引擎图片生成 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ep-20251107205705-d6njf',
        prompt: prompt,
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Volcano API error:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', response.headers);
      return NextResponse.json(
        { error: `图片生成失败：${errorText || '请稍后重试'}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 提取生成的图片 URL
    const imageUrl = data.data?.[0]?.url || '';

    if (!imageUrl) {
      return NextResponse.json(
        { error: '未能获取生成的图片' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      rawData: data,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
