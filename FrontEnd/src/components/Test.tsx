import { ResponsivePie } from '@nivo/pie'
import '../css/pie.css'


const data = [
  {
    "id": "Ties",
    "label": "Ties",
    "value": 2,
    "color": "#0088FE"
  },
  {
    "id": "Wins",
    "label": "Wins",
    "value": 13,
    "color": "#00C49F"
  },
  {
    "id": "Loses",
    "label": "Loses",
    "value": 9,
    "color": "#FF8042"
  }]


  const CenterMetric = ({ data }) => {
    // Calculate the total sum of values
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    console.log(total)
    return (
      <div className='kik'>
        <div>Total: {total}</div>
      </div>
    );
  };
  

function Test() {

return (
  <div className='dlaha'>

      <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            padAngle={0.5}
            startAngle={34}
            sortByValue={true}
            innerRadius={0.65}
            cornerRadius={1}
            activeInnerRadiusOffset={5}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            // arcLinkLabel={e=>e.id+" ("+ (e.value * 100) +")"}
            // arcLinkLabel={(e) => `${(e.value * 100).toLocaleString(undefined, { style: 'percent' })}`}
            arcLinkLabelsTextColor="#ffffff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
            >
            {/* Add your custom layer */}
          </ResponsivePie>
          <CenterMetric data={data} />

  </div>
  )

}


export { Test };