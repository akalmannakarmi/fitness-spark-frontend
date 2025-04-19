import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axios"
import routes from "@/lib/routes"

type LogEntry = {
    Actions: Record<string, number>
    status_codes: Record<string, number>
}
  
type StatDetail = {
    _id: string
    model: string
    count: number
    logs: Record<string, LogEntry>
}

function transformLogs(logs: Record<string, LogEntry>): Record<string, LogEntry> {
  const transformed: Record<string, LogEntry> = {}

  for (const key in logs) {
    if (logs.hasOwnProperty(key)) {
      const timestamp = Number(key) * 60 * 1000
      const dateStr = new Date(timestamp).toLocaleString()
      transformed[dateStr] = logs[key]
    }
  }

  return transformed
}

export function useStatDetail(statId: string) {
  return useQuery<StatDetail>({
    queryKey: ['stat-detail', statId],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.stat_detail_url(statId))
      const data = res.data as StatDetail
      return {
        ...data,
        logs: transformLogs(data.logs),
      }
    },
    enabled: !!statId,
    staleTime: 5 * 60 * 1000,
  })
}
