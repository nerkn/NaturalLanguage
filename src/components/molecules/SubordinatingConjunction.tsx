import React, { useMemo, useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { makeBlanks } from '../../lib/makeBlanks';
import { DraggableProps, DroppableProps } from '../../lib/types';

const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
  };

  return (
    <div ref={setNodeRef} style={style} className='Words' {...listeners} {...attributes}>
      {children}
    </div>
  );
};


const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id }); 

  return (
    <div ref={setNodeRef} className="Blanks">
      {children}
    </div>
  );
};

export function SubordinatingConjunction ({ sentence }: { sentence: string  })  {
  let {sentence: sentenceWithBlanks, blanks }= useMemo(()=> makeBlanks(sentence), [sentence])
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

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
    const correctAnswers = blanks.every((blank, index) => userAnswers[`blank-${index}`] === blank);
    alert(correctAnswers ? 'Correct!' : 'Incorrect.');
  };
  console.log(sentence)
  console.log(sentenceWithBlanks)
  console.log(blanks)
  
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
                  {userAnswers[id] || '____'}
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
 
