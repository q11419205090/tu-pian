'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RecognitionResult {
  labels: string[];
  text: string;
  objects: string[];
}

export default function RecognizePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'labels' | 'text' | 'objects'>('labels');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const recognizeImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // 模拟识别过程
    setTimeout(() => {
      // 这里应该调用实际的图片识别API
      const mockResult: RecognitionResult = {
        labels: ['风景', '自然', '天空', '山脉', '户外'],
        text: '这是一段从图片中识别出的文字内容示例。实际使用时会调用OCR API来提取图片中的真实文字。',
        objects: ['树木', '云朵', '山峰', '草地']
      };
      setResult(mockResult);
      setIsProcessing(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            图片识别
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI识别图片内容，提取文字信息
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              上传图片
            </h2>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
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

            {previewUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  预览
                </h3>
                <img
                  src={previewUrl}
                  alt="预览"
                  className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                />
              </div>
            )}

            {selectedFile && (
              <button
                onClick={recognizeImage}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? '识别中...' : '开始识别'}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              识别结果
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('labels')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'labels'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    标签识别
                  </button>
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'text'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    文字提取
                  </button>
                  <button
                    onClick={() => setActiveTab('objects')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'objects'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    物体检测
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === 'labels' && (
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                        图片标签
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.labels.map((label, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'text' && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          提取的文字
                        </h3>
                        <button
                          onClick={() => copyToClipboard(result.text)}
                          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {result.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'objects' && (
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                        检测到的物体
                      </h3>
                      <div className="space-y-2">
                        {result.objects.map((object, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {object}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              置信度: {Math.floor(Math.random() * 20 + 80)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>请先上传图片并开始识别</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            识别能力
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🏷️</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                智能标签
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                自动识别图片内容，生成相关标签
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                OCR文字识别
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                精准提取图片中的文字内容
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                物体检测
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                识别图片中的各种物体和场景
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
