'use client';

import { useState } from 'react';
import Image from 'next/image';
import { youtubeEmbedUrl } from '@/lib/sermons';

// Lecteur « à la demande » : tant qu'on n'a pas appuyé sur lecture, on n'affiche
// que la miniature. Le lecteur YouTube (plus d'un mégaoctet) n'est chargé qu'au
// clic, ce qui ménage les données mobiles, et YouTube ne dépose rien chez le
// visiteur avant qu'il ait lancé la vidéo.
export default function YoutubePlayer({
  videoId,
  title,
  coverUrl
}: {
  videoId: string;
  title: string;
  coverUrl: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  // Sur toute la largeur de l'écran, la miniature standard (480 px) serait
  // floue : on demande la haute définition, que YouTube ne fournit pas pour
  // toutes les vidéos. Si elle manque, on retombe sur la miniature standard.
  const hdCover = coverUrl ? coverUrl.replace('/hqdefault.jpg', '/maxresdefault.jpg') : null;
  const [cover, setCover] = useState(hdCover);

  // Pleine largeur de l'écran ; 16/9 sur téléphone, mais plafonné à 75 % de la
  // hauteur de l'écran sur grand écran (bandes noires sur les côtés plutôt
  // qu'une vidéo démesurément haute).

  return (
    <div className="relative mx-auto aspect-video max-h-[75vh] w-full overflow-hidden bg-gn-black">
      {playing ? (
        <iframe
          src={`${youtubeEmbedUrl(videoId)}&autoplay=1`}
          title={`Vidéo : ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Lire la vidéo : ${title}`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          {cover && (
            <Image
              src={cover}
              alt=""
              fill
              priority
              sizes="100vw"
              onError={() => {
                if (cover !== coverUrl) setCover(coverUrl);
              }}
              className="object-cover"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20 transition-colors group-hover:from-black/55" />
          {/* Anneau qui pulse doucement : il désigne l'action principale de la page et
              s'arrête au survol. */}
          <span className="gn-play-ring relative flex h-20 w-20 items-center justify-center rounded-full border border-gn-gold/70 bg-gn-black/65 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--gn-gold)" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
