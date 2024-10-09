export type Note = `${string}/${number}`;
export type NoteRange = `${Note}:::${Note}`;

export enum Accident {
  "None" = "none",
  "#" = "#",
  "B" = "b",
}

export enum Clef {
  Treble = "treble",
  Bass = "bass",
}

export type LevelConfig = {
  id: `${Clef}-${number}`;
  name: string;
  clef: Clef;
  range: NoteRange;
  accident: Accident;
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
};
