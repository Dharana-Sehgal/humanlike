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
  const [isStuck, setIsStuck] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [src, playbackSpeed]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // The top-0 of AssessmentForm sticky wrapper is 84px from viewport top
        // We consider it "stuck" when the bounding box's top is precisely at or above that sticky position
        // We use a small threshold to prevent flicker
        setIsStuck(rect.top <= 85);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div 
      ref={containerRef}
      className={cn(
        "w-full bg-white transition-all duration-300 flex flex-col justify-center",
        isStuck 
          ? "p-5 border-b shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm" 
          : "p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl min-h-[160px]"
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className={cn("space-y-6 transition-all", isStuck ? "space-y-4" : "space-y-8")}>
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h3>
          <div className="flex items-center gap-2">
             <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500 font-mono flex items-center gap-1.5">
              <span className="text-slate-900">{formatTime(audioRef.current?.currentTime || 0)}</span>
              <span className="opacity-20">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full">
          <Button
            size="icon"
            onClick={togglePlay}
            className={cn(
              "rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl transition-all active:scale-95 shrink-0",
              isStuck ? "h-10 w-10" : "h-12 w-12"
            )}
          >
            {isPlaying ? (
              <Pause className={isStuck ? "h-5 w-5" : "h-6 w-6"} />
            ) : (
              <Play className={cn("ml-1", isStuck ? "h-5 w-5" : "h-6 w-6")} />
            )}
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

          <div className="flex items-center gap-3">
             <Button
                size="icon"
                variant="ghost"
                onClick={reset}
                className="h-10 w-10 rounded-full text-slate-400 hover:text-primary hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold tracking-tight rounded-full border-slate-200 bg-white hover:bg-slate-50">
                  {playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24 rounded-xl shadow-xl">
                {[1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem 
                    key={speed} 
                    onClick={() => changeSpeed(speed)}
                    className={cn("text-[11px] font-bold py-2 rounded-lg cursor-pointer", playbackSpeed === speed && "bg-slate-50 text-accent")}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
