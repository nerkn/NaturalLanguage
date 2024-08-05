import  { useState } from 'react';
import { DndContext,  DragEndEvent } from '@dnd-kit/core'; 
import { Droppable } from '../atoms/Droppable';
import { Draggable } from '../atoms/Draggable';
 


export function SelectOdd({questions }:{questions:string[][]})  {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);


  function CheckAnswers(index:number)   {
    return () => {      
      const isCorrect = (index ==3 )
      alert(isCorrect ? 'Correct!' : 'Incorrect.');
    }
  };
  function Question({ question }:{question:string[]}) {
    return question.map((qs, i) => [qs, i]).sort(()=>Math.random()-.5).map(q => <div className='button' onClick={CheckAnswers(q[1])}>{q[0]}</div>)
  }

  return ( 
      <div style={{ padding: '20px' }}>
        <h3>Select Odd Word</h3>
        <h3>Words:</h3>
        <div className='flex gap'>
          <Question question={questions[currentQuestion]} />
      </div>
      
        <button onClick={() => setCurrentQuestion((currentQuestion + 1) % questions.length)} style={{ marginTop: '20px' }}>Next Question</button>
      </div> 
  );
};
 
