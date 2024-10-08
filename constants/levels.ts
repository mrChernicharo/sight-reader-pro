import { SectionedLevelConfig, LevelConfig } from "./types";

export const SECTIONED_LEVELS: SectionedLevelConfig[] = [
  {
    title: "Treble Clef",
    data: [
      { name: "basics", clef: "treble", range: "g/4:::d/5", accident: "none" },
      { name: "basics", clef: "treble", range: "g/4:::e/5", accident: "none" },
      { name: "basics", clef: "treble", range: "e/4:::e/5", accident: "none" },
      { name: "basics", clef: "treble", range: "d/4:::f#/5", accident: "#" },
      { name: "basics", clef: "treble", range: "c/4:::g/5", accident: "b" },
      { name: "basics", clef: "treble", range: "c/4:::a/5", accident: "b" },
      { name: "basics", clef: "treble", range: "c/4:::a/5", accident: "#" },
      { name: "basics", clef: "treble", range: "b/3:::b/5", accident: "b" },
      { name: "basics", clef: "treble", range: "a/3:::c/6", accident: "#" },

      { name: "lower range", clef: "treble", range: "g/3:::g/4", accident: "none" },
      { name: "lower range", clef: "treble", range: "e/3:::g/4", accident: "none" },
      { name: "lower range", clef: "treble", range: "d/3:::g/4", accident: "#" },
      { name: "lower range", clef: "treble", range: "c/3:::g/4", accident: "#" },
      { name: "lower range", clef: "treble", range: "bb/2:::g/4", accident: "b" },
      { name: "lower range", clef: "treble", range: "ab/2:::g/4", accident: "b" },

      { name: "higher range", clef: "treble", range: "g/4:::d/6", accident: "none" },
      { name: "higher range", clef: "treble", range: "g/4:::f/6", accident: "none" },
      { name: "higher range", clef: "treble", range: "g/4:::g/6", accident: "#" },
      { name: "higher range", clef: "treble", range: "g/4:::a/6", accident: "#" },
      { name: "higher range", clef: "treble", range: "g/4:::b/6", accident: "b" },
      { name: "higher range", clef: "treble", range: "g/4:::c/7", accident: "#" },
    ].map((levelInfo, i) => ({ ...levelInfo, id: i + 1 } as LevelConfig)),
  },
  {
    title: "Bass Clef",
    data: [
      { name: "basics", clef: "bass", range: "g/2:::d/3", accident: "none" },
      { name: "basics", clef: "bass", range: "c/2:::e/3", accident: "none" },
      { name: "basics", clef: "bass", range: "a/1:::g/3", accident: "none" },
      { name: "basics", clef: "bass", range: "g/1:::b/3", accident: "#" },
      { name: "basics", clef: "bass", range: "f/1:::c/4", accident: "b" },
      { name: "basics", clef: "bass", range: "d/1:::d/4", accident: "b" },
      { name: "basics", clef: "bass", range: "c/1:::e/4", accident: "#" },
      { name: "basics", clef: "bass", range: "b/1:::g/4", accident: "#" },
      { name: "basics", clef: "bass", range: "a/1:::a/4", accident: "#" },
    ].map((levelInfo, i) => ({ ...levelInfo, id: i + 1 } as LevelConfig)),
  },
];
