"use client";

import React, { useState } from "react";
import {
  IconPlus,
  IconCheck,
  IconX,
  IconLoader2,
  IconPencil,
} from "@tabler/icons-react";
import { QuickTask } from "../hooks/useQuickTasks";
import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";
import { InlineEdit } from "@/components/ui/InlineEdit";

interface TaskListProps {
  tasks: QuickTask[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <IconCheck className="w-12 h-12 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
        <p className="text-sm text-[var(--text-muted)]">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "group flex items-center gap-3 p-3 rounded-lg border",
            task.completed
              ? "bg-[var(--surface-hover)]/50 border-[var(--border)]"
              : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primaryColor)]/30"
          )}
        >
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <InlineEdit
              value={task.text}
              isEditing={editingId === task.id}
              onEdit={() => setEditingId(task.id)}
              onSave={(newText) => {
                onEdit(task.id, newText);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
              className={cn(
                "text-sm",
                task.completed
                  ? "text-[var(--text-muted)] line-through"
                  : "text-[var(--text)]"
              )}
              placeholder="Task text..."
              renderEditTrigger={() => null}
            />
          </div>
          {editingId !== task.id && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setEditingId(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--primaryColor)]/10 rounded "
                aria-label="Edit task"
              >
                <IconPencil className="w-3.5 h-3.5 text-[var(--primaryColor)]" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded "
                aria-label="Delete task"
              >
                <IconX className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface AddTaskFormProps {
  onAdd: (text: string) => Promise<void> | void;
  isAdding?: boolean;
  placeholder?: string;
}

export function AddTaskForm({
  onAdd,
  isAdding = false,
  placeholder = "Add a quick task...",
}: AddTaskFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        await onAdd(text.trim());
        setText("");
      } catch (error) {
        console.error("Failed to add task", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 text-sm bg-[var(--control-bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)]/20 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isAdding}
      />
      <button
        type="submit"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primaryColor)] text-[var(--background)] transition-opacity",
          "hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60 disabled:cursor-not-allowed"
        )}
        disabled={isAdding || !text.trim()}
        aria-label="Add task"
      >
        {isAdding ? (
          <IconLoader2 className="w-4 h-4 animate-spin" />
        ) : (
          <IconPlus className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
