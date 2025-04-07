import { DEFAULT_LANGUAGE } from "@/translations";
import { useAppStore } from "./useAppStore";

export function useIntl() {
    const { language } = useAppStore();
    const intl = new Intl.NumberFormat(language ?? DEFAULT_LANGUAGE, { maximumFractionDigits: 2 });

    return {
        intl,
    };
}
