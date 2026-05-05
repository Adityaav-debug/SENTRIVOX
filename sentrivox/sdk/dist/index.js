"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.observeAgent = observeAgent;
const axios_1 = __importDefault(require("axios"));
async function observeAgent(event) {
    try {
        await axios_1.default.post("http://localhost:5000/events", event);
        console.log("Sentrivox event captured");
    }
    catch (error) {
        console.error("Sentrivox SDK failed:", error);
    }
}
