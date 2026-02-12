"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { IconLoader2, IconCircleCheck, IconCircle } from "@tabler/icons-react";
import { useQuickTasks } from "./hooks/useQuickTasks";
import { TaskList, AddTaskForm } from "./components/TaskComponents";
import { SmoothTabs, SmoothTabItem } from "@/components/ui/SmoothTabs";
import { useLocalizedQuickTasks } from "./data";

export default function QuickTasksWidget() {
  const t = useTranslations("dashboard/overview");
  const { translations } = useLocalizedQuickTasks();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const {
    activeTasks,
    completedTasks,
    isInitialLoading,
    isRefreshing,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    isCreating,
  } = useQuickTasks();

  const tabs: SmoothTabItem[] = [
    {
      id: "active",
      title: `${translations.tabs.active} (${activeTasks.length})`,
      icon: IconCircle,
      cardContent: (
        <div className="flex flex-col h-full p-4">
          <AddTaskForm
            onAdd={addTask}
            isAdding={isCreating}
            placeholder={translations.form.placeholder}
          />
          {isRefreshing && (
            <div className="flex justify-center items-center text-[var(--text-muted)]">
              <IconLoader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <div className="mt-4 flex-1 overflow-y-auto">
            {isInitialLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="w-6 h-6 text-[var(--primaryColor)] animate-spin" />
              </div>
            ) : activeTasks.length > 0 ? (
              <TaskList
                tasks={activeTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={updateTask}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-[var(--text-muted)]">
                  {translations.messages.noActiveTasks}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "completed",
      title: `${translations.tabs.completed} (${completedTasks.length})`,
      icon: IconCircleCheck,
      cardContent: (
        <div className="flex flex-col h-full p-4">
          {isRefreshing && (
            <div className="mb-2 flex justify-center items-center text-[var(--text-muted)]">
              <IconLoader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {isInitialLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="w-6 h-6 text-[var(--primaryColor)] animate-spin" />
              </div>
            ) : completedTasks.length > 0 ? (
              <TaskList
                tasks={completedTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={updateTask}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-[var(--text-muted)]">
                  {translations.messages.noCompletedTasks}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <WidgetCard
      className="w-full min-h-[360px] flex flex-col p-4"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={t("quickTasks.title")}
        description={t("quickTasks.description")}
      />

      <div className="flex-1 mt-4 flex flex-col">
        <SmoothTabs
          items={tabs}
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "active" | "completed")
          }
          showCardContent={true}
          cardHeight="320px"
          tabsPosition="top"
        />
      </div>
    </WidgetCard>
  );
}
