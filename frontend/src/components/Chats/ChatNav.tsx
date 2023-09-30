import React from "react";
import '../../style.scss';

interface ChatNavProps {
  onValueClick: (val: number) => void;
}

export const ChatNav: React.FC<ChatNavProps> = ({ onValueClick }) => {
  return (
    <div className="ChatNavbar">
      <ul className="navbar-ul">
        <li id='navbar-li' onClick={() => onValueClick(1)}>
          <span>1</span>
        </li>
        <li id='navbar-li' onClick={() => onValueClick(2)}>
          <span>2</span>
        </li>
        <li id='navbar-li' onClick={() => onValueClick(3)}>
          <span>3</span>
        </li>
      </ul>
    </div>
  );
};
