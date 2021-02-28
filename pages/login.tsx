import { Account } from "@solana/web3.js";
import { useState } from "react";
import { useRouter } from 'next/router'
import { handleChange } from "../handlers";

const testKey = "[222,120,47,151,153,141,96,25,28,165,89,178,22,162,168,117,240,136,70,222,156,69,181,66,37,87,150,132,63,195,246,205,212,211,223,156,107,119,90,23,120,182,250,200,87,154,149,25,31,209,157,112,220,102,108,117,54,196,239,188,137,93,141,111]"

const handleSubmit = (state: any, router: any) => (e: any) => {
    
    e.preventDefault();
    try {
        const {privateKey} = state
        const key = JSON.parse(privateKey)
        const account = new Account(key)
        console.log(account.publicKey.toString())
        router.push({
            pathname: "/user",
            query: {privateKey}
        }, "/user")

    } catch (error) {
        
    }
}
export default function Login() {
    const router = useRouter();
    const [privateKey, setPrivateKey] = useState(testKey)

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit({privateKey}, router)}>
            <input className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full" name="privKey" type="text" placeholder="Private key" value={privateKey} onChange={handleChange(setPrivateKey)} />
            <button className="bg-gray-700 h-12 mt-4 w-full" type="submit">Login</button>
        </form>
    )
}
