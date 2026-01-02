// Comprehensive language code to name mapping
export const LANGUAGE_NAMES = {
  // Indian Languages
  'hi': 'Hindi',
  'ta': 'Tamil',
  'te': 'Telugu',
  'bn': 'Bengali',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'pa': 'Punjabi',
  'or': 'Odia',
  'ur': 'Urdu',
  'as': 'Assamese',
  'sa': 'Sanskrit',
  // Other common languages
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'tr': 'Turkish',
  'pl': 'Polish',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'fi': 'Finnish',
  'no': 'Norwegian',
  'cs': 'Czech',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'el': 'Greek',
  'he': 'Hebrew',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'so': 'Somali',
  'hr': 'Croatian',
  'sk': 'Slovak',
  'bg': 'Bulgarian',
  'sr': 'Serbian',
  'uk': 'Ukrainian',
  'be': 'Belarusian',
  'ka': 'Georgian',
  'az': 'Azerbaijani',
  'kk': 'Kazakh',
  'uz': 'Uzbek',
  'mn': 'Mongolian',
  'ne': 'Nepali',
  'si': 'Sinhala',
  'my': 'Myanmar',
  'km': 'Khmer',
  'lo': 'Lao',
  'am': 'Amharic',
  'sw': 'Swahili',
  'zu': 'Zulu',
  'af': 'Afrikaans',
  'eu': 'Basque',
  'ca': 'Catalan',
  'cy': 'Welsh',
  'ga': 'Irish',
  'mt': 'Maltese',
  'is': 'Icelandic',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'et': 'Estonian',
  'mk': 'Macedonian',
  'sq': 'Albanian',
  'bs': 'Bosnian',
  'sl': 'Slovenian',
  'me': 'Montenegrin',
};

// Language emojis/flags
export const LANGUAGE_EMOJIS = {
  'hindi': '🇮🇳', 'tamil': '🇮🇳', 'telugu': '🇮🇳', 'bengali': '🇮🇳',
  'marathi': '🇮🇳', 'gujarati': '🇮🇳', 'kannada': '🇮🇳', 'malayalam': '🇮🇳',
  'punjabi': '🇮🇳', 'odia': '🇮🇳', 'english': '🇬🇧', 'urdu': '🇵🇰',
  'assamese': '🇮🇳', 'sanskrit': '🇮🇳',
  // Add more as needed
  'hi': '🇮🇳', 'ta': '🇮🇳', 'te': '🇮🇳', 'bn': '🇮🇳',
  'mr': '🇮🇳', 'gu': '🇮🇳', 'kn': '🇮🇳', 'ml': '🇮🇳',
  'pa': '🇮🇳', 'or': '🇮🇳', 'ur': '🇵🇰', 'as': '🇮🇳',
  'sa': '🇮🇳', 'en': '🇬🇧', 'es': '🇪🇸', 'fr': '🇫🇷',
  'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹', 'ru': '🇷🇺',
  'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳', 'ar': '🇸🇦',
  'fi': '🇫🇮', 'so': '🇸🇴', 'hr': '🇭🇷',
};

// Get readable language name from code or name
export function getLanguageName(lang) {
  if (!lang) return 'Unknown';
  
  // If it's already a readable name, return it capitalized
  const lowerLang = lang.toLowerCase();
  if (LANGUAGE_NAMES[lowerLang]) {
    return LANGUAGE_NAMES[lowerLang];
  }
  
  // Check if it's a code
  if (LANGUAGE_NAMES[lang]) {
    return LANGUAGE_NAMES[lang];
  }
  
  // Try to find by code in values
  for (const [code, name] of Object.entries(LANGUAGE_NAMES)) {
    if (code.toLowerCase() === lowerLang) {
      return name;
    }
  }
  
  // If not found, capitalize the first letter
  return lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
}

// Get language emoji
export function getLanguageEmoji(lang) {
  if (!lang) return '🌐';
  const lowerLang = lang.toLowerCase();
  return LANGUAGE_EMOJIS[lowerLang] || LANGUAGE_EMOJIS[lang] || '🌐';
}

// Language color scheme for charts
export const LANGUAGE_COLORS = {
  'hindi': 'from-orange-500 to-red-500',
  'tamil': 'from-blue-500 to-cyan-500',
  'telugu': 'from-green-500 to-emerald-500',
  'bengali': 'from-yellow-500 to-orange-500',
  'marathi': 'from-purple-500 to-pink-500',
  'gujarati': 'from-indigo-500 to-blue-500',
  'kannada': 'from-teal-500 to-green-500',
  'malayalam': 'from-rose-500 to-pink-500',
  'punjabi': 'from-amber-500 to-yellow-500',
  'odia': 'from-violet-500 to-purple-500',
  'english': 'from-blue-600 to-indigo-600',
  'urdu': 'from-green-600 to-teal-600',
  'assamese': 'from-orange-400 to-red-400',
  'sanskrit': 'from-amber-600 to-orange-600',
};

export function getLanguageColor(lang) {
  const lowerLang = lang.toLowerCase();
  return LANGUAGE_COLORS[lowerLang] || 'from-slate-500 to-slate-600';
}

