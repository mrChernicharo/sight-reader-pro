import { KeySignature } from "./enums";
import { addHalfSteps, getNextScaleNote } from "./helperFns";
import { Scale } from "./types";

describe("addHalfSteps", () => {
    test("ascendent half steps in C Major", () => {
        expect(addHalfSteps("c/3", 1, KeySignature.C)).toEqual("c#/3");
        expect(addHalfSteps("c/3", 2, KeySignature.C)).toEqual("d/3");
        expect(addHalfSteps("c/3", 3, KeySignature.C)).toEqual("d#/3");
        expect(addHalfSteps("c/3", 4, KeySignature.C)).toEqual("e/3");
    });

    test("descendent half steps in C Major", () => {
        expect(addHalfSteps("c/3", -1, KeySignature.C)).toEqual("b/2");
        expect(addHalfSteps("c/3", -2, KeySignature.C)).toEqual("a#/2");
        expect(addHalfSteps("c/3", -3, KeySignature.C)).toEqual("a/2");
        expect(addHalfSteps("c/3", -4, KeySignature.C)).toEqual("g#/2");
    });

    test("ascendent half steps in Eb Major", () => {
        expect(addHalfSteps("eb/3", 1, KeySignature["Eb"])).toEqual("e/3");
        expect(addHalfSteps("eb/3", 2, KeySignature["Eb"])).toEqual("f/3");
        expect(addHalfSteps("eb/3", 3, KeySignature["Eb"])).toEqual("gb/3");
        expect(addHalfSteps("eb/3", 4, KeySignature["Eb"])).toEqual("g/3");
    });

    test("descendent half steps in Eb Major", () => {
        expect(addHalfSteps("eb/3", -1, KeySignature["Eb"])).toEqual("d/3");
        expect(addHalfSteps("eb/3", -2, KeySignature["Eb"])).toEqual("db/3");
        expect(addHalfSteps("eb/3", -3, KeySignature["Eb"])).toEqual("c/3");
        expect(addHalfSteps("eb/3", -4, KeySignature["Eb"])).toEqual("b/2");
    });

    test("ascendent half steps in A Major", () => {
        expect(addHalfSteps("a/3", 1, KeySignature["A"])).toEqual("a#/3");
        expect(addHalfSteps("a/3", 2, KeySignature["A"])).toEqual("b/3");
        expect(addHalfSteps("a/3", 3, KeySignature["A"])).toEqual("c/4");
        expect(addHalfSteps("a/3", 4, KeySignature["A"])).toEqual("c#/4");
    });

    test("descendent half steps in A Major", () => {
        expect(addHalfSteps("a/3", -1, KeySignature["A"])).toEqual("g#/3");
        expect(addHalfSteps("a/3", -2, KeySignature["A"])).toEqual("g/3");
        expect(addHalfSteps("a/3", -3, KeySignature["A"])).toEqual("f#/3");
        expect(addHalfSteps("a/3", -4, KeySignature["A"])).toEqual("f/3");
    });
});

describe("getNextScaleNote", () => {
    expect(getNextScaleNote("c/3", 0, KeySignature.C, Scale.Diatonic)).toEqual("c/3");
    expect(getNextScaleNote("c/3", 1, KeySignature.C, Scale.Diatonic)).toEqual("c/3");
    expect(getNextScaleNote("c/3", 2, KeySignature.C, Scale.Diatonic)).toEqual("d/3");
    expect(getNextScaleNote("c/3", 3, KeySignature.C, Scale.Diatonic)).toEqual("e/3");
    expect(getNextScaleNote("c/3", 4, KeySignature.C, Scale.Diatonic)).toEqual("f/3");
    expect(getNextScaleNote("c/3", 5, KeySignature.C, Scale.Diatonic)).toEqual("g/3");
    expect(getNextScaleNote("c/3", 6, KeySignature.C, Scale.Diatonic)).toEqual("a/3");
    expect(getNextScaleNote("c/3", 7, KeySignature.C, Scale.Diatonic)).toEqual("b/3");
    expect(getNextScaleNote("c/3", 8, KeySignature.C, Scale.Diatonic)).toEqual("c/4");

    expect(getNextScaleNote("bb/3", 0, KeySignature.Bb, Scale.Diatonic)).toEqual("bb/3");
    expect(getNextScaleNote("bb/3", 1, KeySignature.Bb, Scale.Diatonic)).toEqual("bb/3");
    expect(getNextScaleNote("bb/3", 2, KeySignature.Bb, Scale.Diatonic)).toEqual("c/4");
    expect(getNextScaleNote("bb/3", 3, KeySignature.Bb, Scale.Diatonic)).toEqual("d/4");
    expect(getNextScaleNote("bb/3", 4, KeySignature.Bb, Scale.Diatonic)).toEqual("eb/4");
    expect(getNextScaleNote("bb/3", 5, KeySignature.Bb, Scale.Diatonic)).toEqual("f/4");
    expect(getNextScaleNote("bb/3", 6, KeySignature.Bb, Scale.Diatonic)).toEqual("g/4");
    expect(getNextScaleNote("bb/3", 7, KeySignature.Bb, Scale.Diatonic)).toEqual("a/4");
    expect(getNextScaleNote("bb/3", 8, KeySignature.Bb, Scale.Diatonic)).toEqual("bb/4");

    expect(getNextScaleNote("e/3", 0, KeySignature.E, Scale.Diatonic)).toEqual("e/3");
    expect(getNextScaleNote("e/3", 1, KeySignature.E, Scale.Diatonic)).toEqual("e/3");
    expect(getNextScaleNote("e/3", 2, KeySignature.E, Scale.Diatonic)).toEqual("f#/3");
    expect(getNextScaleNote("e/3", 3, KeySignature.E, Scale.Diatonic)).toEqual("g#/3");
    expect(getNextScaleNote("e/3", 4, KeySignature.E, Scale.Diatonic)).toEqual("a/3");
    expect(getNextScaleNote("e/3", 5, KeySignature.E, Scale.Diatonic)).toEqual("b/3");
    expect(getNextScaleNote("e/3", 6, KeySignature.E, Scale.Diatonic)).toEqual("c#/4");
    expect(getNextScaleNote("e/3", 7, KeySignature.E, Scale.Diatonic)).toEqual("d#/4");
    expect(getNextScaleNote("e/3", 8, KeySignature.E, Scale.Diatonic)).toEqual("e/4");

    expect(getNextScaleNote("ab/3", 0, KeySignature.Ab, Scale.Diatonic)).toEqual("ab/3");
    expect(getNextScaleNote("ab/3", 1, KeySignature.Ab, Scale.Diatonic)).toEqual("ab/3");
    expect(getNextScaleNote("ab/3", 2, KeySignature.Ab, Scale.Diatonic)).toEqual("bb/3");
    expect(getNextScaleNote("ab/3", 3, KeySignature.Ab, Scale.Diatonic)).toEqual("c/4");
    expect(getNextScaleNote("ab/3", 4, KeySignature.Ab, Scale.Diatonic)).toEqual("db/4");
    expect(getNextScaleNote("ab/3", 5, KeySignature.Ab, Scale.Diatonic)).toEqual("eb/4");
    expect(getNextScaleNote("ab/3", 6, KeySignature.Ab, Scale.Diatonic)).toEqual("f/4");
    expect(getNextScaleNote("ab/3", 7, KeySignature.Ab, Scale.Diatonic)).toEqual("g/4");
    expect(getNextScaleNote("ab/3", 8, KeySignature.Ab, Scale.Diatonic)).toEqual("ab/4");
});
