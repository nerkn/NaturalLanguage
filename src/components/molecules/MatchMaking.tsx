import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "../atoms/Draggable";
import { Droppable } from "../atoms/Droppable";
import { useEffect, useMemo, useState } from "react";
import { randomizeElems } from "../../lib/randomizeElems";

export function MatchMaking({ arr }: { arr: { left: string, right: string, extra: any }[] }) {
    const [answers, answersSet] = useState<string[]>(Array(10).fill(""))
    const [answersCorrect, answersCorrectSet] = useState<string[]>(Array(10).fill(""))
    //const randomizedAnswers = useMemo(() => randomizeElems(arr), [])
    const randomizedAnswers = randomizeElems(arr)
    useEffect(() => {
        answersCheck()
    }, [answers])
    function answersCheck() {
        if (answers.filter(Boolean).length == arr.length)
            answersCorrectSet(arr.map((a, i) => answers[i] == a.right ? "correct" : "false"))
    }
    function handleDragEnd(event: DragEndEvent) {
        const { over, active } = event;
        if (over) {
            let sentence = active.id as string;
            let placeholder = over.id as number
            let nanswers = answers.filter(a => a != sentence)
            nanswers[placeholder] = sentence
            answersSet(nanswers);
        }
    };
    console.log(arr, randomizedAnswers)
    return <DndContext onDragEnd={handleDragEnd}>
        <div className="flex column " >
            {arr.map((a, i) => <div className={"flex flexChildGrow " + answersCorrect[i]}>
                <div className="leftSide"> {a.left}</div>
                <Droppable id={i + ""} >{answers[i] ?? ""}</Droppable>
            </div>)}
        </div>
        <div className="flex column">
            <>{randomizedAnswers.map((a) => answers.includes(a.right) ? <></> : <Draggable id={a.right} >{a.right}</Draggable>)}</>
            {answers.filter(Boolean).map((a) => <Draggable id={a}>{a}</Draggable>)}
        </div>
    </DndContext>


}