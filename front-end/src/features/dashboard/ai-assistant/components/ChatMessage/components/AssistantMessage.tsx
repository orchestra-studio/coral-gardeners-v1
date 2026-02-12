import { Response } from "@/features/dashboard/ai-assistant/ui-elements/response";
import { ChartBlock } from "./ChartBlock";
import { StreamingIndicator } from "./StreamingIndicator";
import type { ChartBlock as ChartBlockType } from "../types";

interface AssistantMessageProps {
  isStreaming: boolean;
  hasContent: boolean;
  displayContent: string;
  cleanedContent: string;
  chartBlocks: ChartBlockType[];
  introContent: string;
  trailingContent: string;
  messageContent: string;
}

export function AssistantMessage({
  isStreaming,
  hasContent,
  displayContent,
  cleanedContent,
  chartBlocks,
  introContent,
  trailingContent,
}: AssistantMessageProps) {
  // Chart is sent as separate event, no need to detect markers
  const hasChartContent = chartBlocks.length > 0;

  return (
    <div className="space-y-4">
      {/* Streaming: show content + charts (if received) + spinner */}
      {isStreaming && (
        <>
          {hasContent && (
            <Response parseIncompleteMarkdown>{displayContent}</Response>
          )}
          {/* Show charts even during streaming */}
          {chartBlocks.length > 0 && (
            <>
              {chartBlocks.map((block, index) => (
                <ChartBlock
                  key={`streaming-chart-${block.title}-${index}`}
                  block={block}
                  index={index}
                />
              ))}
            </>
          )}
          <StreamingIndicator
            hasChartContent={hasChartContent}
            hasContent={hasContent}
          />
        </>
      )}

      {/* Completed: show full message with charts in proper order */}
      {!isStreaming && (
        <>
          {chartBlocks.length > 0 ? (
            <>
              {introContent && (
                <Response parseIncompleteMarkdown>{introContent}</Response>
              )}
              {chartBlocks.map((block, index) => (
                <ChartBlock
                  key={`completed-chart-${block.title}-${index}`}
                  block={block}
                  index={index}
                />
              ))}
              {trailingContent && (
                <Response parseIncompleteMarkdown>{trailingContent}</Response>
              )}
            </>
          ) : (
            hasContent && (
              <Response parseIncompleteMarkdown>{cleanedContent}</Response>
            )
          )}
        </>
      )}
    </div>
  );
}
