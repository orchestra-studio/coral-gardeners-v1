import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Translation objects interface
export interface QuickTasksTranslations {
  header: {
    title: MultilingualText;
    description: MultilingualText;
  };
  tabs: {
    active: MultilingualText;
    completed: MultilingualText;
  };
  form: {
    placeholder: MultilingualText;
    addButton: MultilingualText;
  };
  messages: {
    noActiveTasks: MultilingualText;
    noCompletedTasks: MultilingualText;
  };
}

// Translation objects
const quickTasksTranslations: QuickTasksTranslations = {
  header: {
    title: {
      en: "Quick Tasks",
      ar: "المهام السريعة",
    },
    description: {
      en: "total tasks",
      ar: "إجمالي المهام",
    },
  },
  tabs: {
    active: {
      en: "Active",
      ar: "نشطة",
    },
    completed: {
      en: "Completed",
      ar: "مكتملة",
    },
  },
  form: {
    placeholder: {
      en: "Add a quick task...",
      ar: "أضف مهمة سريعة...",
    },
    addButton: {
      en: "Add task",
      ar: "إضافة مهمة",
    },
  },
  messages: {
    noActiveTasks: {
      en: "No active tasks",
      ar: "لا توجد مهام نشطة",
    },
    noCompletedTasks: {
      en: "No completed tasks",
      ar: "لا توجد مهام مكتملة",
    },
  },
};

// Hook result interface
interface UseLocalizedQuickTasksResult {
  translations: {
    header: {
      title: string;
      description: string;
    };
    tabs: {
      active: string;
      completed: string;
    };
    form: {
      placeholder: string;
      addButton: string;
    };
    messages: {
      noActiveTasks: string;
      noCompletedTasks: string;
    };
  };
}

// Hook to get localized translations
export const useLocalizedQuickTasks = (): UseLocalizedQuickTasksResult => {
  const locale = useLocale();
  const normalizedLocale: keyof MultilingualText =
    locale === "ar" ? "ar" : "en";

  return {
    translations: {
      header: {
        title: quickTasksTranslations.header.title[normalizedLocale],
        description:
          quickTasksTranslations.header.description[normalizedLocale],
      },
      tabs: {
        active: quickTasksTranslations.tabs.active[normalizedLocale],
        completed: quickTasksTranslations.tabs.completed[normalizedLocale],
      },
      form: {
        placeholder: quickTasksTranslations.form.placeholder[normalizedLocale],
        addButton: quickTasksTranslations.form.addButton[normalizedLocale],
      },
      messages: {
        noActiveTasks:
          quickTasksTranslations.messages.noActiveTasks[normalizedLocale],
        noCompletedTasks:
          quickTasksTranslations.messages.noCompletedTasks[normalizedLocale],
      },
    },
  };
};
