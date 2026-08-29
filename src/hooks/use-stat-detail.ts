import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";

type LogEntry = {
  read?: number;
  create?: number;
  update?: number;
  delete?: number;
  status_codes?: Record<string, number>;
};

type StatDetail = {
  _id: string;
  model: string;
  count: number;
  logs: Record<string, LogEntry>;
};

type ChartPoint = {
  time: string;
  read: number;
  create: number;
  update: number;
  delete: number;
};

function toCount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  if (value && typeof value === "object") {
    return Object.values(value).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }
  return 0;
}

export function transformLogs(logs: Record<string, LogEntry>): ChartPoint[] {
  return Object.entries(logs).map(([key, entry]) => {
    const timestamp = Number(key) * 60 * 1000;
    const dateStr = new Date(timestamp).toLocaleString();
    return {
      time: dateStr,
      read: toCount(entry.read),
      create: toCount(entry.create),
      update: toCount(entry.update),
      delete: toCount(entry.delete),
    };
  });
}

export function useStatDetail(statId: string) {
  return useQuery<ChartPoint[]>({
    queryKey: ["stat-detail", statId],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.statDetailUrl(statId));
      const data = res.data as StatDetail;
      return transformLogs(data.logs ?? {});
    },
    enabled: !!statId,
    staleTime: 5 * 60 * 1000,
  });
}
