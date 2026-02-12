"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { SmoothTabs, SmoothTabItem } from "@/components/ui/SmoothTabs";
import {
  FormInput,
  Bell,
  Navigation,
  LayoutGrid,
  MousePointerClick,
  SquareStack,
  BarChart3,
} from "lucide-react";
import ButtonDemo from "./components/ButtonDemo";
import IconButtonDemo from "./components/IconButtonDemo";
import InputDemo from "./components/InputDemo";
import SelectDemo from "./components/SelectDemo";
import CheckboxDemo from "./components/CheckboxDemo";
import AlertDemo from "./components/AlertDemo";
import BadgeDemo from "./components/BadgeDemo";
import TabsDemo from "./components/TabsDemo";
import AvatarDemo from "./components/AvatarDemo";
import SkeletonDemo from "./components/SkeletonDemo";
import PaginationDemo from "./components/PaginationDemo";
import ModalDemo from "./components/ModalDemo";
import DatePickerDemo from "./components/DatePickerDemo";
import TooltipDemo from "./components/TooltipDemo";
import DropdownDemo from "./components/DropdownDemo";
import CalendarDemo from "./components/CalendarDemo";
import SheetDemo from "./components/SheetDemo";
import PopoverDemo from "./components/PopoverDemo";
import CollapsibleDemo from "./components/CollapsibleDemo";
import SearchInputDemo from "./components/SearchInputDemo";
import PhoneInputDemo from "./components/PhoneInputDemo";
import ProgressCardDemo from "./components/ProgressCardDemo";
import NoticeDemo from "./components/NoticeDemo";
import MagicCardDemo from "./components/MagicCardDemo";
import ArrayInputDemo from "./components/ArrayInputDemo";
import StatusDemo from "./components/StatusDemo";
import InlineEditDemo from "./components/InlineEditDemo";
import LinkDemo from "./components/LinkDemo";
import UserNameDemo from "./components/UserNameDemo";
import CollapsibleCodeDemo from "./components/CollapsibleCodeDemo";
import ChartsDemo from "./components/ChartsDemo";
import SmoothTabsDemo from "./components/SmoothTabsDemo";
import RichTextEditorDemo from "./components/RichTextEditorDemo";
import MultiLanguageInputDemo from "./components/MultiLanguageInputDemo";
import BreadcrumbNavigationDemo from "./components/BreadcrumbNavigationDemo";
import EmptyStateDemo from "./components/EmptyStateDemo";
import StatCardDemo from "./components/StatCardDemo";
import ConfirmableSheetDemo from "./components/ConfirmableSheetDemo";
import TableDemo from "./components/TableDemo";
import WorldMapDemo from "./components/WorldMapDemo";
import GridBackgroundDemo from "./components/GridBackgroundDemo";
import SearchModalDemo from "./components/SearchModalDemo";

export default function UIComponentContent() {
  const t = useTranslations("dashboard/ui-component");

  const tabs: SmoothTabItem[] = [
    {
      id: "dataDisplay",
      title: t("sections.dataDisplay.title"),
      icon: BarChart3,
      cardContent: (
        <div className="flex flex-col gap-4">
          <StatCardDemo />
          <ChartsDemo />
          <TableDemo />
          <AvatarDemo />
          <UserNameDemo />
          <CollapsibleCodeDemo />
        </div>
      ),
    },
    {
      id: "feedback",
      title: t("sections.feedback.title"),
      icon: Bell,
      cardContent: (
        <div className="flex flex-col gap-4">
          <ProgressCardDemo />
          <BadgeDemo />
          <StatusDemo />
          <AlertDemo />
          <NoticeDemo />
          <SkeletonDemo />
          <EmptyStateDemo />
        </div>
      ),
    },
    {
      id: "layout",
      title: t("sections.layout.title"),
      icon: LayoutGrid,
      cardContent: (
        <div className="flex flex-col gap-4">
          <WorldMapDemo />
          <GridBackgroundDemo />
          <MagicCardDemo />
        </div>
      ),
    },
    {
      id: "navigation",
      title: t("sections.navigation.title"),
      icon: Navigation,
      cardContent: (
        <div className="flex flex-col gap-4">
          <PaginationDemo />
          <SmoothTabsDemo />
          <BreadcrumbNavigationDemo />
          <TabsDemo />
          <SearchModalDemo />
          <LinkDemo />
        </div>
      ),
    },
    {
      id: "overlays",
      title: t("sections.overlays.title"),
      icon: SquareStack,
      cardContent: (
        <div className="flex flex-col gap-4">
          <ModalDemo />
          <SheetDemo />
          <ConfirmableSheetDemo />
          <DropdownDemo />
          <PopoverDemo />
          <TooltipDemo />
          <CollapsibleDemo />
        </div>
      ),
    },
    {
      id: "buttons",
      title: t("sections.buttons.title"),
      icon: MousePointerClick,
      cardContent: (
        <div className="flex flex-col gap-4">
          <ButtonDemo />
          <IconButtonDemo />
        </div>
      ),
    },
    {
      id: "inputs",
      title: t("sections.inputs.title"),
      icon: FormInput,
      cardContent: (
        <div className="flex flex-col gap-4">
          <InputDemo />
          <SearchInputDemo />
          <InlineEditDemo />
          <SelectDemo />
          <CheckboxDemo />
          <PhoneInputDemo />
          <ArrayInputDemo />
          <MultiLanguageInputDemo />
          <RichTextEditorDemo />
          <DatePickerDemo />
          <CalendarDemo />
        </div>
      ),
    },
  ];

  return (
    <SmoothTabs
      items={tabs}
      contentClassName="bg-transparent border-none"
      showCardContent={true}
      cardHeight="auto"
      tabsPosition="top"
      className="w-full"
      syncWithUrl={true}
    />
  );
}
