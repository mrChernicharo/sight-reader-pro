import { Clef } from "@/utils/enums";
import { LevelSelectionTab } from "./_layout";

export default function TrebleTab() {
    return <LevelSelectionTab clef={Clef.Treble} />;
}
