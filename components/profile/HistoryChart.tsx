"use client";

import { Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HistoryItem {
    score_pourcentage: number;
    date_test: string;
}

interface HistoryChartProps {
    history: HistoryItem[];
}

export function HistoryChart({ history }: HistoryChartProps) {
    if (!history || history.length === 0) return null;

    // Format data for Recharts (reverse to show chronological order left-to-right if history is recent-first)
    // The server returns descending order (recent first). Charts usually show Time -> Right
    // So we assume history[0] is most recent.
    const data = [...history].reverse().map(item => ({
        ...item,
        date: new Date(item.date_test).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        fullDate: new Date(item.date_test).toLocaleDateString('fr-FR')
    }));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 dark:text-white">
                <Activity className="w-5 h-5 text-blue-500" />
                Historique de progression
            </h3>

            <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                            formatter={(value: number | undefined) => [`${value}%`, 'Score']}
                            labelFormatter={(label) => `Date : ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="score_pourcentage"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-2 px-1">
                <span>Début</span>
                <span>Actuel</span>
            </div>
        </div>
    );
}
