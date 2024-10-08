import { SectionedLevelConfig, LevelConfig } from "./types";

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
      { clef: "bass", range: "c/2:::e/3", accident: "none" },
      { clef: "bass", range: "a/1:::g/3", accident: "none" },
      { clef: "bass", range: "g/1:::b/3", accident: "#" },
      { clef: "bass", range: "f/1:::c/4", accident: "b" },
      { clef: "bass", range: "d/1:::d/4", accident: "b" },
      { clef: "bass", range: "c/1:::e/4", accident: "#" },
      { clef: "bass", range: "b/1:::g/4", accident: "#" },
      { clef: "bass", range: "a/1:::a/4", accident: "#" },
    ].map((levelInfo, i) => ({ ...levelInfo, id: i + 1 } as LevelConfig)),
  },
];
