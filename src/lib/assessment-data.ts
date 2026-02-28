/**
 * @fileOverview Type definitions for Assessment Data.
 * Data is now managed via Firebase Firestore in the 'recordings' collection.
 */

export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
  order: number;
}
