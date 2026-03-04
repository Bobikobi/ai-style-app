import { supabase } from './supabase';

// Dummy interface for the analysis result
export interface AnalysisResult {
  id: string;
  season: string;
  palette: string[];
}

/**
 * Uploads the image to Supabase storage and calls an AI service to analyse it.
 * In this mock implementation, we simply upload the file and return a static result.
 * Replace the AI call with your own vision API or replicate call.
 */
export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const filename = `${Date.now()}-${file.name}`;
  // Upload file to Supabase storage bucket named 'photos'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filename, file as any);
  if (uploadError) {
    throw uploadError;
  }

  // Normally here you would call an external AI API (e.g. replicate) with the public URL of the image
  // For this MVP we return a fixed result and save it to Supabase
  const analysis: AnalysisResult = {
    id: filename,
    season: 'Soft Autumn',
    palette: ['#F4D3B2', '#D9A57B', '#B66D3C', '#8C4F2A', '#5D2E15'],
  };

  // Store analysis and results in Supabase tables
  try {
    // Get public URL of uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filename);
    const imageUrl = publicUrlData?.publicUrl ?? '';

    // Insert into PhotoAnalysis table
    await supabase
      .from('PhotoAnalysis')
      .insert({ id: filename, image_url: imageUrl });

    // Insert into ColorSeasonResults table
    await supabase
      .from('ColorSeasonResults')
      .insert({
        id: filename,
        season: analysis.season,
        palette_json: analysis.palette,
      });
  } catch (e) {
    console.warn('Error storing analysis results', e);
  }

  return analysis;
}
