import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { LevelConfig } from "@/constants/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useEffect } from "react";

export function getLevelName(item: LevelConfig) {
  const splitLevelName = item.name.split(" ");
  const levelIdx = splitLevelName.pop();
  const levelName = splitLevelName.join(" ");
  return { levelIdx, levelName };
}

export default function LevelSelectionScreen() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
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
          // console.log(grid);

          return (
            <AppView key={clefLevels.title}>
              <AppText type="title" style={styles.sectionTitle}>
                {clefLevels.title}
              </AppText>

              <AppView style={styles.gridSection}>
                {grid.map((row, rowIdx) => (
                  <AppView key={`row-${rowIdx}`} style={styles.gridRow}>
                    {row.map((item) => {
                      const { levelName, levelIdx } = getLevelName(item);
                      return (
                        <Link
                          key={`${item.clef} ${item.id}`}
                          href={{
                            pathname: "/level-details/[id]",
                            params: {
                              id: item.id,
                              clef: item.clef,
                            },
                          }}
                        >
                          <AppView style={styles.item}>
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

const pink = "#f9c2ff";
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
    backgroundColor: pink,
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
