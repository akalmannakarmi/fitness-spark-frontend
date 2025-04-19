'use client'

import { useStatDetail } from "@/hooks/stat-details"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

type Props = {
  statId: string
  label: string
}

export default function StatChart({ statId, label }: Props) {
  const { data, isLoading } = useStatDetail(statId)

  if (isLoading) return <div>Loading {label} chart...</div>
  if (!data) return <div>No data for {label}</div>

  // Convert logs to array
  const chartData = Object.entries(data.logs).map(([timestamp, log]) => ({
    time: timestamp,
    Read: log.Actions?.Read || 0,
    Create: log.Actions?.Create || 0,
    Update: log.Actions?.Update || 0,
    Delete: log.Actions?.Delete || 0,
  }))

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">{label} Logs</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Read" stroke="#8884d8" />
          <Line type="monotone" dataKey="Create" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Update" stroke="#ffc658" />
          <Line type="monotone" dataKey="Delete" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
