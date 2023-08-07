import canvasutil from "https://code4fukui.github.io/jigaku/lib/jigaku.mjs";
//import Matter from "./matter.min.mjs";
import Matter from "https://code4sabae.github.io/matter-mjs/matter.min.mjs";
const { Engine, Render, Runner, World, Bodies } = Matter;

const startRender = (engine, element) => {
  const canvas = canvasutil.createFullCanvas();
  const size = [1000, 1000];
  const render = { background: "#ffffff", size, canvas };
  const drawWorld = (g) => {
    g.setColor(0, 0, 0);
    const bodies = Matter.Composite.allBodies(engine.world);
    for (const body of bodies) {
      if (!body.render.visible) continue;
      const p = body.position;
      // g.fillCircle(p.x, p.y, 10);
      g.fillStyle = body.render.fillStyle;
      g.beginPath();
      const v = body.vertices;
      g.moveTo(v[0].x, v[0].y);
      for (let i = 1; i < v.length; i++) {
        g.lineTo(v[i].x, v[i].y);
      }
      g.closePath();
      g.fill();
    }
  };

  render.offset = { x: 0, y: 0 };
  canvas.draw = (g, cw, ch) => {
    g.fillStyle = render.background;
    g.fillRect(0, 0, cw, ch);
    g.save();
    const [sw, sh] = size;
    const r = Math.min(cw / sw, ch / sh);
    const offx = (cw - sw * r) / 2;
    const offy = (ch - sh * r) / 2;
    render.offset.x = offx;
    render.offset.y = offy;
    render.r = r;
    g.setTransform(r, 0, 0, r, offx, offy);
    drawWorld(g);
    g.restore();
  };
  const f = () => {
    canvas.redraw();
    requestAnimationFrame(f);
  };
  f();
  return render;
};

const createWorld = (element) => {
  const engine = Engine.create();
  const world = engine.world;
  // const render = createRender(engine, element);
  // Render.run(render);
  const render = startRender(engine, element);
  const runner = Runner.create({ isFixed: true });
  Matter.Events.on(runner, "tick", () => {
    runner.deltaMin = 1000 / runner.fps;
  });
  Runner.run(runner, engine);
  const res = {
    add(body) {
      World.add(world, body);
    },
    remove(body) {
      World.remove(world, body);
    },
    get width() {
      return render.size[0]; //render.canvas.width;
    },
    set width(n) {
      render.size[0] = n;
    },
    get height() {
      return render.size[1]; // render.canvas.height;
    },
    set height(n) {
      render.size[1] = n;
    },
    get render() {
      return render;
    },
    get engine() {
      return engine;
    },
    get gravity() {
      return world.gravity;
    },
    useRealGravity() {
      useDeviceMotionWorld(world);
    },
  };
  setUI(res, element);
  return res;
};

const setUI = (world, div) => {
  const handleTouch = (p) => {
    if (world.ontouch) {
      world.ontouch(p);
    }
  };
  div.onmousemove = (e) => {
    const offset = world.render.offset;
    const r = world.render.r / devicePixelRatio;
    const c = { x: e.clientX, y: e.clientY };
    const p = { x: c.x / r - offset.x / world.render.r, y: c.y / r - offset.y / world.render.r };
    handleTouch(p);
  };
  const touches = (e) => {
    const offset = world.render.offset;
    const r = world.render.r / devicePixelRatio;
    const c = { x: e.clientX, y: e.clientY };
    const res = [];
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const c = { x: t.pageX, y: t.pageY };
      const p = { x: c.x / r - offset.x / world.render.r, y: c.y / r - offset.y / world.render.r };
      res.push(p);
    }
    return res;
  };
  div.addEventListener("touchstart", (e) => {
    e.preventDefault();
    for (const p of touches(e)) {
      handleTouch(p);
    }
  }, { passive: false });
  
  div.addEventListener("touchmove", (e) => {
    e.preventDefault();
    for (const p of touches(e)) {
      handleTouch(p);
    }
  }, { passive: false });
  
  div.addEventListener("touchend", (e) => {
    e.preventDefault();
  }, { passive: false });
};

const useDeviceMotionWorld = (world) => {
  if (
    window.DeviceMotionEvent && DeviceMotionEvent.requestPermission &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  if (
    window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission();
  }
  // Androidは逆!?
  // window.addEventListener("devicemotion", (e) => {
  const yflg = window.navigator.userAgent.indexOf("Android") >= 0 ? -1 : 1;
  window.ondevicemotion = (e) => {
    if (e.accelerationIncludingGravity.x === null) return;
    // ball.WakeUp();
    var xg = e.accelerationIncludingGravity.x;
    var yg = e.accelerationIncludingGravity.y * yflg;
    world.gravity.x = xg / 9.8;
    world.gravity.y = -yg / 9.8;
  };
};

export { createWorld, Matter };
