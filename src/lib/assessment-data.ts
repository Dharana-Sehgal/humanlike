/**
 * @fileOverview Data structures for hierarchical voice assessments.
 * 
 * To add your own recordings:
 * 1. Ensure a 'public/recordings/' folder exists in the root directory.
 * 2. Place your audio files (e.g., .mp3, .wav) in that folder.
 * 3. Reference them in the 'audioUrl' field using a path like '/recordings/your-file.mp3'.
 * 4. Ensure each recording has a unique 'id'.
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
    title: "Seekho",
    recordings: [
      {
        id: "seekho",
        title: "Recording 1",
        // Relative to the public/ folder
        audioUrl: "/recordings/seekho.mp3", 
        duration: "0:03"
      },
      {
        id: "seekho-2",
        title: "Recording 2",
        audioUrl: "/recordings/seekho_2.mp3",
        duration: "0:02"
      }
    ]
  }
];

// Helper to get a flat list of all recordings for navigation logic
export const FLAT_RECORDINGS = ASSESSMENT_MODULES.flatMap(m => 
  m.recordings.map(r => ({ ...r, moduleId: m.id, moduleTitle: m.title }))
);
