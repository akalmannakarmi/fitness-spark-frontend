"use client";

import { useStatDetail } from "@/hooks/use-stat-detail";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  statId: string;
  label: string;
};

export default function StatChart({ statId, label }: Props) {
  const { data, isLoading } = useStatDetail(statId);

  if (isLoading) return <div>Loading {label} chart...</div>;
  if (!data) return <div>No data for {label}</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">{label} Logs</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="read" stroke="#8884d8" />
          <Line type="monotone" dataKey="create" stroke="#82ca9d" />
          <Line type="monotone" dataKey="update" stroke="#ffc658" />
          <Line type="monotone" dataKey="delete" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
