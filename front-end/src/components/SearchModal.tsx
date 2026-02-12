"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  IconSearch,
  IconX,
  IconFile,
  IconFolder,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";

import useAppNavigation from "@/hooks/navigation/useAppNavigation";
import { Input } from "@/components/ui/input";
import IconButton from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NAV_CONFIG_RAW,
  NAVIGATION_CONSTANTS,
} from "@/layouts/dashboard/sidebar/config";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  href?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  translations?: {
    placeholder?: string;
    noResultsText?: string;
    startTypingText?: string;
    poweredByText?: string;
    navigationKeys?: {
      navigate?: string;
      select?: string;
      close?: string;
    };
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "pages":
      return <IconFile className="w-4 h-4" />;
    case "projects":
      return <IconFolder className="w-4 h-4" />;
    case "users":
      return <IconUser className="w-4 h-4" />;
    case "settings":
      return <IconSettings className="w-4 h-4" />;
    default:
      return <IconFile className="w-4 h-4" />;
  }
};

export default function SearchModal({
  isOpen,
  onClose,
  locale,
  translations = {},
}: SearchModalProps) {
  const { navigateTo } = useAppNavigation();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate search results directly from navigation data
  const searchResults: SearchResult[] = [];
  let id = 1;

  for (const item of NAV_CONFIG_RAW) {
    if (item.type === "item") {
      searchResults.push({
        id: id.toString(),
        title: item.title[locale as keyof typeof item.title] || item.title.en,
        description:
          item.description[locale as keyof typeof item.description] ||
          item.description.en,
        category:
          (item.category as Record<string, string>)[locale] ||
          (item.category as Record<string, string>).en ||
          "pages",
        href: NAVIGATION_CONSTANTS.generatePath(item.route),
      });
      id++;
    } else if (item.type === "parent") {
      // Add parent - all parents have routes
      if (item.route) {
        searchResults.push({
          id: id.toString(),
          title: item.title[locale as keyof typeof item.title] || item.title.en,
          description:
            item.description[locale as keyof typeof item.description] ||
            item.description.en,
          category:
            (item.category as Record<string, string>)[locale] ||
            (item.category as Record<string, string>).en ||
            "pages",
          href: NAVIGATION_CONSTANTS.generatePath(item.route),
        });
        id++;
      }

      // Add all children
      for (const child of item.children) {
        searchResults.push({
          id: id.toString(),
          title:
            child.title[locale as keyof typeof child.title] || child.title.en,
          description:
            child.description[locale as keyof typeof child.description] ||
            child.description.en,
          category:
            (child.category as Record<string, string>)[locale] ||
            (child.category as Record<string, string>).en ||
            "pages",
          href: NAVIGATION_CONSTANTS.generatePath(child.route),
        });
        id++;
      }
    }
  }

  const filteredResults = query
    ? searchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchResults.slice(0, 6);

  const handleNavigate = useCallback(
    (result: SearchResult) => {
      if (result.href) {
        navigateTo(result.href);
        onClose();
      } else {
        onClose();
      }
    },
    [navigateTo, onClose]
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleNavigate(filteredResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose, handleNavigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative  h-full max-h-max flex items-start justify-center p-4 pt-25">
        <div
          ref={modalRef}
          className="relative w-full h-full max-h-max  max-w-xl bg-[var(--surface)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-[var(--border)]">
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="text"
                placeholder={
                  translations.placeholder || "Search for anything..."
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                startIcon={<IconSearch className="w-5 h-5" />}
                className="border-none bg-transparent focus:ring-0 focus:border-transparent"
              />
            </div>
            <IconButton onClick={onClose} className="ms-2">
              <IconX className="w-4 h-4" />
            </IconButton>
          </div>

          {/* Results */}
          <div ref={listRef} className="h-max max-h-[80%] overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="p-2  flex flex-col gap-1">
                {filteredResults.map((result, index) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={cn(
                      "w-full p-3 rounded-md h-auto",
                      selectedIndex === index
                        ? "bg-[var(--selected-bg)] border border-[var(--selected-bg)]"
                        : "hover:bg-[var(--surface-hover)]"
                    )}
                    contentClassName="w-full flex items-center gap-3 justify-start text-start"
                    onClick={() => handleNavigate(result)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-[var(--surface-hover)] text-[var(--text-muted)]">
                      {getCategoryIcon(result.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text)] truncate">
                        {result.title}
                      </div>
                      <div className="text-sm text-[var(--text-muted)] truncate">
                        {result.description}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-[var(--text-muted)] capitalize">
                      {result.category}
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                  <IconSearch className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-[var(--text-muted)] text-sm">
                  {query
                    ? translations.noResultsText || "No results found"
                    : translations.startTypingText ||
                      "Start typing to search..."}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface-hover)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">
                    ↑↓
                  </kbd>
                  {translations.navigationKeys?.navigate || "to navigate"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">
                    ↵
                  </kbd>
                  {translations.navigationKeys?.select || "to select"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">
                    esc
                  </kbd>
                  {translations.navigationKeys?.close || "to close"}
                </span>
              </div>
              <span>{translations.poweredByText || "Search by Aniq-ui"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
