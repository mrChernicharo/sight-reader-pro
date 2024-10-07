import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { LEVELS, SECTIONED_LEVELS } from "@/constants/levels";
import { Link } from "expo-router";
import { SectionList, StatusBar, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Levels() {
  return (
    <ScrollView style={styles.container}>
      <AppView>
        {SECTIONED_LEVELS.map((clefLevels) => (
          <AppView key={clefLevels.title} style={styles.listSection}>
            <AppText type="title">{clefLevels.title}</AppText>

            {clefLevels.data.map((item) => {
              return (
                <Link
                  key={`${item.clef} ${item.id}`}
                  href={{
                    pathname: "/levels/[levelId]",
                    params: { levelId: item.id, levelRange: item.range, levelAccident: item.accident, clef: item.clef },
                  }}
                >
                  <AppView style={styles.item}>
                    <AppText>{item.id}</AppText>
                    {/* <AppText>{item.accident} </AppText> */}
                    {/* <AppText>{item.range} </AppText> */}
                    {/* <AppText>{item.clef}</AppText> */}
                  </AppView>
                </Link>
              );
            })}
          </AppView>
        ))}
      </AppView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    padding: 16,
  },
  listSection: {
    gap: 6,
    padding: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    paddingHorizontal: 36,
    paddingVertical: 24,
  },
});
