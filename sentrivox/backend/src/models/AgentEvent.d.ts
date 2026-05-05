import mongoose from "mongoose";
export declare const AgentEvent: mongoose.Model<{
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
}, mongoose.Document<unknown, {}, {
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    timestamp: NativeDate;
    model?: string | null;
    sessionId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    toolName?: string | null;
    latency?: number | null;
    success?: boolean | null;
    error?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AgentEvent.d.ts.map