import { Account } from '@solana/web3.js';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import sol from '../utils/sol';


const newUserAccount = new Account()
export function useUserAccount(){
    const router = useRouter();
    const {privateKey: _privateKey} = router.query
    const privateKey = _privateKey && _privateKey.toString()

    const [balance, setBalance] = useState("")
    const [userAccount, setUserAccount] = useState(newUserAccount)

    useEffect(() => {
        if(!privateKey)return;
        (async () => {
            const account = new Account(JSON.parse(privateKey))
            setUserAccount(account)
            const accountBalance = await sol.conn.getBalance(account.publicKey, "recent")
            setBalance(String(accountBalance))
        })()
    },[privateKey])
    return {privateKey, userAccount, balance}
}