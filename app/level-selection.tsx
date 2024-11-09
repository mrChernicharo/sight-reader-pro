import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { GameType } from "@/constants/enums";
import { getUnlockedLevels } from "@/constants/levels";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { Level } from "@/constants/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Pressable, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export function getLevelName(item: Level<GameType>) {
  const splitLevelName = item.name.split(" ");
  const levelIdx = splitLevelName.pop();
  const levelName = splitLevelName.join(" ");
  return { levelIdx, levelName };
}

export default function LevelSelectionScreen() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const itemBGColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "background");
  const { games } = useAppStore();
  const unlockedLevels = getUnlockedLevels(games);
  const cols = 3;

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      <ScrollView contentContainerStyle={{ backgroundColor }}>
        <AppView style={styles.container}>
          <BackLink style={styles.backArrow} />

          {SECTIONED_LEVELS.map((clefLevels) => {
            const grid = makeGrid(clefLevels.data, cols);

            return (
              <AppView key={clefLevels.title}>
                <AppText type="title" style={styles.sectionTitle}>
                  {clefLevels.title}
                </AppText>

                <AppView style={styles.gridSection}>
                  {grid.map((row, rowIdx) => (
                    <AppView key={`row-${rowIdx}`} style={styles.gridRow}>
                      {row.map((level) => {
                        const { levelName, levelIdx } = getLevelName(level);
                        const disabled = level.index > unlockedLevels[level.clef] + 1;
                        return (
                          <Pressable
                            key={level.id}
                            disabled={disabled}
                            onPress={() => {
                              router.push({
                                pathname: "/level-details/[id]",
                                params: { id: level.id },
                              });
                            }}
                          >
                            <AppView
                              style={[
                                styles.item,
                                {
                                  backgroundColor: disabled ? "gray" : itemBGColor,
                                },
                              ]}
                            >
                              <AppText>{levelName}</AppText>
                              <AppText>{levelIdx}</AppText>
                            </AppView>
                          </Pressable>
                        );
                      })}
                    </AppView>
                  ))}
                </AppView>
              </AppView>
            );
          })}
        </AppView>
        {/* <AppView style={styles.footerFiller}></AppView> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    // paddingTop: StatusBar.currentHeight,
    minHeight: Dimensions.get("window").height,
  },
  backArrow: {
    // borderWidth: 1,
    // borderColor: '#FFF',
    height: 42,
    transform: [{ translateX: 0 }, { translateY: 8 }],
  },
  sectionTitle: {
    paddingVertical: 16,
  },
  gridSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: 16,
  },
  item: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  footerFiller: {
    height: 100,
  },
});

function makeGrid<T>(nums: T[], cols = 2) {
  const grid: T[][] = [];
  nums.forEach((n, i) => {
    if (i % cols == 0) {
      grid.push([n]);
    } else {
      grid?.at(-1)?.push(n);
    }
  });

  return grid;
}
