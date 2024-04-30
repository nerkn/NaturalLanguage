import { useEffect, useRef, useState } from "react";
import "../assets/faceapi";

function matchDimensions(canvasSource, canvasTarget, result) {
  const dims = faceapi.matchDimensions(canvasTarget, canvasSource, true);
  return faceapi.resizeResults(result, dims);
}

export function Giydir() {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const targetCanvasRef = useRef(null);
  const [keepRunning, keepRunningSet] = useState(true);
  const [options, optionsSet] = useState(null);
  const [targetImageCoords, targetImageCoordsSet] = useState(null);
  let canvasTemp = document.createElement("canvas");
  let canvasCtx = canvasTemp.getContext("2d");
  async function onPlay() {
    //if (!keepRunning) return;

    console.log("onPlay calisior", keepRunning);
    const result = await faceapi
      .detectSingleFace(videoElRef.current, options)
      .withFaceLandmarks();

    if (result) {
      const dims = faceapi.matchDimensions(
        canvasRef.current,
        videoElRef.current,
        true
      );
      const resizedResult = faceapi.resizeResults(result, dims);

      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedResult);

      if (
        targetImageCoords &&
        canvasCtx != null &&
        videoElRef.current != null &&
        targetCanvasRef.current != null
      ) {
        let w = resizedResult.detection.box.width | 0,
          h = resizedResult.detection.box.height | 0,
          topAlin = -100;
        canvasTemp.width = w;
        canvasTemp.height = h;
        canvasCtx.drawImage(
          videoElRef.current,
          resizedResult.detection.box.left,
          resizedResult.detection.box.top,
          w,
          h,
          0,
          0,
          canvasTemp.width,
          canvasTemp.height
        );

        let region = new Path2D();
        //  region.rect(0, 0, canvasTemp.width, canvasTemp.height);
        region.ellipse(
          canvasTemp.width / 2,
          canvasTemp.height / 2,
          canvasTemp.width / 2,
          canvasTemp.height / 2,
          0, // rotation
          0,
          2 * Math.PI
        );
        canvasCtx.fillStyle = "#FFFF";
        canvasCtx.globalCompositeOperation = "source-over";

        canvasCtx.globalCompositeOperation = "destination-in";

        // Draw our circular mask
        canvasCtx.fillStyle = "black";
        canvasCtx.fill(region, "evenodd");

        targetCanvasRef.current
          .getContext("2d")
          .drawImage(
            canvasTemp,
            0,
            0,
            canvasTemp.width,
            canvasTemp.height,
            targetImageCoords.box.left,
            targetImageCoords.box.top,
            targetImageCoords.box.width,
            targetImageCoords.box.height
          );
        console.log({
          s: "resizedResult",
          rdW: resizedResult.detection.box.width,
          rdH: resizedResult.detection.box.height,
          tW: targetImageCoords.box.width,
          tH: targetImageCoords.box.height,
          tW2: targetImageCoords.box.width,
          tH2: targetImageCoords.box.height,
        });
      } else {
        console.log({
          targetImageCoords,
          canvasCtx,
          videoElRef: videoElRef.current,
          targetCanvasRef: targetCanvasRef.current,
        });
      }
    }
    setTimeout(onPlay, 50);
  }
  async function run() {
    let v = videoElRef.current;
    if (v == null) return setTimeout(run, 200);
    console.log(faceapi.nets.tinyFaceDetector);
    await faceapi.nets.tinyFaceDetector.load("/");

    await faceapi.loadFaceLandmarkModel("/");

    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    v.srcObject = stream;

    let options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.5,
    });
    optionsSet(options);
  }
  async function getCoordsFromImage() {
    console.log("getCoordsFromImage0", options);
    console.log("getCoordsFromImage1", imageCanvasRef.current);
    const result = await faceapi.detectSingleFace(
      imageCanvasRef.current,
      options
    );
    targetImageCoordsSet(result);
    targetCanvasRef.current.width = imageCanvasRef.current.width;
    targetCanvasRef.current.height = imageCanvasRef.current.height;
    console.log("getCoordsFromImage2", result);
  }
  useEffect(() => {
    run();
    getCoordsFromImage();
  }, []);
  console.log("keeprunning", keepRunning);
  return (
    <div>
      <div className="relative">
        <video
          ref={videoElRef}
          onLoadedMetadata={onPlay}
          id="inputVideo"
          autoPlay
          muted
          playsInline
        ></video>
        <canvas className="absolute l-0" ref={canvasRef} />
      </div>
      <div className="relative">
        <img src="/img.webp" ref={imageCanvasRef} />
        <canvas className="absolute l-0" ref={targetCanvasRef} />
      </div>
      <button onClick={onPlay}>Play</button>
      <button onClick={() => keepRunningSet(false)}>
        {keepRunning ? "Stop" : "Play"}
      </button>
      <button onClick={getCoordsFromImage}>Detect</button>
    </div>
  );
}
