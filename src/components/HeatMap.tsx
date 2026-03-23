import React from 'react';
import { motion } from 'motion/react';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  // Mock data for demonstration if no data is provided
  const heatmapData = data.length > 0 ? data : Array.from({ length: 365 }).map((_, i) => {
    const date = new Date(2026, 0, i + 1);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5),
    };
  });

  const groupedData = heatmapData.reduce((acc, item) => {
    const month = item.date.substring(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {} as Record<string, typeof heatmapData>);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#161b22]';
    if (count < 2) return 'bg-[#0e4429]';
    if (count < 4) return 'bg-[#006d32]';
    return 'bg-[#26a641]';
  };

  return (
    <div className="flex flex-wrap gap-6 p-4 glass rounded-[20px]">
      {Object.entries(groupedData).sort().map(([month, items]) => (
        <div key={month} className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{month}</span>
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.005 }}
                className={`w-3 h-3 rounded-sm ${getColor(item.count)}`}
                title={`${item.date}: ${item.count} contributions`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeatMap;
