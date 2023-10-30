import axios from "axios";
import { useState } from "react";

export const PromptPassword = ({ openForm, chatData }: any) => {

    const [pass, setPass] = useState('')

    const checPassword = async () => {
        if (pass.trim() !== '') {
            const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
            const allwd = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
            if (allwd.data[0].allowed !== true) {
                const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/pass/${chatData?._chat?.chat?.id}`, {
                'roomPass': pass,
                }, { withCredentials: true })
                if (res.data === true) {
                    await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/allow/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, {
                    'allowed': true,
                    }, { withCredentials: true })
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
