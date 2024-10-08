import { SECTIONED_LEVELS } from "./levels";
import { Clef, Note } from "./types";

export function getRandInRange(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isNoteMatch(noteA: string, noteB: string) {
  if (noteA === noteB) return true;

  switch (noteA) {
    case "c#":
      return noteB === "db";
    case "db":
      return noteB === "c#";

    case "d#":
      return noteB === "eb";
    case "eb":
      return noteB === "d#";

    case "f#":
      return noteB === "gb";
    case "gb":
      return noteB === "f#";

    case "g#":
      return noteB === "ab";
    case "ab":
      return noteB === "g#";

    case "a#":
      return noteB === "bb";
    case "bb":
      return noteB === "a#";
  }

  return false;
}

export function stemDown(note: Note, clef: Clef) {
  const [key, octave] = note.split("/");
  console.log({ note, key, octave, clef });
  switch (clef) {
    case Clef.Treble:
      return +octave > 4 ? true : false;
    case Clef.Bass:
      return +octave > 3 || (+octave === 3 && key > "d") ? true : false;
  }
}

export function getLevel(clef: Clef, id: string) {
  return SECTIONED_LEVELS.find((lvl) => lvl.data[0].clef === clef)?.data.find((lvl) => lvl.id === Number(id))!;
}
