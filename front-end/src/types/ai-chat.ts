export type ChatMessageVariant = 'default' | 'tool' | 'status' | 'error';

export type ToolMessageBlock =
    | {
        type: 'table';
        title?: string;
        columns: string[];
        rows: string[][];
        caption?: string;
    }
    | {
        type: 'stats';
        title?: string;
        items: Array<{ label: string; value: string; tone?: 'neutral' | 'positive' | 'negative' | 'warning' }>;
    }
    | {
        type: 'text';
        title?: string;
        body: string;
    }
    | {
        type: 'list';
        title?: string;
        items: string[];
    }
    | {
        type: 'chart';
        title?: string;
        description?: string;
        chartKind: 'line' | 'bar';
        data: Array<Record<string, string | number>>;
        series: Array<{
            dataKey: string;
            name?: string;
            color?: string;
            type?: 'line' | 'bar';
        }>;
        xKey?: string;
        height?: number;
        showLegend?: boolean;
        showGrid?: boolean;
    };

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    model?: string;
    variant?: ChatMessageVariant;
    title?: string;
    subtitle?: string;
    blocks?: ToolMessageBlock[];
    statusType?: 'info' | 'success' | 'warning' | 'error';
}

export interface ReasoningMessage {
    id: string;
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: number;
    title: string;
    model: string;
    messages: ChatMessage[];
    created_at: Date;
    updated_at: Date;
    is_archived: boolean;
}

export interface LLMModel {
    id: string;
    name: string;
    provider: string;
    contextWindow: number;
    description?: string;
    maxTokens?: number;
}

export interface LLMProvider {
    id: string;
    name: string;
    models: LLMModel[];
    baseURL?: string;
    requiresApiKey: boolean;
}

export interface ChatConfig {
    providers: LLMProvider[];
    models: LLMModel[];
}
