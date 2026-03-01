"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Gauge } from "lucide-react";
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
      // Prevent seeking forward if preferred, but usually allowed in players
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

  // Simulated Waveform Bars
  const bars = Array.from({ length: 40 }).map((_, i) => ({
    height: 20 + Math.random() * 60,
    delay: i * 0.05
  }));

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
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

      {/* Waveform Visualization */}
      <div className="flex items-end justify-between h-16 w-full gap-[2px] overflow-hidden opacity-20">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-t-full transition-all duration-300", primaryBgClass)}
            style={{ 
              height: isPlaying ? `${bar.height}%` : '20%',
              transitionDelay: `${bar.delay}s`
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={togglePlay}
          className={cn("h-12 w-12 rounded-full text-white shadow-md transition-all active:scale-95 flex-shrink-0", primaryBgClass, primaryHoverClass)}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={reset}
          className={cn("h-9 w-9 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex-shrink-0", primaryColorClass)}
        >
          <RotateCcw className="h-4 w-4" />
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
              <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold tracking-tighter gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {playbackSpeed}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-20">
              {[1, 1.25, 1.5].map((speed) => (
                <DropdownMenuItem 
                  key={speed} 
                  onClick={() => changeSpeed(speed)}
                  className={cn("text-xs font-bold justify-center", playbackSpeed === speed && "bg-slate-100")}
                >
                  {speed}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Volume2 className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
