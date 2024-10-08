export const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"];
export const ALL_NOTES_SHARP = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
export const ALL_NOTES_BEMOL = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];
// prettier-ignore
export const ALL_NOTES = ["c", "c#", "db", "d", "d#", "eb", "e", "f", "f#", "gb", "g", "g#", "ab", "a", "a#", "bb", "b"];

export const WHITE_NOTES_ALL_OCTAVES: string[] = [];
let oct = 1;
while (oct < 9) {
  WHITE_NOTES.forEach((n) => {
    WHITE_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

export const ALL_NOTES_SHARP_ALL_OCTAVES: string[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_SHARP.forEach((n) => {
    ALL_NOTES_SHARP_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

export const ALL_NOTES_BEMOL_ALL_OCTAVES: string[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_BEMOL.forEach((n) => {
    ALL_NOTES_BEMOL_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// console.log(ALL_NOTES_BEMOL_ALL_OCTAVES, ALL_NOTES_BEMOL_ALL_OCTAVES.length);
