"use client";

import React, { useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableCard from "./SortableCard";
import StatCard from "./StatCard";
import { BaseCard, CardTranslations } from "../types";
import { useLockXScroll, usePersistedOrder } from "../hooks";

// Base props without saveOrder
interface BaseDndCardsProps {
  cards: BaseCard[];
  enableDnd?: boolean;
  onReorder?: (newOrder: BaseCard[]) => void;
  gridCols?: string;
  gap?: string;
  className?: string;
  translations?: CardTranslations;
  enableNoise?: boolean;
  enableLighting?: boolean;
}

// When saveOrder is true, storageKey is required
interface DndCardsPropsWithSaveOrder extends BaseDndCardsProps {
  saveOrder: true;
  /** localStorage key to persist card order between visits - REQUIRED when saveOrder is true */
  storageKey: string;
}

// When saveOrder is false or not provided, storageKey is not allowed
interface DndCardsPropsWithoutSaveOrder extends BaseDndCardsProps {
  saveOrder?: false;
  storageKey?: never;
}

// Union type - either with saveOrder + storageKey or without
export type DndCardsProps =
  | DndCardsPropsWithSaveOrder
  | DndCardsPropsWithoutSaveOrder;

export default function DndCardsContainer({
  cards = [],
  enableDnd = false,
  onReorder,
  saveOrder,
  storageKey,
  gridCols = "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  gap = "gap-3 xs:gap-4",
  className = "",
  translations,
  enableNoise = false,
  enableLighting = false,
}: DndCardsProps) {
  // State and helpers for managing card order (with optional localStorage persistence)
  // Only use storageKey if saveOrder is true
  const {
    orderedCards: internalCards,
    setOrderedCards: setInternalCards,
    persistOrder,
  } = usePersistedOrder<BaseCard>(cards, saveOrder ? storageKey : undefined);

  // Type assertion to help TypeScript understand internalCards is BaseCard[]
  const typedCards = internalCards as BaseCard[];

  // Lock/unlock horizontal scroll on the page (html/body) while dragging
  const { lock: lockXScroll, unlock: unlockXScroll } = useLockXScroll();

  // Safety: ensure scroll is unlocked if component unmounts mid-drag (redundant w/ hook but harmless)
  React.useEffect(() => {
    return () => {
      unlockXScroll();
    };
  }, [unlockXScroll]);

  // The ordering is handled by usePersistedOrder hook, which re-applies stored order when `cards` change

  // Handle drag end event
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      // Always release scroll lock on drag end
      unlockXScroll();
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = typedCards.findIndex(
          (card: BaseCard) => card.id === active.id
        );
        const newIndex = typedCards.findIndex(
          (card: BaseCard) => card.id === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(typedCards, oldIndex, newIndex);
          setInternalCards(newOrder);

          // persist in localStorage if key provided
          // persist
          persistOrder(newOrder);

          // Call external handler if provided
          if (onReorder) {
            onReorder(newOrder);
          }
        }
      }
    },
    [typedCards, onReorder, unlockXScroll, persistOrder, setInternalCards]
  );

  // Handle drag start to lock horizontal scroll
  const handleDragStart = useCallback(() => {
    lockXScroll();
  }, [lockXScroll]);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get card IDs for sortable context
  const cardIds = useMemo(
    () => typedCards.map((card: BaseCard) => card.id),
    [typedCards]
  );

  // Handle both grid and flex layouts
  const isFlexLayout = gridCols?.includes("flex");
  const containerClassName = isFlexLayout
    ? `${gridCols} ${gap} ${className} overflow-hidden`
    : `grid ${gridCols} ${gap} ${className} overflow-hidden`;

  // If DnD is disabled, render static cards
  if (!enableDnd) {
    return (
      <div className={containerClassName}>
        {typedCards.map((card: BaseCard) => (
          <StatCard
            key={card.id}
            id={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            color={card.color}
            translations={translations}
            enableDragHandle={false}
            enableNoise={enableNoise}
            enableLighting={enableLighting}
          />
        ))}
      </div>
    );
  }

  // Render with DnD functionality
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        unlockXScroll();
      }}
    >
      <SortableContext items={cardIds} strategy={rectSortingStrategy}>
        <div className={containerClassName}>
          {typedCards.map((card: BaseCard) => (
            <SortableCard
              key={card.id}
              id={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              color={card.color}
              translations={translations}
              enableNoise={enableNoise}
              enableLighting={enableLighting}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
