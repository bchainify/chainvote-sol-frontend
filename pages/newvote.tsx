import { Account, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { handleChange } from "../handlers";
import { useUserAccount } from "../hooks";
import sol from "../utils/sol";
import Link from 'next/link'
import React from "react";

const instructionData = Buffer.from([0]) // zero for new vote
export default function NewVote() {
    const {userAccount} = useUserAccount()
    const [voteTitle, setVoteTitle] = useState("")

    console.log(userAccount&&userAccount.publicKey.toString())

    const handleSubmit = async (e) => {
        e.preventDefault()
        const accountDataNumberOfBytes = 19
        const rentExempt = await sol.conn.getMinimumBalanceForRentExemption(accountDataNumberOfBytes)

        console.log("Rent exemption balance", rentExempt)
        const voteDataAccount = new Account()
        console.log("voteDataAccount", voteDataAccount.publicKey.toString(), voteDataAccount.secretKey.toString())
        const progPublicKey = sol.getProgramPublicKey()
        const sysAcctHash = await sendAndConfirmTransaction(
            sol.conn,
            new Transaction().add(SystemProgram.createAccount({
                fromPubkey: userAccount.publicKey,
                newAccountPubkey: voteDataAccount.publicKey,
                lamports: rentExempt,
                space: accountDataNumberOfBytes,
                programId: progPublicKey,

            })),
            [userAccount, voteDataAccount],
        )

        console.log({sysAcctHash})

        const instruction = new TransactionInstruction({
            keys: [{pubkey: voteDataAccount.publicKey, isSigner: false, isWritable: true,}],
            programId: progPublicKey,
            data: Buffer.concat([instructionData, Buffer.from(voteTitle, "utf-8")])
        })

        const tx = await sendAndConfirmTransaction(
            sol.conn,
            new Transaction().add(instruction),
            [userAccount]
        )
        console.log("Vote created", tx)
        
     }

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit}>
            <input className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full" name="voteTitle" minLength={5} maxLength={10} type="text" placeholder="Vote title" value={voteTitle} onChange={handleChange(setVoteTitle)} />
            <button className="bg-gray-700 h-12 mt-4 w-full" type="submit">Create a new proposal to vote.</button>
            <br/><br/>
            Note: Create once and <br/>
            <Link href="https://explorer.solana.com/address/8s9vbGThwWH5evk74tNwzCxEtWshyq3n2KYopaXrb1Sb?cluster=testnet"><a className="inline-block w-full mt-4 underline">Explore Transaction History on Solana Testnet</a></Link>
           <Link href="/user" as="/user">
                    <a className="inline-block w-full mt-4 underline">Back to User Menu</a>
            </Link>
     </form>
    )
}