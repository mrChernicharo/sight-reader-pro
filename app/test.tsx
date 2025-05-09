import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/utils/Colors";
import { testBorder } from "@/utils/styles";
import { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

const girlImages = [
    require("../assets/images/girl.01.png"),
    require("../assets/images/girl.02.png"),
    require("../assets/images/girl.03.png"),
];

const bgColors = [Colors.dark.girlBG_0, Colors.dark.girlBG_1, Colors.dark.girlBG_2];

export default function TestScreen() {
    const [imgIdx, setImgIdx] = useState(0);
    const onUp = () => setImgIdx((prev) => (prev == girlImages.length - 1 ? 0 : prev + 1));
    const onDown = () => setImgIdx((prev) => (prev == 0 ? girlImages.length - 1 : prev - 1));

    useEffect(() => {
        console.log(imgIdx);
    }, [imgIdx]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: bgColors[imgIdx] }}>
            <Image style={[s.image, { transform: [{ scaleX: imgIdx === 1 ? -1 : 1 }] }]} source={girlImages[imgIdx]} />

            <View style={s.container}>
                <View style={s.top}>
                    <View style={{ position: "absolute", left: 0, top: 6 }}>
                        <BackLink />
                    </View>
                    <AppText type="subtitle">Test</AppText>
                </View>

                <View style={s.main}>
                    <AppText>Image {imgIdx}</AppText>
                    <View style={s.btnGroup}>
                        <AppButton text="<" onPress={onUp} />
                        <AppButton text=">" onPress={onDown} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        // paddingHorizontal: 36,
        paddingVertical: 24,
        minHeight: "100%",
        // paddingTop: 24,
        ...testBorder(),
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
    main: {
        position: "relative",
        flex: 1,
        width: "100%",
        // justifyContent: "center",
        alignItems: "center",
        // backgroundColor: Colors.dark.girlBG,
        ...testBorder(),
    },
    image: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: 280,
        height: 420,
        zIndex: 0,
        // objectFit: "scale-down",
        // height: 400,
        // ...testBorder("green"),

        // width: Dimensions.get("window").width - 4,
        // height: Dimensions.get("window").height - 100,
    },
    btnGroup: {
        flexDirection: "row",
        zIndex: 10,
    },
});
