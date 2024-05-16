'use client'

import { sendRegister } from "@/utils/user"
import Link from "next/link"
import { useState } from "react"

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
    const inputParent = "grid grid-cols-8 w-full h-full space-between"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
                <h1 className=" text-3xl font-semibold">Register</h1>
                <div className={inputParent}>
                    <h1 className={inputText}>First name:</h1>
                    <input 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        type="text" 
                        placeholder="First name" 
                        className={input} 
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Last name:</h1>
                    <input 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        type="text" 
                        placeholder="Last name" 
                        className={input} 
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Mail:</h1>
                    <input 
                        value={mail} 
                        onChange={(e) => setMail(e.target.value)} 
                        type="email" 
                        placeholder="Mail" 
                        className={input}
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Password:</h1>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className={input}
                    />
                </div>
                <Link 
                    href={!error ? '/' : '/register'}
                    className="grid w-full h-full bg-orange-500 rounded-xl" 
                    onClick={() => sendRegister({
                        username: mail,
                        password,
                        firstName,
                        lastName,
                    })}>
                    <h1 className="text-2xl place-self-center">Create account</h1>
                </Link>
                <div className={inputParent} /> 
        </div>  
    </div>
    )
}