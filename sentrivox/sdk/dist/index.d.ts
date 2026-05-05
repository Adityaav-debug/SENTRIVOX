type AgentEvent = {
    sessionId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    toolName: string;
    latency: number;
    success: boolean;
};
export declare function observeAgent(event: AgentEvent): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map