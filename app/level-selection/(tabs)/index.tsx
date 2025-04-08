import { LevelSelectionTab } from "@/components/molecules/LevelSelectionTab";
import { Clef } from "@/utils/enums";

export default function TrebleTab() {
    return <LevelSelectionTab clef={Clef.Treble} />;
}
