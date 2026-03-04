import Image from 'next/image';

interface Outfit {
  title: string;
  description: string;
  image: string;
}

const outfits: Outfit[] = [
  {
    title: 'מראה קז\'ואל',
    description:
      "ג'ינס כהה, חולצה רכה ומעיל קל; שילוב צבעים ניטרליים ונגיעה של טון חם מהפלטה האישית.",
    image: '/placeholder.png',
  },
  {
    title: 'סגנון עבודה',
    description:
      'שמלה מחויטת בצבעים מחמיאים עם ז׳קט מחויט ונעליים אלגנטיות.',
    image: '/placeholder.png',
  },
  {
    title: 'ערב אלגנטי',
    description:
      'שמלת ערב ארוכה עם בד נשפך וצווארון פתוח, בצבע עמוק מהפלטה.',
    image: '/placeholder.png',
  },
];

export default function OutfitsPage() {
  return (
    <div className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">השראה לאאוטפיטים</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <div key={outfit.title} className="bg-white rounded shadow p-4 max-w-xs">
            <div className="relative h-48 w-full mb-3">
              <Image
                src={outfit.image}
                alt={outfit.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <h2 className="text-lg font-semibold mb-1">{outfit.title}</h2>
            <p className="text-sm text-gray-700">{outfit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
