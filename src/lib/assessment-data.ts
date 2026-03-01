/**
 * @fileOverview Data structures for hierarchical voice assessments.
 * 
 * To add your own recordings:
 * 1. Host your audio file at a public URL.
 * 2. Add a new object to the 'recordings' array in one of the modules below.
 * 3. Ensure each recording has a unique 'id'.
 */

export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
}

export interface AssessmentModule {
  id: string;
  title: string;
  recordings: Recording[];
}

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: "module-1",
    title: "Demo One",
    recordings: [
      {
        id: "rec-1-a",
        title: "Recording 1",
        audioUrl: "https://www.w3schools.com/html/horse.mp3",
        duration: "0:03"
      },
      {
        id: "rec-1-b",
        title: "Recording 2",
        audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        duration: "0:02"
      }
    ]
  },
  {
    id: "module-2",
    title: "Demo Two",
    recordings: [
      {
        id: "rec-2-a",
        title: "Recording 1",
        audioUrl: "https://www.w3schools.com/tags/horse.mp3",
        duration: "0:03"
      },
      {
        id: "rec-2-b",
        title: "Recording 2",
        audioUrl: "https://www.w3schools.com/html/horse.mp3",
        duration: "0:03"
      }
    ]
  }
  // Add more modules or recordings here!
];

// Helper to get a flat list of all recordings for navigation logic
export const FLAT_RECORDINGS = ASSESSMENT_MODULES.flatMap(m => 
  m.recordings.map(r => ({ ...r, moduleId: m.id, moduleTitle: m.title }))
);
