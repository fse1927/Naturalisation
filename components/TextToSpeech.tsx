"use client";

import { useState } from "react";
import { Volume2, PauseCircle, Settings } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface TextToSpeechProps {
    text: string;
}

export default function TextToSpeech({ text }: TextToSpeechProps) {
    const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();
    const [rate, setRate] = useState(1.0);
    const [showSettings, setShowSettings] = useState(false);

    if (!isSupported) return null;

    const handleToggle = () => {
        if (isSpeaking) {
            stop();
        } else {
            speak(text, { rate });
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleToggle}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                    ${isSpeaking
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm'
                    }
                `}
                aria-label={isSpeaking ? "Arrêter la lecture" : "Écouter la synthèse vocale"}
            >
                {isSpeaking ? (
                    <>
                        <PauseCircle className="w-5 h-5 animate-pulse" />
                        <span className="text-sm">En lecture...</span>
                    </>
                ) : (
                    <>
                        <Volume2 className="w-5 h-5" />
                        <span className="text-sm">Écouter</span>
                    </>
                )}
            </button>

            <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                aria-label="Réglages vitesse"
            >
                <Settings className="w-5 h-5" />
            </button>

            {showSettings && (
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border shadow-sm animate-in fade-in slide-in-from-left-2">
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Vitesse: x{rate}</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.25"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-20 accent-primary"
                    />
                </div>
            )}
        </div>
    );
}
