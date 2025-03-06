"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  1,2,2.4,1.8,4,3,1,5,6,7,4.5,8,9.8
]
const formattedData = data.map((rating, index) => ({
  name: `Day ${index + 1}`,
  rating,
}))

export function RatingOverTimeChart() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <ChartContainer
      config={{
        rating: { label: "Rating", color: "hsl(var(--chart-1))" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: -40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: isMobile ? 12 : 14 }}
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fontSize: isMobile ? 12 : 14 }}
            tickCount={6}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="var(--color-rating)" 
            strokeWidth={2}
            dot={!isMobile}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

