// import { ResponsivePie } from '@nivo/pie'
// import '../css/pie.css'


// const data = [
//   {
//     "id": "Ties",
//     "label": "Ties",
//     "value": 2,
//     "color": "#0088FE"
//   },
//   {
//     "id": "Wins",
//     "label": "Wins",
//     "value": 13,
//     "color": "#00C49F"
//   },
//   {
//     "id": "Loses",
//     "label": "Loses",
//     "value": 9,
//     "color": "#FF8042"
//   }]


//   const CenterMetric = ({ data }) => {
//     // Calculate the total sum of values
//     const total = data.reduce((sum, entry) => sum + entry.value, 0);
//     console.log(total)
//     return (
//       <div className='kik'>
//         {/* <div>Total: {total}</div> */}
//       </div>
//     );
//   };
  

// function Test() {

// return (
//   <div className='dlaha'>

//       <ResponsivePie
//             data={data}
//             margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//             padAngle={0.5}
//             startAngle={34}
//             sortByValue={true}
//             innerRadius={0.65}
//             cornerRadius={1}
//             activeInnerRadiusOffset={5}
//             activeOuterRadiusOffset={8}
//             borderWidth={1}
//             borderColor={{
//                 from: 'color',
//                 modifiers: [
//                     [
//                         'darker',
//                         0.2
//                     ]
//                 ]
//             }}
//             // arcLinkLabel={e=>e.id+" ("+ (e.value * 100) +")"}
//             // azrcLinkLabel={(e) => `${(e.value * 100).toLocaleString(undefined, { style: 'percent' })}`}
//             arcLinkLabelsTextColor="#ffffff"
//             arcLinkLabelsThickness={2}
//             arcLinkLabelsSkipAngle={10}
//             arcLinkLabelsColor={{ from: 'color' }}
//             arcLabelsSkipAngle={10}
//             arcLabelsTextColor={{
//                 from: 'color',
//                 modifiers: [
//                     [
//                         'darker',
//                         2
//                     ]
//                 ]
//             }}
//             >
//             {/* Add your custom layer */}
//           </ResponsivePie>
//           <CenterMetric data={data} />

//   </div>
//   )

// }



import React from "react";
import { PieChart, Pie, ResponsivePie } from "@nivo/pie";

const data = [
  { name: "Wins", value: 12, nvalue: "W.V", color: "#00C49F"},
  { name: "Loses", value: 10, nvalue: "L.V", color: "#FF8042" },
  { name: "Ties", value: 15, nvalue: "T.V", color: "#0088FE" }
];

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    fill,
    label
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="bold" fontSize="20">
        {label}
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
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export default function MyPieChart() {
  return (
    <div className="hlwa">
      <ResponsivePie
        data={data}
        innerRadius={0.3}
        outerRadius={0.8}
        activeShape={renderActiveShape}
      />
    </div>
  );
}


// export default Test ;


