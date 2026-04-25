import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2018', growth: 0.68, id: 'y2018' },
  { year: '2020', growth: 1.01, id: 'y2020' },
  { year: '2022', growth: 1.41, id: 'y2022' },
  { year: '2024', growth: 1.80, id: 'y2024' },
];

export function GrowthChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full">
      <h3 className="text-lg mb-4">Area Growth Rate (km²)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="growth" fill="#3b82f6" key="growth-bar" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
