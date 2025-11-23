from typing import Optional
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
        Translate text from source to target language
        For now, this is a mock function. We'll integrate Google Translate API later.
        """
        try:
            # Mock translation for testing
            # In production, we'll use Google Cloud Translation API
            
            print(f"Translating: '{text}' from {source_lang} to {target_lang}")
            
            # Simulate API delay
            time.sleep(0.5)
            
            # Return mock translation
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