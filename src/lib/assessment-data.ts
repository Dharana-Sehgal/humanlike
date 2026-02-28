
export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
  order: number;
}

// Static data is removed as it is now fetched from Firestore.
// You can seed your Firestore 'recordings' collection with documents matching the Recording interface.
