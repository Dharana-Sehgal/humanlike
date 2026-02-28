/**
 * @fileOverview Static data for the Human-Like Voice Assessment.
 * This file contains the voice recordings that users will evaluate.
 */

export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
  order: number;
}

export const RECORDINGS: Recording[] = [
  {
    id: "rec-1",
    title: "Customer Support Greeting",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "1:20",
    order: 1
  },
  {
    id: "rec-2",
    title: "Technical Explanation",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "0:55",
    order: 2
  },
  {
    id: "rec-3",
    title: "Empathetic Apology",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "1:10",
    order: 3
  }
];
