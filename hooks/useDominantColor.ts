import { useEffect, useState } from 'react';

export function useDominantColor(imageUrl: string | null) {
  const [color, setColor] = useState('#d4af37');

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const hex = `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
      setColor(hex);
      document.documentElement.style.setProperty('--accent', hex);
    };
  }, [imageUrl]);

  return color;
}
