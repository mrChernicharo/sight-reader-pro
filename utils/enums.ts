export enum AppEvents {
    NotePlayed = "note-played",
}

export enum NoteNameBase {
    "c" = "c",
    "d" = "d",
    "e" = "e",
    "f" = "f",
    "g" = "g",
    "a" = "a",
    "b" = "b",
}

export enum NoteName {
    "c" = "c",
    "b#" = "b#",
    "dbb" = "dbb",
    "c#" = "c#",
    "db" = "db",
    "d" = "d",
    "cx" = "cx",
    "ebb" = "ebb",
    "d#" = "d#",
    "eb" = "eb",
    "e" = "e",
    "dx" = "dx",
    "fb" = "fb",
    "f" = "f",
    "e#" = "e#",
    "gbb" = "gbb",
    "f#" = "f#",
    "gb" = "gb",
    "g" = "g",
    "fx" = "fx",
    "abb" = "abb",
    "g#" = "g#",
    "ab" = "ab",
    "a" = "a",
    "gx" = "gx",
    "bbb" = "bbb",
    "a#" = "a#",
    "bb" = "bb",
    "b" = "b",
    "ax" = "ax",
    "cb" = "cb",
}

export enum Accident {
    "#" = "#",
    "b" = "b",
    "x" = "x",
    "bb" = "bb",
    "[]" = "[]", // Bequadro
}

export enum LevelAccidentType {
    "None" = "none",
    "#" = "#",
    "b" = "b",
    // "#b" = "#b",
    // "x" = "x",
    // "bb" = "bb",
    // "All" = "all",
}

export enum Clef {
    Treble = "treble",
    Bass = "bass",
    // both, // treble + bass
}

export enum SoundEffect {
    WrongAnswer = "wrong-answer",
    WrongAnswer2 = "wrong-answer-2",
}

export enum GameType {
    Single = "single",
    Chord = "chord",
    Melody = "melody",
    Rhythm = "rhythm",
}

export enum WinRank {
    Gold = "gold",
    Silver = "silver",
    Bronze = "bronze",
}

export enum ScaleType {
    Diatonic = "diatonic",
    Chromatic = "chromatic",
}

export enum GameState {
    Idle = "idle",
    Success = "success",
    Mistake = "mistake",
}

export enum KeySignature {
    Cb = "Cb",
    Gb = "Gb",
    Db = "Db",
    Ab = "Ab",
    Eb = "Eb",
    Bb = "Bb",
    F = "F",
    C = "C",
    G = "G",
    D = "D",
    A = "A",
    E = "E",
    B = "B",
    "F#" = "F#",
    "C#" = "C#",
    Abm = "Abm",
    Ebm = "Ebm",
    Bbm = "Bbm",
    Fm = "Fm",
    Cm = "Cm",
    Gm = "Gm",
    Dm = "Dm",
    Am = "Am",
    Em = "Em",
    Bm = "Bm",
    "F#m" = "F#m",
    "C#m" = "C#m",
    "G#m" = "G#m",
    "D#m" = "D#m",
    "A#m" = "A#m",
}

export enum TimeSignature {
    "2/4" = "2/4",
    "3/4" = "3/4",
    "4/4" = "4/4",
}

export enum NoteDuration {
    "w" = "w",
    "h." = "h.",
    "h" = "h",
    "q." = "q.",
    "q" = "q",
    "8th." = "8.",
    "8th" = "8",
    "16th" = "16",
}

export enum Difficulty {
    Newbie = "newbie",
    Easy = "easy",
    Normal = "normal",
    Hard = "hard",
    Expert = "expert",
}

export enum Knowledge {
    novice = "novice",
    beginner = "beginner",
    intermediary = "intermediary",
    advanced = "advanced",
    pro = "pro",
}

export enum Interval {
    Uni = 1,
    Sec = 2,
    Thr = 3,
    Fou = 4,
    Fif = 5,
    Six = 6,
    Sev = 7,
    Oct = 8,
    Nin = 9,
    Ten = 10,
    Ele = 11,
    Twe = 12,
    Thi = 13,
    // Add more if needed
}

export enum FullInterval {
    P1 = 1,
    m2 = -2,
    M2 = 2,
    m3 = -3,
    M3 = 3,
    P4 = 4,
    A4 = 4.5, // Tritone
    d5 = -5, // Tritone
    P5 = 5,
    m6 = -6,
    M6 = 6,
    m7 = -7,
    M7 = 7,
    P8 = 8,
    A1 = 1.5,
    d2 = -1.5,
    A2 = 2.5,
    d3 = -2.5,
    A3 = 3.5,
    d4 = 3.5,
    A5 = 5.5,
    d6 = -5.5,
    A6 = 6.5,
    d7 = -6.5,
    A7 = 7.5,
    d8 = 7.5,
    A8 = 8.5,
    m9 = -9,
    M9 = 9,
    P11 = 11,
    A11 = 11.5,
    m13 = -13,
    M13 = 13,
    // Add more augmented, diminished, etc., for ninths, elevenths, etc., as needed
}

export enum LevelName {
    basics = "basics",
    apprentice = "apprentice",
    intermediary = "intermediary",
    advanced = "advanced",
    pro = "pro",
    keySignatures = "key signatures",
    keySignaturesII = "key signatures II",
    lowNotes = "low notes",
    highNotes = "high notes",
    guitar = "guitar",
    trombone = "trombone",
}
