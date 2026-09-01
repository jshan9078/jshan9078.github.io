import { useEffect, useRef } from "react";
import type { WebBenchRow } from "@/data/types";

// Three.js is loaded at runtime from a CDN (see the import map in index.html) so the
// bundle stays free of a ~600 KB dependency that only this chart needs.
const THREE_URL = "https://unpkg.com/three@0.160.0/build/three.module.js";
const ORBIT_URL = "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
const CSS2D_URL = "https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS2DRenderer.js";

const FAMS = [
  { model: "Opus 5", color: 0xe0895a },
  { model: "Sonnet 5", color: 0x8ab4e8 },
  { model: "Haiku 4.5", color: 0xc9a0e8 },
  { model: "Gemini 3.7 Flash", color: 0x7ec9a3 },
  { model: "GPT-5.6 Luna", color: 0xe88ab0 },
  { model: "Muse Spark 1.2", color: 0xe8d47a },
];
const THINK = ["low", "medium", "high", "xhigh", "max", "ultra", "n/a"];
// Higher thinking level = stronger glow around the point (0 for low and n/a).
const glowT = (thinking: string) => {
  const i = ["low", "medium", "high", "xhigh", "max", "ultra"].indexOf(thinking);
  return i <= 0 ? 0 : i / 5;
};

let glowTex: unknown = null;
function glowTexture(THREE: any) {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.22)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

export default function WebBench3D({ rows }: { rows: WebBenchRow[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tip = tipRef.current;
    if (!wrap || !tip) return;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const [THREE, { OrbitControls }, { CSS2DRenderer, CSS2DObject }] = await Promise.all([
        import(/* @vite-ignore */ THREE_URL),
        import(/* @vite-ignore */ ORBIT_URL),
        import(/* @vite-ignore */ CSS2D_URL),
      ]);
      if (disposed || !wrapRef.current) return;

      const SX = 10, SY = 6.5, SZ = 10;
      const COST = { min: 0, max: 1.2 };
      const SCORE = { min: 60, max: 100 };
      const TIME = { min: 0, max: 130 };
      const x = (c: number) => ((c - COST.min) / (COST.max - COST.min)) * SX;
      const y = (s: number) => ((s - SCORE.min) / (SCORE.max - SCORE.min)) * SY;
      const z = (t: number) => ((t - TIME.min) / (TIME.max - TIME.min)) * SZ;

      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      wrap.appendChild(renderer.domElement);

      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(W, H);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.inset = "0";
      labelRenderer.domElement.style.pointerEvents = "none";
      // Contain the per-label z-indexes CSS2DRenderer assigns, so labels can never
      // paint above the hover tooltip (which sits at a higher z-index outside this layer).
      labelRenderer.domElement.style.zIndex = "1";
      wrap.appendChild(labelRenderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
      // Frame with headroom so axis/tick labels stay inside the canvas while orbiting,
      // and start the orbit facing the OPTIMAL corner (low cost, low time), matching the
      // 2D charts' good-is-near-you reading.
      const fit = Math.min(1.9, Math.max(1.18, 1.45 / (W / H)));
      camera.position.set(SX / 2 + 3 * (fit / 1.44), 17 * (fit / 1.44), SZ / 2 + 22 * (fit / 1.44));

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(SX / 2, SY / 2, SZ / 2);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 8;
      controls.maxDistance = 42;
      controls.zoomSpeed = 2.2;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enablePan = false;
      const stopSpin = () => { controls.autoRotate = false; };
      renderer.domElement.addEventListener("pointerdown", stopSpin, { once: true });

      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
      keyLight.position.set(14, 22, 10);
      scene.add(keyLight);

      const thinLine = (a: unknown, b: unknown, color: number, opacity: number) => {
        const g = new THREE.BufferGeometry().setFromPoints([a, b]);
        return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
      };
      const label = (html: string, pos: { x: number; y: number; z: number }, cls = "b3d-lbl") => {
        const el = document.createElement("div");
        el.className = cls;
        el.innerHTML = html;
        const o = new CSS2DObject(el);
        o.position.set(pos.x, pos.y, pos.z);
        scene.add(o);
        return o;
      };

      const GRID = 0x1f1f1f, EDGE = 0x3a3a3a;
      for (let c = 0; c <= 1.2001; c += 0.3) {
        scene.add(thinLine(new THREE.Vector3(x(c), 0, 0), new THREE.Vector3(x(c), 0, SZ), GRID, 0.8));
        scene.add(thinLine(new THREE.Vector3(x(c), 0, 0), new THREE.Vector3(x(c), SY, 0), GRID, 0.5));
      }
      for (let t = 0; t <= 130.001; t += 26) {
        scene.add(thinLine(new THREE.Vector3(0, 0, z(t)), new THREE.Vector3(SX, 0, z(t)), GRID, 0.8));
        scene.add(thinLine(new THREE.Vector3(0, 0, z(t)), new THREE.Vector3(0, SY, z(t)), GRID, 0.5));
      }
      for (let s = 60; s <= 100.001; s += 10) {
        scene.add(thinLine(new THREE.Vector3(0, y(s), 0), new THREE.Vector3(SX, y(s), 0), GRID, 0.5));
        scene.add(thinLine(new THREE.Vector3(0, y(s), 0), new THREE.Vector3(0, y(s), SZ), GRID, 0.5));
      }
      scene.add(thinLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(SX, 0, 0), EDGE, 1));
      scene.add(thinLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, SY, 0), EDGE, 1));
      scene.add(thinLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, SZ), EDGE, 1));

      for (let c = 0; c <= 1.2001; c += 0.3)
        label(`$${c.toFixed(2)}`, new THREE.Vector3(x(c), -0.32, -0.45));
      for (let t = 0; t <= 130.001; t += 26)
        label(`${Math.round(t)}s`, new THREE.Vector3(-0.55, -0.32, z(t)));
      for (let s = 60; s <= 100.001; s += 10)
        label(`${s}%`, new THREE.Vector3(-0.4, y(s), -0.55));
      label("MEDIAN COST / TASK", new THREE.Vector3(SX / 2, -1.15, -1.15), "b3d-lbl b3d-lbl--axis");
      label("MEDIAN TIME / TASK", new THREE.Vector3(-1.7, -1.15, SZ / 2), "b3d-lbl b3d-lbl--axis");
      label("ACCURACY", new THREE.Vector3(0.5, SY + 0.75, -0.4), "b3d-lbl b3d-lbl--axis");

      // optimal region: >=95% accuracy, <=$0.35 and <=60 s per task
      {
        const w = x(0.35), h = SY - y(95), d = z(60);
        const geo = new THREE.BoxGeometry(w, h, d);
        const box = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color: 0xf0c948, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.DoubleSide })
        );
        box.position.set(w / 2, y(95) + h / 2, d / 2);
        scene.add(box);
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: 0xf0c948, transparent: true, opacity: 0.6 })
        );
        edges.position.copy(box.position);
        scene.add(edges);
        const opt = label(
          'OPTIMAL',
          new THREE.Vector3(w / 2, SY + 0.55, d / 2),
          "b3d-lbl b3d-lbl--fam"
        );
        opt.element.style.color = "#f0c948";
      }

      const pickables: unknown[] = [];
      const sphereGeo = new THREE.SphereGeometry(0.14, 32, 24);
      for (const fam of FAMS) {
        const frows = rows
          .filter((r) => r.model === fam.model)
          .sort((a, b) => THINK.indexOf(a.thinking) - THINK.indexOf(b.thinking));
        if (!frows.length) continue;
        const color = new THREE.Color(fam.color);
        const pts = frows.map((r) => new THREE.Vector3(x(r.cost), y(r.score), z(r.time)));

        if (pts.length > 1) {
          const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.15);
          scene.add(new THREE.Mesh(
            new THREE.TubeGeometry(curve, 64, 0.022, 8, false),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 })
          ));
        }
        frows.forEach((r, i) => {
          const p = pts[i];
          const gt = glowT(r.thinking);
          // The orb itself emits: emissive ramps well past 1 so high-thinking points
          // visibly radiate; the additive halo sprite carries the light falloff.
          const s = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({
            color, roughness: 0.55, metalness: 0.05, emissive: color,
            emissiveIntensity: 0.1 + 1.6 * gt,
          }));
          s.position.copy(p);
          s.userData = r;
          scene.add(s);
          pickables.push(s);
          if (gt > 0) {
            const halo = new THREE.Sprite(new THREE.SpriteMaterial({
              map: glowTexture(THREE), color, transparent: true,
              opacity: 0.3 + 0.55 * gt, depthWrite: false,
              blending: THREE.AdditiveBlending,
            }));
            halo.scale.setScalar(0.7 + 1.2 * gt);
            halo.position.copy(p);
            scene.add(halo);
          }
          scene.add(thinLine(p, new THREE.Vector3(p.x, 0, p.z), fam.color, 0.22));
          const foot = new THREE.Mesh(
            new THREE.CircleGeometry(0.055, 20),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
          );
          foot.rotation.x = -Math.PI / 2;
          foot.position.set(p.x, 0.012, p.z);
          scene.add(foot);
        });

        const last = frows[frows.length - 1];
        const lp = pts[pts.length - 1].clone().add(new THREE.Vector3(0, 0.42, 0));
        const tag = last.thinking === "n/a" ? "" : `<small>${last.thinking.toUpperCase()}</small>`;
        const el = label(`${fam.model}${tag}`, lp, "b3d-lbl b3d-lbl--fam");
        el.element.style.color = "#" + color.getHexString();
      }

      // hover tooltip
      const ray = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hovered: any = null;
      const onMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        ray.setFromCamera(mouse, camera);
        const hit = ray.intersectObjects(pickables, false)[0];
        if (hovered && (!hit || hit.object !== hovered)) {
          hovered.scale.setScalar(1);
          hovered = null;
          tip.style.display = "none";
        }
        if (hit && hit.object !== hovered) {
          hovered = hit.object;
          hovered.scale.setScalar(1.5);
          const r = hovered.userData as WebBenchRow;
          const think = r.thinking === "n/a" ? "" : ` <span>${r.thinking} thinking</span>`;
          tip.innerHTML =
            `<b>${r.model}</b>${think}<br/><span>${r.harness}</span><br/>` +
            `score <b>${r.score.toFixed(1)}%</b> <span>&middot; $${r.cost.toFixed(3)} &middot; ${r.time.toFixed(0)}s per task (median)</span>`;
          tip.style.display = "block";
        }
        if (hovered) {
          tip.style.left = Math.min(e.clientX - rect.left + 14, rect.width - 200) + "px";
          tip.style.top = e.clientY - rect.top + 14 + "px";
        }
      };
      renderer.domElement.addEventListener("pointermove", onMove);

      const ro = new ResizeObserver(() => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        labelRenderer.setSize(w, h);
      });
      ro.observe(wrap);

      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
      });

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointermove", onMove);
        controls.dispose();
        renderer.dispose();
        wrap.contains(renderer.domElement) && wrap.removeChild(renderer.domElement);
        wrap.contains(labelRenderer.domElement) && wrap.removeChild(labelRenderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [rows]);

  return (
    <div className="bench-3d">
      <div className="bench-3d__stage" ref={wrapRef} />
      <div className="bench-3d__tip" ref={tipRef} />
      <div className="bench-3d__legend">
        <span className="bench-3d__leg">
          <i style={{ background: "transparent", border: "1px solid #f0c948", borderRadius: 2 }} />
          Optimal region <em>&middot; &ge;95% &middot; &le;$0.35 &middot; &le;60s per task</em>
        </span>
        {FAMS.map((f) => {
          const row = rows.find((r) => r.model === f.model);
          if (!row) return null;
          const hex = "#" + f.color.toString(16).padStart(6, "0");
          return (
            <span key={f.model} className="bench-3d__leg">
              <i style={{ background: hex }} />
              {f.model} <em>&middot; {row.harness}</em>
            </span>
          );
        })}
      </div>
      <div className="bench-3d__hint">drag to orbit &middot; scroll to zoom &middot; hover a point for details &middot; stronger glow = higher thinking</div>
    </div>
  );
}
