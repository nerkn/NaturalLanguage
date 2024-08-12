import { useState } from "react";
import dic from "../../data/merged.json";
import { DictionaryEntry } from "../../lib/types";



export function Dictionary({ word }: { word: string }) {
    const [other, otherSet] = useState("")
    let def = (dic as Record<string, DictionaryEntry>)[word.toUpperCase()]
    if (!def)
        return <div className="dic">
            <div>{word}</div>
            <div>Select word to look definition</div>
        </div>
    console.log("def", def)
    return <div className="dic">
        <h3>{word}</h3>
        <div>{def.MEANINGS.map(dm => <div className="flex gap">
            <div><i>{dm[0]}</i></div>
            <div>{dm[1]}
                <div> {dm[3].map((s, i) => <div><>{i + 1}</> {s}</div>)}</div>
            </div>
        </div>)}</div>
        <div>
            {def.SYNONYMS.map(dm => <div onMouseEnter={() => otherSet(dm)}>{dm}</div>)}
            {def.ANTONYMS.map(dm => <div onMouseEnter={() => otherSet(dm)}>{dm}</div>)}
        </div>
        <div>
            {other ? <Dictionary word={other} /> : <></>}</div>
    </div>

}