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
  id: number;
  name: string;
  clef: Clef;
  range: NoteRange;
  accident: Accident;
};

export type SectionedLevelConfig = {
  title: string;
  data: LevelConfig[];
};
