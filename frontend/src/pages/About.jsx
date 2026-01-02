import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Languages, Heart, Code, Users, Globe, Zap, Shield } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const features = [
    { icon: Languages, title: "14+ Languages", desc: "Support for major Indian languages" },
    { icon: Zap, title: "Real-time Translation", desc: "Instant translation as you type" },
    { icon: Globe, title: "Auto-detect Language", desc: "Automatically detects your language" },
    { icon: Shield, title: "Secure & Private", desc: "End-to-end encrypted conversations" },
    { icon: Users, title: "Easy Communication", desc: "Break language barriers effortlessly" },
    { icon: Heart, title: "Free Forever", desc: "100% free with no hidden costs" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#1a1b23] dark:via-[#1f2029] dark:to-[#1a1b23] md:ml-64 animate-fade-in">
      {/* Header - Professional */}
      <header className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-[#2d2e3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 dark:text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold dark:text-white">About</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-scale-in">
            <Languages className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold dark:text-white mb-4 bg-gradient-primary bg-clip-text text-transparent">Local Language Integrator</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 font-medium">
            Breaking language barriers, one conversation at a time
          </p>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Local Language Integrator is a powerful real-time translation platform designed to help people
            communicate seamlessly across different Indian languages. Whether you're chatting with friends,
            colleagues, or family members, our platform ensures that language is never a barrier.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl hover-lift transition-all border border-slate-200 dark:border-slate-700 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-8 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="text-2xl font-bold dark:text-white mb-4">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            India is a diverse country with hundreds of languages and dialects. Our mission is to make
            communication accessible to everyone, regardless of the language they speak. We believe that
            technology should bring people together, not create barriers.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="text-2xl font-bold dark:text-white mb-6">Built With</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'FastAPI', 'Socket.IO', 'Firebase', 'Python', 'Node.js', 'Tailwind CSS', 'TypeScript'].map((tech, idx) => (
              <div
                key={tech}
                className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-center hover:shadow-md transition-all hover-lift border border-slate-200 dark:border-slate-600"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <p className="font-semibold dark:text-white">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-600 dark:text-slate-400 animate-fade-in">
          <p className="text-lg">Made with <Heart className="w-5 h-5 inline text-red-500 animate-pulse" /> for seamless communication</p>
          <p className="text-sm mt-2 font-medium">Version 2.0.0</p>
        </div>
      </div>
    </div>
  );
}

