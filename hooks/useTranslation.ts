import { TRANSLATIONS } from "@/utils/translations";
import { useAppStore } from "./useAppStore";

export function useTranslation() {
  const lang = useAppStore((state) => state.language);

  return {
    t: (key: string) => {
      const segments = key.split(".");
      let val: any = TRANSLATIONS[lang];
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        console.log({ segment, key, lang, TRANSLATIONS });
        val = val[segment];
      }
      return val as string;
    },
  };
}
