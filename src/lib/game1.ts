//var Example = Example || {};

import Matter, { Bodies, Body, Composite, Events } from "matter-js";
import { ShapeColors, ShapeDefs, TButton, TShape } from "./types";
let force = 0.005;
let friction = 0.001;
function createShapes(shape: TShape, xOffset: number) {
  let parts = [];
  console.log("shape", shape, "xOffset", xOffset);
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
          frictionStatic: 0.001,
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
    friction,
    frictionStatic: 0.001,
  });
  Composite.add(lshape, bodies);
  return lshape;
}
export const tetris = (
  gamePlace: HTMLElement,
  cb: (type: string, data: any) => void
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
      showCollisions: true,
      //   showVelocity: true,
    },
  });

  Render.run(render);

  var runner = Runner.create({
    delta: 1000 / 20,
  });
  Runner.run(runner, engine);

  var group = Body.nextGroup(true);
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

  var buttons = [
    createButtons(50, 50, "rleft"),
    createButtons(50, 350, "left"),
    createButtons(750, 50, "rright"),
    createButtons(750, 350, "right"),
  ];
  hay.push(...catapult2.parts);
  activeBody = createShapes("mirrorl", 400);
  Composite.add(world, [
    //catapult,
    catapult2,
    ...buttons,
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
    console.log(w4, gamePlace.clientWidth);
    let newShape = createShapes(
      shapes[Math.floor(Math.random() * shapes.length)],
      400 + (Math.random() - 0.5) * 200
    );
    score += 4;
    cb("score", score);
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
  }
  function applyForce(type: TButton) {
    let applyBody = activeBody.bodies[0];
    let location = force;
    switch (type) {
      //@ts-ignore fallthrough
      case "left":
        location = -location;
      case "right":
        Body.applyForce(
          applyBody,
          {
            x: applyBody.position.x,
            y: applyBody.position.y,
          },
          {
            x: location,
            y: 0,
          }
        );
        break;
      //@ts-ignore fall through
      case "rright":
        location = -location;
      case "rleft":
        Body.applyForce(
          applyBody,
          {
            x: applyBody.position.x,
            y: applyBody.position.y - 10,
          },
          {
            x: -location / 3,
            y: 0,
          }
        );
        Body.applyForce(
          applyBody,
          {
            x: applyBody.position.x,
            y: applyBody.position.y,
          },
          {
            x: location / 3,
            y: 0,
          }
        );
    }
  }
  Events.on(mouseConstraint, "mousedown", (e) => {
    console.log("tikladi ", e, mouseConstraint.body);
    if (mouseConstraint.body) applyForce(mouseConstraint.body.label as TButton);
  });

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

      if (weTouchedFloor) {
        stopAll();
        cb("endGame", score);
      }
    }
  });

  window.addEventListener("resize", () => {
    render.bounds.max.x = gamePlace.clientWidth;
    render.bounds.max.y = gamePlace.clientHeight;
    render.options.width = gamePlace.clientWidth;
    render.options.height = gamePlace.clientHeight;
    render.canvas.width = gamePlace.clientWidth;
    render.canvas.height = gamePlace.clientHeight;
    w4 = (gamePlace.clientWidth / 4) | 600;
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

function createButtons(x: number, y: number, sprite: string) {
  return Bodies.rectangle(x, y, 100, 100, {
    isStatic: true,
    isSensor: true,
    render: {
      sprite: { texture: "/" + sprite + ".png", xScale: 0.7, yScale: 0.7 },
    },
    label: sprite,
  });
}
