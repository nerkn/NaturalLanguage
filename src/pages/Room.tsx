import { useEffect, useRef, useState } from "react";
import { tetris } from "../lib/game1";
import { TetrisGame } from "../lib/types";
import { useDialog } from "../lib/dialog";
let game: TetrisGame;
export function Room() {
  const gamePlace = useRef<HTMLDivElement>(null);
  const { open, close, DialogElem } = useDialog();
  const [score, scoreSet] = useState(0);
  function cb(type: string, data: any) {
    switch (type) {
      case "score":
        scoreSet(data);
        break;
      case "endGame":
        scoreSet(data);
        open();
    }
  }
  function createNewGame() {
    if (game) game.stopAll();
    if (gamePlace.current) {
      console.log("current var");
      gamePlace.current.innerHTML = "";
      game = tetris(gamePlace.current, cb);
    }
    close();
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
      <div ref={gamePlace} className="gamePlace" key={1}></div>
      <DialogElem>
        <h2>Game ended</h2>
        You've got <b>{score}</b>
        <a onClick={createNewGame} className="button">
          Restart
        </a>
      </DialogElem>
    </>
  );
}
