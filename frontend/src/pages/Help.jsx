import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { contactAPI } from '../services/api';
import {
  ArrowLeft, HelpCircle, MessageCircle, Book, Video, Mail,
  ChevronDown, ChevronUp, Send, Mic, Globe, FileImage,
  Smile, Search, Languages, Zap,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does automatic translation work?',
    a: 'When you send a message, it\'s automatically detected and translated to your partner\'s preferred language. Both the original and translated messages are shown in the chat.',
    icon: Languages,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    q: 'How do I start a new conversation?',
    a: 'Click the "New Chat" button on the Home page, enter the email address of the person you want to chat with, and click Start Chat. They must already have an account.',
    icon: MessageCircle,
    color: 'from-purple-500 to-pink-600',
  },
  {
    q: 'Can I change my preferred language?',
    a: 'Yes! Go to Settings from the navigation sidebar. You can change your preferred language at any time — it will affect how incoming messages are translated for you.',
    icon: Globe,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    q: 'Can I send files and images?',
    a: 'Yes! Click the image icon in the chat input to upload files. Supported formats include images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX) up to 10MB.',
    icon: FileImage,
    color: 'from-amber-500 to-orange-600',
  },
  {
    q: 'How do I use voice input?',
    a: 'Click the microphone icon in the chat input area to start recording. Your speech will be converted to text automatically. Works best in Hindi, English, and Hinglish.',
    icon: Mic,
    color: 'from-rose-500 to-pink-600',
  },
  {
    q: 'How do message reactions work?',
    a: 'Hover over any message to reveal the reaction button (😊 icon). Click it to pick an emoji reaction. Click the same reaction again to remove it.',
    icon: Smile,
    color: 'from-sky-500 to-blue-600',
  },
  {
    q: 'How do I search messages?',
    a: 'Inside a chat, click the search icon (🔍) in the header to open the search bar. Results appear in real-time as you type.',
    icon: Search,
    color: 'from-violet-500 to-purple-600',
  },
  {
    q: 'What languages are supported?',
    a: 'We support 14+ languages: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, English, Urdu, Assamese, Sanskrit, and Hinglish.',
    icon: Zap,
    color: 'from-indigo-500 to-blue-600',
  },
];

export default function Help() {
  const navigate = useNavigate();
  const toast = useToast();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingContact(true);
    try {
      await contactAPI.sendMessage(contactForm);
      setContactForm({ name: '', email: '', message: '' });
      toast.success("We'll get back to you within 24 hours!", { title: 'Message sent!' });
    } catch {
      toast.error('Failed to send message. Please try again.', { title: 'Error' });
    } finally {
      setSendingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] md:ml-64 animate-fade-in">

      {/* Header */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate('/home')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold dark:text-white">Help & Support</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">How can we help you?</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── Quick Support Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail,          label: 'Email Support',    sub: 'support@locallanguage.com', color: 'from-blue-500 to-indigo-600',   action: () => window.open('mailto:support@locallanguage.com', '_blank') },
            { icon: Book,          label: 'Documentation',   sub: 'Read the user guide',        color: 'from-purple-500 to-pink-600',   action: () => toast.info('Full docs coming soon!', { title: 'Coming soon' }) },
            { icon: Video,         label: 'Video Tutorials', sub: 'Watch how-to videos',        color: 'from-emerald-500 to-teal-600',  action: () => toast.info('Video tutorials coming soon!', { title: 'Coming soon' }) },
          ].map(({ icon: Icon, label, sub, color, action }, i) => (
            <button key={label}
              onClick={action}
              className={`card-lg p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in btn-ripple`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
            </button>
          ))}
        </div>

        {/* ── FAQ ── */}
        <div className="card-lg overflow-hidden animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-[#2d2e3a]">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{FAQ_ITEMS.length} questions answered</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#2d2e3a]">
            {FAQ_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const isOpen = openFAQ === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-[#2d2e3a]/50 transition-all text-left"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="flex-1 font-semibold text-sm text-slate-800 dark:text-white">{item.q}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-400'}`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pl-[68px] animate-slide-down">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Contact Form ── */}
        <div className="card-lg overflow-hidden animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-[#2d2e3a]">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Send us a Message</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">We reply within 24 hours</p>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                value={contactForm.message}
                onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                placeholder="Describe your issue or question in detail…"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={sendingContact}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl text-sm font-semibold
                  shadow-lg hover:shadow-blue-500/30 hover:opacity-90 transition-all disabled:opacity-50 btn-ripple">
                {sendingContact
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
