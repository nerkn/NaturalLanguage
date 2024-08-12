import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Droppable } from '../atoms/Droppable';
import { Draggable } from '../atoms/Draggable';
import useProgressStore from '../../lib/stores/progress';

let dropHere = "Drop Here"
let modulename = "CompoundSentence";

const CompoundSentenceGame: React.FC<{ sentence: string }> = ({ sentence }) => {
  const [userSentences, setUserSentences] = useState<{ [key: string]: string }>({});
  const [conjunctions, setConjunctions] = useState<string[]>([]);
  const mainRef = useRef<HTMLDivElement>(null)
  const progress = useProgressStore()

  const conjunctionList = ['and', 'but', 'or', 'nor', 'for', 'so', 'yet'];
  const regex = new RegExp(`\\b(${conjunctionList.join('|')})\\b`, 'gi');
  const parts = sentence.split(regex).filter(part => part.trim() !== '');

  const sentences = useMemo(() => parts.filter((part, index) => !conjunctionList.includes(part)).map(part => part.trim()).sort(() => Math.random() - .5), [sentence])
  const cons = parts.filter((part, index) => conjunctionList.includes(part)).map(part => part.trim());

  useEffect(() => {
    if (conjunctions.length === 0) {
      setConjunctions(cons);
    }
  }, [])

  useEffect(() => {
    if (Object.values(userSentences).length == parts.reduce((acc, curr) => acc += conjunctionList.includes(curr) ? 0 : 1, 0))
      setTimeout(checkOrder, 10)
  }, [userSentences])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over) {
      let sentence = active.id as string;
      let newus = ({
        ...userSentences,
        [over.id]: sentence
      })
      setUserSentences(newus);
    }
  };

  const checkOrder = () => {
    let combined = document.querySelector("#droppable")?.textContent
    let checked = (combined === sentence)
    progress.addOrUpdateProgress(modulename, sentence, "", 1, checked ? "completed" : "error")
    return alert(checked ? 'Correct Order!' : 'Incorrect Order.')
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ padding: '20px' }}>
        <h3>Drag sentences near conjunctions:</h3>
        {progress.getProgress(modulename, sentence, "").map(p => p.favorites.map(pf => pf))}
        <div ref={mainRef} id="droppable" onDrop={() => { }} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {parts.map((part, index) => (
            conjunctionList.includes(part) ? " " + part + " " :
              <div key={index}>
                <Droppable id={`droppable-${index}`}  >
                  {userSentences[`droppable-${index}`] || dropHere}
                </Droppable>
              </div>

          ))}
        </div>
        <h3>Sentences:</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sentences.map((sentence, index) => (
            <Draggable key={index} id={sentence} used={Object.values(userSentences).includes(sentence) ? true : false}>
              {sentence}
            </Draggable>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default CompoundSentenceGame;
