import { useEffect, useRef, useState } from "react";
import { tetris } from "../lib/game1";
import { TetrisGame } from "../lib/types";
let game: TetrisGame;
export function Room() {
  const gamePlace = useRef<HTMLDivElement>(null);
  const [score, scoreSet] = useState(0);
  function cb(data: { type: string; data: any }) {
    switch (data.type) {
      case "score":
        scoreSet(data.data);
    }
  }
  function createNewGame() {
    if (game) game.stopAll();
    if (gamePlace.current) {
      console.log("current var");
      gamePlace.current.innerHTML = "";
      game = tetris(gamePlace.current, cb);
    }
  }
  useEffect(() => {
    if (
      gamePlace.current &&
      !(gamePlace.current as HTMLElement).childNodes.length
    ) {
      createNewGame();
    }
  }, [gamePlace]);
  console.log(gamePlace, 12);
  return (
    <>
      <div>
        <h3>Score {score} </h3>
        <a onClick={createNewGame}>Restart</a>
      </div>
      <div ref={gamePlace} className="gamePlace" key={1}></div>
    </>
  );
}
