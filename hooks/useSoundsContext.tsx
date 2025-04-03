import { PIANO_SOUND_ASSETS } from "@/utils/constants";
import { NoteName } from "@/utils/enums";
import { Note } from "@/utils/types";
import { AVPlaybackSource, Audio } from "expo-av";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { GainNode, AudioBuffer, AudioContext, AudioBufferSourceNode } from "react-native-audio-api";

const pianoAssetsURLs = {
  "a/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A1.mp3",
  "a/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A2.mp3",
  "a/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A3.mp3",
  "a/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A4.mp3",
  "a/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A5.mp3",
  "a/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A6.mp3",
  "a/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.A7.mp3",
  "ab/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab1.mp3",
  "ab/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab2.mp3",
  "ab/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab3.mp3",
  "ab/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab4.mp3",
  "ab/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab5.mp3",
  "ab/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab6.mp3",
  "ab/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Ab7.mp3",
  "b/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B1.mp3",
  "b/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B2.mp3",
  "b/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B3.mp3",
  "b/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B4.mp3",
  "b/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B5.mp3",
  "b/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B6.mp3",
  "b/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.B7.mp3",
  "bb/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb1.mp3",
  "bb/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb2.mp3",
  "bb/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb3.mp3",
  "bb/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb4.mp3",
  "bb/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb5.mp3",
  "bb/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb6.mp3",
  "bb/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Bb7.mp3",
  "c/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C1.mp3",
  "c/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C2.mp3",
  "c/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C3.mp3",
  "c/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C4.mp3",
  "c/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C5.mp3",
  "c/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C6.mp3",
  "c/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.C7.mp3",
  "d/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D1.mp3",
  "d/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D2.mp3",
  "d/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D3.mp3",
  "d/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D4.mp3",
  "d/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D5.mp3",
  "d/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D6.mp3",
  "d/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.D7.mp3",
  "db/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db1.mp3",
  "db/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db2.mp3",
  "db/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db3.mp3",
  "db/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db4.mp3",
  "db/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db5.mp3",
  "db/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db6.mp3",
  "db/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Db7.mp3",
  "e/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E1.mp3",
  "e/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E2.mp3",
  "e/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E3.mp3",
  "e/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E4.mp3",
  "e/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E5.mp3",
  "e/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E6.mp3",
  "e/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.E7.mp3",
  "eb/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb1.mp3",
  "eb/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb2.mp3",
  "eb/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb3.mp3",
  "eb/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb4.mp3",
  "eb/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb5.mp3",
  "eb/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb6.mp3",
  "eb/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Eb7.mp3",
  "f/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F1.mp3",
  "f/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F2.mp3",
  "f/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F3.mp3",
  "f/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F4.mp3",
  "f/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F5.mp3",
  "f/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F6.mp3",
  "f/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.F7.mp3",
  "g/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G1.mp3",
  "g/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G2.mp3",
  "g/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G3.mp3",
  "g/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G4.mp3",
  "g/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G5.mp3",
  "g/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G6.mp3",
  "g/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.G7.mp3",
  "gb/1": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb1.mp3",
  "gb/2": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb2.mp3",
  "gb/3": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb3.mp3",
  "gb/4": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb4.mp3",
  "gb/5": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb5.mp3",
  "gb/6": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb6.mp3",
  "gb/7": "https://mrchernicharo.github.io/piano-notes/Piano.mf.Gb7.mp3",

  //  A: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/C4.mp3',
  // C: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/Ds4.mp3',
  // E: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/Fs4.mp3',
};
type PR<V> = Partial<Record<Note, V>>;
interface PlayingNote {
  source: AudioBufferSourceNode;
  envelope: GainNode;
  startedAt: number;
}

interface SoundContext {
  ready: boolean;
  playPianoNote(note: Note): Promise<void>;
  releasePianoNote(note: NoteName): Promise<void>;
}

const initialValues: SoundContext = {
  ready: false,
  playPianoNote: async () => {},
  releasePianoNote: async () => {},
};

const SoundContext = createContext<SoundContext>(initialValues);

const SoundContextProvider = (props: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  // const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playingNotesRef = useRef<PR<PlayingNote>>({});
  const bufferMapRef = useRef<PR<AudioBuffer>>({});

  async function loadSounds() {
    console.log(`<usePianoSound2> loading Piano Sounds...`);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioAssets = Object.entries(pianoAssetsURLs);
    let timeStart = Date.now();

    // console.log(`<usePianoSound2>`, { audioAssets, audioContextRef: audioContextRef.current });

    audioAssets.forEach(async ([key, url], i) => {
      const audioBuffer = await fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContextRef.current!.decodeAudioData(arrayBuffer));

      bufferMapRef.current[key as Note] = audioBuffer;

      const isLastAsset = i + 1 == audioAssets.length;
      if (isLastAsset) {
        console.log(`<usePianoSound2> Done loading Piano Sounds. Took ${Date.now() - timeStart}ms`);
        setReady(true);
      }
    });
  }

  async function unloadSounds() {
    console.log("<usePianoSound2> ...closing audio ctx");
    audioContextRef.current?.close().then(() => {
      audioContextRef.current = null;
      playingNotesRef.current = {};
      bufferMapRef.current = {};
      setReady(false);
      console.log("<usePianoSound2> ...Done closing");
    });
  }

  async function playPianoNote(originalNote: Note) {
    console.log("<usePianoSound2> playPianoNote");
    const audioContext = audioContextRef.current;
    let buffer = bufferMapRef.current[originalNote];
    const tNow = audioContext?.currentTime;
    // console.log("onKeyPressIn :::", { audioContext, buffer, tNow, playingNotes: playingNotesRef.current });
    if (!audioContext || !buffer || !tNow) {
      return;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const envelope = audioContext.createGain();

    source.connect(envelope);
    envelope.connect(audioContext.destination);

    envelope.gain.setValueAtTime(0.001, tNow);
    envelope.gain.exponentialRampToValueAtTime(1, tNow + 0.01);

    source.start(tNow);

    playingNotesRef.current[originalNote] = { source, envelope, startedAt: tNow };
  }

  async function releasePianoNote(originalNote: NoteName) {
    console.log("<usePianoSound2> releasePianoNote", console.log("playingNotes :::", playingNotesRef.current));

    // const audioContext = audioContextRef.current!;
    // const playingNote = playingNotesRef.current[originalNote];

    // if (!playingNote || !audioContext) {
    //   return;
    // }

    // const { source, envelope, startedAt } = playingNote;

    // const tStop = Math.max(audioContext.currentTime, startedAt + 5);

    // envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
    // envelope.gain.setValueAtTime(0, tStop + 0.09);
    // source.stop(tStop + 0.1);

    // playingNotesRef.current[originalNote] = undefined;
  }

  useEffect(() => {
    loadSounds();

    return () => {
      unloadSounds();
    };
  }, []);

  return (
    <SoundContext.Provider value={{ ready, playPianoNote, releasePianoNote }}>{props.children}</SoundContext.Provider>
  );
};

const useSoundContext = () => useContext(SoundContext);

export { SoundContextProvider, useSoundContext };
