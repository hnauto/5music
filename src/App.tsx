import { useEffect, useState, useRef } from 'react';
import { ProgressBar, VolumeControl } from './components/MusicPlayer';
import { scheduleData } from './data/schedule';
import { Schedule } from './types';
import { PlayerCircle } from './components/PlayerCircle';
import { TrackInfo } from './components/TrackInfo';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

function App() {
  const [currentTrack, setCurrentTrack] = useState<Schedule | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // 添加音量状态
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setCurrentTime(timeString);

      const [currentHour, currentMinute] = timeString.split(':').map(Number);
      const currentTimeMinutes = currentHour * 60 + currentMinute;

      const matchingSchedule = scheduleData.schedule.find(schedule => {
        const [startHour, startMinute] = schedule.start.split(':').map(Number);
        const [endHour, endMinute] = schedule.end.split(':').map(Number);
        
        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;
        
        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
      });

      if (matchingSchedule !== currentTrack) {
        setCurrentTrack(matchingSchedule || null);
        setCurrentMusicIndex(0);
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.track.list[currentMusicIndex].music;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, currentMusicIndex]);

  // 添加音量初始化的 useEffect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef.current]);

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

  const handleAudioEnd = () => {
    if (currentTrack) {
      const nextIndex = currentTrack.track.list.length > 1 
        ? (currentMusicIndex + 1) % currentTrack.track.list.length
        : 0; // For a single track, reset to 0 for looping
  
      setCurrentMusicIndex(nextIndex);
  
      // Auto-play next track or loop the single track if playing
      if (audioRef.current && isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioProgress(time);
    }
  };

  // 添加音量控制处理函数
  const handleVolumeChange = (newVolume: number) => {
    const volumeValue = newVolume / 100;
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const handlePreviousTrack = () => {
    if (currentTrack) {
      if (currentMusicIndex > 0) {
        setCurrentMusicIndex(prev => prev - 1);
      } else {
        setCurrentMusicIndex(currentTrack.track.list.length - 1);
      }
    }
  };

  const handleNextTrack = () => {
    if (currentTrack) {
      if (currentMusicIndex < currentTrack.track.list.length - 1) {
        setCurrentMusicIndex(prev => prev + 1);
      } else {
        setCurrentMusicIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D1B1E] to-[#1A0F11] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#3D2529] rounded-2xl p-8 shadow-2xl">
          <PlayerCircle 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
          
          <TrackInfo 
            currentTrack={currentTrack}
            currentTime={currentTime}
            currentMusicIndex={currentMusicIndex}
          />

          {currentTrack && (
            <>
              <ProgressBar
                currentTime={audioProgress}
                duration={audioDuration}
                onSeek={handleSeek}
              />
<VolumeControl 
  volume={volume}
  onVolumeChange={handleVolumeChange}
/>

              
              {/* 播放控制按钮 */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button 
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={handlePreviousTrack}
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button 
                  className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                
                <button 
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={handleNextTrack}
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            </>
          )}

          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
