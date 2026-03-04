'use client';
import { useRef, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BODY_PROFILES,
  PROFILE_Y,
  N_PROFILE_POINTS,
  type BodyShapeId,
} from '@/lib/bodyShapeAlgorithm';

// ─── Error Boundary ───────────────────────────────────────────────────────────
class AvatarErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.warn('[BodyAvatar3D] error:', err); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="w-full h-full flex items-center justify-center bg-neutral-900">
          <p className="text-stone-500 text-xs tracking-widest uppercase">Preview unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const N_SEGS = 48;
const LERP_SPEED = 0.06;
const HEAD_Y = 1.62;
const HEAD_R = 0.135;
const DEFAULT_SHAPE: BodyShapeId = 'hourglass';

// ─── Geometry builders ────────────────────────────────────────────────────────
function buildPositions(profile: number[]): Float32Array {
  const out = new Float32Array(N_SEGS * N_PROFILE_POINTS * 3);
  for (let i = 0; i < N_PROFILE_POINTS; i++) {
    const r = profile[i];
    const y = PROFILE_Y[i];
    for (let j = 0; j < N_SEGS; j++) {
      const theta = (j / N_SEGS) * Math.PI * 2;
      const base = (i * N_SEGS + j) * 3;
      out[base]     = r * Math.cos(theta);
      out[base + 1] = y;
      out[base + 2] = r * Math.sin(theta);
    }
  }
  return out;
}

function buildIndices(): Uint32Array {
  const out = new Uint32Array((N_PROFILE_POINTS - 1) * N_SEGS * 6);
  let k = 0;
  for (let i = 0; i < N_PROFILE_POINTS - 1; i++) {
    for (let j = 0; j < N_SEGS; j++) {
      const a = i * N_SEGS + j;
      const b = i * N_SEGS + (j + 1) % N_SEGS;
      const c = (i + 1) * N_SEGS + j;
      const d = (i + 1) * N_SEGS + (j + 1) % N_SEGS;
      out[k++] = a; out[k++] = c; out[k++] = b;
      out[k++] = b; out[k++] = c; out[k++] = d;
    }
  }
  return out;
}

// ─── Drag state shared across body + head ─────────────────────────────────────
interface DragState {
  active: boolean;
  lastX: number;
  manualY: number;
  autoY: number;
  useAuto: boolean;
}

// ─── Scene (body + head + platform + lights) ─────────────────────────────────
function Scene({
  shapeId,
  drag,
}: {
  shapeId: BodyShapeId;
  drag: React.MutableRefObject<DragState>;
}) {
  const groupRef       = useRef<THREE.Group>(null!);
  const currentProfile = useRef<number[]>([...BODY_PROFILES[DEFAULT_SHAPE]]);
  const targetRef      = useRef(BODY_PROFILES[shapeId]);
  targetRef.current    = BODY_PROFILES[shapeId];

  // Body geometry — built once
  const geoRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geoRef.current) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buildPositions(BODY_PROFILES[DEFAULT_SHAPE]), 3));
    geo.setIndex(new THREE.BufferAttribute(buildIndices(), 1));
    geo.computeVertexNormals();
    geoRef.current = geo;
  }

  useFrame(() => {
    // ---- morph profile ----
    const cp = currentProfile.current;
    const tp = targetRef.current;
    let dirty = false;
    for (let i = 0; i < N_PROFILE_POINTS; i++) {
      const diff = tp[i] - cp[i];
      if (Math.abs(diff) > 0.0002) {
        cp[i] += diff * LERP_SPEED;
        dirty = true;
      }
    }
    if (dirty && geoRef.current) {
      const pos = geoRef.current.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < N_PROFILE_POINTS; i++) {
        const r = cp[i];
        const y = PROFILE_Y[i];
        for (let j = 0; j < N_SEGS; j++) {
          const theta = (j / N_SEGS) * Math.PI * 2;
          const base = (i * N_SEGS + j) * 3;
          arr[base]     = r * Math.cos(theta);
          arr[base + 1] = y;
          arr[base + 2] = r * Math.sin(theta);
        }
      }
      pos.needsUpdate = true;
      geoRef.current.computeVertexNormals();
    }

    // ---- rotation ----
    if (!groupRef.current) return;
    const d = drag.current;
    if (d.useAuto) {
      d.autoY += 0.004;
      groupRef.current.rotation.y = d.autoY;
    } else {
      groupRef.current.rotation.y = d.manualY;
    }
  });

  const bodyMat  = { color: '#E8DDD0', roughness: 0.55, metalness: 0.05 } as const;
  const platMat  = { color: '#D4CFC9', roughness: 0.8,  metalness: 0.02 } as const;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 3]}   intensity={1.6} />
      <directionalLight position={[-3, 3, -2]} intensity={0.6} color="#d0e8ff" />
      <directionalLight position={[0, -2, 3]}  intensity={0.3} color="#fff5e0" />

      <group ref={groupRef}>
        {/* Body */}
        <mesh geometry={geoRef.current!} position={[0, -0.75, 0]}>
          <meshStandardMaterial {...bodyMat} />
        </mesh>
        {/* Head */}
        <mesh position={[0, HEAD_Y - 0.75, 0]}>
          <sphereGeometry args={[HEAD_R, 32, 32]} />
          <meshStandardMaterial {...bodyMat} />
        </mesh>
        {/* Platform */}
        <mesh position={[0, -0.77, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.04, 48]} />
          <meshStandardMaterial {...platMat} />
        </mesh>
      </group>
    </>
  );
}

// ─── Labels ───────────────────────────────────────────────────────────────────
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
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    manualY: 0,
    autoY: 0,
    useAuto: true,
  });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = true;
    drag.current.lastX  = e.clientX;
    drag.current.useAuto = false;
    drag.current.manualY = drag.current.autoY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX    = e.clientX;
    drag.current.manualY += dx * 0.012;
    drag.current.autoY    = drag.current.manualY;
  }

  function onPointerUp() {
    drag.current.active = false;
  }

  return (
    <div
      className={`relative select-none ${className ?? ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ cursor: 'grab' }}
    >
      <AvatarErrorBoundary>
        <Canvas
          camera={{ position: [0, 0.15, 3.2], fov: 38 }}
          style={{ background: 'transparent', display: 'block', width: '100%', height: '100%' }}
          dpr={[1, 1.5]}
        >
          <Scene shapeId={shapeId} drag={drag} />
        </Canvas>
      </AvatarErrorBoundary>

      {/* Labels */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-0.5">
          {SHAPE_DESC[shapeId]}
        </p>
        <p className="text-lg font-light tracking-widest text-stone-700">
          {SHAPE_LABEL[shapeId]}
        </p>
      </div>
      <p className="absolute top-3 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-stone-300 pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
}
