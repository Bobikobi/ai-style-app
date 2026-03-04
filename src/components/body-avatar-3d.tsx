'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  BODY_PROFILES,
  PROFILE_Y,
  N_PROFILE_POINTS,
  type BodyShapeId,
} from '@/lib/bodyShapeAlgorithm';

// ─── Constants ────────────────────────────────────────────────────────────────
const N_SEGS = 56; // smoothness of revolution
const LERP_SPEED = 0.06;
const HEAD_Y = 1.62;
const HEAD_R = 0.135;
const DEFAULT_SHAPE: BodyShapeId = 'hourglass';

// ─── Build Revolution Solid Geometry ──────────────────────────────────────────
function buildPositions(profile: number[]): Float32Array {
  const positions = new Float32Array(N_SEGS * N_PROFILE_POINTS * 3);
  for (let i = 0; i < N_PROFILE_POINTS; i++) {
    const r = profile[i];
    const y = PROFILE_Y[i];
    for (let j = 0; j < N_SEGS; j++) {
      const theta = (j / N_SEGS) * Math.PI * 2;
      const idx = (i * N_SEGS + j) * 3;
      positions[idx]     = r * Math.cos(theta);
      positions[idx + 1] = y;
      positions[idx + 2] = r * Math.sin(theta);
    }
  }
  return positions;
}

function buildIndices(): Uint32Array {
  const indices = new Uint32Array((N_PROFILE_POINTS - 1) * N_SEGS * 6);
  let idx = 0;
  for (let i = 0; i < N_PROFILE_POINTS - 1; i++) {
    for (let j = 0; j < N_SEGS; j++) {
      const a = i * N_SEGS + j;
      const b = i * N_SEGS + (j + 1) % N_SEGS;
      const c = (i + 1) * N_SEGS + j;
      const d = (i + 1) * N_SEGS + (j + 1) % N_SEGS;
      indices[idx++] = a; indices[idx++] = c; indices[idx++] = b;
      indices[idx++] = b; indices[idx++] = c; indices[idx++] = d;
    }
  }
  return indices;
}

function computeNormals(geo: THREE.BufferGeometry) {
  geo.computeVertexNormals();
}

// ─── Animated Body Mesh ───────────────────────────────────────────────────────
function AvatarBody({ shapeId }: { shapeId: BodyShapeId }) {
  const meshRef        = useRef<THREE.Mesh>(null!);
  const currentProfile = useRef<number[]>([...BODY_PROFILES[DEFAULT_SHAPE]]);
  const autoRotY       = useRef(0);
  const userInteracted = useRef(false);

  // Build geometry once — stable reference via ref so Strict Mode double-invoke is safe
  const geoRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geoRef.current) {
    const geo = new THREE.BufferGeometry();
    const positions = buildPositions(BODY_PROFILES[DEFAULT_SHAPE]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(buildIndices(), 1));
    computeNormals(geo);
    geoRef.current = geo;
  }

  const targetProfileRef = useRef(BODY_PROFILES[shapeId]);
  targetProfileRef.current = BODY_PROFILES[shapeId];

  useFrame(() => {
    const cp     = currentProfile.current;
    const target = targetProfileRef.current;
    let changed  = false;
    for (let i = 0; i < N_PROFILE_POINTS; i++) {
      const diff = target[i] - cp[i];
      if (Math.abs(diff) > 0.0002) {
        cp[i] += diff * LERP_SPEED;
        changed = true;
      }
    }

    if (changed && geoRef.current) {
      const pos = geoRef.current.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < N_PROFILE_POINTS; i++) {
        const r = cp[i];
        const y = PROFILE_Y[i];
        for (let j = 0; j < N_SEGS; j++) {
          const theta = (j / N_SEGS) * Math.PI * 2;
          const idx   = (i * N_SEGS + j) * 3;
          arr[idx]     = r * Math.cos(theta);
          arr[idx + 1] = y;
          arr[idx + 2] = r * Math.sin(theta);
        }
      }
      pos.needsUpdate = true;
      geoRef.current.computeVertexNormals();
    }

    if (meshRef.current) {
      autoRotY.current += 0.003;
      if (!userInteracted.current) meshRef.current.rotation.y = autoRotY.current;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geoRef.current!}
      castShadow
      receiveShadow
      position={[0, -0.75, 0]}
      onPointerDown={() => { userInteracted.current = true; }}
    >
      <meshStandardMaterial color="#E8DDD0" roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

// ─── Head ─────────────────────────────────────────────────────────────────────
function AvatarHead({ shapeId }: { shapeId: BodyShapeId }) {
  const headRef = useRef<THREE.Mesh>(null!);
  const autoRotY = useRef(0);
  const userInteracted = useRef(false);

  useFrame(() => {
    autoRotY.current += 0.003;
    if (headRef.current && !userInteracted.current) {
      headRef.current.rotation.y = autoRotY.current;
    }
  });

  return (
    <mesh
      ref={headRef}
      position={[0, HEAD_Y - 0.75, 0]}
      castShadow
      onPointerDown={() => { userInteracted.current = true; }}
    >
      <sphereGeometry args={[HEAD_R, 32, 32]} />
      <meshStandardMaterial
        color="#E8DDD0"
        roughness={0.55}
        metalness={0.05}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

// ─── Platform ─────────────────────────────────────────────────────────────────
function Platform() {
  return (
    <mesh position={[0, -0.77, 0]} receiveShadow>
      <cylinderGeometry args={[0.38, 0.42, 0.04, 48]} />
      <meshStandardMaterial color="#D4CFC9" roughness={0.8} metalness={0.02} />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ shapeId }: { shapeId: BodyShapeId }) {
  return (
    <>
      {/* Studio lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024] as any}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#d0e8ff" />
      <directionalLight position={[0, -2, 3]}  intensity={0.25} color="#fff5e0" />

      <AvatarBody shapeId={shapeId} />
      <AvatarHead shapeId={shapeId} />
      <Platform />

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={5.5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 1.7}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// ─── Shape Labels ──────────────────────────────────────────────────────────────
const SHAPE_LABEL: Record<BodyShapeId, string> = {
  hourglass:           'שעון חול',
  pear:                'אגס',
  apple:               'תפוח',
  rectangle:           'מלבן',
  'inverted-triangle': 'משולש הפוך',
};

const SHAPE_DESC: Record<BodyShapeId, string> = {
  hourglass:           'Bust ≈ Hips · Defined Waist',
  pear:                'Hips > Bust · Narrow Shoulders',
  apple:               'Fuller Middle · Undefined Waist',
  rectangle:           'Uniform Silhouette · Minimal Curve',
  'inverted-triangle': 'Wide Shoulders · Narrow Hips',
};

// ─── Main Export ───────────────────────────────────────────────────────────────
interface Props {
  shapeId: BodyShapeId;
  className?: string;
}

export default function BodyAvatar3D({ shapeId, className }: Props) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0.15, 3.2], fov: 38 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Scene shapeId={shapeId} />
      </Canvas>

      {/* Shape label overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-0.5">
          {SHAPE_DESC[shapeId]}
        </p>
        <p className="text-lg font-light tracking-widest text-stone-700">
          {SHAPE_LABEL[shapeId]}
        </p>
      </div>

      {/* Drag hint */}
      <p className="absolute top-3 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-stone-300 pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
}
