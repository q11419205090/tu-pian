'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('realistic');
  const [size, setSize] = useState<string>('1024x1024');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const styles = [
    { value: 'realistic', label: '写实风格', icon: '📷' },
    { value: 'anime', label: '动漫风格', icon: '🎨' },
    { value: 'oil-painting', label: '油画风格', icon: '🖼️' },
    { value: 'watercolor', label: '水彩风格', icon: '🎭' },
    { value: 'sketch', label: '素描风格', icon: '✏️' },
    { value: 'cyberpunk', label: '赛博朋克', icon: '🌃' }
  ];

  const sizes = [
    { value: '512x512', label: '512×512' },
    { value: '1024x1024', label: '1024×1024' },
    { value: '1024x1792', label: '1024×1792 (竖版)' },
    { value: '1792x1024', label: '1792×1024 (横版)' }
  ];

  const examplePrompts = [
    '一只可爱的橘猫坐在窗台上看着外面的雨',
    '未来城市的夜景，霓虹灯闪烁',
    '宁静的湖面上倒映着雪山',
    '一个魔法森林，发光的蘑菇和萤火虫'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('请输入描述文字');
      return;
    }

    setIsGenerating(true);

    // 模拟生成过程
    setTimeout(() => {
      // 这里应该调用实际的AI生图API
      const newImage: GeneratedImage = {
        url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        prompt: prompt,
        timestamp: Date.now()
      };
      setGeneratedImages([newImage, ...generatedImages]);
      setIsGenerating(false);
    }, 3000);
  };

  const downloadImage = (url: string, prompt: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            AI生图
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            文字描述生成精美图片
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                描述你想要的图片
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片描述
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="详细描述你想要生成的图片..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  示例提示词
                </label>
                <div className="space-y-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                风格选择
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      style === s.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {s.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片尺寸
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {sizes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? '生成中...' : '生成图片'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                生成结果
              </h2>

              {isGenerating && (
                <div className="flex flex-col items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI正在创作中，请稍候...
                  </p>
                </div>
              )}

              {!isGenerating && generatedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>输入描述并点击生成按钮开始创作</p>
                </div>
              )}

              {!isGenerating && generatedImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((image) => (
                    <div
                      key={image.timestamp}
                      className="group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                    >
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                        <div className="p-4 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-sm mb-3 line-clamp-2">
                            {image.prompt}
                          </p>
                          <button
                            onClick={() => downloadImage(image.url, image.prompt)}
                            className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            下载图片
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            使用技巧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                详细描述
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                提供详细的场景、物体、颜色、光线等描述，生成效果更好
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                选择风格
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                根据需求选择合适的艺术风格，让图片更符合预期
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                多次尝试
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI生成具有随机性，可以多次生成选择最满意的结果
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
