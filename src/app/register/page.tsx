'use client'

import { sendRegister } from "@utils/user"
import Link from "next/link"
import { useState } from "react"

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const input = "bg-light rounded-xl overflow-hidden px-8 pt-2 pb-2 col-span-6 outline-none caret-orange-500"
    const inputParent = "grid grid-cols-8 w-full space-between space-x-4"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    async function handleRegister() {
        const err = await sendRegister({
            username: mail,
            password,
            firstName,
            lastName,
        })

        if (typeof err === 'string') {
            setError(err)
        }
    }

    return (
        <div className="w-full h-full grid place-items-center">
            {/* '2xs': '320px',
            'xs': '480px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1400px', */}
            <div className="bg-dark rounded-xl grid place-items-center gap-4 p-5 px-10">
                <h1 className="text-3xl font-semibold">Register</h1>
                {error ? <h1 className="text-md text-red-500">{error}</h1> : null}
                <div className={inputParent}>
                    <h1 className={inputText}>First name:</h1>
                    <input 
                        value={firstName} 
                        onChange={(event) => setFirstName(event.target.value)}
                        type="text" 
                        placeholder="First name" 
                        className={input} 
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Last name:</h1>
                    <input 
                        value={lastName} 
                        onChange={(event) => setLastName(event.target.value)}
                        type="text" 
                        placeholder="Last name" 
                        className={input} 
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Mail:</h1>
                    <input 
                        value={mail} 
                        onChange={(event) => setMail(event.target.value)}
                        type="email" 
                        placeholder="Mail" 
                        className={input}
                    />
                </div>
                <div className={inputParent}>
                    <div/>
                    <h1 className="text-red-500 text-center col-span-11">Password is currently disabled.</h1>
                    {/* <h1 className={inputText}>Password:</h1>
                    <input
                        value={password}
                        onChange={(e) => setPassword(event.target.value)}
                        type="password"
                        placeholder="Password"
                        className={input}
                    /> */}
                </div>
                <Link 
                    href={error.length ? '/register' : '/login'}
                    className="grid w-full pt-2 pb-2 bg-orange-500 rounded-xl" 
                    onClick={handleRegister}>
                    <h1 className="text-xl place-self-center">Create account</h1>
                </Link>
                <div className={inputParent} /> 
        </div>  
    </div>
    )
}
