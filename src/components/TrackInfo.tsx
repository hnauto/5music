import { Schedule } from '../types';
import { Music } from 'lucide-react';

interface TrackInfoProps {
  currentTrack: Schedule | null;
  currentTime: string;
  currentMusicIndex: number;
}

export function TrackInfo({ currentTrack, currentMusicIndex }: TrackInfoProps) {
  return (
    <div className="text-center">
      <h2 className="text-1xl font-bold text-white mb-2">
        {currentTrack ? currentTrack.track.list[currentMusicIndex].title : '等待播放时间'}
      </h2>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Music className="w-4 h-4 text-red-400" />
        <p className="text-gray-400 text-sm">
          {currentTrack ? `${currentTrack.track.effect} ：${currentTrack.start} - ${currentTrack.end}` : '当前时间段没有安排的音乐'}
        </p>
      </div>
      {currentTrack && (
        <p className="text-gray-400 text-sm mb-4">
          {currentTrack.track.note}
        </p>
      )}
    </div>
  );
}
