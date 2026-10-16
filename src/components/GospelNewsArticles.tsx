import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { gospelNewsIssues } from '@/lib/content';
import { articleThumbnail, gospelNewsArticles, type ArticleBlock, type ArticleImage, type GospelNewsArticle } from '@/lib/gospel-news';

// Extrait d'un article : son premier paragraphe.
function excerptOf(article: GospelNewsArticle): string {
  const first = article.blocks.find((block) => block.type === 'p');
  return first && first.type === 'p' ? first.text : '';
}

// Page Gospel News, façon magazine : chaque revue a sa couverture (à télécharger)
// à gauche, son article principal en grand et ses autres articles en liste. Sur
// téléphone, la couverture devient une bande compacte au-dessus des articles.
export function GospelNewsList() {
  const issues = [...gospelNewsIssues].sort((a, b) => b.volume - a.volume);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
      {issues.map((issue, issueIndex) => {
        const articles = gospelNewsArticles.filter((article) => article.volume === issue.volume);
        if (articles.length === 0) return null;
        const [main, ...others] = articles;
        return (
          <section
            key={issue.volume}
            aria-labelledby={`revue-${issue.volume}`}
            className={issueIndex > 0 ? 'mt-14 border-t border-gn-line pt-12 sm:mt-16 sm:pt-14' : ''}
          >
            <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
              {/* Couverture de la revue */}
              <Reveal>
                <div className="flex items-center gap-4 lg:sticky lg:top-28 lg:block">
                  <a
                    href={issue.fileUrl}
                    download
                    aria-label={`Télécharger Gospel News, volume ${issue.volume}`}
                    className="gn-spot group relative block aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg bg-gn-black shadow-xl shadow-black/20 sm:w-36 lg:w-full"
                  >
                    <Image src={issue.coverUrl} alt={`Couverture de Gospel News, volume ${issue.volume}`} fill sizes="(max-width: 1024px) 144px, 240px" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                  </a>
                  <div className="min-w-0 lg:mt-5">
                    {issueIndex === 0 && (
                      <span className="inline-block rounded-full bg-gn-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-gn-on-gold">
                        Dernière parution
                      </span>
                    )}
                    <h2 id={`revue-${issue.volume}`} className="mt-2 font-serif text-2xl font-semibold leading-tight text-gn-ink">
                      Volume {issue.volume}
                    </h2>
                    <p className="mt-1 text-sm text-gn-muted-strong">{issue.date}</p>
                    <a
                      href={issue.fileUrl}
                      download
                      className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gn-gold-line px-4 text-sm font-semibold text-gn-gold-dark transition-colors hover:bg-gn-gold hover:text-gn-on-gold"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Télécharger · {issue.size}
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Articles de la revue */}
              <div>
                <Reveal>
                  <Link
                    href={`/departements/gospel-news/${main.slug}`}
                    className="gn-spot group grid overflow-hidden rounded-lg border border-gn-line bg-white md:grid-cols-[1.1fr_1fr]"
                  >
                    <div className="relative aspect-[16/10] bg-gn-black md:aspect-auto md:min-h-[260px]">
                      <Image src={articleThumbnail(main)} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex flex-col p-5 sm:p-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-dark">À la une du volume {issue.volume}</p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-gn-ink transition-colors group-hover:text-gn-gold-dark">
                        {main.title}
                      </h3>
                      {excerptOf(main) && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gn-ink/75">{excerptOf(main)}</p>}
                      <p className="mt-auto pt-4 text-xs text-gn-muted-strong">{main.author ? `Par ${main.author}` : ''}</p>
                      <span className="mt-2 text-sm font-semibold text-gn-gold-dark">Lire l&apos;article →</span>
                    </div>
                  </Link>
                </Reveal>

                {others.length > 0 && (
                  <ul className="mt-5 grid gap-4 md:grid-cols-2">
                    {others.map((article, index) => (
                      <li key={article.slug}>
                        <Reveal className="h-full" delay={(index % 2) * 0.05}>
                          <Link
                            href={`/departements/gospel-news/${article.slug}`}
                            className="gn-spot group flex h-full items-center gap-4 rounded-lg border border-gn-line bg-white p-3"
                          >
                            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-gn-black sm:w-28">
                              <Image src={articleThumbnail(article)} alt="" fill sizes="112px" className="object-cover object-top" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="line-clamp-3 font-serif text-base font-semibold leading-snug text-gn-ink transition-colors group-hover:text-gn-gold-dark sm:text-lg">
                                {article.title}
                              </h3>
                              {article.author && <p className="mt-1.5 text-xs text-gn-muted-strong">Par {article.author}</p>}
                            </div>
                          </Link>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
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
