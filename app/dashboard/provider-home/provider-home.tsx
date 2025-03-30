import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestStatusChart } from "@/app/dashboard/provider-home/request-status-chart"
import { RequestStatusCard } from "@/app/dashboard/provider-home/request-status-card"
import { User } from "@supabase/supabase-js"
import {useState, useEffect, useCallback} from "react"
import { createClient } from "@/app/utils/supabase/client";

export default function DashboardPage({ user }: { user: User }) {
  const [statusCounts, setStatusCounts] = useState({
    closed: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [trends, setTrends] = useState({
    closed: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!user) return;

    // Fetch current request statuses
    const { data: requests, error } = await supabase
        .from("requests")
        .select("status, created_at")
        .eq("provider_id", user.id);

    if (error) {
      console.error("Error fetching request statuses:", error);
      return;
    }

    // Count occurrences of each status
    const currentCounts = { closed: 0, approved: 0, pending: 0, rejected: 0 };
    const pastCounts = { closed: 0, approved: 0, pending: 0, rejected: 0 };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    requests.forEach((req: { status: string; created_at: string | number | Date }) => {
      const status = req.status as keyof typeof currentCounts;
      if (status in currentCounts) {
        currentCounts[status]++;
        if (new Date(req.created_at) < oneWeekAgo) {
          pastCounts[status]++;
        }
      }
    });

    // Calculate trend (difference from past data)
    const trendData = {
      closed: currentCounts.closed - pastCounts.closed,
      approved: currentCounts.approved - pastCounts.approved,
      pending: currentCounts.pending - pastCounts.pending,
      rejected: currentCounts.rejected - pastCounts.rejected,
    };

    setStatusCounts(currentCounts);
    setTrends(trendData);
  }, [supabase, user])

  useEffect(() => {
    fetchData().then(() => {});
  }, [user, fetchData]); // Re-run if `user` changes


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Request Dashboard</h1>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RequestStatusCard
          title="Closed Requests"
          value={statusCounts.closed}
          description="Successfully closed requests"
          trend={trends.closed}
        />
        <RequestStatusCard
          title="Approved Requests"
          value={statusCounts.approved}
          description="Requests that have been approved"
          trend={trends.approved}
        />
        <RequestStatusCard
          title="Pending Requests"
          value={statusCounts.pending}
          description="Requests awaiting decision"
          trend={trends.pending}
        />
        <RequestStatusCard
          title="Rejected Requests"
          value={statusCounts.rejected}
          description="Requests that were rejected"
          trend={trends.rejected}
        />
      </div>
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestStatusChart user={user} />
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Rating Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingOverTimeChart />
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

