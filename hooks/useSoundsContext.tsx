import { pianoAssetsURLs, soundEfxAssets } from "@/utils/constants";
import { NoteName, SoundEffect } from "@/utils/enums";
import { Note } from "@/utils/types";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { AudioBuffer, AudioBufferSourceNode, AudioContext, GainNode } from "react-native-audio-api";

type PR<V> = Partial<Record<string, V>>;
interface PlayingSound {
    source: AudioBufferSourceNode;
    envelope: GainNode;
    startedAt: number;
}

interface SoundContext {
    ready: boolean;
    playPianoNote(note: Note): Promise<void>;
    releasePianoNote(note: NoteName): Promise<void>;
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
    const [ready, setReady] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const playingSoundsRef = useRef<PR<PlayingSound>>({});
    const bufferMapRef = useRef<PR<AudioBuffer>>({});

    async function playPianoNote(originalNote: Note) {
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

    async function releasePianoNote(originalNote: NoteName) {
        console.log("<SoundContext> releasePianoNote", console.log("playingNotes :::", playingSoundsRef.current));
        // const audioContext = audioContextRef.current!;
        // const playingNote = playingSoundsRef.current[originalNote];

        // if (!playingNote || !audioContext) {
        //   return;
        // }

        // const { source, envelope, startedAt } = playingNote;

        // const tStop = Math.max(audioContext.currentTime, startedAt + 5);

        // envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
        // envelope.gain.setValueAtTime(0, tStop + 0.09);
        // source.stop(tStop + 0.1);

        // playingSoundsRef.current[originalNote] = undefined;
    }

    async function playSoundEfx(efx: SoundEffect) {
        // console.log("<SoundContext> playSoundEfx", efx);
        await releaseSoundEfx(efx);

        const audioContext = audioContextRef.current;
        const buffer = bufferMapRef.current[efx];
        const tNow = audioContext?.currentTime;

        if (!audioContext || !buffer || !tNow) return;

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

        if (!sound || !audioContext) {
            return;
        }

        const { source, envelope, startedAt } = sound;

        const tStop = Math.max(audioContext.currentTime, startedAt + 5);

        envelope.gain.exponentialRampToValueAtTime(0.0001, tStop + 0.08);
        envelope.gain.setValueAtTime(0, tStop + 0.09);
        source.stop(tStop + 0.1);

        playingSoundsRef.current[efx] = undefined;
    }

    useEffect(() => {
        const loadSounds = async () => {
            console.log(`<SoundContext> loading Piano Sounds...`);
            if (!audioContextRef.current) audioContextRef.current = new AudioContext();
            let timeStart = Date.now();
            const pianoAssets = Object.entries(pianoAssetsURLs);
            const efxAssets = Object.entries(soundEfxAssets);
            const allSoundAssets = [...pianoAssets, ...efxAssets];

            // console.log(`<SoundContext>`, { audioAssets, audioContextRef: audioContextRef.current });
            allSoundAssets.forEach(async ([key, url], i) => {
                const audioBuffer = await fetch(url)
                    .then((response) => response.arrayBuffer())
                    .then((arrayBuffer) => audioContextRef.current!.decodeAudioData(arrayBuffer));

                bufferMapRef.current[key] = audioBuffer;

                const isLastAsset = i + 1 == allSoundAssets.length;
                if (isLastAsset) {
                    console.log(`<SoundContext> Done loading Piano Sounds. Took ${Date.now() - timeStart}ms`);
                    setReady(true);
                }
            });
        };

        const unloadSounds = async () => {
            console.log("<SoundContext> ...closing audio ctx");
            audioContextRef.current?.close().then(() => {
                audioContextRef.current = null;
                playingSoundsRef.current = {};
                bufferMapRef.current = {};
                setReady(false);
                console.log("<SoundContext> ...Done closing");
            });
        };

        loadSounds();
        return () => {
            unloadSounds();
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
