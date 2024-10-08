import { Clef } from "./notes";

export type LevelAccident = "none" | "#" | "b";
export type NoteRange = `${string}/${number}:::${string}/${number}`;

export type LevelConfig = {
  id: number;
  clef: Clef;
  range: NoteRange;
  accident: LevelAccident;
};

export type SectionedLevelConfig = {
  title: string;
  data: LevelConfig[];
};

export const SECTIONED_LEVELS: SectionedLevelConfig[] = [
  {
    title: "Treble Clef",
    data: [
      { clef: "treble", range: "g/4:::d/5", accident: "none" },
      { clef: "treble", range: "e/4:::c/5", accident: "none" },
      { clef: "treble", range: "e/4:::d/5", accident: "none" },
      { clef: "treble", range: "d/4:::d/5", accident: "#" },
      { clef: "treble", range: "c/4:::e/5", accident: "b" },
      { clef: "treble", range: "c/3:::e/6", accident: "b" },
      { clef: "treble", range: "d/3:::b/6", accident: "#" },
      { clef: "treble", range: "b/2:::d/7", accident: "#" },
    ].map((levelInfo, i) => ({ ...levelInfo, id: i + 1 } as LevelConfig)),
  },
  {
    title: "Bass Clef",
    data: [
      { clef: "bass", range: "g/2:::d/3", accident: "none" },
      { clef: "bass", range: "e/2:::c/3", accident: "none" },
      { clef: "bass", range: "e/2:::d/3", accident: "none" },
      { clef: "bass", range: "d/2:::d/3", accident: "#" },
      { clef: "bass", range: "c/2:::e/3", accident: "b" },
      { clef: "bass", range: "c/1:::e/4", accident: "b" },
      { clef: "bass", range: "d/2:::b/4", accident: "#" },
    ].map((levelInfo, i) => ({ ...levelInfo, id: i + 1 } as LevelConfig)),
  },
];
