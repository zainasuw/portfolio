// Light the hall, in three dimensions: the Warrior and the Thief from Dungeon Adventure, their own models,
// lit by one real light that the visitor carries. Their heads follow it.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const HEROES = [
  { file: 'Knight.glb', x: -0.92, turn: 0.2, hide: ['1H_Sword_Offhand', 'Badge_Shield', 'Rectangle_Shield', 'Spike_Shield', '2H_Sword'] },
  { file: 'Rogue_Hooded.glb', x: 0.98, turn: -0.2, hide: ['1H_Crossbow', '2H_Crossbow', 'Throwable'] },
];
const SPAN_X = 7.4, SPAN_Y = 4.6, MID_Y = 1.5, TORCH_Z = 1.7;

export async function mount(hall, state, base) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const canvas = renderer.domElement;
  canvas.className = 'torch__gl';
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0912);
  scene.fog = new THREE.Fog(0x0d0912, 7, 15);
  const camera = new THREE.PerspectiveCamera(30, 16 / 10, 0.1, 40);
  camera.position.set(0, 1.45, 7.2);
  camera.lookAt(0, 1.12, 0);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 14), new THREE.MeshStandardMaterial({ color: 0x4a3a52, roughness: 0.96 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(22, 9), new THREE.MeshStandardMaterial({ color: 0x3a2d44, roughness: 1 }));
  wall.position.set(0, 4.5, -1.9); wall.receiveShadow = true; scene.add(wall);

  const dim = new THREE.HemisphereLight(0x9a86b8, 0x140e18, 0.16); scene.add(dim);
  const torch = new THREE.PointLight(0xffb463, 26, 11, 1.8);
  torch.castShadow = true; torch.shadow.mapSize.set(1024, 1024); torch.shadow.bias = -0.0012; torch.shadow.normalBias = 0.06; torch.shadow.radius = 4;
  scene.add(torch);
  const sconces = [-0.34, 0, 0.34].map((fx, i) => {
    const l = new THREE.PointLight(0xffa850, 0, 9, 1.8);
    l.position.set(fx * SPAN_X, MID_Y + (0.5 - (i === 1 ? 0.12 : 0.2)) * SPAN_Y, -1.2);
    scene.add(l); return l;
  });

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [anims, ...models] = await Promise.all([loader.loadAsync(base + 'hero-anims.glb'), ...HEROES.map((h) => loader.loadAsync(base + h.file))]);
  const clip = (name) => anims.animations.find((a) => a.name === name);
  const cast = models.map((gltf, i) => {
    const def = HEROES[i], model = gltf.scene;
    for (const n of def.hide) { const part = model.getObjectByName(n); if (part) part.visible = false; }
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    model.position.set(def.x, 0, 0); model.rotation.y = def.turn; scene.add(model);
    const head = model.getObjectByName('head'), chest = model.getObjectByName('chest');
    const mixer = new THREE.AnimationMixer(model);
    // The idle pose for the head and chest is read once; from then on those two bones belong to the torch,
    // so the idle animation is played without them.
    const full = mixer.clipAction(clip('Idle')); full.play(); mixer.update(0);
    const rest = { head: head.quaternion.clone(), chest: chest.quaternion.clone() };
    full.stop(); mixer.uncacheAction(clip('Idle'));
    const calm = clip('Idle').clone(); calm.name = 'IdleBody';
    calm.tracks = calm.tracks.filter((t) => !/^(head|chest)\./.test(t.name));
    const idle = mixer.clipAction(calm); idle.play();
    const cheer = mixer.clipAction(clip('Cheer')); cheer.setLoop(THREE.LoopOnce, 1); cheer.clampWhenFinished = true;
    if (state.reduce) mixer.timeScale = 0;
    return { model, mixer, idle, cheer, head, chest, rest, yaw: 0, pitch: 0, cheering: false };
  });

  hall.prepend(canvas);
  hall.classList.add('is-3d');
  const fit = () => { const r = hall.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); };
  new ResizeObserver(() => { fit(); wake(); }).observe(hall); fit();

  const v = new THREE.Vector3(), hp = new THREE.Vector3(), pq = new THREE.Quaternion(), mq = new THREE.Quaternion(), look = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, 'YXZ');
  const turnBone = (bone, restQ, model, yaw, pitch) => { // from its resting pose, lean a bone toward the light, in the character's own space
    bone.quaternion.copy(restQ);
    bone.parent.updateWorldMatrix(true, false);
    bone.parent.getWorldQuaternion(pq); model.getWorldQuaternion(mq);
    look.setFromEuler(e.set(-pitch, yaw, 0));
    const world = mq.clone().multiply(look).multiply(mq.clone().invert());
    bone.quaternion.premultiply(pq.clone().invert().multiply(world).multiply(pq));
  };

  let last = performance.now();
  let running = false, awakeUntil = 0, cheered = false, litNow = 0;
  const frame = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    torch.position.set((state.x / 100 - 0.5) * SPAN_X, MID_Y + (0.5 - state.y / 100) * SPAN_Y, TORCH_Z);
    const n = state.lit.filter(Boolean).length;
    litNow += (n - litNow) * (1 - Math.exp(-dt * 4));
    state.lit.forEach((on, i) => { sconces[i].intensity += ((on ? 13 : 0) - sconces[i].intensity) * (1 - Math.exp(-dt * 5)); });
    dim.intensity = 0.16 + litNow * 0.2;
    if (state.done && !cheered) { cheered = true; if (!state.reduce) for (const c of cast) {
      c.cheering = true; c.cheer.reset().setEffectiveWeight(1).fadeIn(0.15).play(); c.idle.fadeOut(0.15);
      const back = (ev) => { // when the cheer has played through, ease back to standing
        if (ev.action !== c.cheer) return;
        c.mixer.removeEventListener('finished', back);
        c.idle.reset().setEffectiveWeight(1).fadeIn(0.3).play(); c.cheer.fadeOut(0.3);
        setTimeout(() => { c.cheering = false; }, 320);
      };
      c.mixer.addEventListener('finished', back);
    } awakeUntil = performance.now() + 4200; }
    if (!state.done) cheered = false;
    for (const c of cast) {
      c.mixer.update(dt);
      c.model.updateMatrixWorld(true);
      c.head.getWorldPosition(hp);
      v.copy(torch.position).sub(hp).applyQuaternion(c.model.getWorldQuaternion(mq).invert()); // the light, as this hero sees it
      const yaw = THREE.MathUtils.clamp(Math.atan2(v.x, v.z), -1.05, 1.05), pitch = THREE.MathUtils.clamp(Math.atan2(v.y, Math.hypot(v.x, v.z)), -0.5, 0.62);
      const k = 1 - Math.exp(-dt * 7);
      c.yaw += (yaw - c.yaw) * k; c.pitch += (pitch - c.pitch) * k;
      if (c.cheering) continue; // while they cheer, the whole body belongs to the cheer
      turnBone(c.chest, c.rest.chest, c.model, c.yaw * 0.28, c.pitch * 0.1);
      turnBone(c.head, c.rest.head, c.model, c.yaw * 0.62, c.pitch * 0.85);
    }
    renderer.render(scene, camera);
    if (performance.now() < awakeUntil) requestAnimationFrame(frame); else running = false;
  };
  const wake = (ms = 1600) => { awakeUntil = Math.max(awakeUntil, performance.now() + ms); if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  wake(1200);
  return { wake };
}
