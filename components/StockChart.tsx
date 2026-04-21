"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function genSeries(n: number, seed = 42) {
  const data: { t: number; p: number }[] = [];
  let v = 120;
  let x = seed;
  for (let i = 0; i <= n; i++) {
    x = (x * 9301 + 49297) % 233280;
    v += (x / 233280 - 0.42) * 8;
    data.push({ t: i, p: Math.max(60, Math.min(200, v)) });
  }
  return data;
}

export function StockChart() {
  const data = useMemo(() => genSeries(60), []);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a1f2b" strokeDasharray="3 3" />
          <XAxis dataKey="t" stroke="#6b7385" fontSize={11} tickLine={false} />
          <YAxis stroke="#6b7385" fontSize={11} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: "#12161f",
              border: "1px solid #222836",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#9aa3b2" }}
          />
          <Area type="monotone" dataKey="p" stroke="#22c55e" strokeWidth={2} fill="url(#grd)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
