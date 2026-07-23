// Speech Recognition and Text-To-Speech Service

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export type SpeechCallback = (result: SpeechRecognitionResult) => void;
export type ErrorCallback = (error: string) => void;

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    langCode: string,
    onResult: SpeechCallback,
    onError?: ErrorCallback,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError("Browser speech recognition is not natively supported in this environment.");
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.lang = this.getBcp47LanguageCode(langCode);

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        onResult({ transcript, isFinal });
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error || "Speech recognition error");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (onError) onError(err?.message || "Failed to start microphone speech input.");
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speakText(text: string, langCode: string = 'en', onComplete?: () => void): void {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any active speech

    // Clean text of markdown or emojis for clean audio output
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
                          .replace(/[#*`_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.getBcp47LanguageCode(langCode);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onComplete) {
      utterance.onend = onComplete;
      utterance.onerror = onComplete;
    }

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  private getBcp47LanguageCode(code: string): string {
    const map: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'es': 'es-ES',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'fr': 'fr-FR',
      'de': 'de-DE'
    };
    return map[code] || 'en-US';
  }
}

export const speechService = new SpeechService();
