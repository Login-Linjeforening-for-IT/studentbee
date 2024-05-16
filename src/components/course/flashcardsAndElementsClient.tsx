'use client'

import { useState } from "react";
import Elements from "../root/elements";
import Flashcards from "../root/flashcards";

export default function FlashcardsAndElementsClient({id}: {id: string}) {
    const [current, setCurrent] = useState(0)

    return (
        <>
            <Flashcards id={id} current={current} setCurrent={setCurrent} />
            <Elements id={id} current={current} />
        </>
    )
}