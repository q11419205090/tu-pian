import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "快速压缩图片大小，保持高质量",
      icon: "🗜️",
      href: "/compress",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "抠图去背景",
      description: "智能识别主体，一键去除背景",
      icon: "✂️",
      href: "/remove-bg",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      icon: "🔍",
      href: "/recognize",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "AI生图",
      description: "文字描述生成精美图片",
      icon: "🎨",
      href: "/generate",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI图片综合处理平台
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            一站式图片处理解决方案，让图片处理更简单
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-6 right-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>选择上方功能开始使用</p>
        </div>
      </main>
    </div>
  );
}
