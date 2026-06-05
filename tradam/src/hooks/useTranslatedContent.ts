'use client';

import { useLanguage } from './useLanguage';
import { translations } from '@/lib/i18n';

/**
 * A hook to translate dynamic content (like product titles/descriptions)
 * that may not be in the static i18n dictionary.
 * 
 * In a production app, this would integrate with a real translation API 
 * (e.g. Google Translate, DeepL).
 */
export function useTranslatedContent() {
  const { locale } = useLanguage();

  const tc = (text: string | undefined | null) => {
    if (!text) return '';
    
    // 1. Exact match check in our dictionary
    const dict = translations[locale];
    if (dict[text]) return dict[text];

    // 2. Case-insensitive and trimmed match check
    const normalizedText = text.toLowerCase().trim();
    const match = Object.keys(dict).find(key => key.toLowerCase().trim() === normalizedText);
    
    if (match) {
      return dict[match];
    }

    // 3. Robust Pattern Matching (Handles common plurals or slight variations)
    // This is where we could add regex-based translations for patterns like "Xkg of Y"
    
    // 4. Fallback: Return original text
    // NOTE: For a real "standard" implementation, you would trigger an 
    // async translation here if the dictionary check fails and cache the result.
    return text;
  };

  return { tc };
}
