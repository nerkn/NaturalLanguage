import * as faceDetection from "@tensorflow-models/face-detection";
import { fromTriangles } from "transformation-matrix";
type pointType = { x: number; y: number; name?: string };
type ellipseParams = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean | undefined;
};
export function FaceAngleCalc(estOne: faceDetection.Face) {
  let est = estOne.keypoints;
  let eyes = AngleCalc(est[0], est[1]);
  let ears = AngleCalc(est[4], est[5]);

  return [eyes, ears];
}
export function Facetimator2Ellipse(ps: pointType[]): ellipseParams {
  let eye2eye = (Math.abs(ps[0].x - ps[1].x) + Math.abs(ps[5].x - ps[4].x)) / 2;
  return {
    x: (ps[0].x + ps[1].x + ps[4].x + ps[5].x) / 4,
    y: (ps[0].y + ps[1].y + ps[4].y + ps[5].y) / 4,
    radiusX: eye2eye * 0.7,
    radiusY: eye2eye,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
  };
}
export function keypoints2FaceBox(estOne: faceDetection.Keypoint[]): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  let eye2eye = Math.abs(estOne[0].x - estOne[1].x);
  return {
    left: estOne[0].x,
    top: (estOne[0].y + estOne[1].y) / 2 - 50,
    width: eye2eye,
    height: eye2eye * 1.62,
  };
}
function AngleCalc(p1: pointType, p2: pointType) {
  return Math.atan2(-p1.y + p2.y, -p1.x + p2.x);
}
function CorrectionX(p1: pointType, angle: number) {
  return p1.x * Math.sin(angle) + p1.y * Math.cos(angle);
}
function CorrectionX2(p1: ellipseParams, angle: number) {
  return p1.radiusX * Math.sin(angle) + p1.radiusY * Math.cos(angle);
}
function CorrectionY(p1: pointType, angle: number) {
  return p1.x * Math.cos(angle) + p1.y * Math.sin(angle);
}
function CorrectionY2(p1: ellipseParams, angle: number) {
  return p1.radiusX * Math.cos(angle) + p1.radiusY * Math.sin(angle);
}

let sourceKpsCache: number[] = [];
export function DrawSrc2Target({
  source,
  target,
  sourceKps,
  targerKps,
  ctxTemp,
}: {
  source: HTMLVideoElement | HTMLImageElement;
  target: CanvasRenderingContext2D;
  sourceKps: faceDetection.Keypoint[];
  targerKps: faceDetection.Keypoint[];
  ctxTemp: CanvasRenderingContext2D;
}) {
  if (!sourceKpsCache.length) {
    sourceKpsCache[0] = sourceKps[0].x;
    sourceKpsCache[1] = sourceKps[0].y;
    sourceKpsCache[2] = sourceKps[1].x;
    sourceKpsCache[3] = sourceKps[1].y;
    sourceKpsCache[4] = sourceKps[3].x;
    sourceKpsCache[5] = sourceKps[3].y;
  } else {
    sourceKpsCache[0] = (sourceKpsCache[0] * 3 + sourceKps[0].x) / 4;
    sourceKpsCache[1] = (sourceKpsCache[1] * 3 + sourceKps[0].y) / 4;
    sourceKpsCache[2] = (sourceKpsCache[2] * 3 + sourceKps[1].x) / 4;
    sourceKpsCache[3] = (sourceKpsCache[3] * 3 + sourceKps[1].y) / 4;
    sourceKpsCache[4] = (sourceKpsCache[4] * 3 + sourceKps[3].x) / 4;
    sourceKpsCache[5] = (sourceKpsCache[5] * 3 + sourceKps[3].y) / 4;
  }
  sourceKps[0].x = sourceKpsCache[0];
  sourceKps[0].y = sourceKpsCache[1];
  sourceKps[1].x = sourceKpsCache[2];
  sourceKps[1].y = sourceKpsCache[3];
  sourceKps[3].x = sourceKpsCache[4];
  sourceKps[3].y = sourceKpsCache[5];

  let matrix = fromTriangles(
    [sourceKps[0], sourceKps[1], sourceKps[3]],
    [targerKps[0], targerKps[1], targerKps[3]]
  );
  //let dm = DOMMatrixReadOnly.fromMatrix(matrix)
  ctxTemp.reset();
  ctxTemp.setTransform(matrix);
  ctxTemp.filter = "blur(3px)";
  ctxTemp.drawImage(source, 0, 0);
  if (1) {
    let ellipseSource = Facetimator2Ellipse(sourceKps);
    //console.log(source, matrix, ellipseSource);
    prepareRegion(
      ctxTemp,
      ellipseSource.x,
      ellipseSource.y,
      ellipseSource.radiusX + 5,
      ellipseSource.radiusY + 5
    );
  }

  ctxTemp.filter = "blur(0)";
  prepareRegionClipCircles(ctxTemp, sourceKps);
  ctxTemp.drawImage(source, 0, 0);
  target.clearRect(0, 0, 1000, 1000);
  target.drawImage(ctxTemp.canvas, 0, 0);
}

function prepareRegionClipCircles(
  canvasCtx: CanvasRenderingContext2D,
  kps: faceDetection.Keypoint[]
) {
  let radius = 50;
  let region = new Path2D();
  region.arc(kps[0].x, kps[0].y, radius, 0, 2 * Math.PI);
  region.arc(kps[1].x, kps[1].y, radius, 0, 2 * Math.PI);
  region.arc(kps[2].x, kps[2].y, radius * 1.5, 0, 2 * Math.PI);
  region.arc(kps[3].x, kps[3].y, radius, 0, 2 * Math.PI);
  canvasCtx.clip(region, "nonzero");
}
function prepareRegionCircles(
  canvasCtx: CanvasRenderingContext2D,
  kps: faceDetection.Keypoint[]
) {
  canvasCtx.fillStyle = "#f33";
  canvasCtx.fillRect(-1000, -1000, 1000, 1000);
  let radius = 50;
  let region = new Path2D();
  region.arc(kps[0].x, kps[0].y, radius, 0, 2 * Math.PI);
  region.arc(kps[1].x, kps[1].y, radius, 0, 2 * Math.PI);
  region.arc(kps[2].x, kps[2].y, radius, 0, 2 * Math.PI);
  region.arc(kps[3].x, kps[3].y, radius, 0, 2 * Math.PI);
  canvasCtx.fillStyle = "#FFFF";
  canvasCtx.globalCompositeOperation = "source-over";

  canvasCtx.globalCompositeOperation = "destination-in";

  // Draw our circular mask
  canvasCtx.fillStyle = "black";
  canvasCtx.fill(region, "nonzero");
}
function prepareRegion(
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number
) {
  //canvasCtx.clearRect(-1000, -1000, 1000, 1000);
  let region = new Path2D();
  region.ellipse(
    x, //CorrectionX2(ellipse, angle) / 2,
    y, //CorrectionY2(ellipse, angle) / 2,
    radiusX,
    radiusY,
    0,
    0,
    2 * Math.PI
  );
  canvasCtx.fillStyle = "#FFFF";

  canvasCtx.globalCompositeOperation = "destination-in";

  // Draw our circular mask
  canvasCtx.fillStyle = "#666";
  canvasCtx.fill(region, "evenodd");
  canvasCtx.globalCompositeOperation = "source-over";
}
export function DrawSrc2Temp({
  canvasCtx,
  source,
  keypointsSource,
  keypointsTarget,
  angle,
}: {
  canvasCtx: CanvasRenderingContext2D;
  source: HTMLVideoElement | HTMLImageElement;
  keypointsSource: faceDetection.Keypoint[];
  keypointsTarget: faceDetection.Keypoint[];

  angle: number;
}) {
  let paySource = 50;

  let ellipseSource = Facetimator2Ellipse(keypointsSource);
  let ellipseTarget = Facetimator2Ellipse(keypointsTarget);
  let facialCentralPoint = [
    ellipseTarget.radiusX / 2 + 20,
    ellipseTarget.radiusY / 2 + 20,
  ];
  if (canvasCtx == null) {
    console.log("canvas context alamadik");
    return [0, 0] as [number, number];
  }
  canvasCtx.translate(facialCentralPoint[0], facialCentralPoint[1]);
  canvasCtx.fillStyle = "#333";
  canvasCtx.fillRect(0, 0, 1000, 1000);
  canvasCtx.rotate(angle);
  canvasCtx.drawImage(
    source,
    ellipseSource.x - ellipseSource.radiusX / 2 - paySource,
    ellipseSource.y - ellipseSource.radiusY / 2 - paySource,
    ellipseSource.radiusX + paySource * 2,
    ellipseSource.radiusY + paySource * 2,
    +20,
    +20,
    ellipseTarget.radiusX + 20,
    ellipseTarget.radiusY + 20
  );
  //canvasCtx.translate(0, 0);
  //canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
  let region = new Path2D();
  /*
  if (false) {
    region.moveTo(keypoints[5].x, keypoints[5].y);
    region.lineTo(keypoints[3].x, keypoints[3].y);
    region.lineTo(keypoints[4].x, keypoints[4].y);
    region.lineTo(keypoints[5].x, keypoints[5].y);
  }
  */
  region.ellipse(
    facialCentralPoint[0], //CorrectionX2(ellipse, angle) / 2,
    facialCentralPoint[1], //CorrectionY2(ellipse, angle) / 2,
    ellipseTarget.radiusX / 2,
    ellipseTarget.radiusY / 2,
    0,
    0,
    2 * Math.PI
  );
  canvasCtx.fillStyle = "#FFFF";
  canvasCtx.globalCompositeOperation = "source-over";

  canvasCtx.globalCompositeOperation = "destination-in";

  // Draw our circular mask
  canvasCtx.fillStyle = "black";
  canvasCtx.fill(region, "evenodd");
  return [
    CorrectionY({ x: ellipseTarget.radiusX, y: ellipseTarget.radiusY }, angle),
    CorrectionX({ x: facialCentralPoint[0], y: facialCentralPoint[1] }, angle),
  ];
}

export function DrawSrc2Temp1({
  canvasCtx,
  source,
  ellipse,
  angle,
}: {
  canvasCtx: CanvasRenderingContext2D;
  source: HTMLVideoElement | HTMLImageElement;
  ellipse: ellipseParams;
  angle: number;
}) {
  let paySource = 200,
    payTemp = 200;
  canvasCtx.canvas.width = ellipse.radiusX * 2 + paySource;
  canvasCtx.canvas.height = ellipse.radiusY * 2 + paySource;
  if (canvasCtx == null) {
    console.log("canvas context alamadik");
    return [0, 0] as [number, number];
  }
  //canvasCtx.translate(ellipse.radiusX / 2, ellipse.radiusY / 2);
  canvasCtx.rotate(angle);
  canvasCtx.drawImage(
    source,
    ellipse.x - ellipse.radiusX / 2 - paySource,
    ellipse.y - ellipse.radiusY / 2 - paySource,
    ellipse.radiusX + paySource * 2,
    ellipse.radiusY + paySource * 2,
    +20,
    +20,
    ellipse.radiusX + payTemp,
    ellipse.radiusY + payTemp
  );
  canvasCtx.translate(0, 0);
  canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
  let region = new Path2D();
  region.ellipse(
    ellipse.radiusX / 2 + payTemp / 2 - 20,
    ellipse.radiusY / 2 + payTemp / 2 + 40,
    ellipse.radiusX / 2 + 20,
    ellipse.radiusY / 2 + 20,
    angle,
    0,
    2 * Math.PI
  );
  canvasCtx.fillStyle = "#FFFF";
  canvasCtx.globalCompositeOperation = "source-over";

  canvasCtx.globalCompositeOperation = "destination-in";

  // Draw our circular mask
  canvasCtx.fillStyle = "black";
  canvasCtx.fill(region, "evenodd");
  return [payTemp / 2 - 20, payTemp / 2 + 40];
}

export function DrawTemp2Target({
  canvasCtx,
  target,
  points,
  offset,
}: {
  canvasCtx: CanvasRenderingContext2D;
  target: CanvasRenderingContext2D | null;
  points: { left: number; top: number; width: number; height: number };
  offset: number[];
}) {
  if (target == null) return;
  let targetCanvas = canvasCtx.canvas;
  target.drawImage(
    targetCanvas,
    0,
    0,
    targetCanvas.width,
    targetCanvas.height,
    points.left - offset[0] - 20,
    points.top - offset[1] - 20,
    points.width,
    points.height
  );
}
