import "./pie.css";
import  { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";




const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    totalValue
    // nvalue
  } = props;

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
        {`${payload.name} : ${value}`}
      </text>
      <text
        x={cx - 40}
        y={cy + 20}
        dy={15}
        fill="#d3d3d3"
        fontWeight="bold"
        fontSize="13px"
      >
        {`Rate (${(percent * 100).toFixed(2)}%)`}
      </text>
      <text
        x={cx - 50}
        y={cy - 50}
        dy={15}
        fill="#ffffff"
        fontWeight="bold"
        fontSize="1.2rem"
      >
        {`Games : ${totalValue}`}
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

export default function MyPieChart(props:any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_:any, index:number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const data = [
    { name: "Wins", value: props.gameData.wins, color: "#00C49F"},
    { name: "Loses", value: props.gameData.loses, color: "#F85B30" }
  ];

  const totalValue = data.reduce((total, item) => total + item.value, 0);

  return (
    <div className="hlwa">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={(props:any) =>renderActiveShape({...props, totalValue: totalValue})}
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