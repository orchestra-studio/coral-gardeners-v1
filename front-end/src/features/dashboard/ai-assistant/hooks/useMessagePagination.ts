import { useCallback, useMemo } from "react";

interface MessagePaginationParams {
    messagesData: {
        pages?: Array<{ total?: number; data?: unknown[] }>;
    } | undefined;
    activeSessionId: number | undefined;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    serverMessagesCount: number;
    fetchNextPage: () => Promise<unknown>;
}

/**
 * Manages message pagination (load more, load all)
 */
export function useMessagePagination({
    messagesData,
    activeSessionId,
    hasNextPage,
    isFetchingNextPage,
    serverMessagesCount,
    fetchNextPage,
}: MessagePaginationParams) {
    const lastMessagesPage = messagesData?.pages?.[messagesData.pages.length - 1];
    const hasMoreMessages = Boolean(hasNextPage && activeSessionId);

    const remainingMessages = useMemo(() => {
        return Math.max(
            (lastMessagesPage?.total ?? serverMessagesCount) - serverMessagesCount,
            0
        );
    }, [lastMessagesPage, serverMessagesCount]);

    const loadOlderMessages = useCallback(() => {
        if (!activeSessionId || !hasNextPage || isFetchingNextPage) {
            return;
        }
        fetchNextPage();
    }, [activeSessionId, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const loadAllMessages = useCallback(async () => {
        if (!activeSessionId || !hasNextPage || isFetchingNextPage) {
            return;
        }

        let more = true;

        while (more) {
            const result = await fetchNextPage();
            more = Boolean((result as { hasNextPage?: boolean })?.hasNextPage);
            if (!more) {
                break;
            }
        }
    }, [activeSessionId, fetchNextPage, hasNextPage, isFetchingNextPage]);

    return {
        hasMoreMessages,
        remainingMessages,
        loadOlderMessages,
        loadAllMessages,
    };
}
