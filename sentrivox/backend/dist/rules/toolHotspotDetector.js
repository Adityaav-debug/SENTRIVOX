"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectToolHotspot = detectToolHotspot;
function detectToolHotspot(sessionId, events) {
    const sessionEvents = events.filter((event) => event.sessionId === sessionId);
    if (sessionEvents.length === 0) {
        return null;
    }
    const toolCounts = {};
    for (const event of sessionEvents) {
        const tool = event.toolName;
        if (!tool)
            continue;
        toolCounts[tool] = (toolCounts[tool] || 0) + 1;
    }
    let hottestTool = "";
    let highestCount = 0;
    for (const tool in toolCounts) {
        const currentCount = toolCounts[tool] || 0;
        if (currentCount > highestCount) {
            hottestTool = tool;
            highestCount = currentCount;
        }
    }
    if (highestCount >= 5) {
        return {
            alert: "Tool hotspot detected",
            severity: "medium",
            toolName: hottestTool,
            count: highestCount
        };
    }
    return null;
}
