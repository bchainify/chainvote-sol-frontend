import { PublicKey, sendAndConfirmTransaction, Transaction, TransactionInstruction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { handleChange } from "../handlers";
import { useUserAccount } from "../hooks";
import sol from "../utils/sol";
import bufferLayout from "buffer-layout"
import Link from 'next/link'

let defaultVoterData: PublicKey

const voterStruct = bufferLayout.struct([
    bufferLayout.u8("is_initialized"),
    bufferLayout.u8("has_voted"),
])
export default function NewVote() {
    const {userAccount} = useUserAccount()
    const [voteDataAddress, setVoteDataAddress] = useState("88yU4rxzYhsmSTcb4tbSdAVGLmwaR7PQoNhRnpa8rNDX")
    const [voterDataAddress, setVoterDataAddress] = useState(defaultVoterData)
    const [voterVoteInfo, setVoterVoteInfo] = useState({is_initialized:false, has_voted: false})
    const [counter, setCounter] = useState(0)

    useEffect(() =>{
        if(!userAccount)return
        (async () => {
            const seed = voteDataAddress.substring(30)
            const voterDataAccountKey = await PublicKey.createWithSeed(userAccount.publicKey, seed, sol.getProgramPublicKey())
            setVoterDataAddress(voterDataAccountKey)
            console.log("+++",voterDataAccountKey.toString())
            const voterVoteInfo = await sol.conn.getAccountInfo(voterDataAccountKey)
            if(!voterVoteInfo)return
            const storedData = Buffer.from(voterVoteInfo.data)
            const _voterInfo = voterStruct.decode(storedData)
            const voteInfo = {is_initialized: _voterInfo.is_initialized === 1, has_voted: _voterInfo.has_voted === 1}
            setVoterVoteInfo(voteInfo)

        })()
    },[userAccount, voteDataAddress, counter])

    const handleSubmit = (name) => async(e: any) => {
        e.preventDefault();
        console.log(name)
        const instructionData = name === "yes" ? Buffer.from([2,1]) : Buffer.from([2,0])
        const instruction = new TransactionInstruction({
            keys: [
                {pubkey: new PublicKey(voteDataAddress), isSigner: false, isWritable: true}, // vote data
                {pubkey: userAccount.publicKey, isSigner: true, isWritable: false}, // vote creator
                {pubkey: voterDataAddress, isSigner: false, isWritable: true}, // new voter
            ],
            programId: sol.getProgramPublicKey(),
            data: instructionData
        })

        const tx = await sendAndConfirmTransaction(
            sol.conn,
            new Transaction().add(instruction),
            [userAccount]
        )
        console.log("Vote created", tx)
        setCounter(prevState => ++prevState)
    }

    console.log({voterVoteInfo, counter})

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={(e) => e.preventDefault()}>
            <div>Topic: Vote topic?</div>
            <div className="mt-2">Can vote: {voterVoteInfo.is_initialized ? "Yes" : "No"}; Has voted: {voterVoteInfo.has_voted ? "yes":"No"};</div>
            <input
                className=" outline-none focus:outline-none h-10 mt-2 text-lg pl-2 w-full"
                name="voteAccountData"
                type="text"
                placeholder="Vote account data address"
                value={voteDataAddress}
                onChange={handleChange(setVoteDataAddress)}
            />
            <div className="flex justify-between mt-8">
                <button className="bg-green-400 h-12 mt-4 w-20" onClick={handleSubmit("yes")} name="yes" type="submit">Yes</button>
                <button className=" bg-red-400 h-12 mt-4 w-20"  onClick={handleSubmit("no")} name="no" type="submit">No</button>
            </div>
            <br/><br/>
            Note: Vote once and <br/>
            <Link href="https://explorer.solana.com/address/8s9vbGThwWH5evk74tNwzCxEtWshyq3n2KYopaXrb1Sb?cluster=testnet"><a className="inline-block w-full mt-4 underline">Explore Transaction History on Solana Testnet</a></Link>
           <Link href="/user" as="/user">
                    <a className="inline-block w-full mt-4 underline">Back to User Menu</a>
            </Link>
        </form>
    )
}