type AgentTelemetry = {
    sessionId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    toolName: string;
    latency: number;
    success: boolean;
};
export declare function observeAgent(data: AgentTelemetry): Promise<void>;
export {};
//# sourceMappingURL=observeAgent.d.ts.map