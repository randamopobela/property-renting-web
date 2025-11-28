"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface SalesData {
  id: string;
  createdAt: string;
  amount: number;
  room: {
      property: { name: string }
  };
}

export default function SalesChart({ data }: { data: SalesData[] }) {
  
  const chartData = data.map((item) => ({
    date: format(new Date(item.createdAt), "dd MMM", { locale: id }),
    amount: item.amount,
    property: item.room.property.name
  }));

  return (
    <Card className="col-span-4 border-0 shadow-sm ring-1 ring-gray-200">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Grafik Pendapatan</CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0 pl-2">
        <div className="h-[350px] w-full">
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#6b7280" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
                            dx={-10}
                        />
                        <Tooltip 
                            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, "Pendapatan"]}
                            contentStyle={{ 
                                borderRadius: "8px", 
                                border: "none", 
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#ffffff"
                            }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Bar 
                            dataKey="amount" 
                            fill="#0d9488" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm">Belum ada data penjualan untuk ditampilkan.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}