import {  MouseEvent, useRef, useState } from "react";
import CompoundSentenceGame from "../components/molecules/compoundSentences";
import { sentences } from "../data/sentences";

export function CompoundSentences() {
    const sentenceListRef=   useRef<HTMLDivElement>(null)
    const [sentence, sentenceSet] = useState("Select sentence, so you can practice compund sentences.")
    function openNext(e:MouseEvent<HTMLAnchorElement>) {
        if (!sentenceListRef || !sentenceListRef.current)
            return;
        sentenceListRef.current.querySelectorAll(".subElems").forEach(e => e.classList.remove("opened"));
        
        (e.target as HTMLAnchorElement).nextElementSibling?.classList.add("opened")
    }

    return <div>
        <div className="flex sentenceList gap" ref={sentenceListRef}>
            {sentences.filter(s => s.type == "FunBoy").map((s) => <div className="flex column"><a onClick={openNext} className="button">{s.name}</a><div className="subElems">{s.sentences.map((s, i) => <div onClick={() => sentenceSet(s)}>{i}</div>)}</div></div> )}
        </div>
    <CompoundSentenceGame sentence={sentence} key={sentence} />
    </div>

}