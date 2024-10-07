import { Link } from "expo-router";
import { Text, View } from "react-native";

type LevelAccidents = "none" | "#" | "b";
type NoteRange = [string, string];

type LevelConfig = {
  id: number;
  range: NoteRange;
  accidents: LevelAccidents;
};

const LEVELS: LevelConfig[] = [
  { id: 1, range: ["g/4", "c/5"], accidents: "none" },
  { id: 2, range: ["e/4", "c/5"], accidents: "none" },
  { id: 3, range: ["e/4", "d/5"], accidents: "none" },
  { id: 4, range: ["d/4", "d/5"], accidents: "#" },
  { id: 5, range: ["c/4", "e/5"], accidents: "b" },
];

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

      {LEVELS.map(({ id, range, accidents }) => (
        <Link
          key={id}
          href={{
            pathname: "/levels/[levelId]",
            params: { levelId: id, levelRange: range, levelAccidents: accidents },
          }}
        >
          {id}
        </Link>
      ))}
    </View>
  );
}
