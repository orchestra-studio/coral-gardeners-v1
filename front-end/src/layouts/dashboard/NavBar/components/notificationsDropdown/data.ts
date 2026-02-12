import { Notification } from "./types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: {
      en: "Payment Received",
      ar: "تم استلام الدفعة"
    },
    message: {
      en: "$2,500 has been credited to your account",
      ar: "تم إيداع 2,500 دولار في حسابك"
    },
    time: "2 min ago",
    isRead: false,
    type: "success",
  },
  {
    id: "2",
    title: {
      en: "Card Spending Alert",
      ar: "تنبيه إنفاق البطاقة"
    },
    message: {
      en: "You have spent 80% of your monthly budget",
      ar: "لقد أنفقت 80% من ميزانيتك الشهرية"
    },
    time: "1 hour ago",
    isRead: true,
    type: "warning",
  },
  {
    id: "3",
    title: {
      en: "Investment Update",
      ar: "تحديث الاستثمار"
    },
    message: {
      en: "Your portfolio gained 2.3% this week",
      ar: "ربحت محفظتك 2.3% هذا الأسبوع"
    },
    time: "3 hours ago",
    isRead: true,
    type: "info",
  },
  {
    id: "4",
    title: {
      en: "Security Alert",
      ar: "تنبيه أمني"
    },
    message: {
      en: "New login from Chrome on Mac",
      ar: "تسجيل دخول جديد من Chrome على Mac"
    },
    time: "1 day ago",
    isRead: true,
    type: "error",
  },
];

export const getTypeColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-[var(--accepted)]";
    case "warning":
      return "bg-[var(--pending)]";
    case "error":
      return "bg-[var(--rejected)]";
    default:
      return "bg-[var(--info)]";
  }
};
