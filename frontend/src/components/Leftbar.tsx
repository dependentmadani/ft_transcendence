import { useEffect, useState } from "react"
import { Chats } from "./Chats"
import { Navebar } from "./Navebar"
import { Search } from "./Search"

// import { Messages } from "./Messages";



interface ChildComponentProps {
  onValueChange: (newValue: number) => -1;
}

// export const Leftbar = ({onValueChange}) => {
export  const Leftbar: React.FC<ChildComponentProps> = ({ onValueChange }) => {
  const [inputValue, setInputValue] = useState(-1);
  

  useEffect(() => {
    const handleInputChange = () => {
      setInputValue(1);
      onValueChange(1)
      // onValueChange(event.target.value); // Pass the value back to the parent
    };
    handleInputChange()
  }, [])

  

  return (
    <div className="sidebar">
        <Navebar />
        <Search />
        <Chats />
        {/* <Messages /> */}
    </div>
  )
}
