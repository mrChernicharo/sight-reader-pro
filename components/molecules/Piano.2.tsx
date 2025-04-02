import { KeySignature, NoteName } from "@/utils/enums";
import { FLAT_KEY_SIGNATURES } from "@/utils/keySignature";
import { WHITE_NOTES } from "@/utils/notes";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { useEffect, useRef } from "react";
import { Note } from "@/utils/types";
import { GainNode, AudioBuffer, AudioContext, AudioBufferSourceNode } from "react-native-audio-api";
import { capitalizeStr } from "@/utils/helperFns";

const pianoAssets = {
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

const blackNoteNames: Record<"Flat" | "Sharp", NoteName[]> = {
  Flat: ["db", "eb", "", "gb", "ab", "bb"] as NoteName[],
  Sharp: ["c#", "d#", "", "f#", "g#", "a#"] as NoteName[],
};

type PR<V> = Partial<Record<Note, V>>;
interface PlayingNote {
  source: AudioBufferSourceNode;
  envelope: GainNode;
  startedAt: number;
}

export function Piano2({
  keySignature,
  onKeyPressed,
}: {
  keySignature: KeySignature;
  onKeyPressed: (note: NoteName) => void;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const playingNotesRef = useRef<PR<PlayingNote>>({});
  const bufferMapRef = useRef<PR<AudioBuffer>>({});

  const { width } = useWindowDimensions();
  const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";
  const BLACK_NOTES = blackNoteNames[pianoBlackKeySpec];
  const [blackNotesLeft, blackNotesRight] = [BLACK_NOTES.slice(0, 2), BLACK_NOTES.slice(3)];
  const keyboardMargin = width * 0.06;
  const keyWidth = (width - keyboardMargin * 2) / 7;

  function onKeyPressIn(which: Note) {
    const audioContext = audioContextRef.current;
    let buffer = bufferMapRef.current[which];
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

    playingNotesRef.current[which] = { source, envelope, startedAt: tNow };
  }

  function onKeyPressOut(which: Note) {
    const audioContext = audioContextRef.current!;
    const playingNote = playingNotesRef.current[which];

    if (!playingNote || !audioContext) {
      return;
    }

    const { source, envelope, startedAt } = playingNote;

    const tStop = Math.max(audioContext.currentTime, startedAt + 5);

    envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
    envelope.gain.setValueAtTime(0, tStop + 0.09);
    source.stop(tStop + 0.1);

    playingNotesRef.current[which] = undefined;
  }

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioAssets = Object.entries(pianoAssets);
    let timeStart = Date.now();

    audioAssets.forEach(async ([key, url], i) => {
      const audioBuffer = await fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContextRef.current!.decodeAudioData(arrayBuffer));

      bufferMapRef.current[key as Note] = audioBuffer;

      const isLastAsset = i + 1 == audioAssets.length;
      if (isLastAsset) {
        console.log(`Done loading Piano Sounds. Took ${Date.now() - timeStart}ms`);
      }
    });

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <AppView style={[s.piano]}>
      {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
      <AppView
        style={[s.blackNotes, { width: keyboardMargin + keyWidth * 1.36, left: keyboardMargin + keyWidth / 1.65 }]}
      >
        {blackNotesLeft.map((note) => (
          <AppView key={note} style={[s.blackNote, { width: keyWidth, ...(!String(note) && { height: 0 }) }]}>
            <Pressable
              style={[s.blackNoteInner]}
              android_ripple={{ radius: 90, color: "#ffffff33" }}
              // android_disableSound
              //   cancelable
              onPressIn={() => onKeyPressIn(`${note}/3` as Note)}
              onPressOut={() => onKeyPressOut(`${note}/3` as Note)}
            >
              <AppText style={{ color: "white" }}>{capitalizeStr(note)}</AppText>
            </Pressable>
          </AppView>
        ))}
      </AppView>

      <AppView
        style={[s.blackNotes, { width: keyboardMargin + keyWidth * 2.35, right: keyboardMargin + keyWidth / 1.75 }]}
      >
        {blackNotesRight.map((note) => (
          <AppView key={note} style={[s.blackNote, { width: keyWidth, ...(!String(note) && { height: 0 }) }]}>
            <Pressable
              style={[s.blackNoteInner]}
              android_ripple={{ radius: 90, color: "#ffffff33" }}
              // android_disableSound
              //   cancelable
              onPressIn={() => onKeyPressIn(`${note}/3` as Note)}
              onPressOut={() => onKeyPressOut(`${note}/3` as Note)}
            >
              <AppText style={{ color: "white" }}>{capitalizeStr(note)}</AppText>
            </Pressable>
          </AppView>
        ))}
      </AppView>

      <AppView style={s.whiteNotes}>
        {WHITE_NOTES.map((note) => (
          <Pressable
            key={note}
            android_ripple={{ radius: 90, color: "#000000066" }}
            // android_disableSound
            // cancelable
            // onPress={() => {
            //   onPianoKeyPress(note as NoteName);
            // }}
            onPressIn={() => onKeyPressIn(`${note}/3` as Note)}
            onPressOut={() => onKeyPressOut(`${note}/3` as Note)}
            style={[s.whiteNote, { width: keyWidth }]}
          >
            <AppText style={{ color: "black" }}>{capitalizeStr(note)}</AppText>
          </Pressable>
        ))}
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  piano: {
    position: "relative",
    paddingBottom: 80,
    marginTop: -20,
  },
  whiteNotes: {
    flexDirection: "row",
    justifyContent: "center",
  },
  whiteNote: {
    borderWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#ddd",
    height: 160,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  blackNotes: {
    flexDirection: "row",
    position: "absolute",
    top: -10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 10000,
  },
  blackNote: {
    height: 110,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  blackNoteInner: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#333",
    height: "100%",
    width: "80%",
    borderRadius: 6,
    zIndex: 10000,
  },
});
