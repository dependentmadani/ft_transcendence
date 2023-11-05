import axios from "axios";
import { useState } from "react";
import { useShow } from "@/context/ShowFormContext";

export const PromptPassword = ({ chatData, setIsAllowed }: any) => {

    const [pass, setPass] = useState('')
    const [show, setShow] = useShow();



    const checPassword = async () => {
        if (pass.trim() !== '') {
            const isAllowd = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
            if (isAllowd !== true) {
                const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/pass/${chatData?._chat?.id}`, {
                'roomPass': pass,
                }, { withCredentials: true })
                if (res.data === true) {
                    await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/allow/${chatData?._chat?.id}/${chatData._mainUser.id}`, {
                    'allowed': true,
                    }, { withCredentials: true })
                    setIsAllowed(true)
                }
            }
            else {
                setIsAllowed(true)
            }

        }
    }

    return (
        <div className="overlay">
            <div className="form-container passwordForm">
                <h2 className="room-pass-name">room { chatData?._chat?.name } requires password to access!</h2>
                <div className="room-pass-form">
                    <input type="password" placeholder="Password" className="room-pass-input" onChange={(e) => setPass(e.target.value)} />
                    <span className="room-form-span" onClick={checPassword}>ok</span>
                    <span className="room-form-span" onClick={()=> {setShow('false')}}>cancel</span>
                </div>
            </div>
        </div>
    )
}
