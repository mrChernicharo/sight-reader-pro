import { Clef } from "@/utils/enums";
import { LevelSelectionTab } from "./_layout";

export default function BassTab() {
    return <LevelSelectionTab clef={Clef.Bass} />;
}
