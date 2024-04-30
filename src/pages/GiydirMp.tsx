import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
let faceLandmarker;
import { fromTriangles } from "transformation-matrix";

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "@mediapipe/tasks-vision/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode: "IMAGE",
    numFaces: 1,
  });
}

export function GiydirMp() {
  const sourceVidRef = useRef<HTMLVideoElement>(null);
  const sourceCanRef = useRef<HTMLCanvasElement>(null);
  const targetImgRef = useRef<HTMLImageElement>(null);
  const targetCanRef = useRef<HTMLCanvasElement>(null);
  const canvasTemp = useRef<HTMLCanvasElement>(null);
  let [si, siSet] = useState(0);
  function clearSi(newSi: number) {
    if (si) clearInterval(si);
    siSet(newSi);
  }
  function onPlay() {}
  function DetecFaces() {}
  useEffect(() => {
    createFaceLandmarker();
  }, []);
  const [canvasCtx, canvasCtxSet] = useState<CanvasRenderingContext2D | null>(
    null
  );
  return (
    <div className="flex">
      <div className="relative">
        <video
          ref={sourceVidRef}
          onLoadedMetadata={onPlay}
          id="inputVideo"
          autoPlay
          muted
          playsInline
        ></video>
        <canvas className="absolute l-0" ref={sourceCanRef} />
      </div>
      <canvas ref={canvasTemp} />
      <div className="relative">
        <img src="/img.webp" ref={targetImgRef} />
        <canvas className="absolute l-0" ref={targetCanRef} />
      </div>
      <div>
        <button onClick={onPlay}>Play</button>
        <button onClick={DetecFaces}>Detect</button>
        <button
          onClick={() => {
            clearSi(setInterval(DetecFaces, 200));
          }}
        >
          Detect Interval {si}
        </button>
        <button
          onClick={() => {
            debugger;
            DetecFaces();
          }}
        >
          Detect Debug
        </button>
      </div>
    </div>
  );
}
