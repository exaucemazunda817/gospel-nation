import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { gospelNewsArticles, type ArticleBlock, type ArticleImage } from '@/lib/gospel-news';

// Les images occupent toute la largeur du site. Une photo horizontale remplit la bande ;
// une affiche verticale est montrée en entier, sur un fond flou fait de sa propre image,
// pour ne jamais couper le texte qu'elle contient.
function FullWidthImage({ image }: { image: ArticleImage }) {
  if (image.kind === 'photo') {
    return (
      <div className="relative aspect-[4/3] max-h-[75vh] w-full overflow-hidden bg-gn-black sm:aspect-[16/9]">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className="relative h-[70vh] min-h-[380px] w-full overflow-hidden bg-gn-black sm:h-[80vh]">
      <Image src={image.src} alt="" fill sizes="64px" aria-hidden="true" className="scale-110 object-cover opacity-70 blur-2xl" />
      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 900px" className="object-contain" />
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h':
      return <h3 className="mt-10 font-serif text-2xl font-semibold leading-snug text-gn-ink">{block.text}</h3>;
    case 'p':
      return <p className="mt-5 text-base leading-relaxed text-gn-ink/80">{block.text}</p>;
    case 'quote':
      return (
        <blockquote className="mt-6 border-l-2 border-gn-gold pl-5">
          <p className="font-serif text-lg italic leading-relaxed text-gn-ink">« {block.text} »</p>
          {block.source && <footer className="mt-2 text-xs font-bold uppercase tracking-wide text-gn-muted-strong">{block.source}</footer>}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="mt-5 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-base leading-relaxed text-gn-ink/80">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gn-gold" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function GospelNewsArticles() {
  return (
    <div>
      {gospelNewsArticles.map((article) => (
        <article key={article.slug} id={article.slug} className="scroll-mt-24 border-b border-gn-line py-12 last:border-b-0 sm:py-16">
          <Reveal className="mx-auto max-w-3xl px-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-dark">
              Vol. {article.volume} · {article.date}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-snug text-gn-ink sm:text-4xl">{article.title}</h2>
            {article.author && <p className="mt-2 text-sm text-gn-muted-strong">Par {article.author}</p>}
          </Reveal>

          {article.blocks.map((block, index) =>
            block.type === 'image' ? (
              <Reveal key={index} className="my-8 sm:my-10">
                <FullWidthImage image={block.image} />
              </Reveal>
            ) : (
              <div key={index} className="mx-auto max-w-3xl px-5 sm:px-6">
                <Block block={block} />
              </div>
            )
          )}
        </article>
      ))}
    </div>
  );
}
