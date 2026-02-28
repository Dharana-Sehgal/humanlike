
# Human-Like Voice Assessment Laboratory

This application allows users to evaluate AI-generated voice recordings for human-likeness.

## How it Works

1.  **Input Data**: The recordings being evaluated are hardcoded in `src/lib/assessment-data.ts`. You can add more samples by editing that file.
2.  **Submission Data**: Currently, user evaluations are handled locally. When a user completes an assessment, the final payload is logged to the browser console.

## Project Structure

- `src/lib/assessment-data.ts`: The source of truth for all voice samples used in the assessment.
- `src/app/page.tsx`: The main application logic managing the state of the assessment flow.
- `src/components/`: Reusable UI components for the audio player, rating system, and forms.

## Customization

To add your own recordings:
1. Open `src/lib/assessment-data.ts`.
2. Add a new object to the `RECORDINGS` array with your audio URL and details.
