"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title: string;
  onEnded?: () => void;
}

export function AudioPlayer({ src, title, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with sidebar primary tone
  const primaryColorClass = "text-[#3a2065]";
  const primaryBgClass = "bg-[#3a2065]";
  const primaryHoverClass = "hover:bg-[#2d1b4e]";

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  const onSeek = (val: number[]) => {
    if (audioRef.current) {
      const newTime = (val[0] / 100) * audioRef.current.duration;
      if (newTime > audioRef.current.currentTime) return;
      audioRef.current.currentTime = newTime;
      setProgress(val[0]);
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-lg text-slate-800 font-bold tracking-tight">{title}</h3>
        <div className={cn("font-mono text-xs font-bold flex items-center gap-2", primaryColorClass)}>
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span className="opacity-20">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={togglePlay}
          className={cn("h-10 w-10 rounded-full text-white shadow-md transition-all active:scale-95", primaryBgClass, primaryHoverClass)}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={reset}
          className={cn("h-8 w-8 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50", primaryColorClass)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        <div className="flex-1 px-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={onSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <Volume2 className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
