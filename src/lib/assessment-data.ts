/**
 * @fileOverview Static data for the Human-Like Voice Assessment.
 * This file contains the voice recordings that users will evaluate.
 * For testing purposes, these have been updated to short audio clips.
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
    title: "Quick Greeting Test",
    audioUrl: "https://www.w3schools.com/html/horse.mp3",
    duration: "0:03",
    order: 1
  },
  {
    id: "rec-2",
    title: "Short Tech Sample",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    duration: "0:02",
    order: 2
  },
  {
    id: "rec-3",
    title: "Brief Feedback Clip",
    audioUrl: "https://www.w3schools.com/tags/horse.mp3",
    duration: "0:03",
    order: 3
  }
];
