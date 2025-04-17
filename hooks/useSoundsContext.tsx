import { SoundEffect } from "@/utils/enums";
import { getEquivalentNotes } from "@/utils/helperFns";
import { Note } from "@/utils/types";
import { Asset } from "expo-asset";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { AudioBuffer, AudioBufferSourceNode, AudioContext, GainNode } from "react-native-audio-api";
import * as SplashScreen from "expo-splash-screen";

const requires = [
    require("../assets/sounds/piano-notes/Piano.mf.A1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.A7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Ab7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.B7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Bb7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.C7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.D7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Db7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.E7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Eb7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.F7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.G7.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb1.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb2.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb3.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb4.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb5.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb6.mp3"),
    require("../assets/sounds/piano-notes/Piano.mf.Gb7.mp3"),
    require("../assets/sounds/efx/wrong-answer.mp3"),
];

type PR<V> = Partial<Record<string, V>>;
interface PlayingSound {
    source: AudioBufferSourceNode;
    envelope: GainNode;
    startedAt: number;
}

interface SoundContext {
    ready: boolean;
    playPianoNote(note: Note): Promise<void>;
    releasePianoNote(note: Note): void;
    playSoundEfx(effect: SoundEffect): Promise<void>;
}

const initialValues: SoundContext = {
    ready: false,
    playPianoNote: async () => {},
    releasePianoNote: () => {},
    playSoundEfx: async () => {},
};

const SoundContext = createContext<SoundContext>(initialValues);

const SoundContextProvider = (props: { children: ReactNode }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const playingSoundsRef = useRef<PR<PlayingSound>>({});
    const bufferMapRef = useRef<PR<AudioBuffer>>({});

    const [ready, setReady] = useState(false);

    async function playPianoNote(originalNote: Note) {
        releasePianoNote(originalNote);

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
        // console.log("gain", envelope.gain);
        source.connect(envelope);
        envelope.connect(audioContext.destination);

        envelope.gain.setValueAtTime(0.001, tNow);

        // envelope.gain.exponentialRampToValueAtTime(9, tNow + 0.02);
        // envelope.gain.exponentialRampToValueAtTime(12, tNow + 0.01);
        envelope.gain.exponentialRampToValueAtTime(6, tNow + 0.02);
        source.start(tNow);

        playingSoundsRef.current[originalNote] = { source, envelope, startedAt: tNow };
    }

    function releasePianoNote(originalNote: Note) {
        // console.log("<SoundContext> releasePianoNote", originalNote);
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
        if (ready) {
            console.log("splash hide!");
            SplashScreen.hideAsync();
        }
    }, [ready]);

    useEffect(() => {
        const loadSounds = async () => {
            console.log(`<SoundContext> loading Sounds...`);
            audioContextRef.current = new AudioContext();

            const assetsPromises: Promise<Asset>[] = [];
            for (const moduleId of requires) {
                assetsPromises.push(Asset.loadAsync(moduleId).then(([asset]) => asset));
            }
            const assets = await Promise.all(assetsPromises);
            console.log("AudioAssets loaded! Asset count:", assets.length);

            const bufferPromises: Promise<AudioBuffer>[] = [];
            for (const asset of assets) {
                const key = pluckNoteFromMp3Filename(asset.name);
                const file = asset.localUri;
                bufferPromises.push(
                    audioContextRef.current!.decodeAudioDataSource(file!).then((audioBuffer) => {
                        // f#/4 and gb/4 are the same sound, but there's only one Piano.mf.Gb4.mp3 asset
                        // ensure there's a buffer entry for each possible note name
                        const equivalentNotes = getEquivalentNotes(key as Note);
                        equivalentNotes?.forEach((note) => {
                            bufferMapRef.current[note] = audioBuffer;
                        });
                        return audioBuffer;
                    })
                );
            }
            await Promise.all(bufferPromises);
            const bufferCount = Object.keys(bufferMapRef.current).length;
            console.log("AudioAssets converted to AudioBuffers! Buffer entry count", bufferCount);
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
                setReady(true);
                console.log(`<SoundContext> Done loading Piano Sounds. Took ${Date.now() - timeStart}ms`);
            });

        return () => {
            unloadSounds()
                .catch(console.error)
                .finally(() => {
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

// const a = {
//     assets: [
//         "assets/sounds/piano-notes/Piano.mf.A1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.A7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Ab7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.B7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Bb7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.C7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.D7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Db7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.E7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Eb7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.F7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.G7.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb1.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb2.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb3.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb4.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb5.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb6.mp3",
//         "assets/sounds/piano-notes/Piano.mf.Gb7.mp3",
//     ],
// };
