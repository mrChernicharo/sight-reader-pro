import { Clef, GameType, Knowledge } from "@/utils/enums";
import { getGameStats, getIsGameWin, padZero } from "@/utils/helperFns";
import { ALL_LEVELS } from "@/utils/levels";
import { Level, SectionedLevel } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { useAppStore } from "./useAppStore";
import { useIntl } from "./useIntl";

export function useAllLevels() {
    const { intl } = useIntl();
    const games = useAppStore((state) => state.games);
    const knowledge = useAppStore((state) => state.knowledge);
    const practiceLevel = useAppStore((state) => state.practiceLevel);
    const setPracticeLevel = useAppStore((state) => state.setPracticeLevel);

    const getLevel = (levelId: string) => {
        // console.log("<getLevel>", {
        //     levelId,
        //     practiceLevel,
        //     isPracticeLevel: levelId.includes("practice"),
        // });
        if (practiceLevel && levelId.includes("practice")) return practiceLevel;
        return allLevels.find((lvl) => lvl.id === levelId)!;
    };

    const allLevels = useMemo(() => {
        const clefIdx = {
            [Clef.Treble]: 0,
            [Clef.Bass]: 0,
        };
        const result = ALL_LEVELS.filter((lvl: Level) => {
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
        }).map((lvl) => {
            const i = clefIdx[lvl.clef];
            const indexedLevel = {
                ...lvl,
                index: i,
                id: `${lvl.clef}-${lvl.name}-${padZero(i)}`,
                name: `${lvl.name} ${padZero(i + 1)}`,
            };

            clefIdx[lvl.clef]++;
            return indexedLevel;
        });

        if (practiceLevel) return result.concat(practiceLevel);
        else return result;
    }, [knowledge, practiceLevel]);

    // otherwise practice level ends up on the list
    const nonPracticeLevels = useMemo(() => allLevels.filter((lvl) => !lvl.id.includes("practice")), [allLevels]);

    const loadPracticeLevel = useCallback(async (level: Level) => {
        // console.log("<load practice level>", level);
        await setPracticeLevel(level);
    }, []);

    const unloadPracticeLevel = useCallback(async () => {
        // console.log("<UNLOAD practice level>");
        await setPracticeLevel(null);
    }, []);

    const sectionedLevels = useMemo(() => {
        return [
            {
                title: Clef.Treble,
                data: nonPracticeLevels.filter((lvl) => lvl.clef == Clef.Treble),
            },
            {
                title: Clef.Bass,
                data: nonPracticeLevels.filter((lvl) => lvl.clef == Clef.Bass),
            },
        ] as SectionedLevel[];
    }, [nonPracticeLevels]);

    const unlockedLevels = useMemo(() => {
        let highestTrebleIdx = -1;
        let highestBassIdx = -1;
        const nonPracticeGames = games.filter((lvl) => !lvl.id.includes("practice"));

        // console.log("getUnlockedLevels:::", nonPracticeGames.length);
        for (const game of nonPracticeGames) {
            const level = getLevel(game.levelId);
            // console.log("level:::", JSON.stringify(level, null, 2));
            if (!game || !level) continue;

            const { isGameWin } = getIsGameWin(game, level.winConditions);

            switch (level.type) {
                case GameType.Melody:
                case GameType.Single: {
                    switch (level.clef) {
                        case Clef.Treble:
                            if (isGameWin && level.index > highestTrebleIdx) {
                                highestTrebleIdx = level.index;
                            }
                            break;
                        case Clef.Bass:
                            if (isGameWin && level.index > highestBassIdx) {
                                highestBassIdx = level.index;
                            }
                            break;
                    }
                }
                case GameType.Chord:
                case GameType.Rhythm:
                // @TODO
            }
        }
        const response: Record<Clef, number> = {
            treble: highestTrebleIdx,
            bass: highestBassIdx,
        };
        return response;
    }, [games]);

    const levelStars = useMemo(() => {
        const treble: number[] = [];
        const bass: number[] = [];

        games.forEach((game) => {
            const level = getLevel(game.levelId);
            if (!level) return;

            const arr = level.clef === Clef.Treble ? treble : bass;

            const { stars } = getIsGameWin(game, level.winConditions);

            if (!arr[level.index] || arr[level.index] < stars) {
                arr[level.index] = stars;
            }
        });

        // console.log("<levelStars>", { treble, bass });
        return { treble, bass };
    }, [games]);

    // useEffect(() => {
    //     console.log(
    //         "allLevels >>>> ",
    //         allLevels.map((l) => ({ n: l.name, i: l.index }))
    //     );
    // }, [allLevels]);

    return {
        getLevel,
        loadPracticeLevel,
        unloadPracticeLevel,
        allLevels,
        sectionedLevels,
        unlockedLevels,
        levelStars,
    };
}
