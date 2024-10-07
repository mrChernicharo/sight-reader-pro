import { Link } from "expo-router";
import { Text, View } from "react-native";

export type LevelAccident = "none" | "#" | "b";
export type NoteRange = `${string}/${number}:::${string}/${number}`;

export type LevelConfig = {
  id: number;
  range: NoteRange;
  accident: LevelAccident;
};

const LEVELS: LevelConfig[] = [
  { range: "g/4:::c/5", accident: "none" },
  { range: "e/4:::c/5", accident: "none" },
  { range: "e/4:::d/5", accident: "none" },
  { range: "d/4:::d/5", accident: "#" },
  { range: "c/4:::e/5", accident: "b" },
  { range: "c/3:::e/6", accident: "b" },
  { range: "d/4:::b/6", accident: "#" },
].map((levelInfo, i) => ({ id: i, ...levelInfo } as LevelConfig));

export default function Levels() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Levels</Text>

      {LEVELS.map(({ id, range, accident }) => (
        <Link
          key={id}
          href={{
            pathname: "/levels/[levelId]",
            params: { levelId: id, levelRange: range, levelAccident: accident },
          }}
        >
          {id}
        </Link>
      ))}
    </View>
  );
}
