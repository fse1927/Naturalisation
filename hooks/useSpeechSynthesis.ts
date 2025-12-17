import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechSynthesisProps {
    onEnd?: () => void;
    onError?: (event: SpeechSynthesisErrorEvent) => void;
}

export function useSpeechSynthesis({ onEnd, onError }: UseSpeechSynthesisProps = {}) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsSupported(true);
        }
    }, []);

    const speak = useCallback((text: string, options?: { rate?: number }) => {
        if (!isSupported) return;

        // Cancel previous
        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = options?.rate ?? 0.95; // Default or custom
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
        };
        utterance.onerror = (event) => {
            console.error("Speech synthesis error", event);
            setIsSpeaking(false);
            onError?.(event);
        };

        synthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isSupported, onEnd, onError]);

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [isSupported]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    return {
        speak,
        stop,
        isSpeaking,
        isSupported
    };
}
