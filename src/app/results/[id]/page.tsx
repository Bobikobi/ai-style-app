import ColorPalette from '@/components/color-palette';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface Params {
  params: { id: string };
}

export default async function ResultsPage({ params }: Params) {
  const { id } = params;
  // Fetch the stored result from Supabase table `ColorSeasonResults`
  const { data, error } = await supabase
    .from('ColorSeasonResults')
    .select('season, palette_json')
    .eq('id', id)
    .single();
  if (error || !data) {
    return notFound();
  }
  // Parse palette from stored JSON (array of hex strings)
  const palette: string[] = Array.isArray(data.palette_json)
    ? data.palette_json
    : JSON.parse(data.palette_json || '[]');

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-orange-50">
      <h1 className="text-3xl font-bold mb-4">תוצאות ניתוח</h1>
      <p className="mb-4">
        זיהינו שהעונה שלך היא <strong>{data.season}</strong>
      </p>
      <ColorPalette colors={palette} />
    </div>
  );
}
