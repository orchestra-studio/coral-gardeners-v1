"use client";

import { useMemo, useRef, memo } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/features/dashboard/ai-assistant/ui-elements/conversation";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  PendingResponse,
  ErrorMessage,
  MessagesWithReasoning,
  StreamingContent,
  StandaloneReasoning,
} from "./components";
import { LoadMoreMessages } from "./components/LoadMoreMessages";
import { MessageSkeleton } from "./components/MessageSkeleton";
import {
  useMessagesLogic,
  useScrollManagement,
  useAutoLoadMessages,
  useLoadMoreHandlers,
} from "./hooks";
import type { ChatMessagesProps } from "./types";

function ChatMessagesContent(props: ChatMessagesProps) {
  const {
    messages,
    streamingMessage,
    reasoning,
    emptyStateTitle,
    thinkingLabel,
    errorLabel,
    errorMessage,
    status,
    showInitialSkeleton = false,
    hasMoreMessages = false,
    remainingCount = 0,
    onLoadOlder,
    onLoadAll,
    isLoadingOlder = false,
    isInitialLoading = false,
  } = props;

  const { scrollToBottom, scrollRef } = useStickToBottomContext();
  const scrollElement =
    scrollRef.current ??
    (typeof document !== "undefined"
      ? (document.scrollingElement as HTMLElement | null) ||
        (document.documentElement as HTMLElement | null) ||
        (document.body as HTMLElement | null)
      : null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  const logic = useMessagesLogic({
    messages,
    streamingMessage,
    reasoning,
    status,
  });

  const showSkeleton =
    isInitialLoading && !logic.hasMessages && showInitialSkeleton;

  const reasoningInserted = useMemo(() => {
    if (!logic.shouldShowReasoning) return false;
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.role === "assistant";
  }, [logic.shouldShowReasoning, messages]);

  // Scroll management first to get refs
  const scrollManagementRefs = useRef({
    saveScrollAnchor: () => {},
    canAutoLoadRef: { current: false },
  });

  // Auto-load messages when scrolling to top
  const { checkAndLoad } = useAutoLoadMessages({
    hasMoreMessages,
    isLoadingOlder,
    scrollElement,
    topSentinelRef,
    canAutoLoadRef: scrollManagementRefs.current.canAutoLoadRef,
    messagesLength: messages.length,
    onLoadOlder,
    saveScrollAnchor: () => scrollManagementRefs.current.saveScrollAnchor(),
  });

  // Scroll management
  const { saveScrollAnchor, canAutoLoadRef, isInitialScrollDone } =
    useScrollManagement({
      scrollElement,
      messages,
      streamingMessage,
      scrollToBottom,
      onCheckAutoLoad: checkAndLoad,
    });

  // Update refs
  scrollManagementRefs.current.saveScrollAnchor = saveScrollAnchor;
  scrollManagementRefs.current.canAutoLoadRef = canAutoLoadRef;

  // Load more handlers
  const { handleLoadMore, handleLoadAll } = useLoadMoreHandlers({
    onLoadOlder,
    onLoadAll,
    saveScrollAnchor,
  });

  return (
    <ConversationContent
      className={cn(
        logic.hasMessages
          ? "pb-[calc(6rem+env(safe-area-inset-bottom))]"
          : "pb-12",
        !isInitialScrollDone && logic.hasMessages && "opacity-0"
      )}
    >
      {hasMoreMessages && (
        <div ref={topSentinelRef} className="h-px w-full" aria-hidden />
      )}

      {showSkeleton ? (
        <MessageSkeleton show count={4} />
      ) : (
        <>
          <EmptyState title={emptyStateTitle} show={logic.showEmptyState} />

          <LoadMoreMessages
            hasMore={hasMoreMessages}
            remainingCount={remainingCount}
            onLoadMore={handleLoadMore}
            onLoadAll={handleLoadAll}
            isLoading={isLoadingOlder}
          />

          <MessagesWithReasoning
            messages={messages}
            reasoning={reasoning}
            shouldShowReasoning={logic.shouldShowReasoning}
            reasoningText={logic.reasoningText}
            thinkingLabel={thinkingLabel}
          />

          <StandaloneReasoning
            reasoning={reasoning}
            shouldShowReasoning={logic.shouldShowReasoning}
            reasoningText={logic.reasoningText}
            thinkingLabel={thinkingLabel}
            reasoningInserted={reasoningInserted}
            hasStreamingMessage={!!streamingMessage}
          />

          <StreamingContent
            streamingMessage={streamingMessage}
            reasoning={reasoning}
            shouldShowReasoning={logic.shouldShowReasoning}
            reasoningText={logic.reasoningText}
            thinkingLabel={thinkingLabel}
            reasoningInserted={reasoningInserted}
          />

          <PendingResponse
            thinkingLabel={thinkingLabel}
            show={logic.showPendingResponse}
          />

          <ErrorMessage
            errorLabel={errorLabel}
            errorMessage={errorMessage}
            show={logic.showError}
          />
        </>
      )}
    </ConversationContent>
  );
}

export default memo(function ChatMessages(props: ChatMessagesProps) {
  return (
    <Conversation className="flex-1 overflow-x-visible">
      <ChatMessagesContent {...props} />
      <ConversationScrollButton />
    </Conversation>
  );
});
