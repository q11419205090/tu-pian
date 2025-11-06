'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedUrl('');
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // 模拟处理过程
    setTimeout(() => {
      // 这里应该调用实际的背景移除API
      // 目前使用原图作为演示
      setProcessedUrl(previewUrl);
      setIsProcessing(false);
    }, 2000);
  };

  const downloadProcessed = () => {
    if (!processedUrl) return;

    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `no-bg_${selectedFile?.name || 'image.png'}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            抠图去背景
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            智能识别主体，一键去除背景
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              上传图片
            </h2>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">点击上传</span> 或拖拽图片到此处
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    支持 PNG, JPG, JPEG
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {selectedFile && (
              <>
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    使用提示
                  </h3>
                  <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• 主体清晰的图片效果更好</li>
                    <li>• 建议使用高分辨率图片</li>
                    <li>• 处理时间约2-5秒</li>
                  </ul>
                </div>

                <button
                  onClick={removeBackground}
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '处理中...' : '开始去背景'}
                </button>
              </>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              效果预览
            </h2>

            {previewUrl ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    原图
                  </h3>
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="原图"
                      className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                {processedUrl && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        去背景后
                      </h3>
                      <div className="relative">
                        {/* Checkerboard background to show transparency */}
                        <div className="absolute inset-0 rounded-lg" style={{
                          backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}></div>
                        <img
                          src={processedUrl}
                          alt="去背景后"
                          className="relative w-full h-64 object-contain rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <p className="text-green-800 dark:text-green-300 font-semibold">
                        处理完成！
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        背景已成功移除
                      </p>
                    </div>

                    <button
                      onClick={downloadProcessed}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      下载透明背景图片
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>请先上传图片</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            功能说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                智能识别
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI自动识别图片主体，精准分离前景和背景
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                快速处理
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                秒级处理速度，无需等待即可获得结果
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                高质量输出
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                保持原图质量，边缘处理自然流畅
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
