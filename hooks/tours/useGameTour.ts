import { useState, useCallback, useEffect } from "react";
import { useAppStore } from "../useAppStore";

export function useGameTour() {
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const goToStepOne = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(1), 0);
    }, []);

    const goToStepTwo = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(2), 0);
    }, []);

    const goToStepThree = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(3), 0);
    }, []);

    const goToStepFour = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(4), 0);
    }, []);

    const doFinalStep = useCallback(async () => {
        await setTourCompleted("game", true);
        setTourStep(-1);
    }, []);

    useEffect(() => {
        // console.log("Start up game tour!!!");
        setTimeout(() => setTourStep(0), 200);
    }, []);

    return {
        tourStep,
        goToStepOne,
        goToStepTwo,
        goToStepThree,
        goToStepFour,
        doFinalStep,
    };
}
