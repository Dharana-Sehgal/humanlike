# Human-Like Voice Assessment Laboratory

This application allows users to evaluate AI-generated voice recordings for human-likeness.

## Setting Up Your Data

This app fetches its data from **Firebase Firestore**. To see recordings in the app, follow these steps:

1.  **Go to the [Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project.
3.  Navigate to **Firestore Database**.
4.  Create a collection named `recordings`.
5.  Add documents to the `recordings` collection with the following fields:
    - `title` (string): The name of the sample.
    - `audioUrl` (string): A public URL to an audio file.
    - `duration` (string): The length of the audio (e.g., "1:20").
    - `order` (number): The position in the assessment sequence (1, 2, 3...).

## Submissions
User evaluations are automatically saved to the `submissions` collection in Firestore.
