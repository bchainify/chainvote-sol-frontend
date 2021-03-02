import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import bufferLayout from "buffer-layout"
import { handleChange } from "../handlers";
import sol from "../utils/sol";
import Link from 'next/link'

const voteStruct = bufferLayout.struct([
    bufferLayout.u32("yes"),
    bufferLayout.u32("no"),
    bufferLayout.u8("is_initialized"),
    bufferLayout.u8("title",10),
])

export default function NewVote() {
    const [voteDataAddress, setVoteDataAddress] = useState("")

    const [vote, setVote] = useState({is_initialized: false, no: 0, yes: 0})
    const [title, setTitle] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const voteDataAccount = await sol.conn.getAccountInfo(new PublicKey(voteDataAddress))

        const storedData = Buffer.from(voteDataAccount.data)
        const title = storedData.slice(9)
        setTitle(title.toString())
        const vote = voteStruct.decode(storedData)
        setVote({...vote, is_initialized: vote.is_initialized === 1})
        console.log({vote, title})
        
    }

    console.log(title)

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit}>
            <input className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full" name="voteAccountData" type="text" placeholder="Vote account data address" value={voteDataAddress} onChange={handleChange(setVoteDataAddress)} />
            {vote.is_initialized &&
                <div>
                    Vote title: {`${title ? title : "Should we support crypto?"}`}
                    <div className="mt-2">
                        {vote.yes} voted Yes while {vote.no} voted No
                    </div>
                </div>
            }
            <button className="bg-gray-700 h-12 mt-4 w-full" type="submit">Get vote data</button>
            <br/><br/>
            <Link href="https://explorer.solana.com/address/8s9vbGThwWH5evk74tNwzCxEtWshyq3n2KYopaXrb1Sb?cluster=testnet"><a className="inline-block w-full mt-4 underline">Explore Transaction History on Solana Testnet</a></Link>
            <Link href="/user" as="/user">
                    <a className="inline-block w-full mt-4 underline">Back to User Menu</a>
            </Link>
        </form>
    )
}