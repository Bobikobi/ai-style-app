// ─── Pollinations.ai — free image generation, no API key required ─────────────
// Images are deterministic per seed, so same outfit/season always returns same image.

const BASE = 'https://image.pollinations.ai/prompt';

const CATEGORY_PROMPTS: Record<string, string> = {
  casual:   'minimalist casual fashion editorial, neutral beige tones, clean bright studio, model wearing simple elegant outfit, Vogue style',
  work:     'professional tailored workwear fashion editorial, ivory and charcoal palette, modern corporate chic, Zara lookbook',
  evening:  'elegant evening fashion editorial, dramatic lighting, rich tones, model in sophisticated gown or midi dress, Harpers Bazaar',
  sport:    'sporty chic athleisure editorial, monochrome palette, clean studio, Nike editorial style, modern activewear',
  romantic: 'romantic feminine fashion editorial, soft pastel light, flowing silk fabric, gentle warm tones, editorial photography',
  bohemian: 'bohemian fashion editorial, earthy neutral tones, natural light, linen textures, free-spirit styling',
};

const SEASON_PROMPTS: Record<string, string> = {
  spring:  'spring fashion color mood board, warm peachy ivory tones, fresh blossoms, golden hour natural light, editorial',
  summer:  'summer fashion color mood board, cool muted blues and whites, breezy linen, soft pastel light, editorial',
  autumn:  'autumn fashion color mood board, rich earthy warm tones, camel rust terracotta, cozy textures, golden light, editorial',
  winter:  'winter fashion color mood board, stark deep navy black ivory, dramatic shadows, minimalist editorial, cold crisp',
};

function buildUrl(prompt: string, width: number, height: number, seed: number): string {
  const full = `${prompt}, no text, no watermark, high quality fashion photography`;
  return `${BASE}/${encodeURIComponent(full)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

/** Returns a fashion editorial image URL for an outfit card */
export function getOutfitImageUrl(outfitId: number, category: string): string {
  const prompt = CATEGORY_PROMPTS[category] ?? 'fashion editorial photography, neutral tones, clean aesthetic';
  return buildUrl(prompt, 600, 480, outfitId * 137);
}

/** Returns a color mood-board image URL for a season */
export function getSeasonMoodUrl(season: string, seed: number): string {
  const prompt = SEASON_PROMPTS[season] ?? 'fashion color mood board, neutral elegant tones';
  return buildUrl(prompt, 600, 340, seed);
}
