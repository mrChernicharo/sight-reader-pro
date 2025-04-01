import { Href } from "expo-router";
import {
  WinRank,
  KeySignature,
  ScaleType,
  LevelAccidentType,
  GameType,
  Clef,
  NoteName,
  NoteNameBase,
  Accident,
  GameState,
  TimeSignature,
  NoteDuration,
} from "./enums";

// exceptions b0, c8
type NoteOctave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type NoteNom = `${NoteNameBase}${Accident}/${NoteOctave}`;

export type Note = "b/0" | "ax/0" | "cb/0" | `${NoteName}/${NoteOctave}` | "c/8" | "b#/8" | "dbb/8";

export type NoteRange = `${Note}:::${Note}`;

export type MelodyNote = {
  note: Note;
  duration: NoteDuration;
};

/**
 * hits per minute
 *
 * ```// example: { gold: 40, silver: 37, bronze: 32 }```
 */
export type WinConditions = {
  [WinRank.Gold]: number;
  [WinRank.Silver]: number;
  [WinRank.Bronze]: number;
};

export type GameKeySettings =
  | { hasKey: true; keySignatures: Array<KeySignature>; scaleType: ScaleType }
  | { hasKey: false; accident: LevelAccidentType };

export type GameSettings<T> = T extends GameType.Single | GameType.Chord
  ? GameKeySettings & { noteRanges: Array<NoteRange> }
  : T extends GameType.Melody
  ? GameKeySettings & { noteRanges: Array<NoteRange>; timeSignature: TimeSignature }
  : T extends GameType.Rhythm
  ? GameKeySettings & { timeSignature: TimeSignature }
  : never;

export type SingleNoteRound = {
  attempt: Note | null;
  value: Note;
};

export type ChordRound = {
  attempt: Note[];
  value: Note[];
};

export type MelodyRound = {
  attempts: Note[];
  values: Note[];
  durations: NoteDuration[][];
};

export type RhythmRound = Array<{
  attempt: number | null;
  value: number;
}>;

export type Round<T> = T extends GameType.Single
  ? SingleNoteRound
  : T extends GameType.Chord
  ? ChordRound
  : T extends GameType.Melody
  ? MelodyRound
  : T extends GameType.Rhythm
  ? RhythmRound
  : never;

export type Game<T> = {
  id: string;
  levelId: string;
  timestamp: number;
  durationInSeconds: number;
  type: T;
  rounds: Round<T>[];
};

export type LevelId = `${Clef}-${"practice" | number}`;

export type Level<T> = GameSettings<T> & {
  id: LevelId;
  clef: Clef;
  index: number;
  name: string;
  description: string;
  durationInSeconds: number;
  winConditions: WinConditions;
  gameType: T;
};

export type CurrentGame<T> = Game<T> & Level<T> & { state: GameState };

export type PianoKeySpec = "Flat" | "Sharp"; /* | 'Both' */

export interface GameScore {
  successes: number;
  mistakes: number;
}

export type SectionedLevel = {
  title: string;
  data: Level<GameType>[];
};

export interface LevelScore {
  value: number;
  multiplier: number;
  hits: number;
  hitScore: number;
  winConditions: WinConditions;
  accuracy: number;
  formula: string;
}

export interface GameScreenParams {
  id: string;
  keySignature: KeySignature;
  previousPage: Href;
}

export type GameStatsDisplayProps = {
  level: Level<GameType>;
  hitsPerMinute: number;
};
