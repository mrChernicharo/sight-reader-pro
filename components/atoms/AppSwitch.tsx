import { StyleSheet, Switch } from "react-native";
import { AppView } from "./AppView";

export function AppSwitch({ value, setValue }: { value: boolean; setValue: (val: boolean) => void }) {
    return (
        <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor="#81b0ff"
            ios_backgroundColor="#3e3e3e"
            onValueChange={(val) => setValue(val)}
            value={value}
        />
    );
}

const s = StyleSheet.create({});
