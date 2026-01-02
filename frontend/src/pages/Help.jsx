import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Book, Video, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "How does automatic translation work?",
    answer: "When you send a message in your preferred language, it's automatically detected and translated to your conversation partner's preferred language. Both the original and translated messages are shown."
  },
  {
    question: "Can I change my preferred language?",
    answer: "Yes! Go to Settings from the home page or profile, and you can change your preferred language at any time. This will affect how your messages are translated."
  },
  {
    question: "How do I start a new conversation?",
    answer: "Click the 'Start New Chat' button on the home page, enter the email address of the person you want to chat with, and click 'Start Chat'."
  },
  {
    question: "Can I send files and images?",
    answer: "Yes! Click the image icon in the chat input area to upload files or images. Supported formats include images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX)."
  },
  {
    question: "How do message reactions work?",
    answer: "Click the smiley icon on any message to see reaction options. You can react with emojis like 👍, ❤️, 😂, and more. Click a reaction again to remove it."
  },
  {
    question: "What languages are supported?",
    answer: "We support 14+ languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, English, Urdu, Assamese, and Sanskrit."
  },
  {
    question: "How do I search messages?",
    answer: "Click the search icon in the chat header to open the search bar. Type your search query and results will appear in real-time."
  },
  {
    question: "Can I use voice input?",
    answer: "Yes! Click the microphone icon in the chat input to start voice recording. Your speech will be converted to text and automatically translated."
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

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
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold dark:text-white">Help & Support</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => window.open('mailto:support@locallanguage.com?subject=Support Request', '_blank')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover-lift transition-all cursor-pointer border border-blue-400/20 animate-scale-in text-white transform hover:scale-105 interactive-card"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transform hover:rotate-12 transition-transform">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Live Chat</h3>
            <p className="text-sm text-blue-100">Email our support team</p>
          </button>

          <button
            onClick={() => navigate('/help')}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover-lift transition-all cursor-pointer border border-purple-400/20 animate-scale-in text-white transform hover:scale-105 interactive-card"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transform hover:rotate-12 transition-transform">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Documentation</h3>
            <p className="text-sm text-purple-100">Read our user guide</p>
          </button>

          <button
            onClick={() => {
              // Open YouTube or tutorial page
              alert('Video tutorials coming soon! Check back later.');
            }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover-lift transition-all cursor-pointer border border-emerald-400/20 animate-scale-in text-white transform hover:scale-105 interactive-card"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transform hover:rotate-12 transition-transform">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Video Tutorials</h3>
            <p className="text-sm text-emerald-100">Watch how-to videos</p>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-[#242530] rounded-3xl shadow-xl p-8 mb-8 border border-slate-200 dark:border-[#2d2e3a] animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-semibold dark:text-white text-left">{item.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 animate-fade-in">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-[#242530] rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-[#2d2e3a] animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white mb-6">Contact Us</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.open('mailto:support@locallanguage.com?subject=Support Request', '_blank')}
              className="w-full flex items-center space-x-4 p-4 bg-slate-50 dark:bg-[#2d2e3a] rounded-xl hover:shadow-md transition-all hover-lift transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold dark:text-white">Email Support</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">support@locallanguage.com</p>
              </div>
            </button>
            <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold dark:text-white">Response Time</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

