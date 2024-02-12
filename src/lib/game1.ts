//var Example = Example || {};

import Matter, { Bodies, Body, Common, Composite, Events } from "matter-js";
import {
  EventClick,
  EventTouch,
  ShapeColors,
  ShapeDefs,
  TShape,
} from "./types";
/*
import * as decomp from "poly-decomp"; 
Common.setDecomp(decomp);
/*
let elems = {
    lshape: () => {
        Composite.create()
            }
        
    )
}
*/
let force = 0.007;
let friction = 0.5;
function createShapes(shape: TShape, xOffset: number) {
  let parts = [];
  console.log("shape", shape);
  let definition = ShapeDefs[shape].split(",");
  for (let defindex = 0; defindex < definition.length; defindex += 2) {
    parts.push(
      Bodies.rectangle(
        20 * +definition[defindex] + xOffset,
        20 * +definition[defindex + 1],
        20,
        20,
        {
          friction,
          frictionAir: 0.3,
          frictionStatic: 30,
          render: {
            fillStyle: "#" + ShapeColors[shape],
          },
        }
      )
    );
  }
  let lshape = Composite.create();
  let bodies = Body.create({
    parts,
  });
  Composite.add(lshape, bodies);
  return lshape;
}
export const tetris = (
  gamePlace: HTMLElement,
  cb: (data: { type: string; data: any }) => void
) => {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    activeBody: Matter.Composite,
    hay: Matter.Body[] = [],
    score = 0,
    w4 = gamePlace.clientWidth / 4;

  // create engine
  var engine = Engine.create({ gravity: { y: 0.1 } }),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: gamePlace,
    engine: engine,
    options: {
      width: w4 * 4,
      height: gamePlace.clientHeight,
      //showIds: true,
      wireframes: false,
      //showAngleIndicator: true,
      //   showCollisions: true,
      //   showVelocity: true,
    },
  });

  Render.run(render);

  var runner = Runner.create({
    delta: 1000 / 20,
  });
  Runner.run(runner, engine);

  var group = Body.nextGroup(true);
  /*
  var catapult = Bodies.rectangle(400, 550, 320, 20, {
    label: "catapult",
    collisionFilter: { group: group },
    friction,
  });
  *
  var catapult2 = Bodies.fromVertices(
    400,
    550,
    [
      [
        { x: 16, y: 7 },
        { x: 26, y: 17 },
        { x: 167, y: 17 },
        { x: 176, y: 7 },
        { x: 167, y: 37 },
        { x: 26, y: 37 },
        { x: 16, y: 7 },
      ],
    ],
    {
      position: { x: 400, y: 550 },
      label: "catapult",
      collisionFilter: { group },
      friction,
    }
  );
  */
  let cataProp = {
    collisionFilter: { group },
    friction,
    label: "catapult",
    render: {
      fillStyle: "#d55",
    },
  };

  var catapult2 = Body.create({
    parts: [
      Bodies.rectangle(200, 540, 20, 40, cataProp),
      Bodies.rectangle(400, 550, 380, 20, cataProp),
      Bodies.rectangle(600, 540, 20, 40, cataProp),
    ],
    ...cataProp,
  });
  /*
    Body.create({
    vertices: [
      { x: 16, y: 7 },
      { x: 26, y: 17 },
      { x: 167, y: 17 },
      { x: 176, y: 7 },
      { x: 167, y: 37 },
      { x: 26, y: 37 },
      { x: 16, y: 7 },
    ],
    bounds:
    position: { x: 400, y: 550 },
    label: "catapult",
    collisionFilter: { group },
    friction,
  });
  */
  //hay.push(catapult);
  hay.push(...catapult2.parts);
  activeBody = createShapes("mirrorl", 400);
  Composite.add(world, [
    //catapult,
    catapult2,
    activeBody,
    Bodies.rectangle(400, 600, 800, 50.5, {
      label: "floor",
      isStatic: true,
      render: { fillStyle: "#060a19" },
    }),
    Bodies.rectangle(400, 565, 20, 30, {
      isStatic: true,
      collisionFilter: { group: group },
      render: { fillStyle: "#060a19" },
    }),

    Constraint.create({
      bodyA: catapult2,
      pointB: Vector.clone(catapult2.position),
      stiffness: 0.5,
      length: 0,
    }),
  ]);
  function shapeAddRandom() {
    let shapes = "l,mirrorl,T,box,stick,z,s".split(",") as TShape[];
    let newShape = createShapes(
      shapes[Math.floor(Math.random() * shapes.length)],
      w4 / 2 + Math.random() * (w4 / 3)
    );
    score += 4;
    cb({ type: "score", data: score });
    Composite.add(world, newShape);
    activeBody = newShape;
  }
  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });

  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 800 },
  });

  Events.on(engine, "beforeUpdate", () => {
    if (!activeBody) return;
    if (activeBody.bodies[0].speed > 1.2) {
      Body.applyForce(activeBody.bodies[0], activeBody.bodies[0].position, {
        x: 0,
        y: -0.0001,
      });
    }
  });
  function stopAll() {
    Matter.Render.stop(render);
    Matter.Runner.stop(runner);
    // @ts-ignore
    document.removeEventListener("click", ClickEvent);
    // @ts-ignore
    document.removeEventListener("touchstart", TouchEvent);
  }
  Events.on(engine, "collisionStart", function (event) {
    var pairs = event.pairs;

    // change object colours to show those starting a collision
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      let weTouchedFloor;
      if (hay.includes(pair.bodyA) && hay.includes(pair.bodyB)) {
        continue;
      } else if (
        pair.bodyA.label == "floor" &&
        pair.bodyB.label != "catapult"
      ) {
        weTouchedFloor = pair.bodyB;
      } else if (
        pair.bodyB.label == "floor" &&
        pair.bodyA.label != "catapult"
      ) {
        weTouchedFloor = pair.bodyA;
      } else if (activeBody) {
        if (
          (hay.includes(pair.bodyB) &&
            activeBody.bodies[0].parts.includes(pair.bodyA)) ||
          (hay.includes(pair.bodyA) &&
            activeBody.bodies[0].parts.includes(pair.bodyB))
        ) {
          hay.push(...activeBody.bodies[0].parts);
          shapeAddRandom();
        }
      }

      if (weTouchedFloor) stopAll();
    }
  });
  function ClickEvent(event: EventClick) {
    if (!activeBody) return;
    let location = (0.5 - event.offsetX / event.target?.width) * force;
    console.log(
      "temp force ",
      location,
      event.offsetX,
      event.target,
      event.target?.width
    );
    if (!location) return;
    if (event.offsetY < 200) {
      Body.applyForce(
        activeBody.bodies[0],
        {
          x: activeBody.bodies[0].position.x - 10,
          y: activeBody.bodies[0].position.y - 10,
        },
        {
          x: -location,
          y: 0,
        }
      );
      Body.applyForce(
        activeBody.bodies[0],
        {
          x: activeBody.bodies[0].position.x,
          y: activeBody.bodies[0].position.y,
        },
        {
          x: location,
          y: 0,
        }
      );
      //);
    } else {
      activeBody.bodies.forEach((b) =>
        Body.applyForce(b, b.position, {
          x: -location * 2,
          y: 0,
        })
      );
    }
  }
  function TouchEvent(event: EventTouch) {
    console.log("touchevent", event);
    ClickEvent({
      ...event,
      target: event.target,
      offsetX: event.touches[0].clientX,
      offsetY: event.touches[0].clientY,
    });
  }
  // @ts-ignore
  document.addEventListener("click", ClickEvent);
  // @ts-ignore
  document.addEventListener("touchstart", TouchEvent);
  window.addEventListener("resize", () => {
    render.bounds.max.x = gamePlace.clientWidth;
    render.bounds.max.y = gamePlace.clientHeight;
    render.options.width = gamePlace.clientWidth;
    render.options.height = gamePlace.clientHeight;
    render.canvas.width = gamePlace.clientWidth;
    render.canvas.height = gamePlace.clientHeight;
    w4 = (gamePlace.clientWidth / 4) | 0;
    Matter.Render.setPixelRatio(render, window.devicePixelRatio); // added this
  });
  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stopAll,
  };
};
