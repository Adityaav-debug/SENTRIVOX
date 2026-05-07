"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  Activity,
  AlertTriangle,
  Cpu,
  DollarSign
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://reliable-recreation-production-f7f1.up.railway.app/api/events";

console.log("API URL:", BASE_URL);

const WS_URL = BASE_URL.replace(/^http/, "ws").replace("/api/events", "/ws");

const getRootCause = (alertType: string) => {
  switch (alertType) {
    case "LATENCY_SPIKE":
      return "Likely model overload or API timeout";
    case "TOKEN_BURN":
      return "Prompt inefficiency or repeated completions";
    case "RETRY_STORM":
      return "External dependency instability";
    case "LOOP_DETECTED":
      return "Agent reasoning recursion";
    default:
      return "Unknown anomaly";
  }
};

const classifyEvent = (latency: number) => {
  if (latency > 4000) {
    return {
      label: "CRITICAL",
      message: "Latency spike detected",
      color: "text-red-400"
    };
  }
  if (latency > 1000) {
    return {
      label: "WARNING",
      message: "Heavy inference",
      color: "text-yellow-400"
    };
  }
  return {
    label: "NORMAL",
    message: "Normal inference",
    color: "text-green-400"
  };
};

export default function SentrivoxDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [alertData, setAlertData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<string>("loop-test-001");
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/ws");

    socket.onopen = () => {
      console.log("WebSocket connected to:", WS_URL);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Live event:", data);
        setLiveMessage(data.message);
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => socket.close();
  }, []);

  const getRecommendation = () => {
    if (alerts.some((a) => a.type === "LATENCY_SPIKE")) {
      return "Investigate model/API bottlenecks";
    }
    if (alerts.some((a) => a.type === "TOKEN_BURN")) {
      return "Optimize prompt efficiency";
    }
    if (alerts.some((a) => a.type === "RETRY_STORM")) {
      return "Enable exponential backoff";
    }
    return "System operating normally";
  };

  useEffect(() => {
    fetch(`${BASE_URL}/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []));
  }, []);

  const fetchData = () => {
    fetch(`${BASE_URL}/sessions/${currentSession}/alerts`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        setRecommendation(data.recommendation || null);
        setAlertData(data);
      });

    fetch(`${BASE_URL}/sessions/${currentSession}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const predictiveAlert = alerts.find(
    (alert) => alert.alert === "Agent likely to fail soon"
  );
  const rootCause = alertData?.rootCause;
  const metrics = [
    {
      title: "Active Agents",
      value: "42",
      subtitle: "Live production monitoring",
      icon: Activity,
    },
    {
      title: "Token Waste Prevented",
      value: "$18.4K",
      subtitle: "Estimated monthly savings",
      icon: DollarSign,
    },
    {
      title: "Critical Failures",
      value: "17",
      subtitle: "Detected before escalation",
      icon: AlertTriangle,
    },
    {
      title: "Sessions Analyzed",
      value: "12.8K",
      subtitle: "Across customer environments",
      icon: Cpu,
    },
  ];

  const trendData = events.map((e: any, index) => ({
    name: `E${index + 1}`,
    latency: e.latency || 0
  }));

  const highCount = alerts.filter(
    (a) => a.severity === "HIGH"
  ).length;

  const mediumCount = alerts.filter(
    (a) => a.severity === "MEDIUM"
  ).length;

  const lowCount = alerts.filter(
    (a) => a.severity === "LOW"
  ).length;

  const totalAlerts =
    highCount + mediumCount + lowCount;

  const severityData =
    totalAlerts > 0
      ? [
        {
          name: "HIGH",
          value: Math.max(
            Math.round((highCount / totalAlerts) * 100),
            highCount > 0 ? 10 : 0
          )
        },
        {
          name: "MEDIUM",
          value: Math.max(
            Math.round((mediumCount / totalAlerts) * 100),
            mediumCount > 0 ? 10 : 0
          )
        },
        {
          name: "LOW",
          value: Math.max(
            Math.round((lowCount / totalAlerts) * 100),
            lowCount > 0 ? 10 : 0
          )
        }
      ]
      : [
        { name: "HIGH", value: 0 },
        { name: "MEDIUM", value: 0 },
        { name: "LOW", value: 0 }
      ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  const alertFeed = alerts.map((alert, index) => ({
    id: index,
    type: alert.type,
    severity: alert.severity,
    message: alert.message
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Sentrivox</h1>
            <p className="text-slate-400 mt-3 text-lg">
              AI Agent Observability & Failure Intelligence Platform
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 border border-slate-800 rounded-full px-5 py-2 text-sm">
              ● Monitoring {sessions.length} active agents
            </div>

            <select
              value={currentSession}
              onChange={(e) => setCurrentSession(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sessions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.title}
                className="bg-slate-900 border-slate-800 rounded-2xl"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm">{metric.title}</p>
                    <Icon size={18} />
                  </div>

                  <p className="text-4xl font-bold">{metric.value}</p>
                  <p className="text-sm text-slate-500">{metric.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {recommendation && recommendation.action !== "No intervention needed" && (
          <div className="bg-indigo-950 border border-indigo-900 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">AI Recommendation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Action</p>
                <p className="text-2xl font-bold text-indigo-200">{recommendation.action}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Priority</p>
                <p className={`text-2xl font-bold uppercase ${recommendation.priority === 'critical' ? 'text-red-400' : 'text-indigo-200'}`}>
                  {recommendation.priority}
                </p>
              </div>
            </div>
          </div>
        )}

        {predictiveAlert && (
          <div className="bg-red-950 border border-red-900 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Predictive Failure Intelligence
            </h2>

            <p className="text-5xl font-bold mb-2">
              {predictiveAlert.riskScore}%
            </p>

            <p className="text-slate-300">
              Agent likely to fail soon
            </p>
          </div>
        )}

        {rootCause && (
          <div className="bg-amber-950 border border-amber-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">
              Root Cause Intelligence
            </h2>

            <p className="text-lg mb-2">
              {rootCause.diagnosis}
            </p>

            <p className="text-slate-400">
              Confidence: {rootCause.confidence}%
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Failure Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Severity Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    outerRadius={80}
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="text-cyan-400 font-medium mb-4">
          Live Stream: {liveMessage}
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">
            Live Alert Feed
          </h2>

          <div className="space-y-3">
            {alertFeed.length > 0 ? (
              alertFeed.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                >
                  <p className="font-semibold">
                    {alert.severity} — {alert.type}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {alert.message}
                  </p>

                  <p className="text-blue-400 text-sm mt-2">
                    Root Cause: {getRootCause(alert.type)}
                  </p>

                  <p className="text-gray-400 text-xs mt-2">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No active alerts
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">
            Session Replay
          </h2>

          <div className="space-y-3">
            {events.map((event, index) => {
              const eventInfo = classifyEvent(event.latency);

              return (
                <div
                  key={index}
                  className="border-l-2 border-blue-500 pl-4 mb-4"
                >
                  <p className="text-gray-400 text-sm">
                    {new Date(
                      event.timestamp
                    ).toLocaleTimeString()}
                  </p>

                  <p className={eventInfo.color}>
                    {eventInfo.label}
                  </p>

                  <p className="text-white">
                    {eventInfo.message}
                  </p>

                  <p className="text-blue-400 text-sm">
                    Latency: {event.latency}ms
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Executive Intelligence Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm">Primary Tool Bottleneck</p>
              <p className="text-xl font-semibold mt-2">{alertData?.summary?.bottleneck || "none"}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Average Session Latency</p>
              <p className="text-xl font-semibold mt-2">{alertData?.summary?.avgLatency || "0s"}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Failure Rate</p>
              <p className="text-xl font-semibold mt-2">{alertData?.summary?.failureRate || "0%"}</p>
            </div>
          </div>

          <p className="text-blue-400 text-sm mt-6 pt-6 border-t border-slate-800">
            Recommended Action: {getRecommendation()}
          </p>
        </div>
      </div>
    </div>
  );
}
