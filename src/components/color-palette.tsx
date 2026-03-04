interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="flex space-x-2">
      {colors.map((color) => (
        <div
          key={color}
          className="w-12 h-12 rounded-md border"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
