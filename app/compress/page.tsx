'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // 清理旧的 URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);

      setSelectedFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCompressedUrl('');
      setCompressedBlob(null);
      setCompressedSize(0);

      // 获取图片尺寸
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    } else {
      alert('请选择有效的图片文件（PNG, JPG, JPEG, WEBP）');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法获取 Canvas 上下文');
      }

      // 如果是 PNG 且有透明通道，先填充白色背景
      if (selectedFile.type === 'image/png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 使用更好的图像渲染质量
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0);

      // 统一使用 JPEG 格式进行压缩（JPEG 支持质量参数）
      const outputFormat = 'image/jpeg';
      const qualityValue = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 清理旧的压缩图片 URL
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);

            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
          } else {
            alert('压缩失败，请重试');
          }
          setIsCompressing(false);
        },
        outputFormat,
        qualityValue
      );
    } catch (error) {
      console.error('压缩失败:', error);
      alert('压缩失败: ' + (error as Error).message);
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedBlob || !selectedFile) return;

    const a = document.createElement('a');
    const url = URL.createObjectURL(compressedBlob);
    a.href = url;

    // 压缩后统一使用 .jpg 扩展名
    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    a.download = `${nameWithoutExt}_compressed.jpg`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSelectedFile(null);
    setPreviewUrl('');
    setCompressedUrl('');
    setCompressedBlob(null);
    setQuality(80);
    setOriginalSize(0);
    setCompressedSize(0);
    setImageDimensions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const compressionRate = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            图片压缩
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            快速压缩图片大小，保持高质量
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                上传图片
              </h2>
              {selectedFile && (
                <button
                  onClick={resetAll}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  重置
                </button>
              )}
            </div>

            <div className="mb-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">点击上传</span> 或拖拽图片到此处
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      支持 PNG, JPG, JPEG, WEBP
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {selectedFile && (
              <>
                {/* 图片信息 */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    图片信息
                  </h3>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p>文件名: {selectedFile.name}</p>
                    <p>文件大小: {formatSize(originalSize)}</p>
                    {imageDimensions && (
                      <p>尺寸: {imageDimensions.width} × {imageDimensions.height} 像素</p>
                    )}
                    <p>输入格式: {selectedFile.type.split('/')[1].toUpperCase()}</p>
                    <p>输出格式: JPEG (更好的压缩效果)</p>
                  </div>
                </div>

                {/* 压缩质量滑块 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    压缩质量: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => {
                      setQuality(Number(e.target.value));
                      // 如果已经压缩过，清除压缩结果以便重新压缩
                      if (compressedUrl) {
                        setCompressedUrl('');
                        setCompressedBlob(null);
                        setCompressedSize(0);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${quality}%, #e5e7eb ${quality}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>低质量 (小文件)</span>
                    <span>高质量 (大文件)</span>
                  </div>
                </div>

                {/* 压缩按钮 */}
                <button
                  onClick={compressImage}
                  disabled={isCompressing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCompressing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      压缩中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      开始压缩
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              预览对比
            </h2>

            {previewUrl ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      原图
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatSize(originalSize)}
                    </span>
                  </div>
                  <div className="relative border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="原图"
                      className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                </div>

                {compressedUrl && (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          压缩后
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatSize(compressedSize)}
                        </span>
                      </div>
                      <div className="relative border-2 border-green-500 rounded-lg overflow-hidden">
                        <img
                          src={compressedUrl}
                          alt="压缩后"
                          className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          已压缩
                        </div>
                      </div>
                    </div>

                    {/* 压缩统计 */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">压缩率</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {compressionRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">节省空间</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatSize(originalSize - compressedSize)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatSize(originalSize)} → {formatSize(compressedSize)}
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {compressionRate > 0 ? '↓' : '↑'} {Math.abs(compressionRate)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 下载按钮 */}
                    <button
                      onClick={downloadCompressed}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载压缩后的图片
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">请先上传图片</p>
                <p className="text-sm mt-2">支持拖拽上传</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            使用说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">1️⃣</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  上传图片
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  点击或拖拽图片到上传区域，支持 PNG、JPG、JPEG、WEBP 格式
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">2️⃣</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  调整质量
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  拖动滑块选择压缩质量，质量越低文件越小，建议 70-85%
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">3️⃣</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  下载保存
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  点击压缩按钮处理图片，完成后点击下载按钮保存到本地
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特点 */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            功能特点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                极速压缩
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                本地处理，无需上传服务器，秒级完成压缩，保护隐私安全
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                高质量输出
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                智能压缩算法，在减小文件大小的同时保持图片清晰度
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                灵活调节
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                10%-100% 自由调节压缩质量，满足不同使用场景需求
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                多格式支持
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                支持 PNG、JPG、JPEG、WEBP 等主流图片格式输入
              </p>
            </div>
          </div>
        </div>

        {/* 使用建议 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            使用建议
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-blue-500">📱</span>
                社交媒体分享
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                推荐质量：<span className="font-semibold text-blue-600">70-80%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                适合微信、微博、朋友圈等社交平台分享，在保证清晰度的同时大幅减小文件体积，加快上传和加载速度。
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-green-500">🌐</span>
                网站使用
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                推荐质量：<span className="font-semibold text-green-600">75-85%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                适合网站、博客、电商平台等场景，平衡图片质量和加载速度，提升用户体验和 SEO 表现。
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-purple-500">🖨️</span>
                打印输出
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                推荐质量：<span className="font-semibold text-purple-600">85-95%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                适合需要打印的图片，保持高质量的同时适度压缩，确保打印效果清晰细腻。
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-orange-500">📧</span>
                邮件附件
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                推荐质量：<span className="font-semibold text-orange-600">60-75%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                适合作为邮件附件发送，大幅减小文件大小，避免超出邮件附件大小限制，加快发送和接收速度。
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    温馨提示
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    <li>• 压缩前建议保留原图备份，压缩是不可逆的过程</li>
                    <li>• 已经压缩过的图片再次压缩效果不明显，可能导致质量下降</li>
                    <li>• 图片尺寸越大，压缩效果越明显</li>
                    <li>• 所有处理均在本地完成，不会上传到服务器，请放心使用</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
