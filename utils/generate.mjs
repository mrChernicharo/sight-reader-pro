import fs from "node:fs";
// const fs = require("node:fs");

export function generate(command) {
    const [type, name, path = "/"] = command.split(" ");

    const capitalName = name.charAt(0).toUpperCase() + name.slice(1);

    if (type === "screen") {
        const filePath = `${path}${name}.screen.tsx`;
        const componentContent = `
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ${capitalName}Screen() {
    const theme = useColorScheme() ?? "light";
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const {} = useAppStore()

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 4 }}>
                        <BackLink />
                    </AppView>
                    <AppText type="defaultSemiBold">{t("${name}.title")}</AppText>
                </AppView>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 36,
        paddingVertical: 24,
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
});
        `;

        console.log("generate", { command, type, name, filePath });

        fs.writeFile(filePath, componentContent, (err) => {
            if (err) {
                console.error("Error writing repository file:", err);
            }
        });
    }
}

// USAGE:
// run `node ./utils/generate.mjs`

// generate("screen knowledge");
// generate("screen name app/");
// generate("screen lang app/init/");
generate("screen _layout app/init/");
