import { useState } from "react";
import { Chats } from "./Chats/Chats";
import { Search } from './Search/Search';


export  const Leftbar = ({ onValueChange, chatData }: any) => {

  const categories = ["Your Chats", "Available Rooms"];
  const [category, setCategory] = useState("Your Chats");


  function ButtonCategoryStyle({title, onClick}) {
    return <button className="button-chat-onclick" onClick={onClick}>
      {title}
    </button>
  }

  return (
    <div id='leftSideBar' className="leftSidebar">
          <Search onValueChange={onValueChange} chatData={ chatData } />
          <div>
            <div className="contact-types">
              <button className="button-chat-onclick" onClick={() => setCategory("Your Chats")}>Your Chats</button>
              <button className="button-chat-onclick" onClick={() => setCategory("Available Rooms")}>Available Rooms</button>
            </div>
            { category === "Your Chats" && <Chats category={category} onValueChange={onValueChange} chatData={ chatData } />}
            { category === "Available Rooms" && <Chats category={category} onValueChange={onValueChange} chatData={ chatData }/> }
          </div>
    </div>
  )
}
