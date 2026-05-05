export interface AgentEvent {
    sessionId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    toolName?: string;
    latency: number;
    success: boolean;
    error?: string;
    timestamp?: Date;
    cost?: number;
}
//# sourceMappingURL=types.d.ts.map