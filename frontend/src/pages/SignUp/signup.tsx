import { useState } from 'react'
import './signup.css'

export function Signup() {
    
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");

    return (
        <>
            <h1 className="text-3xl- font-bold mb-8 text-center">Sign Up</h1>
            <form className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items center justify-items-end">
                <label>Username</label>
                <input />
            </form>
        </>
    )
}