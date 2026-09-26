import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Activity, Layers, Info } from 'lucide-react';
import { fetchAnalytics } from '../services/api';
import { DemoDataTag } from '../components/DemoDataTag';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics('WRK-108').then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 font-semibold text-sm">
        Loading Safety Analytics...
      </div>
    );
  }

  // Sample comparison dataset: Unmonitored cumulative exposure risk vs Monitored H2Safe
  const comparisonData = [
    { day: 'Day 1', unmonitored: 8.5, monitored: 2.1 },
    { day: 'Day 2', unmonitored: 18.2, monitored: 5.6 },
    { day: 'Day 3', unmonitored: 31.0, monitored: 9.8 },
    { day: 'Day 4', unmonitored: 47.5, monitored: 14.2 },
    { day: 'Day 5', unmonitored: 64.0, monitored: 18.4 },
  ];

  const pieColors = ['#059669', '#d97706', '#ea580c', '#dc2626'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Industrial Safety Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              Worker WRK-108
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quantitative trend analysis of passive colorimetric H₂S exposure records.
          </p>
        </div>

        <DemoDataTag label="Research Analytics Simulation" />
      </div>

      {/* Grid Row 1: Cumulative Exposure Over Time & Concentration Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Cumulative H2S Exposure Over Time */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900">Cumulative Exposure Over Time</h3>
              <p className="text-xs text-slate-500">Cumulative ppm·hr dosage buildup</p>
            </div>
            <span className="text-xs font-bold text-slate-400">ppm·hr</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeline}>
                <defs>
                  <linearGradient id="cumColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#cumColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Estimated H2S Concentration Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900">Estimated H₂S Concentration</h3>
              <p className="text-xs text-slate-500">Instantaneous gas readings (ppm)</p>
            </div>
            <span className="text-xs font-bold text-slate-400">ppm</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="ppm" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Risk Distribution & Monitored vs Unmonitored Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 3: Risk Level Breakdown Distribution */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Exposure Risk Breakdown</h3>
            <p className="text-xs text-slate-500">Proportion of safe vs attention scans</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.risk_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Unmonitored vs Monitored Comparison */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900">Without Monitoring vs With H2Safe</h3>
              <p className="text-xs text-slate-500">Comparison of cumulative shift hazard accumulation</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="unmonitored" name="Unmonitored Hazard (Est)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="monitored" name="H2Safe Controlled Shift" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
