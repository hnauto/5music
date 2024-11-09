import { Volume2, Music } from 'lucide-react';
import { Schedule } from '../types';
import '../index.css'; 
interface PlayerCircleProps {
  currentTrack: Schedule | null;
  isPlaying: boolean;
  togglePlay: () => void;
}

export function PlayerCircle({ currentTrack, isPlaying, togglePlay }: PlayerCircleProps) {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-[#4D2F33] rounded-full shadow-inner flex items-center justify-center">
        <div className={`w-48 h-48 bg-[#2D1B1E] rounded-full flex items-center justify-center ${isPlaying ? 'animate-rotate' : ''}`}>
          {currentTrack ? (
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              {isPlaying ? (
                <Music className="w-6 h-6 text-white" />
              ) : (
                <Music className="w-6 h-6 text-white ml-1" />
              )}
            </button>
          ) : (
            <Volume2 className="w-12 h-12 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}