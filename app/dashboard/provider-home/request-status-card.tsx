import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from 'lucide-react'

interface RequestStatusCardProps {
  title: string
  value: number
  description: string
  trend: number
}

export function RequestStatusCard({ title, value, description, trend }: RequestStatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs mt-1">
          {Math.abs(trend)}% {trend > 0 ? "increase" : "decrease"}
        </p>
      </CardContent>
    </Card>
  )
}

