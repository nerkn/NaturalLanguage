import Matter from "matter-js";

export type TetrisGame = {
  engine: Matter.Engine;
  runner: Matter.Runner;
  render: Matter.Render;
  canvas: HTMLCanvasElement;
  stopAll: () => void;
};
export type TShape = "l" | "mirrorl" | "T" | "box" | "stick" | "z" | "s";
export type TButton = "left" | "right" | "rleft" | "rright";
export const ShapeDefs: Record<TShape, string> = {
  l: "0,0,1,0,1,1,1,2",
  mirrorl: "0,0,1,0,0,1,0,2",
  T: "0,0,0,1,0,2,1,1",
  box: "0,0,0,1,1,0,1,1",
  stick: "0,0,0,1,0,2,0,3",
  z: "0,0,0,1,1,1,1,2",
  s: "0,1,0,2,1,0,1,1",
};
export const ShapeColors: Record<TShape, string> = {
  l: "D9EDBF",
  mirrorl: "FFB996",
  T: "FFCF81",
  box: "FDFFAB",
  stick: "E6A4B4",
  z: "7BD3EA",
  s: "99B080",
};
export type EventClick = {
  offsetX: number;
  offsetY: number;
  target: HTMLElement & { width: number };
};
export type EventTouch = {
  target: HTMLElement & { width: number };
  touches: { clientX: number; clientY: number }[];
};

export interface DraggableProps {
  id: string;
  children: React.ReactNode;
  used?: boolean;
}

export interface DroppableProps {
  id: string;
  children: React.ReactNode;
}
export type DialogOption = {
  id: number;
  person: string;
  msg: string;
  options: number[];
};

type Meaning = [string, string, string[], string[]];

export interface DictionaryEntry {
  MEANINGS: Meaning[];
  ANTONYMS: string[];
  SYNONYMS: string[];
}

/*
"ABACK": {"MEANINGS": [
  [
    "Adverb", 
    "having the wind against the forward side of the sails", 
    [], 
    ["the ship came up into the wind with all yards aback"]
], [
  "Adverb", 
  "by surprise", 
  [], 
  ["taken aback by the caustic remarks"]
]
], 
"ANTONYMS": [], 
"SYNONYMS": ["Aback"]},
*/