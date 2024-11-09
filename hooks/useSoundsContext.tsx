import { PIANO_SOUND_ASSETS } from "@/utils/constants";
import { Note } from "@/utils/types";
import { AVPlaybackSource, Audio } from "expo-av";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

interface SoundContext {
  ready: boolean;
  playNote(note: Note): Promise<void>;
}

const initialValues: SoundContext = {
  ready: false,
  playNote: async () => {},
};

const SoundContext = createContext<SoundContext>(initialValues);

const SoundContextProvider = (props: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  // @ts-ignore
  const sounds = useRef<Record<Note, Audio.Sound>>({});

  async function loadSounds() {
    for (const [noteStr, asset] of Object.entries(PIANO_SOUND_ASSETS)) {
      try {
        const note = noteStr as Note;
        const uri = asset as unknown as AVPlaybackSource;
        const { sound } = await Audio.Sound.createAsync(uri);
        sounds.current[note] = sound;
      } catch (err) {
        console.error(err);
      }
    }
    console.log("sounds loaded!");
    setReady(true);
  }

  async function unloadSounds() {
    console.log("unloading sounds...");
    setReady(false);
    // const unloadPromises = Object.values(sounds.current).map((sound) => sound.unloadAsync);
    // const results = await Promise.allSettled(unloadPromises);
    // console.log("sounds unloaded!", results);
  }

  async function playNote(note: Note) {
    // console.log("playNote ", note);

    const status = (await sounds.current[note]?.getStatusAsync()) as any;
    if (status && status["isPlaying"]) {
      // console.log("interrupting old note ", note);
      await sounds.current[note].stopAsync();
    }
    // console.log("play note ", note);
    await sounds.current[note].playAsync();
    // console.log("done playing ", note);
  }

  useEffect(() => {
    loadSounds();

    return () => {
      unloadSounds();
    };
  }, []);

  return <SoundContext.Provider value={{ ready, playNote }}>{props.children}</SoundContext.Provider>;
};

const useSoundContext = () => {
  const ctx = useContext(SoundContext);
  return ctx;
};

export { SoundContextProvider, useSoundContext };
