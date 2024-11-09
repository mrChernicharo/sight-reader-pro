import { SoundEffect } from "@/constants/enums";
import { flattenEventualSharpNote, getAudioFilepath } from "@/constants/helperFns";
import { Note } from "@/constants/types";
import { Audio } from "expo-av";
import { useState, useEffect, useRef } from "react";

const pianoAssets = {
  "a/1": require("@/assets/sounds/piano-notes/Piano.mf.A1.mp3"),
  "a/2": require("@/assets/sounds/piano-notes/Piano.mf.A2.mp3"),
  "a/3": require("@/assets/sounds/piano-notes/Piano.mf.A3.mp3"),
  "a/4": require("@/assets/sounds/piano-notes/Piano.mf.A4.mp3"),
  "a/5": require("@/assets/sounds/piano-notes/Piano.mf.A5.mp3"),
  "a/6": require("@/assets/sounds/piano-notes/Piano.mf.A6.mp3"),
  "a/7": require("@/assets/sounds/piano-notes/Piano.mf.A7.mp3"),
  "ab/1": require("@/assets/sounds/piano-notes/Piano.mf.Ab1.mp3"),
  "ab/2": require("@/assets/sounds/piano-notes/Piano.mf.Ab2.mp3"),
  "ab/3": require("@/assets/sounds/piano-notes/Piano.mf.Ab3.mp3"),
  "ab/4": require("@/assets/sounds/piano-notes/Piano.mf.Ab4.mp3"),
  "ab/5": require("@/assets/sounds/piano-notes/Piano.mf.Ab5.mp3"),
  "ab/6": require("@/assets/sounds/piano-notes/Piano.mf.Ab6.mp3"),
  "ab/7": require("@/assets/sounds/piano-notes/Piano.mf.Ab7.mp3"),
  "b/1": require("@/assets/sounds/piano-notes/Piano.mf.B1.mp3"),
  "b/2": require("@/assets/sounds/piano-notes/Piano.mf.B2.mp3"),
  "b/3": require("@/assets/sounds/piano-notes/Piano.mf.B3.mp3"),
  "b/4": require("@/assets/sounds/piano-notes/Piano.mf.B4.mp3"),
  "b/5": require("@/assets/sounds/piano-notes/Piano.mf.B5.mp3"),
  "b/6": require("@/assets/sounds/piano-notes/Piano.mf.B6.mp3"),
  "b/7": require("@/assets/sounds/piano-notes/Piano.mf.B7.mp3"),
  "bb/1": require("@/assets/sounds/piano-notes/Piano.mf.Bb1.mp3"),
  "bb/2": require("@/assets/sounds/piano-notes/Piano.mf.Bb2.mp3"),
  "bb/3": require("@/assets/sounds/piano-notes/Piano.mf.Bb3.mp3"),
  "bb/4": require("@/assets/sounds/piano-notes/Piano.mf.Bb4.mp3"),
  "bb/5": require("@/assets/sounds/piano-notes/Piano.mf.Bb5.mp3"),
  "bb/6": require("@/assets/sounds/piano-notes/Piano.mf.Bb6.mp3"),
  "bb/7": require("@/assets/sounds/piano-notes/Piano.mf.Bb7.mp3"),
  "c/1": require("@/assets/sounds/piano-notes/Piano.mf.C1.mp3"),
  "c/2": require("@/assets/sounds/piano-notes/Piano.mf.C2.mp3"),
  "c/3": require("@/assets/sounds/piano-notes/Piano.mf.C3.mp3"),
  "c/4": require("@/assets/sounds/piano-notes/Piano.mf.C4.mp3"),
  "c/5": require("@/assets/sounds/piano-notes/Piano.mf.C5.mp3"),
  "c/6": require("@/assets/sounds/piano-notes/Piano.mf.C6.mp3"),
  "c/7": require("@/assets/sounds/piano-notes/Piano.mf.C7.mp3"),
  "d/1": require("@/assets/sounds/piano-notes/Piano.mf.D1.mp3"),
  "d/2": require("@/assets/sounds/piano-notes/Piano.mf.D2.mp3"),
  "d/3": require("@/assets/sounds/piano-notes/Piano.mf.D3.mp3"),
  "d/4": require("@/assets/sounds/piano-notes/Piano.mf.D4.mp3"),
  "d/5": require("@/assets/sounds/piano-notes/Piano.mf.D5.mp3"),
  "d/6": require("@/assets/sounds/piano-notes/Piano.mf.D6.mp3"),
  "d/7": require("@/assets/sounds/piano-notes/Piano.mf.D7.mp3"),
  "db/1": require("@/assets/sounds/piano-notes/Piano.mf.Db1.mp3"),
  "db/2": require("@/assets/sounds/piano-notes/Piano.mf.Db2.mp3"),
  "db/3": require("@/assets/sounds/piano-notes/Piano.mf.Db3.mp3"),
  "db/4": require("@/assets/sounds/piano-notes/Piano.mf.Db4.mp3"),
  "db/5": require("@/assets/sounds/piano-notes/Piano.mf.Db5.mp3"),
  "db/6": require("@/assets/sounds/piano-notes/Piano.mf.Db6.mp3"),
  "db/7": require("@/assets/sounds/piano-notes/Piano.mf.Db7.mp3"),
  "e/1": require("@/assets/sounds/piano-notes/Piano.mf.E1.mp3"),
  "e/2": require("@/assets/sounds/piano-notes/Piano.mf.E2.mp3"),
  "e/3": require("@/assets/sounds/piano-notes/Piano.mf.E3.mp3"),
  "e/4": require("@/assets/sounds/piano-notes/Piano.mf.E4.mp3"),
  "e/5": require("@/assets/sounds/piano-notes/Piano.mf.E5.mp3"),
  "e/6": require("@/assets/sounds/piano-notes/Piano.mf.E6.mp3"),
  "e/7": require("@/assets/sounds/piano-notes/Piano.mf.E7.mp3"),
  "eb/1": require("@/assets/sounds/piano-notes/Piano.mf.Eb1.mp3"),
  "eb/2": require("@/assets/sounds/piano-notes/Piano.mf.Eb2.mp3"),
  "eb/3": require("@/assets/sounds/piano-notes/Piano.mf.Eb3.mp3"),
  "eb/4": require("@/assets/sounds/piano-notes/Piano.mf.Eb4.mp3"),
  "eb/5": require("@/assets/sounds/piano-notes/Piano.mf.Eb5.mp3"),
  "eb/6": require("@/assets/sounds/piano-notes/Piano.mf.Eb6.mp3"),
  "eb/7": require("@/assets/sounds/piano-notes/Piano.mf.Eb7.mp3"),
  "f/1": require("@/assets/sounds/piano-notes/Piano.mf.F1.mp3"),
  "f/2": require("@/assets/sounds/piano-notes/Piano.mf.F2.mp3"),
  "f/3": require("@/assets/sounds/piano-notes/Piano.mf.F3.mp3"),
  "f/4": require("@/assets/sounds/piano-notes/Piano.mf.F4.mp3"),
  "f/5": require("@/assets/sounds/piano-notes/Piano.mf.F5.mp3"),
  "f/6": require("@/assets/sounds/piano-notes/Piano.mf.F6.mp3"),
  "f/7": require("@/assets/sounds/piano-notes/Piano.mf.F7.mp3"),
  "g/1": require("@/assets/sounds/piano-notes/Piano.mf.G1.mp3"),
  "g/2": require("@/assets/sounds/piano-notes/Piano.mf.G2.mp3"),
  "g/3": require("@/assets/sounds/piano-notes/Piano.mf.G3.mp3"),
  "g/4": require("@/assets/sounds/piano-notes/Piano.mf.G4.mp3"),
  "g/5": require("@/assets/sounds/piano-notes/Piano.mf.G5.mp3"),
  "g/6": require("@/assets/sounds/piano-notes/Piano.mf.G6.mp3"),
  "g/7": require("@/assets/sounds/piano-notes/Piano.mf.G7.mp3"),
  "gb/1": require("@/assets/sounds/piano-notes/Piano.mf.Gb1.mp3"),
  "gb/2": require("@/assets/sounds/piano-notes/Piano.mf.Gb2.mp3"),
  "gb/3": require("@/assets/sounds/piano-notes/Piano.mf.Gb3.mp3"),
  "gb/4": require("@/assets/sounds/piano-notes/Piano.mf.Gb4.mp3"),
  "gb/5": require("@/assets/sounds/piano-notes/Piano.mf.Gb5.mp3"),
  "gb/6": require("@/assets/sounds/piano-notes/Piano.mf.Gb6.mp3"),
  "gb/7": require("@/assets/sounds/piano-notes/Piano.mf.Gb7.mp3"),
};

const efxAssets = {
  [SoundEffect.WrongAnswer]: require("@/assets/sounds/efx/wrong-answer.mp3"),
};

export function usePianoSound() {
  const sounds = useRef<Map<Note, Audio.Sound>>(new Map());

  async function playPianoNote(originalNote: Note) {
    const parsedNote: Note = parseSharpsIntoFlats(originalNote);
    // console.log(">>>>", { originalNote, parsedNote });
    try {
      let _sound: Audio.Sound;
      if (sounds.current.has(parsedNote)) {
        _sound = sounds.current.get(parsedNote)!;

        // @TESTING if this restarting note sound is really necessary
        // const soundStatus = await _sound?.getStatusAsync();
        // if (soundStatus && (soundStatus as any)["isPlaying"]) {
        //   await _sound.setPositionAsync(0);
        // }
        _sound.playFromPositionAsync(0);
      }
      //
      else {
        const uri = pianoAssets[parsedNote as keyof typeof pianoAssets];
        _sound = (await Audio.Sound.createAsync(uri, { volume: 1 })).sound;
        sounds.current.set(parsedNote, _sound);
        _sound.playFromPositionAsync(0);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    return () => {
      // console.log("will unload notes...");
      // setTimeout(() => {
      //   console.log("volume down");
      //   for (const s of sounds.current.values()) {
      //     s.setVolumeAsync(0.6);
      //   }
      // }, 2000);

      // setTimeout(() => {
      //   console.log(" more volume down");
      //   for (const s of sounds.current.values()) {
      //     s.setVolumeAsync(0.3);
      //   }
      // }, 4000);

      setTimeout(() => {
        console.log("unload notes!");
        for (const s of sounds.current.values()) {
          s.unloadAsync();
        }
      }, 6000);
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
        const { sound } = await Audio.Sound.createAsync(uri, { volume: 0.1 });
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
  }, [sounds]);

  return {
    playSoundEfx,
  };
}

// function getSoundUri(paths: any, note: Note) {
//   const filePath = getAudioFilepath(note);
//   const uri = paths[note as keyof typeof paths];
//   // console.log("getSoundUri", { filePath, note, uri });
//   return uri;
// }

function parseSharpsIntoFlats(originalNote: Note) {
  const [k, oct] = originalNote.split("/");
  const flatForcedNote = `${flattenEventualSharpNote(k)}/${oct}` as Note;
  return flatForcedNote;
}
