import { Message } from "./Message"

interface Message {}

export const Messages = ({ messages }: any) => {

  console.log(messages)
  return (
    <div className="messages">
      {
        messages?.map((message: any, index:number) => (
          <Message key={ index } currentMessage={ message } />
        ))
      }
    </div>
  )
}
