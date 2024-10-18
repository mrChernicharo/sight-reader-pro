import { WinRank, KeySignature, ScaleType, Accident, GameType, Clef } from "./enums";

export type Note = `${string}/${number}`;
export type NoteRange = `${Note}:::${Note}`;

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
  | { hasKey: false; accident: Accident };

export type GameSettings =
  | ({
      gameType: GameType.Single | GameType.Chord;
      noteRanges: Array<NoteRange>;
    } & GameKeySettings)
  | ({
      gameType: GameType.Melody;
      noteRanges: Array<NoteRange>;
      timeSignature: string;
    } & GameKeySettings)
  | {
      gameType: GameType.Rhythm;
      timeSignature: string;
    };

export type SingleNoteRound = {
  attempt: Note | null;
  value: Note;
};

export type ChordRound = {
  attempt: Note[];
  value: Note[];
};

export type MelodyRound = Array<{
  attempt: Note[];
  value: Note[];
}>;

export type RhythmRound = Array<{
  attempt: number | null;
  value: number;
}>;

export type Round = SingleNoteRound | ChordRound | MelodyRound | RhythmRound;

export type Game = {
  id: string;
  level_id: string;
  timestamp: number;
  durationInSeconds: number;
} & (
  | {
      type: GameType.Single;
      rounds: SingleNoteRound[];
    }
  | {
      type: GameType.Chord;
      rounds: ChordRound[];
    }
  | {
      type: GameType.Melody;
      rounds: MelodyRound[];
    }
  | {
      type: GameType.Rhythm;
      rounds: RhythmRound[];
    }
);

export interface GameScore {
  successes: number;
  mistakes: number;
}

export type Level = GameSettings & {
  id: `${Clef}-${number}`;
  clef: Clef;
  index: number;
  name: string;
  description: string;
  durationInSeconds: number;
  winConditions: WinConditions;
};

export type SectionedLevel = {
  title: string;
  data: Level[];
};

// export type Game = {
//   id: string;
//   level_id: string;
//   timestamp: number;
//   notes: GameNote[];
//   durationInSeconds: number;
// };

export type PianoKeySpec = "Flat" | "Sharp"; /* | 'Both' */
