/**
 * @fileOverview Data structures for grouped voice assessments.
 */

export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
}

export interface AssessmentGroup {
  id: string;
  title: string;
  recordings: Recording[];
}

export const ASSESSMENT_GROUPS: AssessmentGroup[] = [
  {
    id: "group-1",
    title: "Hindi Conversational",
    recordings: [
      {
        id: "rec-1-a",
        title: "Customer Query",
        audioUrl: "https://www.w3schools.com/html/horse.mp3",
        duration: "0:03"
      },
      {
        id: "rec-1-b",
        title: "Agent Response",
        audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        duration: "0:02"
      }
    ]
  },
  {
    id: "group-2",
    title: "Technical Support",
    recordings: [
      {
        id: "rec-2-a",
        title: "Issue Description",
        audioUrl: "https://www.w3schools.com/tags/horse.mp3",
        duration: "0:03"
      }
    ]
  }
];
