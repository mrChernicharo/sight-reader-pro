import { ALL_LEVELS } from "@/utils/levels";
import { Level, SectionedLevel } from "@/utils/types";
import { useAppStore } from "./useAppStore";
import { Clef, Knowledge } from "@/utils/enums";
import { useCallback, useMemo } from "react";

export function useAllLevels() {
    const knowledge = useAppStore((state) => state.knowledge);

    const allLevels = useMemo(() => {
        return ALL_LEVELS.filter((lvl: Level) => {
            switch (knowledge) {
                case Knowledge.pro:
                    return lvl.skillLevel === Knowledge.pro;
                case Knowledge.advanced:
                    return [Knowledge.pro, Knowledge.advanced].includes(lvl.skillLevel);
                case Knowledge.intermediary:
                    return [Knowledge.pro, Knowledge.advanced, Knowledge.intermediary].includes(lvl.skillLevel);
                case Knowledge.beginner:
                    return lvl.skillLevel !== Knowledge.novice;
                case Knowledge.novice:
                    return true;
            }
        }).map((lvl, index) => ({ ...lvl, index }));
    }, [knowledge]);

    const sectionedLevels = useMemo(() => {
        return [
            {
                title: Clef.Treble,
                data: allLevels.filter((lvl) => lvl.clef == Clef.Treble),
            },
            {
                title: Clef.Bass,
                data: allLevels.filter((lvl) => lvl.clef == Clef.Bass),
            },
        ] as SectionedLevel[];
    }, [allLevels]);

    const getLevel = useCallback(
        (levelId: string) => {
            // console.log("<getLevel>", { level, levelId });
            const level = allLevels.find((lvl) => lvl.id === levelId)!;
            return level;
        },
        [allLevels]
    );

    return {
        allLevels,
        getLevel,
        sectionedLevels,
    };
}
