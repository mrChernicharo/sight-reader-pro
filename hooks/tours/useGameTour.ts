import { useState, useCallback, useEffect } from "react";
import { useAppStore } from "../useAppStore";
import { safelySetTourStep } from "@/utils/helperFns";

export function useGameTour() {
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const goToStepOne = useCallback(() => {
        safelySetTourStep(setTourStep, 1);
    }, []);

    const goToStepTwo = useCallback(() => {
        safelySetTourStep(setTourStep, 2);
    }, []);

    const goToStepThree = useCallback(() => {
        safelySetTourStep(setTourStep, 3);
    }, []);

    const goToStepFour = useCallback(() => {
        safelySetTourStep(setTourStep, 4);
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
