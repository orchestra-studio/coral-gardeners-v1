import { useState, useEffect } from "react";
import { useAIChatModels } from "@/services/aiChat";
import type { LLMModel } from "@/lib/api";

const SELECTED_MODEL_KEY = "ai-chat-selected-model";

export function useAIModels() {
    // Initialize from localStorage if available
    const [selectedModel, setSelectedModel] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(SELECTED_MODEL_KEY) || "";
        }
        return "";
    });

    const { data: config, isLoading } = useAIChatModels();

    // Set default model when config loads, or reset if stored model is no longer valid
    useEffect(() => {
        if (config?.models && config.models.length > 0) {
            const storedModelExists = config.models.some((m: LLMModel) => m.id === selectedModel);

            // Reset to first model if no model selected or stored model doesn't exist anymore
            if (!selectedModel || !storedModelExists) {
                const defaultModel = config.models[0].id;
                setSelectedModel(defaultModel);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(SELECTED_MODEL_KEY, defaultModel);
                }
            }
        }
    }, [config, selectedModel]);

    // Persist selected model to localStorage
    const handleSetSelectedModel = (modelId: string) => {
        setSelectedModel(modelId);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SELECTED_MODEL_KEY, modelId);
        }
    };

    const selectedModelData = config?.models?.find((m: LLMModel) => m.id === selectedModel);

    return {
        providers: config?.providers || [],
        models: config?.models || [],
        selectedModel,
        selectedModelData,
        setSelectedModel: handleSetSelectedModel,
        isLoading,
    };
}