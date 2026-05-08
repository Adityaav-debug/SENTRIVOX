import { FastifyInstance } from "fastify";
import PDFDocument from "pdfkit";
import { AgentEvent } from "../models/AgentEvent";
import { analyzeRootCause } from "../rules/rootCauseEngine";

export async function reportRoutes(
  fastify: FastifyInstance
) {
  fastify.get(
    "/api/reports/:sessionId",
    async (request: any, reply) => {
      const { sessionId } = request.params;

      const events =
        await AgentEvent.find({
          sessionId
        });

      if (!events.length) {
        return reply.code(404).send({
          error: "Session not found"
        });
      }

      const toolCalls =
        events.filter(
          (e: any) => e.toolName
        ).length;

      const retryCount =
        events.reduce(
          (sum, e: any) =>
            sum + (e.retryCount || 0),
          0
        );

      const inputTokens =
        events.reduce(
          (sum, e: any) =>
            sum +
            (e.inputTokens || 0),
          0
        );

      const outputTokens =
        events.reduce(
          (sum, e: any) =>
            sum +
            (e.outputTokens || 0),
          0
        );

      const totalTokens =
        inputTokens +
        outputTokens;

      const totalCost =
        events.reduce(
          (sum, e: any) =>
            sum +
            (e.costUsd || 0),
          0
        );


      const latency =
        events.length > 0
          ? Math.max(
            ...events.map(
              (e: any) =>
                e.latency || 0
            )
          )
          : 0;

      const uniqueTools = Array.from(new Set(events.map((e: any) => e.toolName).filter(Boolean))) as string[];

      const toolStats: Record<string, any> = {};

      events.forEach((event: any) => {
        const tool = event.toolName || "unknown";

        if (!toolStats[tool]) {
          toolStats[tool] = {
            calls: 0,
            totalLatency: 0,
            maxLatency: 0,
            failures: 0,
            retries: 0
          };
        }

        toolStats[tool].calls++;

        toolStats[tool].totalLatency += event.latency || 0;

        toolStats[tool].maxLatency = Math.max(
          toolStats[tool].maxLatency,
          event.latency || 0
        );

        toolStats[tool].retries += event.retryCount || 0;

        if (event.status === "failed") {
          toolStats[tool].failures++;
        }
      });


      const rootCause =
        analyzeRootCause({
          sessionId,
          toolCalls,
          retryCount,
          totalTokens,
          latency,
          uniqueTools
        });

      const doc =
        new PDFDocument();

      reply.header(
        "Content-Type",
        "application/pdf"
      );

      reply.header(
        "Content-Disposition",
        `attachment; filename=${sessionId}.pdf`
      );

      const stream = doc.pipe(reply.raw);


      doc.fontSize(24)
        .fillColor("#0ea5e9")
        .text("Sentrivox Executive Report", { align: "center" });

      doc.moveDown();
      doc.strokeColor("#334155").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      doc.fontSize(14)
        .fillColor("#111827")
        .text(`Session ID: `, { continued: true })
        .fillColor("#4b5563")
        .text(sessionId);

      doc.fontSize(14)
        .fillColor("#111827")
        .text(`Total Events: `, { continued: true })
        .fillColor("#4b5563")
        .text(`${events.length}`);

      doc.moveDown();

      doc.fontSize(18)
        .fillColor("#0ea5e9")
        .text("Intelligence Summary");

      doc.moveDown(0.5);

      doc.fontSize(12)
        .fillColor("#111827")
        .text(`Maximum Latency: ${latency}ms`);

      doc.text(`Total Token Usage: ${totalTokens}`);

      doc.text(`Tool Executions: ${toolCalls}`);

      doc.text(`Input Tokens: ${inputTokens}`);

      doc.text(`Output Tokens: ${outputTokens}`);

      doc.text(
        `Estimated Cost: $${totalCost.toFixed(3)}`
      );


      doc.moveDown();

      if (rootCause) {
        doc.fontSize(18)
          .fillColor("#ef4444")
          .text("Root Cause Diagnosis");

        doc.moveDown(0.5);

        doc.fontSize(14)
          .fillColor("#111827")
          .text(rootCause.diagnosis);

        doc.fontSize(12)
          .fillColor("#4b5563")
          .text(`Confidence Level: ${rootCause.confidence}%`);

        doc.moveDown();

        doc.fontSize(14)
          .fillColor("#10b981")
          .text("Recommended Action:");

        doc.fontSize(12)
          .fillColor("#111827")
          .text(rootCause.recommendation);
      } else {
        doc.fontSize(14)
          .fillColor("#10b981")
          .text("No critical anomalies detected in this session.");
      }

      doc.moveDown();

      doc.fontSize(18)
        .fillColor("#0ea5e9")
        .text("Tool Performance Summary");

      Object.entries(toolStats).forEach(
        ([tool, stats]: any) => {
          const avgLatency =
            Math.round(
              stats.totalLatency /
              stats.calls
            );

          const failureRate =
            (
              (stats.failures /
                stats.calls) *
              100
            ).toFixed(1);

          doc.moveDown(0.5);

          doc.fontSize(13)
            .fillColor("#111827")
            .text(`Tool: ${tool}`);

          doc.fontSize(11)
            .fillColor("#4b5563")
            .text(`Calls: ${stats.calls}`)
            .text(`Avg Latency: ${avgLatency}ms`)
            .text(`Max Latency: ${stats.maxLatency}ms`)
            .text(`Retries: ${stats.retries}`)
            .text(`Failure Rate: ${failureRate}%`);
        }
      );


      doc.moveDown(2);
      doc.fontSize(10)
        .fillColor("#4b5563")
        .text("Generated by Sentrivox Observability Engine", { align: "center" });

      doc.end();

      return new Promise((resolve) => {
        stream.on("finish", resolve);
      });
    }
  );
}
