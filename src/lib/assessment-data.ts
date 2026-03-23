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
}

export interface AssessmentModule {
  id: string;
  title: string;
  recordings: Recording[];
}

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: "Noise",
    title: "Noise",
    recordings: [
      {
        id: "Noise",
        title: "Recording 1",
        // Paths relative to the public/ folder must start with / and NOT include 'public/'
        audioUrl: "/recordings/cpns-85656a0906_bot.mp3",
      },
      {
        id: "Noise-2",
        title: "Recording 2",
        audioUrl: "/recordings/cpns-8930889e7f_agent.mp3",
      }
    ]
  }
];

// Helper to get a flat list of all recordings for navigation logic
export const FLAT_RECORDINGS = ASSESSMENT_MODULES.flatMap(m => 
  m.recordings.map(r => ({ ...r, moduleId: m.id, moduleTitle: m.title }))
);
