"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingCart,
  MessageCircle,
  Clock,
  TrendingUp,
  Plus,
  Minus,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const chartData = [
  { month: "Sep", visitors: 180 },
  { month: "Oct", visitors: 160 },
  { month: "Nov", visitors: 140 },
  { month: "Dec", visitors: 170 },
  { month: "Jan", visitors: 150 },
  { month: "Feb", visitors: 130 },
  { month: "Mar", visitors: 140 },
  { month: "Apr", visitors: 160 },
  { month: "May", visitors: 240 },
  { month: "Jun", visitors: 220 },
  { month: "Jul", visitors: 200 },
  { month: "Aug", visitors: 210 },
];

const metrics = [
  {
    title: "Total Users",
    value: "12,489",
    change: "0.43%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Unique Users",
    value: "9,572",
    change: "4.35%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Total Conversations",
    value: "40,510",
    change: "2.59%",
    icon: MessageCircle,
    trend: "up",
  },
  {
    title: "Time Spent",
    value: "2h 34m",
    change: "0.95%",
    icon: Clock,
    trend: "up",
  },
];

export default function AnalyticsDashboard() {
  // Utility to get CSS variable value for recharts
  function getCssVarValue(cssVar: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      cssVar
    );
    return value ? value.trim() : fallback;
  }

  // State for chart colors (SSR safe)
  const [chartColors, setChartColors] = useState({
    primary: "#7C3AED", // fallback to a purple
    mutedForeground: "#6B7280", // fallback to gray
    card: "#fff",
  });

  useEffect(() => {
    setChartColors({
      primary: getCssVarValue("--primary-foreground", "#7C3AED"),
      mutedForeground: getCssVarValue("--muted-foreground", "#6B7280"),
      card: getCssVarValue("--card", "#fff"),
    });
  }, []);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-muted-foreground mb-6">
          Analytics
        </h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold text-muted-foreground">
                    {metric.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-primary font-medium">
                      {metric.change}
                    </span>
                    <TrendingUp className="size-4 text-primary ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Chart */}
          <Card className="bg-card border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-semibold text-muted-foreground">
                    2,053
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visitors in August
                  </p>
                </div>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    style={{ background: "transparent" }}
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: chartColors.mutedForeground }}
                    />
                    <YAxis hide />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: chartColors.primary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Visitors Location */}
          <Card className="bg-card border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-muted-foreground">
                Visitors Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="relative">
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute bottom-20 left-24 flex flex-col items-center">
                      <div className="bg-primary rounded-full size-3 mb-1"></div>
                      <div className="bg-card px-2 py-1 rounded shadow-sm text-xs font-medium">
                        180
                        <br />
                        <span className="text-muted-foreground">Brazil</span>
                      </div>
                    </div>

                    <div className="absolute top-16 left-32 bg-primary rounded-full size-2"></div>
                    <div className="absolute top-20 right-20 bg-primary rounded-full size-2"></div>
                    <div className="absolute bottom-16 right-16 bg-primary rounded-full size-2"></div>
                    <div className="absolute top-24 left-1/2 bg-primary rounded-full size-2"></div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="size-8 p-0 bg-transparent"
                  >
                    <Plus className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="size-8 p-0 bg-transparent"
                  >
                    <Minus className="size-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Last updated: 7 days ago
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
