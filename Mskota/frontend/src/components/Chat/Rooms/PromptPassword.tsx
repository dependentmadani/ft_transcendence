import axios from "axios";
import { useState } from "react";

export const PromptPassword = ({ setAllowing, openForm, chatData }: any) => {

    const [pass, setPass] = useState('')

    const checPassword = async () => {
        if (pass.trim() !== '') {
            const res = await axios.post(`http://localhost:8000/room/pass/${chatData?._chat?.chat?.id}`, {
                'roomPass': pass,
            }, { withCredentials: true })
            console.log('resss', res.data)
            if (res.data === true)
                setAllowing()
        }
    }

    return (
        <div className="overlay">
            <div className="form-container passwordForm">
                <h2>room { chatData?._chat?.chat?.roomName } requires password to access!</h2>
                <input placeholder="Password" onChange={(e) => setPass(e.target.value)} />
                <span onClick={checPassword}>ok</span>
                <span onClick={openForm}>cancel</span>
            </div>
        </div>
    )
}
