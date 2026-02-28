export interface Recording {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
}

export const recordings: Recording[] = [
  {
    id: 'rec-1',
    title: 'Customer Service Bot - Inquiry 101',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '0:45',
  },
  {
    id: 'rec-2',
    title: 'Sales Assistant - Product Demo',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '1:12',
  },
  {
    id: 'rec-3',
    title: 'Technical Support - Troubleshooting',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '0:58',
  },
  {
    id: 'rec-4',
    title: 'Reservation Bot - Booking Flow',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '1:05',
  },
];
