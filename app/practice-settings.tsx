import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function PracticeSettingsScreen() {
  return (
    <ScrollView>
      <AppText>Practice Settings</AppText>

      <AppText>Range</AppText>

      <AppView>
        <Link href="/practice-level">
          <TouchableOpacity>
            <AppText>Start</AppText>
          </TouchableOpacity>
        </Link>
      </AppView>
    </ScrollView>
  );
}
