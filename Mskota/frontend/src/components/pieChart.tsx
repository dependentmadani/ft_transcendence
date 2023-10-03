import "../css/pie.css";
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Wins", value: 12, color: "#00C49F"},
  { name: "Loses", value: 10, color: "#FF8042" },
  { name: "Ties", value: 15, color: "#00c8fe" }
];


const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    nvalue
  } = props;
  const lineP = ((outerRadius * 2) / 10);
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + lineP) * cos;
  const my = cy + (outerRadius + lineP) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * lineP / 2;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text 
        x={cx} 
        y={cy - 10}  
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill={fill}
        style={{ 
          // fontSize: `clamp(.5vw, 1.5vw, 40px)`, 
          fontWeight:`bold` }}>
        {`${payload.name} : ${value}`}
      </text>
            <text
              x={cx - 40}
              y={cy}
              dy={15}
              fill="#d3d3d3"
              fontWeight="bold"
              fontSize="13px"
            >
              {`Rate (${(percent * 100).toFixed(2)}%)`}
            </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius} 
        startAngle={startAngle + 3}
        endAngle={endAngle - 3}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle + 2}
        endAngle={endAngle - 2}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 6}
        fill={fill}
      />
    </g>
  );
};

export default function MyPieChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );


  return (
    <div className="hlwa">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          innerRadius="65%"
          outerRadius="82%"
          dataKey="value"
          
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer >
   </div>
  );
}