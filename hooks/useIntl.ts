import { useAppStore } from "./useAppStore";

export function useIntl() {
  const { language } = useAppStore();
  const intl = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });

  return {
    intl,
  };
}
