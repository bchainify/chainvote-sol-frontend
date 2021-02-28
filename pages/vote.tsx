import { useState } from "react";
import { handleChange } from "../handlers";


const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("submit")
}
export default function NewVote() {
    const [state, setState] = useState({})
    const [voteTitle, setVoteTitle] = useState("")

    return (
        <form className="bg-gray-400 shadow-md m-auto mt-64 w-360 p-6" onSubmit={handleSubmit}>
            <div>Vote title: Should we support crypto</div>
            <div className="flex justify-between mt-8">
                <button className="bg-green-400 h-12 mt-4 w-20" type="submit">Yes</button>
                <button className=" bg-red-400 h-12 mt-4 w-20" type="submit">No</button>
            </div>
        </form>
    )
}