export type Note = `${string}/${number}`;
export type NoteRange = `${Note}:::${Note}`;

export enum Accident {
  "None" = "none",
  "#" = "#",
  "b" = "b",
  "#b" = "#b",
  "x" = "x",
  "bb" = "bb",
  "All" = "all",
}

export enum Clef {
  Treble = "treble",
  Bass = "bass",
}

export enum SoundEffect {
  WrongAnswer = "wrong-answer",
}

export type LevelConfig = {
  id: `${Clef}-${number}`;
  index: number;
  name: string;
  clef: Clef;
  range: NoteRange;
  accident: Accident;
  durationInSeconds: number;
  winNotesPerMinute: number;
};

export type SectionedLevelConfig = {
  title: string;
  data: LevelConfig[];
};

export type GameNote = {
  attempt: string;
  note: string;
};

export type Game = {
  id: string;
  level_id: string;
  timestamp: number;
  notes: GameNote[];
  durationInSeconds: number;
};

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
}

export interface GameScore {
  successes: number;
  mistakes: number;
}
