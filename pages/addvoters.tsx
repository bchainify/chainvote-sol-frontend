import { Account, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { handleChange } from "../handlers";
import { useUserAccount } from "../hooks";
import sol from "../utils/sol";

const voterAccount = new Account()
const instructionData = Buffer.from([1])
export default function NewVote() {
    const {userAccount} = useUserAccount()
    const [voteDataAddress, setVoteDataAddress] = useState("88yU4rxzYhsmSTcb4tbSdAVGLmwaR7PQoNhRnpa8rNDX")
    console.log(voterAccount.secretKey.toString())
    const [voterAddress, setVoterAddress] = useState(voterAccount.publicKey.toString())
    console.log({voterAddress})
    const handleSubmit = async (e) => {
        e.preventDefault()

        const seed = voteDataAddress.substring(30)
        console.log(seed)
        const voterDataAccountKey = await PublicKey.createWithSeed(voterAccount.publicKey, seed, sol.getProgramPublicKey())
        console.log("voterDataAccount", voterDataAccountKey.toString())

        const numBytes = 2
        const rentExempt = await sol.conn.getMinimumBalanceForRentExemption(numBytes)

        // await sol.conn.requestAirdrop(voterAccount.publicKey, 100_000_000)

        let createTransaction = new Transaction().add( SystemProgram.createAccountWithSeed({
            fromPubkey: voterAccount.publicKey,       // payer
            lamports: rentExempt,                // funds to deposit on the new account
            space: 2,                        // space required in bytes

            basePubkey: userAccount.publicKey,       // derive from... must be signer
            seed,                                   // derive from...
            programId: sol.getProgramPublicKey(),                 // derive from... and will be owner of account

            newAccountPubkey: voterDataAccountKey,
        }))

        const voterDataTx = await sendAndConfirmTransaction(
            sol.conn,
            createTransaction,
            [userAccount]
        )

        console.log({voterDataTx})

        // const instruction = new TransactionInstruction({
        //     keys: [
        //         {pubkey: new PublicKey(voteDataAddress), isSigner: false, isWritable: true}, // vote data
        //         {pubkey: userAccount.publicKey, isSigner: true, isWritable: false}, // vote creator
        //         {pubkey: new PublicKey(voterAddress), isSigner: false, isWritable: false}, // new voter
        //         {pubkey: voterDataAccountKey, isSigner: false, isWritable: true}, // voter data
        //     ],
        //     programId: sol.getProgramPublicKey(),
        //     data: instructionData
        // })

        // const tx = await sendAndConfirmTransaction(
        //     sol.conn,
        //     new Transaction().add(instruction),
        //     [userAccount,]
        // )
        // console.log("Vote created", tx)

    }


    

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit}>
            <input
                className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full"
                name="voteAccountData"
                type="text"
                placeholder="Vote account data address"
                value={voteDataAddress}
                onChange={handleChange(setVoteDataAddress)}
            />
            <input
                className=" outline-none focus:outline-none h-10 text-lg pl-2 w-full"
                name="voteAccountData"
                type="text"
                placeholder="Vote account data address"
                value={voterAddress}
                onChange={handleChange(setVoterAddress)}
            />
            <button className="bg-gray-700 h-12 mt-4 w-full" type="submit">Add a new Voter</button>
        </form>
    )
}
