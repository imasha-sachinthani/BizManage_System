import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  dataKeys?: string[];
  colors?: string[];
}

export function DashboardChart({ type, title, data, dataKeys = [], colors = [] }: ChartProps) {
  const defaultColors = ['#1A2B4A', '#D4AF37', '#047857', '#DC2626', '#F59E0B'];
  const chartColors = colors.length > 0 ? colors : defaultColors;

  // Ensure data is valid
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' && dataKeys.length > 0 ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line 
                  key={`line-${key}-${index}`}
                  type="monotone" 
                  dataKey={key} 
                  stroke={chartColors[index % chartColors.length]} 
                  strokeWidth={3}
                  dot={{ fill: chartColors[index % chartColors.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : type === 'bar' && dataKeys.length > 0 ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={`bar-${key}-${index}`}
                  dataKey={key} 
                  fill={chartColors[index % chartColors.length]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          ) : type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Invalid chart configuration
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
