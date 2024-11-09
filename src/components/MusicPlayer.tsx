import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  return (
    <div className="w-full px-4 mb-4">
      <div
        className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-red-500 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 -top-1 w-3 h-3 bg-red-500 rounded-full transform translate-x-1/2"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}


export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [currentTime, setCurrentTime] = useState('');

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(previousVolume * 100);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.33) return <Volume className="w-5 h-5" />;
    if (volume < 0.66) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setCurrentTime(timeString);
    };

    updateCurrentTime(); // Initial call to set time
    const interval = setInterval(updateCurrentTime, 1000); // Update time every second
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div 
      className="relative flex items-center gap-2 px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <span className="text-xs text-gray-400 min-w-[40px]">
        {Math.round(volume * 100)}%
      </span> */}
      <button
        onClick={toggleMute}
        className="focus:outline-none text-gray-400 hover:text-white transition-colors"
      >
        {getVolumeIcon()}
      </button>
      <div className={`flex items-center transition-all duration-200 ${isHovered ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-red-500"
          style={{
            background: `linear-gradient(to right, #ef4444 ${volume * 100}%, #374151 ${volume * 100}%)`
          }}
        />
      </div>
      <div className="flex flex-col gap-1 ml-auto">
        <p className="text-red-400 font-medium">
          {currentTime}
        </p>
      </div>
    </div>
  );
}


// 如果您还需要一个完整的 MusicPlayer 组件包装器，可以添加这个（可选的）
export function MusicPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 示例时长（3分钟）
  const [volume, setVolume] = useState(0.5); // 初始音量 50%

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume / 100);
  };

  return (
    <div className="p-4">
      <ProgressBar 
        currentTime={currentTime} 
        duration={duration} 
        onSeek={handleSeek} 
      />
      <VolumeControl 
        volume={volume} 
        onVolumeChange={handleVolumeChange} 
      />
    </div>
  );
}