'use client'

import { useState } from "react"

export default function Edit({ params }: { params: { item: string[] } }) {
    const [rejected, setRejected] = useState<Card[]>([])
    const [editing, setEditing] = useState<Card[]>([])
    const [accepted, setAccepted] = useState<Card[]>([])
    const item = params.item[0]

    function handleSubmit() {
        
    }

    return (
        <div className="w-full h-full rounded-xl overflow-auto gap-8 grid grid-rows-12">
            <div className="w-full grid grid-cols-4 gap-8 row-span-11">
                <div className="bg-red-800 rounded-xl p-4">
                    <h1>Rejected</h1>
                    <div>
                        {rejected.map((card: Card) => <div key={card.question}>
                            <h1>{card.question}</h1>
                            <h1>➡️</h1>
                        </div>)}
                    </div>
                </div>
                <div className="w-full h-full bg-red-200 col-span-2 rounded-xl p-4">
                    <h1>Editing</h1>
                    <div>
                        {editing.map((card: Card) => <div>
                            <h1>{card.question}</h1>
                            <div>
                                {card.alternatives.map((answer, index) => <div>
                                    <h1>{index + 1}</h1>
                                    <h1>{answer}</h1>
                                    {card.correct === index && <h1>Correct</h1>}
                                </div>)}
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className="w-full h-full bg-red-800 rounded-xl p-4">
                    <h1>Accepted</h1>
                    <div>
                        {accepted.map((card: Card) => <div>
                            <h1>{card.question}</h1>
                        </div>)}
                    </div>
                </div>
            </div>
            <div className="w-full h-full grid place-items-center">
                <button
                    onClick={handleSubmit}
                    className="h-full rounded-xl bg-gray-800 px-8 text-2xl"
                >
                    Publish changes
                </button>
            </div>
        </div>
    )
}