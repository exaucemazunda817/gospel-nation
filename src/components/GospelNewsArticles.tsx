import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { gospelNewsIssues } from '@/lib/content';
import { articleThumbnail, gospelNewsArticles, type ArticleBlock, type ArticleImage, type GospelNewsArticle } from '@/lib/gospel-news';

// Liste façon fil d'actualité, regroupée par revue (la plus récente d'abord) :
// titre à gauche, vignette à droite, un clic ouvre l'article. Chaque revue se
// télécharge en entier depuis son en-tête.
export function GospelNewsList() {
  const issues = [...gospelNewsIssues].sort((a, b) => b.volume - a.volume);
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
      {issues.map((issue) => {
        const articles = gospelNewsArticles.filter((article) => article.volume === issue.volume);
        if (articles.length === 0) return null;
        return (
          <section key={issue.volume} aria-labelledby={`revue-${issue.volume}`} className="mb-12 last:mb-0">
            <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-gn-gold/60 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-line">Revue</p>
                <h2 id={`revue-${issue.volume}`} className="mt-1 font-serif text-2xl font-semibold text-gn-ink sm:text-3xl">
                  Volume {issue.volume}, {issue.date}
                </h2>
              </div>
              <a
                href={issue.fileUrl}
                download
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gn-gold-line px-5 text-sm font-semibold text-gn-gold-dark transition-colors hover:bg-gn-gold hover:text-gn-on-gold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Télécharger la revue (PDF · {issue.size})
              </a>
            </Reveal>
            <ul className="grid gap-x-14 lg:grid-cols-2">
              {articles.map((article, index) => (
                <li key={article.slug} className="border-b border-gn-line">
                  <Reveal delay={(index % 2) * 0.05}>
                    <Link href={`/departements/gospel-news/${article.slug}`} className="group flex items-center gap-4 py-4 sm:gap-6 sm:py-5">
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-4 font-serif text-lg font-semibold leading-snug text-gn-ink transition-colors group-hover:text-gn-gold-dark sm:text-2xl">
                          {article.title}
                        </h3>
                        {article.author && <p className="mt-2.5 text-xs text-gn-muted-strong">Par {article.author}</p>}
                      </div>
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gn-black sm:h-28 sm:w-44">
                        <Image src={articleThumbnail(article)} alt="" fill sizes="176px" className="object-cover object-top" />
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

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

function Block({ block, lead }: { block: ArticleBlock; lead?: boolean }) {
  switch (block.type) {
    case 'h':
      return (
        <h3 className="mt-8 border-t-2 border-gn-gold/60 pt-3 font-serif text-xl font-bold leading-snug text-gn-ink sm:text-2xl">
          {block.text}
        </h3>
      );
    case 'p':
      return lead ? (
        <p className="mt-4 font-serif text-lg font-medium leading-snug text-gn-ink sm:text-xl">{block.text}</p>
      ) : (
        <p className="mt-3 text-base leading-normal text-gn-ink/85">{block.text}</p>
      );
    case 'quote':
      return (
        <blockquote className="mt-5 rounded-r-lg border-l-4 border-gn-gold bg-gn-gold/10 px-5 py-3">
          <p className="font-serif text-base italic leading-snug text-gn-ink sm:text-lg">« {block.text} »</p>
          {block.source && <footer className="mt-1.5 text-xs font-bold uppercase tracking-wide text-gn-gold-dark">{block.source}</footer>}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="mt-3 space-y-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-base leading-normal text-gn-ink/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gn-gold" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

// Article complet : texte dans une colonne de lecture, images sur toute la largeur.
export function ArticleContent({ article }: { article: GospelNewsArticle }) {
  // Premier paragraphe : chapô, un peu plus grand.
  const leadIndex = article.blocks.findIndex((block) => block.type === 'p');
  return (
    <article className="pb-10 pt-6 sm:pb-12 sm:pt-8">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-dark">
          Vol. {article.volume} · {article.date}
        </p>
        {article.author && <p className="mt-2 text-sm text-gn-muted-strong">Par {article.author}</p>}
      </Reveal>

      {article.blocks.map((block, index) =>
        block.type === 'image' ? (
          <Reveal key={index} className="my-8 sm:my-10">
            <FullWidthImage image={block.image} />
          </Reveal>
        ) : (
          <div key={index} className="mx-auto max-w-3xl px-5 sm:px-6">
            <Block block={block} lead={index === leadIndex} />
          </div>
        )
      )}
    </article>
  );
}
