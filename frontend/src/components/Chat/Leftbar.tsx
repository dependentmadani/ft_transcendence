import { useState } from "react";
import { Chats } from "./Chats/Chats";
import { Search } from './Search/Search';


export  const Leftbar = ({ onValueChange, chatData }: any) => {

  const categories = ["Your Chats", "Available Rooms"];
  const [category, setCategory] = useState("Your Chats");


  function ButtonCategoryStyle({title, id, onClick}) {
    return <button className="button-chat-onclick" id={id} onClick={onClick}>
      {title}
    </button>
  }

  return (
    <div id='leftSideBar' className="leftSidebar">
          <Search onValueChange={onValueChange} chatData={ chatData } />
          <div>
            <div>
              {
                categories.map((cat, index) => {
                  return <ButtonCategoryStyle id={index} title={cat} onClick={() => setCategory(cat)} />
                })
              }
            </div>
            { category === "Your Chats" && <Chats category={category} onValueChange={onValueChange} chatData={ chatData } />}
            { category === "Available Rooms" && <Chats category={category} onValueChange={onValueChange} chatData={ chatData }/> }
          </div>
    </div>
  )
}
