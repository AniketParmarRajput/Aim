import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip as RechartsTooltip,
} from "recharts";

const DEFAULT_COLORS = [
  "#8B451F", // Deep brown
  "#C2703D", // Brand orange/brown
  "#D4A24C", // Golden
  "#E0B45C", // Light gold
  "#6B341C", // Dark brown
  "#A85F32", // Burnt orange
  "#D98B45", // Warm orange
  "#8F6B45", // Muted brown
];

const CommonPieChart = ({
  data = [],
  centerLabel = "",
  height = 300,
  innerRadius = 52,
  outerRadius = 98,
  colors = DEFAULT_COLORS,
  onSegmentClick,
  formatter,
}) => {
  const chartData = data.filter((item) => item && Number(item.value) > 0);

  const total = chartData.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0,
  );

  const formatValue = (value) => {
    if (formatter) {
      return formatter(value);
    }

    return Number(value).toLocaleString("en-IN");
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          cornerRadius={4}
          labelLine={false}
          onClick={onSegmentClick}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              cursor={onSegmentClick ? "pointer" : "default"}
            />
          ))}

          {centerLabel && (
            <Label
              value={centerLabel.toUpperCase()}
              position="center"
              style={{
                fontSize: 12,
                fontWeight: "700",
                fill: "#64748b",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}
        </Pie>

        <RechartsTooltip
          formatter={(value, name) => {
            const percentage =
              total > 0 ? ((Number(value) / total) * 100).toFixed(1) : "0.0";

            return [`${formatValue(value)} (${percentage}%)`, name];
          }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CommonPieChart;
