import { NoteName, SoundEffect } from "@/utils/enums";
import { Note } from "@/utils/types";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { AudioBuffer, AudioBufferSourceNode, AudioContext, GainNode } from "react-native-audio-api";
import { Asset, useAssets } from "expo-asset";

// export const soundAssets = {
//     "a/1": require("@/assets/sounds/piano-notes/Piano.mf.A1.mp3"),
//     "a/2": require("@/assets/sounds/piano-notes/Piano.mf.A2.mp3"),
//     "a/3": require("@/assets/sounds/piano-notes/Piano.mf.A3.mp3"),
//     "a/4": require("@/assets/sounds/piano-notes/Piano.mf.A4.mp3"),
//     "a/5": require("@/assets/sounds/piano-notes/Piano.mf.A5.mp3"),
//     "a/6": require("@/assets/sounds/piano-notes/Piano.mf.A6.mp3"),
//     "a/7": require("@/assets/sounds/piano-notes/Piano.mf.A7.mp3"),
//     "ab/1": require("@/assets/sounds/piano-notes/Piano.mf.Ab1.mp3"),
//     "ab/2": require("@/assets/sounds/piano-notes/Piano.mf.Ab2.mp3"),
//     "ab/3": require("@/assets/sounds/piano-notes/Piano.mf.Ab3.mp3"),
//     "ab/4": require("@/assets/sounds/piano-notes/Piano.mf.Ab4.mp3"),
//     "ab/5": require("@/assets/sounds/piano-notes/Piano.mf.Ab5.mp3"),
//     "ab/6": require("@/assets/sounds/piano-notes/Piano.mf.Ab6.mp3"),
//     "ab/7": require("@/assets/sounds/piano-notes/Piano.mf.Ab7.mp3"),
//     "b/1": require("@/assets/sounds/piano-notes/Piano.mf.B1.mp3"),
//     "b/2": require("@/assets/sounds/piano-notes/Piano.mf.B2.mp3"),
//     "b/3": require("@/assets/sounds/piano-notes/Piano.mf.B3.mp3"),
//     "b/4": require("@/assets/sounds/piano-notes/Piano.mf.B4.mp3"),
//     "b/5": require("@/assets/sounds/piano-notes/Piano.mf.B5.mp3"),
//     "b/6": require("@/assets/sounds/piano-notes/Piano.mf.B6.mp3"),
//     "b/7": require("@/assets/sounds/piano-notes/Piano.mf.B7.mp3"),
//     "bb/1": require("@/assets/sounds/piano-notes/Piano.mf.Bb1.mp3"),
//     "bb/2": require("@/assets/sounds/piano-notes/Piano.mf.Bb2.mp3"),
//     "bb/3": require("@/assets/sounds/piano-notes/Piano.mf.Bb3.mp3"),
//     "bb/4": require("@/assets/sounds/piano-notes/Piano.mf.Bb4.mp3"),
//     "bb/5": require("@/assets/sounds/piano-notes/Piano.mf.Bb5.mp3"),
//     "bb/6": require("@/assets/sounds/piano-notes/Piano.mf.Bb6.mp3"),
//     "bb/7": require("@/assets/sounds/piano-notes/Piano.mf.Bb7.mp3"),
//     "c/1": require("@/assets/sounds/piano-notes/Piano.mf.C1.mp3"),
//     "c/2": require("@/assets/sounds/piano-notes/Piano.mf.C2.mp3"),
//     "c/3": require("@/assets/sounds/piano-notes/Piano.mf.C3.mp3"),
//     "c/4": require("@/assets/sounds/piano-notes/Piano.mf.C4.mp3"),
//     "c/5": require("@/assets/sounds/piano-notes/Piano.mf.C5.mp3"),
//     "c/6": require("@/assets/sounds/piano-notes/Piano.mf.C6.mp3"),
//     "c/7": require("@/assets/sounds/piano-notes/Piano.mf.C7.mp3"),
//     "d/1": require("@/assets/sounds/piano-notes/Piano.mf.D1.mp3"),
//     "d/2": require("@/assets/sounds/piano-notes/Piano.mf.D2.mp3"),
//     "d/3": require("@/assets/sounds/piano-notes/Piano.mf.D3.mp3"),
//     "d/4": require("@/assets/sounds/piano-notes/Piano.mf.D4.mp3"),
//     "d/5": require("@/assets/sounds/piano-notes/Piano.mf.D5.mp3"),
//     "d/6": require("@/assets/sounds/piano-notes/Piano.mf.D6.mp3"),
//     "d/7": require("@/assets/sounds/piano-notes/Piano.mf.D7.mp3"),
//     "db/1": require("@/assets/sounds/piano-notes/Piano.mf.Db1.mp3"),
//     "db/2": require("@/assets/sounds/piano-notes/Piano.mf.Db2.mp3"),
//     "db/3": require("@/assets/sounds/piano-notes/Piano.mf.Db3.mp3"),
//     "db/4": require("@/assets/sounds/piano-notes/Piano.mf.Db4.mp3"),
//     "db/5": require("@/assets/sounds/piano-notes/Piano.mf.Db5.mp3"),
//     "db/6": require("@/assets/sounds/piano-notes/Piano.mf.Db6.mp3"),
//     "db/7": require("@/assets/sounds/piano-notes/Piano.mf.Db7.mp3"),
//     "e/1": require("@/assets/sounds/piano-notes/Piano.mf.E1.mp3"),
//     "e/2": require("@/assets/sounds/piano-notes/Piano.mf.E2.mp3"),
//     "e/3": require("@/assets/sounds/piano-notes/Piano.mf.E3.mp3"),
//     "e/4": require("@/assets/sounds/piano-notes/Piano.mf.E4.mp3"),
//     "e/5": require("@/assets/sounds/piano-notes/Piano.mf.E5.mp3"),
//     "e/6": require("@/assets/sounds/piano-notes/Piano.mf.E6.mp3"),
//     "e/7": require("@/assets/sounds/piano-notes/Piano.mf.E7.mp3"),
//     "eb/1": require("@/assets/sounds/piano-notes/Piano.mf.Eb1.mp3"),
//     "eb/2": require("@/assets/sounds/piano-notes/Piano.mf.Eb2.mp3"),
//     "eb/3": require("@/assets/sounds/piano-notes/Piano.mf.Eb3.mp3"),
//     "eb/4": require("@/assets/sounds/piano-notes/Piano.mf.Eb4.mp3"),
//     "eb/5": require("@/assets/sounds/piano-notes/Piano.mf.Eb5.mp3"),
//     "eb/6": require("@/assets/sounds/piano-notes/Piano.mf.Eb6.mp3"),
//     "eb/7": require("@/assets/sounds/piano-notes/Piano.mf.Eb7.mp3"),
//     "f/1": require("@/assets/sounds/piano-notes/Piano.mf.F1.mp3"),
//     "f/2": require("@/assets/sounds/piano-notes/Piano.mf.F2.mp3"),
//     "f/3": require("@/assets/sounds/piano-notes/Piano.mf.F3.mp3"),
//     "f/4": require("@/assets/sounds/piano-notes/Piano.mf.F4.mp3"),
//     "f/5": require("@/assets/sounds/piano-notes/Piano.mf.F5.mp3"),
//     "f/6": require("@/assets/sounds/piano-notes/Piano.mf.F6.mp3"),
//     "f/7": require("@/assets/sounds/piano-notes/Piano.mf.F7.mp3"),
//     "g/1": require("@/assets/sounds/piano-notes/Piano.mf.G1.mp3"),
//     "g/2": require("@/assets/sounds/piano-notes/Piano.mf.G2.mp3"),
//     "g/3": require("@/assets/sounds/piano-notes/Piano.mf.G3.mp3"),
//     "g/4": require("@/assets/sounds/piano-notes/Piano.mf.G4.mp3"),
//     "g/5": require("@/assets/sounds/piano-notes/Piano.mf.G5.mp3"),
//     "g/6": require("@/assets/sounds/piano-notes/Piano.mf.G6.mp3"),
//     "g/7": require("@/assets/sounds/piano-notes/Piano.mf.G7.mp3"),
//     "gb/1": require("@/assets/sounds/piano-notes/Piano.mf.Gb1.mp3"),
//     "gb/2": require("@/assets/sounds/piano-notes/Piano.mf.Gb2.mp3"),
//     "gb/3": require("@/assets/sounds/piano-notes/Piano.mf.Gb3.mp3"),
//     "gb/4": require("@/assets/sounds/piano-notes/Piano.mf.Gb4.mp3"),
//     "gb/5": require("@/assets/sounds/piano-notes/Piano.mf.Gb5.mp3"),
//     "gb/6": require("@/assets/sounds/piano-notes/Piano.mf.Gb6.mp3"),
//     "gb/7": require("@/assets/sounds/piano-notes/Piano.mf.Gb7.mp3"),
//     [SoundEffect.WrongAnswer]: require("@/assets/sounds/efx/wrong-answer.mp3"),
//     //  A: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/C4.mp3',
//     // C: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/Ds4.mp3',
//     // E: 'https://software-mansion.github.io/react-native-audio-api/audio/sounds/Fs4.mp3',
// };

type PR<V> = Partial<Record<string, V>>;
interface PlayingSound {
    source: AudioBufferSourceNode;
    envelope: GainNode;
    startedAt: number;
}

interface SoundContext {
    ready: boolean;
    playPianoNote(note: Note): Promise<void>;
    releasePianoNote(note: Note): Promise<void>;
    playSoundEfx(effect: SoundEffect): Promise<void>;
}

const initialValues: SoundContext = {
    ready: false,
    playPianoNote: async () => {},
    releasePianoNote: async () => {},
    playSoundEfx: async () => {},
};

const SoundContext = createContext<SoundContext>(initialValues);

const SoundContextProvider = (props: { children: ReactNode }) => {
    const [assets, loadErr] = useAssets([
        require("@/assets/sounds/piano-notes/Piano.mf.A1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.A7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Ab7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.B7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Bb7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.C7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.D7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Db7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.E7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Eb7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.F7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.G7.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb1.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb2.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb3.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb4.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb5.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb6.mp3"),
        require("@/assets/sounds/piano-notes/Piano.mf.Gb7.mp3"),
        require("@/assets/sounds/efx/wrong-answer.mp3"),
    ]);
    const [ready, setReady] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const playingSoundsRef = useRef<PR<PlayingSound>>({});
    const bufferMapRef = useRef<PR<AudioBuffer>>({});

    async function playPianoNote(originalNote: Note) {
        await releasePianoNote(originalNote);

        // console.log("<SoundContext> playPianoNote", originalNote);
        const audioContext = audioContextRef.current;
        let buffer = bufferMapRef.current[originalNote];
        const tNow = audioContext?.currentTime;
        // console.log("onKeyPressIn :::", { audioContext, buffer, tNow, playingNotes: playingSoundsRef.current });
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

        playingSoundsRef.current[originalNote] = { source, envelope, startedAt: tNow };
    }

    async function releasePianoNote(originalNote: Note) {
        console.log("<SoundContext> releasePianoNote", originalNote);
        const audioContext = audioContextRef.current!;
        const sound = playingSoundsRef.current[originalNote];

        if (!sound || !audioContext) return;

        const tStop = Math.max(audioContext.currentTime, sound.startedAt + 5);

        sound.envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
        sound.envelope.gain.setValueAtTime(0, tStop + 0.09);
        sound.source.stop(tStop + 0.1);

        playingSoundsRef.current[originalNote] = undefined;
    }

    async function playSoundEfx(efx: SoundEffect) {
        // console.log("<SoundContext> playSoundEfx", efx);
        await releaseSoundEfx(efx);

        const audioContext = audioContextRef.current;
        const buffer = bufferMapRef.current[efx];
        const tNow = audioContext?.currentTime;

        if (!audioContext || !buffer) return;

        const envelope = audioContext.createGain();
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        envelope.connect(audioContext.destination);
        source.connect(envelope);
        source.start(tNow);
    }

    async function releaseSoundEfx(efx: SoundEffect) {
        const audioContext = audioContextRef.current!;
        const sound = playingSoundsRef.current[efx];

        if (!sound || !audioContext) return;

        const tStop = Math.max(audioContext.currentTime, sound.startedAt + 5);

        sound.envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
        sound.envelope.gain.setValueAtTime(0, tStop + 0.09);

        sound.source.stop(tStop + 0.1);
        playingSoundsRef.current[efx] = undefined;
    }

    useEffect(() => {
        const loadSounds = async () => {
            console.log(`<SoundContext> loading Piano Sounds...`);

            audioContextRef.current = new AudioContext();

            const allAssets = assets || [];

            console.log("allAssets :::", allAssets.length);
            const assetPromises = allAssets.map((asset, i) => {
                return new Promise((resolve) => {
                    const key = pluckNoteFromMp3Filename(asset.name);
                    const file = asset.localUri;
                    return audioContextRef.current!.decodeAudioDataSource(file!).then((audioBuffer) => {
                        console.log("audioBuffer :::", i);
                        bufferMapRef.current[key] = audioBuffer;
                        resolve(audioBuffer);
                    });
                });
            });
            await Promise.all(assetPromises);
            console.log("bufferMapRef :::", bufferMapRef);
        };

        const unloadSounds = async () => {
            console.log("<SoundContext> ...closing audio ctx");
            audioContextRef.current?.close().then(() => {
                audioContextRef.current = null;
                playingSoundsRef.current = {};
                bufferMapRef.current = {};
                console.log("<SoundContext> ...Done closing");
            });
        };

        let timeStart = Date.now();
        loadSounds()
            .catch(console.error)
            .finally(() => {
                console.log(`<SoundContext> Done loading Piano Sounds. Took ${Date.now() - timeStart}ms`);
                setReady(true);
            });

        return () => {
            unloadSounds().finally(() => {
                setReady(false);
            });
        };
    }, []);

    return (
        <SoundContext.Provider value={{ ready, playPianoNote, releasePianoNote, playSoundEfx }}>
            {props.children}
        </SoundContext.Provider>
    );
};

const useSoundContext = () => useContext(SoundContext);

export { SoundContextProvider, useSoundContext };

function pluckNoteFromMp3Filename(filename: string) {
    if (filename.startsWith("Piano")) {
        const [piano, mf, note] = filename.split(".");
        const oct = note.at(-1);
        let nn = note.substring(0, note.length - 1).toLowerCase();

        return `${nn}/${oct}`;
    }
    return filename;
}
