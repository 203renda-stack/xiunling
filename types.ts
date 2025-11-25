export type View = 'home' | 'chat' | 'mood' | 'resources';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MoodLog {
  id: string;
  timestamp: number;
  score: number; // 1 (Very Bad) to 5 (Very Good)
  note: string;
  aiAnalysis?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'audio' | 'hotline';
  link?: string;
  phone?: string;
  duration?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}