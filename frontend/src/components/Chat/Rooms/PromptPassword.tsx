import axios from "axios";
import { useState } from "react";

export const PromptPassword = ({ setAllowing, openForm, chatData }: any) => {

    const [pass, setPass] = useState('')

    const checPassword = async () => {
        if (pass.trim() !== '') {
            const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
            const allwd = await axios.get(`http://localhost:8000/roomUsers/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
            if (al) {
                const res = await axios.post(`http://localhost:8000/room/pass/${chatData?._chat?.chat?.id}`, {
                'roomPass': pass,
                }, { withCredentials: true })
                console.log('resss', res.data)
                if (res.data === true) {
                    await axios.put(`http://localhost:8000/roomUsers/allow/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, {
                    'allowed': true,
                    }, { withCredentials: true })
                    setAllowing()
                }
            }
        }
    }

    return (
        <div className="overlay">
            <div className="form-container passwordForm">
                <h2 className="room-pass-name">room { chatData?._chat?.chat?.roomName } requires password to access!</h2>
                <div className="room-pass-form">
                    <input type="password" placeholder="Password" className="room-pass-input" onChange={(e) => setPass(e.target.value)} />
                    <span className="room-form-span" onClick={checPassword}>ok</span>
                    <span className="room-form-span" onClick={openForm}>cancel</span>
                </div>
            </div>
        </div>
    )
}
