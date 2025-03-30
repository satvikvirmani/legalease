"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { createClient } from "@/app/utils/supabase/client";
import {useCallback, useEffect, useState} from "react";

import { User } from "@supabase/supabase-js";

export function RequestStatusChart({ user }: { user: User }) {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all requests
      if (!user) return;

      const { data: requests, error } = await supabase
          .from("requests")
          .select("status")
          .eq("provider_id", user.id);

      if (error) {
        console.log(error);
        return;
      }

      // Count occurrences of each status
      const statusCount: Record<string, number> = {
        closed: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };

      requests.forEach((request) => {
        const status = request.status.toLowerCase();
        if (statusCount[status] !== undefined) {
          statusCount[status]++;
        }
      });

      // Set chart data
      setData([
        { name: "Closed", value: statusCount.closed, color: "hsl(var(--chart-1))" },
        { name: "Approved", value: statusCount.approved, color: "hsl(var(--chart-2))" },
        { name: "Pending", value: statusCount.pending, color: "hsl(var(--chart-3))" },
        { name: "Rejected", value: statusCount.rejected, color: "hsl(var(--chart-4))" },
      ]);
    } catch (error) {
      console.error("Error fetching request data:", error);
      setError("Failed to load request status data.");
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    fetchData().then(() => {});
  }, [user, fetchData]);

  if (loading) return <div className="text-center py-6">Loading chart...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <ChartContainer
      config={{
        closed: { label: "Closed", color: "hsl(var(--chart-1))" },
        approved: { label: "Approved", color: "hsl(var(--chart-2))" },
        pending: { label: "Pending", color: "hsl(var(--chart-3))" },
        rejected: { label: "Rejected", color: "hsl(var(--chart-4))" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

