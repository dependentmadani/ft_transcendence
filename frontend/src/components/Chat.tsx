import Add from '../img/add.png'
import More from '../img/more.png'
import { Input } from './Input'
import { Messages } from './Messages'

export const Chat = () => {
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>Hamid</span>
        <div className="chatIcons">
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}
