import { useMemo, useState } from 'react';
import { Dictionary } from '../atoms/Dictionary';

export function SelectOdd({ questions }: { questions: string[][] }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [word, wordSet] = useState("");
  const [answered, answeredSet] = useState(false);
  const words = useMemo(() => questions[currentQuestion].map((qs, i) => [qs, i]).sort(() => Math.random() - .5), [currentQuestion]) as [string, number][]

  function CheckAnswers(index: number) {
    return () => {
      const isCorrect = (index == 3)
      answeredSet(true)
      alert(isCorrect ? 'Correct!' : 'Incorrect.');
    }
  };
  function Question() {
    return words.map((q, i) => <div className={'button v' + i} onMouseEnter={() => wordSet(q[0])} onClick={CheckAnswers(q[1])}>{q[0]}</div>)
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h3>Select Odd Word</h3>
        <h3>Words:</h3>
        <div className='flex gap'>
          <Question />
        </div>

        <button onClick={() => {
          setCurrentQuestion((currentQuestion + 1) % questions.length);
          answeredSet(false)
        }} style={{ marginTop: '20px' }}>Next Question</button>
        {answered ? <div>
          <Dictionary word={word} />
        </div> : <></>}
      </div>
    </>
  );
};

