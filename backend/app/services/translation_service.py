from langdetect import detect
import time

class TranslationService:
    def __init__(self):
        # Language mapping
        self.language_map = {
            'hindi': 'hi',
            'tamil': 'ta',
            'telugu': 'te',
            'bengali': 'bn',
            'marathi': 'mr',
            'gujarati': 'gu',
            'kannada': 'kn',
            'malayalam': 'ml',
            'punjabi': 'pa',
            'odia': 'or',
            'english': 'en'
        }
        
        # Mock translations for demo
        self.mock_translations = {
            'hello': {
                'hindi': 'नमस्ते',
                'tamil': 'வணக்கம்',
                'english': 'Hello'
            },
            'how are you': {
                'hindi': 'आप कैसे हैं',
                'tamil': 'நீங்கள் எப்படி இருக்கிறீர்கள்',
                'english': 'How are you'
            },
            'good morning': {
                'hindi': 'सुप्रभात',
                'tamil': 'காலை வணக்கம்',
                'english': 'Good morning'
            }
        }
    
    def detect_language(self, text: str) -> str:
        """Detect language from text"""
        try:
            detected = detect(text)
            
            # Map to our language codes
            lang_reverse_map = {v: k for k, v in self.language_map.items()}
            return lang_reverse_map.get(detected, 'english')
        except:
            return 'english'
    
    async def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Mock translation for free tier
        In production, you would use Google Cloud Translation API
        """
        try:
            # If same language, return original
            if source_lang == target_lang:
                return text
            
            # Check for mock translations
            text_lower = text.lower()
            if text_lower in self.mock_translations:
                return self.mock_translations[text_lower].get(target_lang, text)
            
            # For demo purposes, just prefix with language
            return f"[Translated to {target_lang}]: {text}"
            
        except Exception as e:
            print(f"Translation error: {e}")
            return text
    
    async def translate_with_detection(self, text: str, target_lang: str) -> dict:
        """Detect source language and translate"""
        source_lang = self.detect_language(text)
        translated = await self.translate_text(text, source_lang, target_lang)
        
        return {
            'original_text': text,
            'source_language': source_lang,
            'translated_text': translated,
            'target_language': target_lang
        }

# Create singleton instance
translation_service = TranslationService()