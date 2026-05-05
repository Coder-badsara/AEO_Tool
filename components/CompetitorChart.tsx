"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CompetitorStat } from "@/lib/types";

interface Props {
  competitors: CompetitorStat[];
  productName: string;
  productScore: number;
}

export default function CompetitorChart({ competitors, productName, productScore }: Props) {
  const data = [
    { name: productName, mentions: Math.max(1, Math.round(productScore / 25)), isProduct: true },
    ...competitors.map((competitor) => ({
      name: competitor.name,
      mentions: competitor.mentionCount,
      isProduct: false
    }))
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
        <XAxis type="number" domain={[0, 3]} tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="rgba(255,255,255,0.15)" />
        <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#d1d5db", fontSize: 12 }} stroke="rgba(255,255,255,0.15)" />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{ backgroundColor: "#08111f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#e5e7eb" }}
        />
        <Bar dataKey="mentions" radius={[0, 8, 8, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.isProduct ? "#35c28f" : "#5b6474"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
