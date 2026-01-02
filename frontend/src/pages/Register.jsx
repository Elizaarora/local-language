import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { Languages, Moon, Sun, Mail, Lock, User, ArrowRight, Globe2, MessageSquare, Zap, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferred_language: 'hinglish', // Default to Hinglish for Indian users
  });
  const { register, loading, error } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
  }, []);

  // Extended list with Hinglish support
  const indianLanguages = [
    { code: 'hinglish', name: 'Hinglish 🇮🇳 ⭐ RECOMMENDED', description: 'Mix of Hindi & English - Best for Indian accent' },
    { code: 'english', name: 'English 🇬🇧', description: 'Standard English' },
    { code: 'hindi', name: 'Hindi (हिंदी) 🇮🇳', description: 'Standard Hindi' },
    { code: 'tamil', name: 'Tamil (தமிழ்) 🇮🇳', description: 'Tamil language' },
    { code: 'telugu', name: 'Telugu (తెలుగు) 🇮🇳', description: 'Telugu language' },
    { code: 'bengali', name: 'Bengali (বাংলা) 🇮🇳', description: 'Bengali language' },
    { code: 'marathi', name: 'Marathi (मराठी) 🇮🇳', description: 'Marathi language' },
    { code: 'gujarati', name: 'Gujarati (ગુજરાતી) 🇮🇳', description: 'Gujarati language' },
    { code: 'kannada', name: 'Kannada (ಕನ್ನಡ) 🇮🇳', description: 'Kannada language' },
    { code: 'malayalam', name: 'Malayalam (മലയാളം) 🇮🇳', description: 'Malayalam language' },
    { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ) 🇮🇳', description: 'Punjabi language' },
    { code: 'odia', name: 'Odia (ଓଡ଼ିଆ) 🇮🇳', description: 'Odia language' },
    { code: 'urdu', name: 'Urdu (اردو) 🇵🇰', description: 'Urdu language' },
    { code: 'assamese', name: 'Assamese (অসমীয়া) 🇮🇳', description: 'Assamese language' },
    { code: 'sanskrit', name: 'Sanskrit (संस्कृतम्) 🇮🇳', description: 'Sanskrit language' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/home');
    }
  };

  const [focusedField, setFocusedField] = useState(null);

  const features = [
    { icon: Globe2, text: '14 Indian Languages', desc: 'Comprehensive support' },
    { icon: MessageSquare, text: 'Real-time Translation', desc: 'Instant communication' },
    { icon: Zap, text: 'Auto Detection', desc: 'Smart language recognition' },
    { icon: Shield, text: 'Enterprise Security', desc: 'Bank-level encryption' },
  ];

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-[1600px] h-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 relative z-10 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                  <Languages className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Local Language
                </h1>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Integrator
                </h2>
              </div>
            </div>
            
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              Join thousands of users breaking language barriers and connecting globally through <span className="font-semibold text-blue-600 dark:text-blue-400">seamless translation</span>.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-[#242530]/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#2d2e3a] hover:shadow-xl transition-all transform hover:scale-105 animate-fade-in interactive-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-full max-w-md">
            <div className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-[#2d2e3a]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <div className="lg:hidden">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Local Language Integrator
                    </h1>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all transform hover:scale-110"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-700" />
                  )}
                </button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Create Account
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Start your multilingual journey today
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-center space-x-2 animate-fade-in">
                  <Heart className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Language
                  </label>
                  <select
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {indianLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>{indianLanguages.find(l => l.code === formData.preferred_language)?.name}</strong>
                      <br />
                      {indianLanguages.find(l => l.code === formData.preferred_language)?.description}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Login here
                  </Link>
                </p>
              </div>

              {/* Hinglish Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800 rounded-xl">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Why Hinglish is Recommended?
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Hinglish</strong> is perfect for Indian users! It understands when you naturally mix Hindi and English:
                  <br />
                  <br />
                  ✅ "Aaj main market jaa raha hoon"
                  <br />
                  ✅ "I'm going to market aaj"
                  <br />
                  ✅ "Yaar, this is so confusing"
                  <br />
                  <br />
                  <strong>Best voice recognition for Indian accent!</strong>
                </p>
              </div>

              {/* Mobile Features - Only visible on small screens */}
              <div className="lg:hidden mt-6 pt-6 border-t border-slate-200 dark:border-[#2d2e3a]">
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#2d2e3a] dark:to-[#353642] rounded-xl p-3 text-center"
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{feature.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// // Register.jsx (separate file)
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import useAuthStore from '../store/authStore';
// import useThemeStore from '../store/themeStore';
// import { Languages, Moon, Sun } from 'lucide-react';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     preferred_language: 'hindi',
//   });
//   const { register, loading, error } = useAuthStore();
//   const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     initTheme();
//   }, []);

//   const indianLanguages = [
//     { code: 'english', name: 'English 🇬🇧' },
//     { code: 'hindi', name: 'Hindi (हिंदी) 🇮🇳' },
//     { code: 'tamil', name: 'Tamil (தமிழ்) 🇮🇳' },
//     { code: 'telugu', name: 'Telugu (తెలుగు) 🇮🇳' },
//     { code: 'bengali', name: 'Bengali (বাংলা) 🇮🇳' },
//     { code: 'marathi', name: 'Marathi (मराठी) 🇮🇳' },
//     { code: 'gujarati', name: 'Gujarati (ગુજરાતી) 🇮🇳' },
//     { code: 'kannada', name: 'Kannada (ಕನ್ನಡ) 🇮🇳' },
//     { code: 'malayalam', name: 'Malayalam (മലയാളം) 🇮🇳' },
//     { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ) 🇮🇳' },
//     { code: 'odia', name: 'Odia (ଓଡ଼ିଆ) 🇮🇳' },
//     { code: 'urdu', name: 'Urdu (اردو) 🇵🇰' },
//     { code: 'assamese', name: 'Assamese (অসমীয়া) 🇮🇳' },
//     { code: 'sanskrit', name: 'Sanskrit (संस्कृतम्) 🇮🇳' },
//   ];

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await register(formData);
//     if (success) {
//       navigate('/home');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//             title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//           >
//             {isDarkMode ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-gray-700" />
//             )}
//           </button>
//         </div>

//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
//             <Languages className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Create Account
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Join Local Language Integrator</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="John Doe"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="your@email.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="••••••••"
//               required
//               minLength={6}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Preferred Language
//             </label>
//             <select
//               name="preferred_language"
//               value={formData.preferred_language}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {indianLanguages.map((lang) => (
//                 <option key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//               Messages you receive will be translated to this language
//             </p>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
//           >
//             {loading ? 'Creating Account...' : 'Register'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
//             Login here
//           </Link>
//         </p>

//         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg">
//           <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
//             <span className="font-semibold">14+ Languages Supported</span>
//             <br />
//             <span className="text-xs">Voice input with auto-translation • Dark mode • Real-time messaging</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }