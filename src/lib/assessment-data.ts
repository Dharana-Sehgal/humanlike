/**
 * @fileOverview Data structures for hierarchical voice assessments.
 * 
 * To add your own recordings:
 * 1. Place your audio files (e.g., .mp3, .wav) in the 'public/recordings/' folder.
 * 2. Reference them in the 'audioUrl' field using a path like '/recordings/your-file.mp3'.
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
        // Example of a local path. Put your file in: public/recordings/sample1.mp3
        audioUrl: "/recordings/sample1.mp3", 
        duration: "0:03"
      },
      {
        id: "rec-1-b",
        title: "Recording 2",
        audioUrl: "/recordings/sample2.mp3",
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
        audioUrl: "/recordings/sample3.mp3",
        duration: "0:03"
      },
      {
        id: "rec-2-b",
        title: "Recording 2",
        audioUrl: "/recordings/sample4.mp3",
        duration: "0:03"
      }
    ]
  }
];

// Helper to get a flat list of all recordings for navigation logic
export const FLAT_RECORDINGS = ASSESSMENT_MODULES.flatMap(m => 
  m.recordings.map(r => ({ ...r, moduleId: m.id, moduleTitle: m.title }))
);
