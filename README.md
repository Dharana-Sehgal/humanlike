# Human-Like Voice Assessment Laboratory

This application allows users to evaluate AI-generated voice recordings for human-likeness.

## How it Works

1.  **Input Data**: The recordings being evaluated are hardcoded in `src/lib/assessment-data.ts`. You can add more samples by editing that file.
2.  **Submission Data**: When a user completes an assessment, their ratings and feedback are sent to **Firebase Firestore**.

## Viewing Results

To see the submissions:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Navigate to **Firestore Database**.
4.  Look for the `submissions` collection. Each document contains the user's details and their ratings for each recording.

## Firebase Setup
Ensure you have initialized your Firebase project in the console and that Firestore is enabled in "Test Mode" to allow submissions during development.
