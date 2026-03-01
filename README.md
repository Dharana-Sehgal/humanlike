
# Human-Like Voice Assessment Laboratory

This application allows users to evaluate AI-generated voice recordings for human-likeness.

## How to Add Your Own Recordings

1.  **Prepare Files**: Move your `.mp3` or `.wav` files into the `public/recordings/` directory of this project.
2.  **Update Metadata**: Open `src/lib/assessment-data.ts`.
3.  **Add Entry**: Add a new object to the `recordings` array within the desired module. Use the path to the file starting from the public root (e.g., `/recordings/my-new-audio.mp3`).

```typescript
{
  id: "unique-id-123",
  title: "My Custom Voice",
  audioUrl: "/recordings/my-new-audio.mp3",
  duration: "0:45"
}
```

## Project Structure

- `public/recordings/`: The physical location for your audio files.
- `src/lib/assessment-data.ts`: The source of truth for the assessment flow and sidebar.
- `src/app/page.tsx`: The main application state manager.
- `src/components/`: UI components for the assessment interface.

## Submission Data

Currently, user evaluations are handled locally. When a user completes an assessment, the final payload is logged to the browser console.
