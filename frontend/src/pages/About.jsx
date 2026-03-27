import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Languages, Heart, Code2, Users, Globe, Zap,
  Shield, MessageSquare, Sparkles, Github, ExternalLink,
} from 'lucide-react';

const FEATURES = [
  { icon: Languages,     title: '14+ Languages',         desc: 'All major Indian languages plus Hinglish',  color: 'from-blue-500 to-indigo-600' },
  { icon: Zap,           title: 'Real-time Translation',  desc: 'Instant translation as messages are sent',  color: 'from-purple-500 to-pink-600' },
  { icon: Globe,         title: 'Auto Language Detection',desc: 'Automatically detects your language',       color: 'from-emerald-500 to-teal-600' },
  { icon: Shield,        title: 'Secure & Private',       desc: 'End-to-end encrypted conversations',       color: 'from-amber-500 to-orange-600' },
  { icon: MessageSquare, title: 'Rich Messaging',         desc: 'Voice, files, reactions, search & more',   color: 'from-sky-500 to-blue-600' },
  { icon: Heart,         title: 'Always Free',            desc: '100% free with no hidden costs ever',      color: 'from-rose-500 to-pink-600' },
];

const STACK = [
  { name: 'React 19',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { name: 'FastAPI',     color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { name: 'Socket.IO',   color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { name: 'Firebase',    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  { name: 'Python',      color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
  { name: 'Tailwind CSS',color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
  { name: 'Vite',        color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
  { name: 'Zustand',     color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
];

const STATS = [
  { value: '14+', label: 'Languages Supported' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 1s', label: 'Translation Speed' },
  { value: 'Free', label: 'Forever' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] md:ml-64 animate-fade-in">

      {/* Header */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate('/home')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold dark:text-white">About</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Local Language Integrator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl animate-scale-in p-8 sm:p-12 text-center">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
              <Languages className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Local Language Integrator</h2>
            <p className="text-white/80 text-lg font-medium mb-6 max-w-xl mx-auto">
              Breaking language barriers, one conversation at a time
            </p>
            <p className="text-white/70 text-sm leading-relaxed max-w-2xl mx-auto">
              A powerful real-time translation platform built to help people across India communicate
              seamlessly — whether you speak Hindi, Tamil, Telugu, or any of the 14+ supported languages.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <div>
          <h3 className="text-2xl font-bold dark:text-white mb-5 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" /> Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i}
                  className="card-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">{feat.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mission ── */}
        <div className="card-lg p-7 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-3">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                India is a beautifully diverse country with hundreds of languages and dialects. Our mission
                is to make digital communication accessible to everyone, regardless of the language they
                speak. We believe technology should bring people together — not create barriers.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                Whether you're a student in Tamil Nadu chatting with a colleague in Punjab, or a family
                spread across multiple states — we ensure language is never an obstacle.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="card-lg p-7 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Built With</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {STACK.map(tech => (
              <span key={tech.name} className={`px-3.5 py-2 rounded-xl text-sm font-semibold border border-transparent ${tech.color}`}>
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center py-6 animate-fade-in">
          <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 text-base">
            Made with <Heart className="w-5 h-5 text-red-500 animate-pulse" /> for seamless communication
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">Version 2.0.0 · Open Source</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => window.open('mailto:support@locallanguage.com', '_blank')}
              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <ExternalLink className="w-4 h-4" /> Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
