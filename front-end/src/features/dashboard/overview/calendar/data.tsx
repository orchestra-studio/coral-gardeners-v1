import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Translation objects interface
export interface CalendarTranslations {
  header: {
    title: MultilingualText;
    selectDate: MultilingualText;
  };
}

// Translation objects
const calendarTranslations: CalendarTranslations = {
  header: {
    title: {
      en: "Calendar",
      ar: "التقويم",
    },
    selectDate: {
      en: "Select a date",
      ar: "اختر تاريخاً",
    },
  },
};

// Hook result interface
interface UseLocalizedCalendarResult {
  translations: {
    header: {
      title: string;
      selectDate: string;
    };
  };
}

// Hook to get localized translations
export const useLocalizedCalendar = (): UseLocalizedCalendarResult => {
  const locale = useLocale();

  return {
    translations: {
      header: {
        title: calendarTranslations.header.title[locale],
        selectDate: calendarTranslations.header.selectDate[locale],
      },
    },
  };
};
