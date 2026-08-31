import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap, EASE, isTouchDevice, useReducedMotion } from "../lib/core";
import { HOTSPOTS, OVERVIEW_CAM, type Hotspot, type HotspotId } from "../data/content";

export type VillaApi = {
  focus: (id: HotspotId) => void;
  reset: () => void;
};

type SceneProps = {
  onSelect: (id: HotspotId) => void;
  activeId: HotspotId | null;
};

/* ---------------- pool water shader ---------------- */

const WATER_VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 p = position;
    float w = sin(p.x * 1.6 + uTime * 0.9) * 0.5 + sin(p.y * 2.6 - uTime * 0.7) * 0.5;
    p.z += w * 0.045;
    vWave = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const WATER_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vec3 deep = vec3(0.13, 0.29, 0.28);
    vec3 shallow = vec3(0.48, 0.62, 0.55);
    float m = smoothstep(-1.0, 1.0, vWave);
    vec3 col = mix(deep, shallow, m * 0.55 + 0.25);
    float glint = smoothstep(0.72, 1.0, sin(vUv.x * 42.0 + uTime * 1.1) * sin(vUv.y * 36.0 - uTime * 0.8));
    col += glint * 0.10;
    gl_FragColor = vec4(col, 0.96);
  }
`;

function PoolWater() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        transparent: true,
      }),
    []
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.47, 8.4]}>
      <planeGeometry args={[14.4, 4, 48, 14]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ---------------- stylised planting ---------------- */

function Palm({
  position,
  scale = 1,
  lean = 0.14,
}: {
  position: [number, number, number];
  scale?: number;
  lean?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, lean]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 2.6, 6]} />
        <meshStandardMaterial color="#6e5a41" roughness={1} />
      </mesh>
      <group position={[lean * 1.6, 2.6, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 3, 0]}>
            <mesh position={[0.72, 0.05, 0]} rotation={[0, 0, -0.42]} castShadow>
              <boxGeometry args={[1.5, 0.04, 0.26]} />
              <meshStandardMaterial color="#3f5238" roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------------- hotspot markers ---------------- */

function Marker({
  spot,
  index,
  active,
  onSelect,
}: {
  spot: Hotspot;
  index: number;
  active: boolean;
  onSelect: (id: HotspotId) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const { camera } = useThree();
  const reduced = useReducedMotion();

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.quaternion.copy(camera.quaternion);
    const target = active ? 1.3 : hover ? 1.12 : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.12));
    if (!reduced) {
      g.position.y = spot.marker[1] + Math.sin(state.clock.elapsedTime * 1.3 + index * 1.7) * 0.07;
    }
  });

  return (
    <group
      ref={ref}
      position={spot.marker}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(spot.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <ringGeometry args={[0.26, 0.32, 40]} />
        <meshBasicMaterial
          color={active ? "#e6c58c" : "#b08d5f"}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <circleGeometry args={[0.075, 24]} />
        <meshBasicMaterial color="#f2e6ca" />
      </mesh>
    </group>
  );
}

/* ---------------- architecture ---------------- */

function VillaModel() {
  const fins = useMemo(
    () => Array.from({ length: 12 }, (_, i) => -6.6 + i * 0.55),
    []
  );
  const palms: { p: [number, number, number]; s: number; l: number }[] = [
    { p: [8, 0.3, 4], s: 1.1, l: 0.16 },
    { p: [10.5, 0.3, 8], s: 1, l: -0.12 },
    { p: [12.5, 0.3, 2], s: 1.25, l: 0.2 },
    { p: [9, 0.3, 10.5], s: 0.9, l: -0.18 },
    { p: [13.5, 0.3, 7], s: 1.15, l: 0.1 },
    { p: [-10.5, 0.3, 6], s: 1, l: -0.15 },
    { p: [-11, 0.3, -3], s: 1.2, l: 0.12 },
    { p: [6.5, 0.3, -8], s: 1, l: 0.2 },
  ];
  return (
    <group>
      {/* ground + plot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[48, 48]} />
        <meshStandardMaterial color="#1b1812" roughness={1} />
      </mesh>
      <mesh position={[2, 0.15, 1]} receiveShadow castShadow>
        <boxGeometry args={[36, 0.3, 26]} />
        <meshStandardMaterial color="#c6b795" roughness={0.95} />
      </mesh>
      {/* lawn */}
      <mesh position={[9.5, 0.32, 4]} receiveShadow>
        <boxGeometry args={[11, 0.05, 9]} />
        <meshStandardMaterial color="#3d4a36" roughness={1} />
      </mesh>
      <mesh position={[-9.5, 0.32, 5]} receiveShadow>
        <boxGeometry args={[8, 0.05, 8]} />
        <meshStandardMaterial color="#41503a" roughness={1} />
      </mesh>
      <mesh position={[-4, 0.32, -8]} receiveShadow>
        <boxGeometry args={[10, 0.05, 6]} />
        <meshStandardMaterial color="#3d4a36" roughness={1} />
      </mesh>

      {/* entry path + stepping stones */}
      <mesh position={[1.6, 0.32, -8.4]} receiveShadow>
        <boxGeometry args={[1.7, 0.05, 7]} />
        <meshStandardMaterial color="#a8987a" roughness={1} />
      </mesh>
      {[-12.4, -13.6, -14.8].map((z, i) => (
        <mesh key={i} position={[1.6, 0.32, z]}>
          <cylinderGeometry args={[0.45, 0.45, 0.06, 20]} />
          <meshStandardMaterial color="#9c8d70" roughness={1} />
        </mesh>
      ))}

      {/* living pavilion */}
      <mesh position={[-2.8, 1.8, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 3, 5]} />
        <meshStandardMaterial color="#cfc3a9" roughness={0.92} />
      </mesh>
      <mesh position={[-2.8, 1.6, 1.03]}>
        <boxGeometry args={[8.3, 2.6, 0.08]} />
        <meshStandardMaterial
          color="#93a8a2"
          metalness={0.35}
          roughness={0.12}
          transparent
          opacity={0.32}
        />
      </mesh>
      {fins.map((x, i) => (
        <mesh key={i} position={[x, 1.7, 1.4]} castShadow>
          <boxGeometry args={[0.07, 2.8, 0.65]} />
          <meshStandardMaterial color="#4e3b28" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[-2.8, 3.42, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[9.6, 0.22, 6.2]} />
        <meshStandardMaterial color="#b3ada0" roughness={0.9} />
      </mesh>

      {/* dining pavilion */}
      <mesh position={[3.4, 1.55, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 2.5, 5]} />
        <meshStandardMaterial color="#5a4632" roughness={0.85} />
      </mesh>
      <mesh position={[3.4, 2.9, -1.2]} castShadow>
        <boxGeometry args={[4.5, 0.18, 5.9]} />
        <meshStandardMaterial color="#b3ada0" roughness={0.9} />
      </mesh>
      {/* dining table on terrace */}
      <mesh position={[3.4, 0.75, 3.4]} castShadow>
        <boxGeometry args={[2.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#4e3b28" roughness={0.8} />
      </mesh>

      {/* master wing (upper) */}
      <mesh position={[-4.2, 4.48, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 1.9, 4.6]} />
        <meshStandardMaterial color="#cfc3a9" roughness={0.92} />
      </mesh>
      <mesh position={[-4.2, 4.5, 0.84]}>
        <boxGeometry args={[5.4, 1.2, 0.07]} />
        <meshStandardMaterial
          color="#93a8a2"
          metalness={0.35}
          roughness={0.12}
          transparent
          opacity={0.32}
        />
      </mesh>
      <mesh position={[-4.2, 5.54, -1.3]} castShadow>
        <boxGeometry args={[6.5, 0.2, 5.5]} />
        <meshStandardMaterial color="#a8a294" roughness={0.9} />
      </mesh>

      {/* terrace deck */}
      <mesh position={[-0.5, 0.36, 3.6]} receiveShadow>
        <boxGeometry args={[12.5, 0.12, 4.6]} />
        <meshStandardMaterial color="#6b5138" roughness={0.9} />
      </mesh>

      {/* pool */}
      <mesh position={[-1, 0.28, 8.4]} castShadow receiveShadow>
        <boxGeometry args={[15.4, 0.5, 5]} />
        <meshStandardMaterial color="#e3d9c2" roughness={0.8} />
      </mesh>
      <PoolWater />

      {/* hedges + walls */}
      <mesh position={[6.9, 0.55, 8]} castShadow>
        <boxGeometry args={[0.7, 0.5, 6]} />
        <meshStandardMaterial color="#374632" roughness={1} />
      </mesh>
      <mesh position={[9.5, 0.52, 0.4]} castShadow>
        <boxGeometry args={[6, 0.45, 0.7]} />
        <meshStandardMaterial color="#374632" roughness={1} />
      </mesh>
      <mesh position={[-16, 0.75, 1]}>
        <boxGeometry args={[0.25, 0.9, 26]} />
        <meshStandardMaterial color="#8f8474" roughness={1} />
      </mesh>
      <mesh position={[-7, 0.75, -12]}>
        <boxGeometry args={[14, 0.9, 0.25]} />
        <meshStandardMaterial color="#8f8474" roughness={1} />
      </mesh>
      <mesh position={[11, 0.75, -12]}>
        <boxGeometry args={[12, 0.9, 0.25]} />
        <meshStandardMaterial color="#8f8474" roughness={1} />
      </mesh>

      {palms.map((p, i) => (
        <Palm key={i} position={p.p} scale={p.s} lean={p.l} />
      ))}
    </group>
  );
}

/* ---------------- camera rig ---------------- */

function Inner({
  innerRef,
  onSelect,
  activeId,
}: SceneProps & { innerRef: React.RefObject<VillaApi | null> }) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const reduced = useReducedMotion();

  useImperativeHandle(
    innerRef,
    () => ({
      focus: (id: HotspotId) => {
        const spot = HOTSPOTS.find((h) => h.id === id);
        if (!spot || !controlsRef.current) return;
        const controls = controlsRef.current;
        controls.autoRotate = false;
        controls.enabled = false;
        gsap.to(camera.position, {
          x: spot.camPos[0],
          y: spot.camPos[1],
          z: spot.camPos[2],
          duration: reduced ? 0.3 : 1.8,
          ease: EASE.inOut,
        });
        gsap.to(controls.target, {
          x: spot.camTarget[0],
          y: spot.camTarget[1],
          z: spot.camTarget[2],
          duration: reduced ? 0.3 : 1.8,
          ease: EASE.inOut,
          onUpdate: () => controls.update(),
          onComplete: () => {
            controls.enabled = true;
          },
        });
      },
      reset: () => {
        const controls = controlsRef.current;
        if (!controls) return;
        controls.enabled = false;
        gsap.to(camera.position, {
          x: OVERVIEW_CAM.pos[0],
          y: OVERVIEW_CAM.pos[1],
          z: OVERVIEW_CAM.pos[2],
          duration: reduced ? 0.3 : 1.6,
          ease: EASE.inOut,
        });
        gsap.to(controls.target, {
          x: OVERVIEW_CAM.target[0],
          y: OVERVIEW_CAM.target[1],
          z: OVERVIEW_CAM.target[2],
          duration: reduced ? 0.3 : 1.6,
          ease: EASE.inOut,
          onUpdate: () => controls.update(),
          onComplete: () => {
            controls.enabled = true;
          },
        });
      },
    }),
    [camera, reduced]
  );

  return (
    <>
      <color attach="background" args={["#14120e"]} />
      <fog attach="fog" args={["#14120e", 38, 90]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#e8e0ce", "#2e2a22", 0.55]} />
      <directionalLight
        color="#ffd9a6"
        intensity={1.5}
        position={[14, 18, 9]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <directionalLight color="#9fb2c8" intensity={0.3} position={[-14, 10, -8]} />

      <VillaModel />

      {HOTSPOTS.map((spot, i) => (
        <Marker
          key={spot.id}
          spot={spot}
          index={i}
          active={activeId === spot.id}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        target={OVERVIEW_CAM.target}
        enablePan={false}
        minDistance={7}
        maxDistance={34}
        minPolarAngle={0.3}
        maxPolarAngle={1.38}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
        onStart={() => {
          if (controlsRef.current) controlsRef.current.autoRotate = false;
        }}
      />
    </>
  );
}

const VillaScene = forwardRef<VillaApi, SceneProps>(function VillaScene(
  { onSelect, activeId },
  ref
) {
  const innerRef = useRef<VillaApi | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: (id) => innerRef.current?.focus(id),
      reset: () => innerRef.current?.reset(),
    }),
    []
  );
  const touch = isTouchDevice();
  return (
    <Canvas
      shadows={!touch}
      dpr={touch ? [1, 1.25] : [1, 1.75]}
      camera={{ position: OVERVIEW_CAM.pos, fov: 38, near: 0.1, far: 140 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute !inset-0"
    >
      <Inner innerRef={innerRef} onSelect={onSelect} activeId={activeId} />
    </Canvas>
  );
});

export default VillaScene;
