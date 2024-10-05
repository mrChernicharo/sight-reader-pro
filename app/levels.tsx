import { Link } from "expo-router";
import { Text, View } from "react-native";

const LEVELS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
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

      {LEVELS.map((level) => (
        <Link
          key={level.id}
          href={{
            pathname: "/levels/[levelId]",
            params: { levelId: level.id },
          }}
        >
          {level.id}
        </Link>
      ))}
    </View>
  );
}
