import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import bufferLayout from "buffer-layout"
import { handleChange } from "../handlers";
import sol from "../utils/sol";


const voteStruct = bufferLayout.struct([
    bufferLayout.u32("yes"),
    bufferLayout.u32("no"),
    bufferLayout.u8("is_initialized"),
    bufferLayout.u8("title",10),
])

export default function NewVote() {
    const [voteDataAddress, setVoteDataAddress] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const voteDataAccount = await sol.conn.getAccountInfo(new PublicKey(voteDataAddress))

        const storedData = Buffer.from(voteDataAccount.data)
        const vote = voteStruct.decode(storedData)

        console.log(vote)
        
    }

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit}>
            <input className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full" name="voteAccountData" type="text" placeholder="Vote account data address" value={voteDataAddress} onChange={handleChange(setVoteDataAddress)} />
            <button className="bg-gray-700 h-12 mt-4 w-full" type="submit">Get vote data</button>
        </form>
    )
}