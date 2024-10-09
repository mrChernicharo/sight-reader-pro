import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { SECTIONED_LEVELS } from "@/constants/levels";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LevelSelectionScreen() {
  const cols = 3;
  return (
    <ScrollView>
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
                            <AppText>{item.id}</AppText>
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
    backgroundColor: "#f9c2ff",
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
