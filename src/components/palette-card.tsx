interface PaletteCardProps {
  title: string;
  colors: string[];
}

export default function PaletteCard({ title, colors }: PaletteCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white max-w-xs">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
