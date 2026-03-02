"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  src: string;
  title: string;
  onEnded?: () => void;
}

export function AudioPlayer({ src, title, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const primaryColorClass = "text-[#3a2065]";
  const primaryBgClass = "bg-[#3a2065]";
  const primaryHoverClass = "hover:bg-[#2d1b4e]";

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [src, playbackSpeed]);

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
      audioRef.current.currentTime = newTime;
      setProgress(val[0]);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
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
    <div className="w-full bg-slate-50/80 rounded-xl p-6 border border-slate-100 space-y-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs text-slate-900 font-bold uppercase tracking-tight">{title}</h3>
          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest bg-white border border-slate-100 px-2 py-1 rounded">Sample Source</span>
        </div>
        <div className={cn("font-mono text-[10px] font-bold px-3 py-1 bg-white rounded border border-slate-100 flex items-center gap-2", primaryColorClass)}>
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span className="opacity-20">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={togglePlay}
          className={cn("h-9 w-9 rounded-full text-white shadow-sm flex-shrink-0", primaryBgClass, primaryHoverClass)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={reset}
          className={cn("h-8 w-8 rounded-full border-slate-200 bg-white shadow-sm flex-shrink-0", primaryColorClass)}
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

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold tracking-tight rounded border-slate-200 bg-white">
                {playbackSpeed}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24">
              {[1, 1.25, 1.5].map((speed) => (
                <DropdownMenuItem 
                  key={speed} 
                  onClick={() => changeSpeed(speed)}
                  className={cn("text-[10px] font-bold", playbackSpeed === speed && "bg-slate-50")}
                >
                  {speed}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
