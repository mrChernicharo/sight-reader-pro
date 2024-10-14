import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { getUnlockedLevels } from "@/constants/levels";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { LevelConfig } from "@/constants/types";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export function getLevelName(item: LevelConfig) {
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

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (granted) {
        Audio.setAudioModeAsync({
          // IOS
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          // Android
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: true,
        });
      }
    });
  }, []);

  return (
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
                        <Link
                          key={level.id}
                          disabled={disabled}
                          href={{
                            pathname: "/level-details/[id]",
                            params: { id: level.id },
                          }}
                        >
                          <AppView style={[styles.item, { backgroundColor: disabled ? "gray" : itemBGColor }]}>
                            <AppText>{levelName}</AppText>
                            <AppText>{levelIdx}</AppText>
                          </AppView>
                        </Link>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  backArrow: {
    // position: "absolute",
    // top: 10,
    // left: 16,
    // zIndex: 100,
    // height: 24,
    // width: 100,
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
    // paddingHorizontal: 36,
    // paddingVertical: 24,
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
