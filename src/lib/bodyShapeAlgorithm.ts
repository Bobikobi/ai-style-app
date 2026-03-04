// ─── Body Shape Detection Algorithm ───────────────────────────────────────────

export type BodyShapeId = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle';

export interface Measurements {
  bust: number;      // cm
  waist: number;     // cm
  hips: number;      // cm
  shoulders?: number; // cm (optional)
  height?: number;   // cm (optional)
}

export interface DetectionResult {
  shape: BodyShapeId;
  scores: Record<BodyShapeId, number>; // 0–100
  measurements: Measurements;
}

export function detectBodyShape(m: Measurements): DetectionResult {
  const { bust, waist, hips } = m;
  const shoulders = m.shoulders ?? bust * 1.02;

  // Key ratios
  const bustToHip        = bust / hips;
  const waistToHip       = waist / hips;
  const waistToBust      = waist / bust;
  const shoulderToHip    = shoulders / hips;
  const waistDefinition  = 1 - waistToHip; // higher = more defined waist

  // Score each shape (0–100)
  const scores: Record<BodyShapeId, number> = {
    hourglass:           0,
    pear:                0,
    apple:               0,
    rectangle:           0,
    'inverted-triangle': 0,
  };

  // Hourglass: bust ≈ hips (within 5%), waist significantly narrower (<= 75% of bust)
  const hourglassBustHipBalance = Math.max(0, 100 - Math.abs(bustToHip - 1.0) * 500);
  const hourglassWaistDef       = Math.max(0, (0.76 - waistToBust) * 400);
  scores.hourglass = Math.min(100, (hourglassBustHipBalance * 0.5 + hourglassWaistDef * 0.5));

  // Pear: hips clearly wider than bust (>= 8%), waist moderately defined
  const pearHipDominance = Math.max(0, (hips - bust) / bust * 400);
  const pearWaistDef     = Math.max(0, (0.82 - waistToHip) * 300);
  scores.pear = Math.min(100, pearHipDominance * 0.6 + pearWaistDef * 0.4);

  // Apple: little waist definition, wide middle
  const appleWaist = Math.max(0, (waistToHip - 0.80) * 500);
  const appleRound = Math.max(0, (waistToBust - 0.78) * 400);
  scores.apple = Math.min(100, appleWaist * 0.5 + appleRound * 0.5);

  // Rectangle: all measurements similar
  const rectVariance = Math.abs(bustToHip - 1) + Math.abs(waistToHip - 0.88) + Math.abs(shoulderToHip - 1);
  scores.rectangle = Math.max(0, 100 - rectVariance * 150);

  // Inverted triangle: shoulders/bust clearly wider than hips (>= 10%)
  const invShoulderDominance = Math.max(0, (shoulderToHip - 1.08) * 600);
  const invBustDominance     = Math.max(0, (bustToHip - 1.08) * 400);
  scores['inverted-triangle'] = Math.min(100, invShoulderDominance * 0.6 + invBustDominance * 0.4);

  // Determine winning shape
  const shape = (Object.keys(scores) as BodyShapeId[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  return { shape, scores, measurements: m };
}

// ─── 3D Body Profiles ─────────────────────────────────────────────────────────
// 21 radius values for a revolution solid, from feet (y=0) to neck-top (y=1.48)
// Each value is the radius at that height level.
// Body height in 3D units: 1.6 (body) + 0.22 (head sphere) ≈ 1.82 total

export const N_PROFILE_POINTS = 21;

// Fixed Y positions for each profile level (feet at 0, neck-top at 1.48)
export const PROFILE_Y: number[] = [
  0.00,  // 0  feet bottom
  0.06,  // 1  ankle
  0.14,  // 2  lower calf
  0.24,  // 3  calf
  0.32,  // 4  upper calf
  0.40,  // 5  knee
  0.48,  // 6  lower thigh
  0.56,  // 7  mid thigh
  0.64,  // 8  upper thigh
  0.70,  // 9  hip bottom
  0.76,  // 10 hip
  0.82,  // 11 lower abdomen
  0.88,  // 12 waist
  0.94,  // 13 upper waist
  1.00,  // 14 lower ribcage
  1.06,  // 15 ribcage
  1.14,  // 16 bust
  1.22,  // 17 upper chest
  1.30,  // 18 shoulders
  1.40,  // 19 neck
  1.48,  // 20 neck top
];

export const BODY_PROFILES: Record<BodyShapeId, number[]> = {
  // Classic hourglass: bust ≈ hips, pronounced waist dip
  hourglass: [
    0.040, 0.055, 0.080, 0.105, 0.100, 0.092, 0.100, 0.130, 0.160,
    0.195, 0.215, 0.210, 0.145, 0.155, 0.170, 0.190, 0.215, 0.205, 0.225, 0.085, 0.072,
  ],
  // Pear: narrow shoulders→bust, wide hips
  pear: [
    0.040, 0.055, 0.082, 0.108, 0.102, 0.092, 0.120, 0.158, 0.200,
    0.238, 0.260, 0.248, 0.165, 0.165, 0.172, 0.180, 0.183, 0.165, 0.170, 0.082, 0.068,
  ],
  // Apple: wide, undefined waist, fuller middle
  apple: [
    0.040, 0.055, 0.082, 0.108, 0.100, 0.092, 0.108, 0.138, 0.168,
    0.190, 0.210, 0.222, 0.218, 0.222, 0.225, 0.225, 0.218, 0.195, 0.208, 0.085, 0.072,
  ],
  // Rectangle: uniform silhouette, minimal waist definition
  rectangle: [
    0.040, 0.055, 0.078, 0.102, 0.098, 0.088, 0.098, 0.128, 0.158,
    0.178, 0.188, 0.182, 0.168, 0.172, 0.178, 0.182, 0.188, 0.178, 0.192, 0.082, 0.068,
  ],
  // Inverted triangle: wide shoulders, narrow hips
  'inverted-triangle': [
    0.038, 0.050, 0.074, 0.096, 0.090, 0.082, 0.090, 0.112, 0.134,
    0.152, 0.162, 0.155, 0.142, 0.148, 0.158, 0.178, 0.210, 0.220, 0.265, 0.085, 0.072,
  ],
};
