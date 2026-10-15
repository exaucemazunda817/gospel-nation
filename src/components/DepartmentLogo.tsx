import Image from 'next/image';

// Logo de département : toujours une pastille ronde posée au centre d'une tuile
// sombre, quelle que soit la forme du fichier d'origine (les 13 logos ont été
// refaits en cercles de même taille dans public/departments/logo/). Un fin
// anneau doré garde visibles les logos à fond noir sur la tuile noire.
// À poser dans un parent positionné (relative / absolute) ; `cover` place la
// pastille dans la moitié haute quand le bas de la carte porte du texte.
export default function DepartmentLogo({
  slug,
  name,
  sizes = '240px',
  cover = false
}: {
  slug: string;
  name: string;
  sizes?: string;
  cover?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex justify-center bg-gradient-to-br from-gn-black-soft to-gn-black ${
        cover ? 'items-start pt-10 sm:items-center sm:pt-0' : 'items-center'
      }`}
    >
      <div className="gn-dept-logo relative aspect-square h-[72%] overflow-hidden rounded-full ring-1 ring-gn-gold/45 max-sm:h-auto max-sm:w-[46%] sm:h-[78%]">
        <Image src={`/departments/logo/${slug}.webp`} alt={name} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
