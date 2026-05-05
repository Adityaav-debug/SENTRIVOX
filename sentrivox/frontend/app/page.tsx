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
  Cell
} from "recharts";

import {
  Activity,
  AlertTriangle,
  Cpu,
  DollarSign
} from "lucide-react";

export default function SentrivoxDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [alertData, setAlertData] = useState<any>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<string>("loop-test-001");

  useEffect(() => {
    fetch("http://localhost:5000/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/sessions/${currentSession}/alerts`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        setRecommendation(data.recommendation || null);
        setAlertData(data);
      });
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
                <LineChart data={[
                  { day: "Mon", failures: 4 },
                  { day: "Tue", failures: 7 },
                  { day: "Wed", failures: 3 },
                  { day: "Thu", failures: 9 },
                  { day: "Fri", failures: 5 },
                ]}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="failures" strokeWidth={3} />
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
                    data={[
                      { name: "Critical", value: 5 },
                      { name: "High", value: 9 },
                      { name: "Medium", value: 12 },
                    ]}
                    dataKey="value"
                    outerRadius={80}
                  >
                    <Cell />
                    <Cell />
                    <Cell />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
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
        </div>
      </div>
    </div>
  );
}
