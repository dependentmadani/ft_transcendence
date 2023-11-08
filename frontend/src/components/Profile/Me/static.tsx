import MyPieChart from '@/components/Profile/PieChart/pieChart'


function Statistic(props:any) {

    return (
        <div className='statistic'>
            <div id='title' >
                <span>Statistic </span>
            </div>
            <div id='chart'>
                {props.gameData.gamesPlayed ? <MyPieChart gameData={props.gameData} />  : <span className='no-users'> No Games ... </span>}
            </div>
        </div>
    )
}

export default Statistic;