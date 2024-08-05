import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  used: boolean;
}

interface DroppableProps {
  id: string;
  children: React.ReactNode; 
}

const Draggable: React.FC<DraggableProps> = ({ id, children , used }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    padding: '8px',
    margin: '4px',
    borderRadius:"4px",
    backgroundColor: 'lightblue',
    color:used?"#667":"#213547",
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children} 
    </div>
  );
};

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  const style = {
    padding: '16px',
    margin: '8px',
    minHeight: '50px',
    backgroundColor: 'lightgrey',
    display: 'flex',
    flexDirection: 'column'  ,
    gap: '8px'
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

interface CompoundSentenceGameProps {
  sentence: string;
}

const CompoundSentenceGame: React.FC<CompoundSentenceGameProps> = ({ sentence }) => {
  const [userSentences, setUserSentences] = useState<{ [key: string]: string }>({});
  const [conjunctions, setConjunctions] = useState<string[]>([]);
  const mainRef = useRef<HTMLDivElement >(null)

  const conjunctionList = ['and', 'but', 'or', 'nor', 'for', 'so', 'yet'];
  const regex = new RegExp(`\\b(${conjunctionList.join('|')})\\b`, 'gi');
  const parts = sentence.split(regex).filter(part => part.trim() !== '');

  const sentences = useMemo(()=> parts.filter((part, index) => index % 2 === 0).map(part => part.trim()).sort(()=>Math.random()-.5), [sentence])
  const cons = parts.filter((part, index) => index % 2 !== 0).map(part => part.trim());

    useEffect(()=>{
  if (conjunctions.length === 0) {
    setConjunctions(cons);
  }
},[])
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over) {
      let sentence = active.id as string;
      setUserSentences(prev => ({
        ...prev,
        [over.id]: sentence
      }));
    }
  };

  const checkOrder = () => {
    let combined = document.querySelector("#droppable").textContent
    if(false){
    const combined = conjunctions.reduce((acc, conj, index) => {
      const sentencePart = userSentences[`droppable-${index}`] || '';
      return acc + sentencePart + ' ' + conj + ' ';
    }, '').trim();}
    console.log("combined ", combined )
    console.log("sentence ",  sentence)
    return combined === sentence;
  };
 
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ padding: '20px' }}>
        <h3>Drag sentences near conjunctions:</h3>
        <div ref={mainRef} onDrop={() => { }} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {parts.map((part, index) => (                      
                          conjunctionList.includes(part) ? " "+part+" " :
                              <div key={index} > 
                                  <Droppable  id={`droppable-${index}`}  >
                                      {userSentences[`droppable-${index}`] || 'Drop here'}
                                  </Droppable>
                              </div>
                      
          ))}
        </div>
        <h3>Sentences:</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sentences.map((sentence, index) => (
            <Draggable key={index} id={sentence} used={Object.values(userSentences).includes(sentence)?true:false}>
              {sentence}
            </Draggable>
          ))}
        </div>
        <button onClick={() => alert(checkOrder() ? 'Correct Order!' : 'Incorrect Order.')}>Check Order</button>
      </div>
    </DndContext>
  );
};

export default CompoundSentenceGame;
