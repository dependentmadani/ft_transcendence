import "../css/pie.css";
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Wins", value: 12, nvalue: "W.V", color: "#00C49F"},
  { name: "Loses", value: 10, nvalue: "L.V", color: "#FF8042" },
  { name: "Ties", value: 15, nvalue: "T.V", color: "#0088FE" }
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
        y={cy}  
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill={fill} 
        style={{ 
          // fontSize: `clamp(.5vw, 1.5vw, 40px)`, 
          fontWeight:`bold` }}>
        {payload.name}
      </text>
      <li>hlwa</li>
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        fontWeight="bold"
        fontSize="15"

      >{`${nvalue} : ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 11 : -11) }
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontWeight="bold"
        fontSize="13px"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
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
          innerRadius="40%"
          outerRadius="52%"
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