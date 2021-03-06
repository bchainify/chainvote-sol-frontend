import Link from 'next/link'
import { useUserAccount } from "../hooks";


export default function User() {
    const {balance, privateKey, userAccount} = useUserAccount()

    return (
        <div className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6">
            Solana Testnet Account Address:
            <div><span className="text-xs">{userAccount&&userAccount.publicKey.toString()}</span></div>
            <div className="flex justify-between items-center w-full">
                <div className="w-24 h-24 bg-gray-500"></div>
                <div className="">Account Balance: {(Number(balance) / 1_000_000_000).toString()} SOL</div>
            </div>

            <div className="w-full mt-8">
            <img alt="" src="https://pics.freeicons.io/uploads/icons/png/19707786981580202135-512.png" width="120" height="120"/>
                <Link href={`/newvote?privateKey=${privateKey}`} as="new-vote">
                    <a className="inline-block w-full underline">Create a new proposal to vote.</a>
                </Link>
                <Link href={`/addvoters?privateKey=${privateKey}`} as="add-voters">
                    <a className="inline-block w-full mt-4 underline">Add voters on proposal.</a>
                </Link>
                <Link href={`/vote?privateKey=${privateKey}`} as="/vote">
                    <a className="inline-block w-full mt-4 underline">Vote on a proposal.</a>
                </Link>
                
                <Link href="/viewvote" as="/view-vote">
                    <a className="inline-block w-full mt-4 underline">View vote on a proposal.</a>
                </Link>
            </div>
        </div>
    )
}
