export interface Track {
  effect: string;
  note: string;
  list: TrackItem[];
}

export interface TrackItem {
  title: string;
  music: string;
}

export interface Schedule {
  start: string;
  end: string;
  track: Track;
}

export interface ScheduleData {
  schedule: Schedule[];
}
