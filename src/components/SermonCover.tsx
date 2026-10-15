'use client';

import { useState } from 'react';
import Image from 'next/image';

// Miniature d'une prédication en grand format : on demande la haute définition de
// YouTube (maxresdefault), absente pour certaines vidéos ; si elle manque, on
// retombe sur la miniature standard plutôt que d'afficher une image grise.
export default function SermonCover({
  src,
  priority = false,
  sizes
}: {
  src: string;
  priority?: boolean;
  sizes: string;
}) {
  const hd = src.replace('/hqdefault.jpg', '/maxresdefault.jpg');
  const [current, setCurrent] = useState(hd);
  return (
    <Image
      src={current}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      onError={() => {
        if (current !== src) setCurrent(src);
      }}
      className="object-cover"
    />
  );
}
