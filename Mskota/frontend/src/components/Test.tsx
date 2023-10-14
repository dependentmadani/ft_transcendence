import { useEffect, useState } from "react";
import { useClient } from "../client/clientContext"




const Test = () => {

  const [kfta, setKfta] = useState(false);
  const {client, updateClient} =  useClient();

  console.log('--- holla ---');
  useEffect (() => {
    console.log('hlwa')
    updateClient({...client, id: client.id + 10})
    console.log(client)
  }, [kfta]) 

  // useEffect(() => {

  //   console.log(client)
  // }, [client])

  const handlePlus = () => {
    updateClient({...client, id: client.id + 1})
  }
  
  const handleMinus = () => {
    
    updateClient({...client, id: client.id - 1})
  }

  const handleHlwa = () => {
    setKfta(!kfta)
  }

return <>
    {/* <button onClick={handlePlus}>+</button>
    <button onClick={handleMinus}>-</button> */}
    <button onClick={handleHlwa}>hlwa</button>
  </>
}

export default Test