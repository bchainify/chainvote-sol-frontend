import * as solana from "@solana/web3.js"

export class Sol {
    conn: solana.Connection;
    version: solana.Version;
    constructor(connURL: string){
        this.conn = new solana.Connection(connURL, "recent");
        (async () =>{
            this.version = await this.conn.getVersion();
        })()
    }

    getProgramPublicKey(): solana.PublicKey{
        return new solana.PublicKey("8s9vbGThwWH5evk74tNwzCxEtWshyq3n2KYopaXrb1Sb")
    }
}

// export default new Sol("http://localhost:8899");
export default new Sol("https://testnet.solana.com");
