import React, { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { makeBlanks } from '../../lib/makeBlanks';
import { Droppable } from '../atoms/Droppable';
import { Draggable } from '../atoms/Draggable';
import useProgressStore from '../../lib/stores/progress';

const modulename = "SubordinatingConjunction"
const blank = "____"

export function SubordinatingConjunction({ sentence }: { sentence: string }) {
  const progress = useProgressStore()
  let { sentence: sentenceWithBlanks, blanks } = useMemo(() => makeBlanks(sentence), [sentence])
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (Object.values(userAnswers).length == blanks.length)
      setTimeout(checkAnswers, 10)
  }, [userAnswers])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over) {
      setUserAnswers(prev => ({
        ...prev,
        [over.id]: active.id as string
      }));
    }
  };

  const checkAnswers = () => {
    const checked = blanks.every((blank, index) => userAnswers[`blank-${index}`] === blank);
    progress.addOrUpdateProgress(modulename, sentence, "", 1, checked ? "completed" : "error")
    alert(checked ? 'Correct!' : 'Incorrect.');
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='fillInTheBlanks'>
        <h3>Fill in the blanks:</h3>
        <div>
          {sentenceWithBlanks.split(/(\{[0-9]\})/).map((part, index) => {
            const match = part.match(/\{([0-9])\}/);
            if (match) {
              const id = `blank-${match[1]}`;
              return (
                <Droppable key={index} id={id}>
                  {userAnswers[id] || blank}
                </Droppable>
              );
            }
            return part;
          })}
        </div>
        <h3>Words:</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {blanks.map((blank, index) => (
            <Draggable key={index} id={blank}>
              {blank}
            </Draggable>
          ))}
        </div>
        <button onClick={checkAnswers} style={{ marginTop: '20px' }}>Check Answers</button>
      </div>
    </DndContext>
  );
};

