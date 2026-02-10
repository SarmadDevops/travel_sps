import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
];

const PolicyChart = () => {

  const themeColors = {
    primary: "#13c2c2", 
    secondary: "#10314a" 
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#10314a]">Policy Analytics</h3>
        
      
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors.primary }}></span> 
              <span className="text-xs font-semibold text-gray-600">Sales</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors.secondary }}></span> 
              <span className="text-xs font-semibold text-gray-600">Revenue</span>
           </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#8c8c8c', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#8c8c8c', fontSize: 12}} 
            />
            <Tooltip 
                contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    backgroundColor: '#fff'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
            />
            
         
            <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={themeColors.secondary} 
                strokeWidth={3} 
                dot={{ r: 4, fill: themeColors.secondary, strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
            />

           
            <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={themeColors.primary} 
                strokeWidth={3} 
                dot={{ r: 4, fill: themeColors.primary, strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PolicyChart;