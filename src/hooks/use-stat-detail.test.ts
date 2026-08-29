import { describe, expect, it } from "vitest";
import { transformLogs } from "@/hooks/use-stat-detail";

describe("transformLogs", () => {
  it("maps each log key to a chart point with numeric read/create/update/delete counts", () => {
    const logs = {
      "10": { read: 5, create: 2, update: 1, delete: 0 },
      "20": { read: 7, create: 3, update: 2, delete: 1 },
    };

    const points = transformLogs(logs);

    expect(points).toHaveLength(2);
    expect(points[0]).toMatchObject({
      read: 5,
      create: 2,
      update: 1,
      delete: 0,
    });
    expect(points[1]).toMatchObject({
      read: 7,
      create: 3,
      update: 2,
      delete: 1,
    });
    expect(points[0].time).toBeTruthy();
  });

  it("treats missing or non-numeric entries as zero", () => {
    const points = transformLogs({
      "0": { read: "3" as unknown as number },
      "1": {},
    });

    expect(points[0]).toMatchObject({
      read: 3,
      create: 0,
      update: 0,
      delete: 0,
    });
    expect(points[1]).toMatchObject({
      read: 0,
      create: 0,
      update: 0,
      delete: 0,
    });
  });

  it("returns an empty array when there are no logs", () => {
    expect(transformLogs({})).toEqual([]);
  });
});
