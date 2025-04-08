import { LevelSelectionTab } from "@/components/molecules/LevelSelectionTab";
import { Clef } from "@/utils/enums";

export default function BassTab() {
    return <LevelSelectionTab clef={Clef.Bass} />;
}
