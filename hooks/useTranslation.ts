import { TRANSLATIONS, DEFAULT_LANGUAGE } from "@/translations";
import { useAppStore } from "./useAppStore";

export function useTranslation() {
    const lang = useAppStore((state) => state.language);

    return {
        t: (key: string) => {
            try {
                const segments = key.split(".");
                let val: any = TRANSLATIONS[lang ?? DEFAULT_LANGUAGE];
                for (let i = 0; i < segments.length; i++) {
                    const segment = segments[i];
                    // console.log({ segment, key, lang, TRANSLATIONS });
                    val = val[segment];
                }

                if (typeof val != "string") throw Error("oops");

                return val ?? key;
            } catch (error) {
                return key;
            }
        },
    };
}
