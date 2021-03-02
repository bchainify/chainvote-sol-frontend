import { useState, useEffect } from "react";
import * as solana from "@solana/web3.js"
import bufferLayout from "buffer-layout"
import oneAccount from "./one.json"
import recAccount from "./rec.json"
import { Account, sendAndConfirmTransaction } from "@solana/web3.js";

const connURl = "https://testnet.solana.com" //https://localhost:8899
export default function Home() {

  const [state, setState] = useState()

  useEffect(() => {
    (async () => {
      const conn = new solana.Connection(connURl, 'recent')
      const version = await conn.getVersion()
      console.log(version, "-----")
      const pk = new solana.PublicKey("ADKegxzHrFsT3MKj84gSFqJNkSyYkbG9jVFhrZTs8r7J")
      const acct0 = new Account(recAccount)
      const bal = await conn.getBalance(pk, "recent")
      console.log(bal)
      const account = await conn.getAccountInfo(acct0.publicKey, "recent")
      const stored = Buffer.from(account.data)
      const numbGreet = bufferLayout.struct([
        bufferLayout.u32('numGreets'),
      ]);
      const counts = numbGreet.decode(stored)
      console.log("Number of times smart contract is called: ", counts.numGreets)

      const acct = new solana.Account(oneAccount)

      console.log(await conn.getBalance(acct.publicKey))
      console.log(acct.publicKey.toString())

      const instruction_data = Buffer.from([0])
      

      const instruction = new solana.TransactionInstruction({
        keys: [{pubkey: acct0.publicKey, isSigner: false, isWritable: true}],
        programId: pk,
        data: instruction_data,
      })


      const tx = new solana.Transaction().add(solana.SystemProgram.createAccount({
        fromPubkey: acct.publicKey,
        newAccountPubkey: acct0.publicKey,
        lamports: 10000000000000,
        space: numbGreet.span,
        programId: pk
      }))

      // await sendAndConfirmTransaction(conn, tx, [acct, acct0])

      console.log(acct0.publicKey.toString())

      const hash = await solana.sendAndConfirmTransaction(
        conn,
        new solana.Transaction().add(instruction),
        [acct],
        {
          commitment: 'singleGossip',
          preflightCommitment: 'singleGossip',
        },
      )

      console.log(hash.toString())

    })()
    
  })


  return (
    <div>
      Hello world
    </div>
  );
}
