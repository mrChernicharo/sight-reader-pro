import { flattenEventualSharpNote, getAudioFilepath } from "@/constants/helperFns";
import { Note, SoundEffect } from "@/constants/types";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";

const pianoAssets = {
  "a/1": require("@/assets/sounds/piano-notes/Piano.mf.A1_cut.mp3"),
  "a/2": require("@/assets/sounds/piano-notes/Piano.mf.A2_cut.mp3"),
  "a/3": require("@/assets/sounds/piano-notes/Piano.mf.A3_cut.mp3"),
  "a/4": require("@/assets/sounds/piano-notes/Piano.mf.A4_cut.mp3"),
  "a/5": require("@/assets/sounds/piano-notes/Piano.mf.A5_cut.mp3"),
  "a/6": require("@/assets/sounds/piano-notes/Piano.mf.A6_cut.mp3"),
  "a/7": require("@/assets/sounds/piano-notes/Piano.mf.A7_cut.mp3"),
  "ab/1": require("@/assets/sounds/piano-notes/Piano.mf.Ab1_cut.mp3"),
  "ab/2": require("@/assets/sounds/piano-notes/Piano.mf.Ab2_cut.mp3"),
  "ab/3": require("@/assets/sounds/piano-notes/Piano.mf.Ab3_cut.mp3"),
  "ab/4": require("@/assets/sounds/piano-notes/Piano.mf.Ab4_cut.mp3"),
  "ab/5": require("@/assets/sounds/piano-notes/Piano.mf.Ab5_cut.mp3"),
  "ab/6": require("@/assets/sounds/piano-notes/Piano.mf.Ab6_cut.mp3"),
  "ab/7": require("@/assets/sounds/piano-notes/Piano.mf.Ab7_cut.mp3"),
  "b/1": require("@/assets/sounds/piano-notes/Piano.mf.B1_cut.mp3"),
  "b/2": require("@/assets/sounds/piano-notes/Piano.mf.B2_cut.mp3"),
  "b/3": require("@/assets/sounds/piano-notes/Piano.mf.B3_cut.mp3"),
  "b/4": require("@/assets/sounds/piano-notes/Piano.mf.B4_cut.mp3"),
  "b/5": require("@/assets/sounds/piano-notes/Piano.mf.B5_cut.mp3"),
  "b/6": require("@/assets/sounds/piano-notes/Piano.mf.B6_cut.mp3"),
  "b/7": require("@/assets/sounds/piano-notes/Piano.mf.B7_cut.mp3"),
  "bb/1": require("@/assets/sounds/piano-notes/Piano.mf.Bb1_cut.mp3"),
  "bb/2": require("@/assets/sounds/piano-notes/Piano.mf.Bb2_cut.mp3"),
  "bb/3": require("@/assets/sounds/piano-notes/Piano.mf.Bb3_cut.mp3"),
  "bb/4": require("@/assets/sounds/piano-notes/Piano.mf.Bb4_cut.mp3"),
  "bb/5": require("@/assets/sounds/piano-notes/Piano.mf.Bb5_cut.mp3"),
  "bb/6": require("@/assets/sounds/piano-notes/Piano.mf.Bb6_cut.mp3"),
  "bb/7": require("@/assets/sounds/piano-notes/Piano.mf.Bb7_cut.mp3"),
  "c/1": require("@/assets/sounds/piano-notes/Piano.mf.C1_cut.mp3"),
  "c/2": require("@/assets/sounds/piano-notes/Piano.mf.C2_cut.mp3"),
  "c/3": require("@/assets/sounds/piano-notes/Piano.mf.C3_cut.mp3"),
  "c/4": require("@/assets/sounds/piano-notes/Piano.mf.C4_cut.mp3"),
  "c/5": require("@/assets/sounds/piano-notes/Piano.mf.C5_cut.mp3"),
  "c/6": require("@/assets/sounds/piano-notes/Piano.mf.C6_cut.mp3"),
  "c/7": require("@/assets/sounds/piano-notes/Piano.mf.C7_cut.mp3"),
  "d/1": require("@/assets/sounds/piano-notes/Piano.mf.D1_cut.mp3"),
  "d/2": require("@/assets/sounds/piano-notes/Piano.mf.D2_cut.mp3"),
  "d/3": require("@/assets/sounds/piano-notes/Piano.mf.D3_cut.mp3"),
  "d/4": require("@/assets/sounds/piano-notes/Piano.mf.D4_cut.mp3"),
  "d/5": require("@/assets/sounds/piano-notes/Piano.mf.D5_cut.mp3"),
  "d/6": require("@/assets/sounds/piano-notes/Piano.mf.D6_cut.mp3"),
  "d/7": require("@/assets/sounds/piano-notes/Piano.mf.D7_cut.mp3"),
  "db/1": require("@/assets/sounds/piano-notes/Piano.mf.Db1_cut.mp3"),
  "db/2": require("@/assets/sounds/piano-notes/Piano.mf.Db2_cut.mp3"),
  "db/3": require("@/assets/sounds/piano-notes/Piano.mf.Db3_cut.mp3"),
  "db/4": require("@/assets/sounds/piano-notes/Piano.mf.Db4_cut.mp3"),
  "db/5": require("@/assets/sounds/piano-notes/Piano.mf.Db5_cut.mp3"),
  "db/6": require("@/assets/sounds/piano-notes/Piano.mf.Db6_cut.mp3"),
  "db/7": require("@/assets/sounds/piano-notes/Piano.mf.Db7_cut.mp3"),
  "e/1": require("@/assets/sounds/piano-notes/Piano.mf.E1_cut.mp3"),
  "e/2": require("@/assets/sounds/piano-notes/Piano.mf.E2_cut.mp3"),
  "e/3": require("@/assets/sounds/piano-notes/Piano.mf.E3_cut.mp3"),
  "e/4": require("@/assets/sounds/piano-notes/Piano.mf.E4_cut.mp3"),
  "e/5": require("@/assets/sounds/piano-notes/Piano.mf.E5_cut.mp3"),
  "e/6": require("@/assets/sounds/piano-notes/Piano.mf.E6_cut.mp3"),
  "e/7": require("@/assets/sounds/piano-notes/Piano.mf.E7_cut.mp3"),
  "eb/1": require("@/assets/sounds/piano-notes/Piano.mf.Eb1_cut.mp3"),
  "eb/2": require("@/assets/sounds/piano-notes/Piano.mf.Eb2_cut.mp3"),
  "eb/3": require("@/assets/sounds/piano-notes/Piano.mf.Eb3_cut.mp3"),
  "eb/4": require("@/assets/sounds/piano-notes/Piano.mf.Eb4_cut.mp3"),
  "eb/5": require("@/assets/sounds/piano-notes/Piano.mf.Eb5_cut.mp3"),
  "eb/6": require("@/assets/sounds/piano-notes/Piano.mf.Eb6_cut.mp3"),
  "eb/7": require("@/assets/sounds/piano-notes/Piano.mf.Eb7_cut.mp3"),
  "f/1": require("@/assets/sounds/piano-notes/Piano.mf.F1_cut.mp3"),
  "f/2": require("@/assets/sounds/piano-notes/Piano.mf.F2_cut.mp3"),
  "f/3": require("@/assets/sounds/piano-notes/Piano.mf.F3_cut.mp3"),
  "f/4": require("@/assets/sounds/piano-notes/Piano.mf.F4_cut.mp3"),
  "f/5": require("@/assets/sounds/piano-notes/Piano.mf.F5_cut.mp3"),
  "f/6": require("@/assets/sounds/piano-notes/Piano.mf.F6_cut.mp3"),
  "f/7": require("@/assets/sounds/piano-notes/Piano.mf.F7_cut.mp3"),
  "g/1": require("@/assets/sounds/piano-notes/Piano.mf.G1_cut.mp3"),
  "g/2": require("@/assets/sounds/piano-notes/Piano.mf.G2_cut.mp3"),
  "g/3": require("@/assets/sounds/piano-notes/Piano.mf.G3_cut.mp3"),
  "g/4": require("@/assets/sounds/piano-notes/Piano.mf.G4_cut.mp3"),
  "g/5": require("@/assets/sounds/piano-notes/Piano.mf.G5_cut.mp3"),
  "g/6": require("@/assets/sounds/piano-notes/Piano.mf.G6_cut.mp3"),
  "g/7": require("@/assets/sounds/piano-notes/Piano.mf.G7_cut.mp3"),
  "gb/1": require("@/assets/sounds/piano-notes/Piano.mf.Gb1_cut.mp3"),
  "gb/2": require("@/assets/sounds/piano-notes/Piano.mf.Gb2_cut.mp3"),
  "gb/3": require("@/assets/sounds/piano-notes/Piano.mf.Gb3_cut.mp3"),
  "gb/4": require("@/assets/sounds/piano-notes/Piano.mf.Gb4_cut.mp3"),
  "gb/5": require("@/assets/sounds/piano-notes/Piano.mf.Gb5_cut.mp3"),
  "gb/6": require("@/assets/sounds/piano-notes/Piano.mf.Gb6_cut.mp3"),
  "gb/7": require("@/assets/sounds/piano-notes/Piano.mf.Gb7_cut.mp3"),
};

const efxAssets = {
  [SoundEffect.WrongAnswer]: require("@/assets/sounds/efx/wrong-answer.mp3"),
};

export function usePianoSound() {
  const [sounds, setSounds] = useState<Map<Note, Audio.Sound>>(new Map());

  async function playPianoNote(originalNote: Note) {
    const parsedNote = parseSharpsIntoFlats(originalNote);
    // console.log(">>>>", { originalNote, parsedNote });
    try {
      if (sounds.has(parsedNote)) {
        const sound = sounds.get(parsedNote)!;

        const soundStatus = await sound?.getStatusAsync();
        if (soundStatus && (soundStatus as any)["isPlaying"]) {
          await sound.stopAsync();
        }
        sound.playFromPositionAsync(0);
      } else {
        const uri = getSoundUri(pianoAssets, parsedNote);
        const { sound } = await Audio.Sound.createAsync(uri, { volume: 1 });
        setSounds((prevMap) => {
          const nextMap = new Map(prevMap);
          nextMap.set(parsedNote, sound);
          return nextMap;
        });
        sound.playFromPositionAsync(0);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    return () => {
      console.log("unload notes");
      for (const s of sounds.values()) {
        s.unloadAsync();
      }
    };
  }, []);

  // useEffect(() => {
  //   console.log(sounds);
  // }, [sounds]);

  return {
    playPianoNote,
  };
}

export function useSoundEfx() {
  const [sounds, setSounds] = useState<Map<SoundEffect, Audio.Sound>>(new Map());

  async function playSoundEfx(effect: SoundEffect) {
    try {
      if (sounds.has(effect)) {
        const sound = sounds.get(effect)!;

        const soundStatus = await sound?.getStatusAsync();
        if (soundStatus && (soundStatus as any)["isPlaying"]) {
          await sound.stopAsync();
        }
        sound.playFromPositionAsync(0);
      } else {
        // const uri = getSoundUri(pianoAssets, effect);
        const uri = efxAssets[effect];
        const { sound } = await Audio.Sound.createAsync(uri, { volume: 0.2 });
        setSounds((prevMap) => {
          const nextMap = new Map(prevMap);
          nextMap.set(effect, sound);
          return nextMap;
        });
        sound.playFromPositionAsync(0);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    return () => {
      console.log("unload efx");
      for (const s of sounds.values()) {
        s.unloadAsync();
      }
    };
  }, []);

  return {
    playSoundEfx,
  };
}

function getSoundUri(paths: any, note: Note) {
  const filePath = getAudioFilepath(note);
  const uri = paths[note as keyof typeof paths];
  console.log("getSoundUri", { filePath, note, uri });
  return uri;
}

function parseSharpsIntoFlats(originalNote: Note) {
  const [k, oct] = originalNote.split("/");
  const flatForcedNote = `${flattenEventualSharpNote(k)}/${oct}` as Note;
  return flatForcedNote;
}
