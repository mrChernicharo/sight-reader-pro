import { DEFAULT_LANGUAGE } from "@/translations";
import { useAppStore } from "./useAppStore";

export function useIntl() {
    const { language } = useAppStore();
    const lang = language ?? DEFAULT_LANGUAGE;
    const intl = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 });
    const intlDate = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "medium" });

    return {
        intl,
        intlDate,
    };
}
