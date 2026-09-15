'use client';

import { useEffect, useRef, useState } from 'react';
import BibleVerseList from './BibleVerseList';
import { getVersion } from '@/lib/bible/versions';

const FONT_SIZES = [15, 16, 18, 21] as const;
const DEFAULT_FONT_INDEX = 1;
const STORAGE_KEY = 'gn-bible-font-size-index';

export default function BibleReader({
  bookSlug,
  bookName,
  chapter,
  verses,
  versionCode = 'lsg1910'
}: {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verses: string[];
  versionCode?: string;
}) {
  const version = getVersion(versionCode);
  const [fontIndex, setFontIndex] = useState(DEFAULT_FONT_INDEX);
  const [speaking, setSpeaking] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAudioSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const idx = Number(saved);
        if (idx >= 0 && idx < FONT_SIZES.length) setFontIndex(idx);
      }
    } catch {
      // localStorage indisponible — on garde la taille par défaut.
    }
  }, []);

  useEffect(() => {
    // Le changement de chapitre coupe toute lecture audio en cours.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, [bookSlug, chapter, versionCode]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const changeFontIndex = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), FONT_SIZES.length - 1);
    setFontIndex(clamped);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      // Stockage indisponible — la préférence ne sera pas mémorisée.
    }
  };

  const toggleSpeech = () => {
    if (!audioSupported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${bookName}, chapitre ${chapter}. ${verses.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gn-line pb-5">
        <div className="flex items-center gap-1.5">
          <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-wide text-gn-muted">Taille</span>
          <button
            type="button"
            onClick={() => changeFontIndex(fontIndex - 1)}
            disabled={fontIndex === 0}
            aria-label="Réduire le texte"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gn-line text-gn-ink transition-colors hover:border-gn-gold-line disabled:opacity-30"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => changeFontIndex(fontIndex + 1)}
            disabled={fontIndex === FONT_SIZES.length - 1}
            aria-label="Agrandir le texte"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gn-line text-gn-ink transition-colors hover:border-gn-gold-line disabled:opacity-30"
          >
            A+
          </button>
        </div>

        {audioSupported && (
          <button
            type="button"
            onClick={toggleSpeech}
            className="flex items-center gap-2 rounded-full border border-gn-gold/40 px-4 py-2 text-[12.5px] font-semibold text-gn-gold-line transition-colors hover:bg-gn-gold/10"
          >
            {speaking ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
                Arrêter la lecture
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Écouter ce chapitre
              </>
            )}
          </button>
        )}
      </div>

      <BibleVerseList
        bookSlug={bookSlug}
        bookName={bookName}
        chapter={chapter}
        verses={verses}
        fontSizePx={FONT_SIZES[fontIndex]}
        versionCode={version.code}
        versionName={version.name}
      />
    </div>
  );
}
