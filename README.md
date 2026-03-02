
# Human-Like Voice Assessment Laboratory

This application allows users to evaluate AI-generated voice recordings for human-likeness.

## Project Structure for Audio

To add your own recordings, place them in the `public/recordings/` directory at the root of the project:

```text
/ (root)
├── public/
│   └── recordings/
│       ├── your-file-1.mp3
│       └── your-file-2.wav
├── src/
│   └── lib/
│       └── assessment-data.ts  <-- Update metadata here
├── package.json
└── ...
```

## How to Add Your Own Recordings

1.  **Prepare Files**: Create a folder named `recordings` inside the `public` directory if it doesn't exist. Move your `.mp3` or `.wav` files into it.
2.  **Update Metadata**: Open `src/lib/assessment-data.ts`.
3.  **Add Entry**: Add a new object to the `recordings` array within the desired module. Use the absolute path starting from the public root.

```typescript
{
  id: "unique-id-123",
  title: "My Custom Voice",
  audioUrl: "/recordings/your-file-1.mp3", // Path relative to public folder
  duration: "0:45"
}
```

## Submission Data

When a user completes an assessment, the final payload is logged to the browser console. This can be easily connected to a database like Firestore for permanent storage.
