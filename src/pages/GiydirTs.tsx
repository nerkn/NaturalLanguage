import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceDetection from "@tensorflow-models/face-detection";
import { useEffect, useRef, useState } from "react";
import {
  DrawSrc2Target,
  DrawSrc2Temp,
  DrawTemp2Target,
  FaceAngleCalc,
  Facetimator2Ellipse,
  keypoints2FaceBox,
} from "../lib/faceHelpers";

const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
const detectorConfig: faceDetection.MediaPipeFaceDetectorMediaPipeModelConfig =
  {
    runtime: "mediapipe",
    solutionPath: "./node_modules/@mediapipe/face_detection",
  };
let detector = await faceDetection.createDetector(model, detectorConfig);

export function GiydirTs() {
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
  const [canvasCtx, canvasCtxSet] = useState<CanvasRenderingContext2D | null>(
    null
  );
  async function DetecFacesTri() {
    if (targetCanRef.current == null) return;
    let targetCanRefCtx = targetCanRef.current.getContext("2d");
    if (
      sourceVidRef.current == null ||
      targetImgRef.current == null ||
      canvasCtx == null ||
      targetCanRefCtx == null
    )
      return;
    let sourceEst = await detector.estimateFaces(sourceVidRef.current),
      targetEst = await detector.estimateFaces(targetImgRef.current);
    DrawSrc2Target({
      source: sourceVidRef.current,
      target: targetCanRefCtx,
      ctxTemp: canvasCtx,
      sourceKps: sourceEst[0].keypoints,
      targerKps: targetEst[0].keypoints,
    });
  }
  async function DetecFaces() {
    if (
      sourceVidRef.current == null ||
      targetImgRef.current == null ||
      canvasCtx == null ||
      targetCanRef.current == null
    )
      return;
    let sourceEst = await detector.estimateFaces(sourceVidRef.current),
      targetEst = await detector.estimateFaces(targetImgRef.current);
    let sourceAngle = FaceAngleCalc(sourceEst[0]),
      targetAngle = FaceAngleCalc(targetEst[0]);
    let ellipse = Facetimator2Ellipse(sourceEst[0].keypoints);
    console.log({
      ellipse,
      srcKeys: sourceEst[0].keypoints,
      trgKeys: targetEst[0].keypoints,
      rotation: [
        targetAngle[0],
        sourceAngle[0],
        -targetAngle[0] + sourceAngle[0],
      ],
    });
    //canvasCtx.rotate(-sourceAngle[0] + targetAngle[0]);
    let offset = DrawSrc2Temp({
      canvasCtx,
      source: sourceVidRef.current,
      keypointsSource: sourceEst[0].keypoints,
      keypointsTarget: targetEst[0].keypoints,
      angle: targetAngle[0] - sourceAngle[0],
    });
    let targetFace = keypoints2FaceBox(targetEst[0].keypoints);

    DrawTemp2Target({
      canvasCtx,
      target: targetCanRef.current.getContext("2d"),
      points: {
        ...targetFace,
        width: canvasCtx.canvas.width,
        height: canvasCtx.canvas.height,
      },
      offset,
    });

    console.log("estimations", sourceAngle, targetAngle);
  }
  function onPlay() {}

  async function run() {
    let v = sourceVidRef.current;
    if (v == null) return setTimeout(run, 200);
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    v.srcObject = stream;
  }

  useEffect(() => {
    run();
    canvasCtxSet(canvasTemp.current?.getContext("2d") || null);
  }, []);

  useEffect(() => {
    //document.createElement("canvas").getContext("2d"));
    if (targetCanRef.current == null) return;
    targetCanRef.current.width = targetImgRef.current?.width || 0;
    targetCanRef.current.height = targetImgRef.current?.height || 0;
  }, [targetImgRef]);
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
        <canvas ref={canvasTemp} width={1200} height={800} />
      </div>
      <div className="relative">
        <img src="/img.webp" ref={targetImgRef} />
        <canvas className="absolute l-0" ref={targetCanRef} />
      </div>
      <div>
        <button onClick={onPlay}>Play</button>
        <button onClick={DetecFaces}>Detect</button>
        <button onClick={DetecFacesTri}>DetectTri</button>
        <button
          onClick={() => {
            clearSi(setInterval(DetecFaces, 50));
          }}
        >
          Detect Interval {si}
        </button>
        <button
          onClick={() => {
            clearSi(setInterval(DetecFacesTri, 50));
          }}
        >
          DetectTri Interval {si}
        </button>
        <button onClick={() => clearSi(0)}> Stop </button>
        <button
          onClick={() => {
            debugger;
            DetecFacesTri();
          }}
        >
          Detect Debug
        </button>
      </div>
    </div>
  );
}
