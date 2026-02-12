import type { LLMModel, LLMProvider } from "@/types/ai-chat";

export interface ChatHeaderProps {
    providers: LLMProvider[];
    models: LLMModel[];
    selectedModel: string;
    onModelChange: (modelId: string) => void;
    onHistoryClick: () => void;
    onNewChatClick: () => void;
    isLoading?: boolean;
    modelsLoading?: boolean;
    historyLabel: string;
    newChatLabel: string;
}
