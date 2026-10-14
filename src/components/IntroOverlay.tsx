'use client';

import { church } from '@/lib/content';

// Écran d'ouverture (repris du principe de One Love, avec le logo de l'église) :
// le globe apparaît et se précise, « GOSPEL » s'écrit, « NATION » s'écrit à son
// tour et la croix s'illumine en pulsant, la devise s'affiche, puis le volet se
// referme en cercle sur le site. Joué à chaque chargement complet ou
// actualisation de page, jamais pour l'espace admin ni avec « Réduire les
// animations ». Tout est piloté en CSS (globals.css, html[data-intro]) : la page
// n'est jamais bloquée, même si le JavaScript arrive tard. Le bouton permet de
// passer l'intro (et sert aussi de premier geste : il autorise le son de la vidéo).
//
// Le logo est découpé en trois bandes par `clip-path` (globe, GOSPEL, NATION) :
// la petite devise gravée en bas du logo est volontairement laissée de côté, elle
// est remplacée par la devise en texte lisible.
export default function IntroOverlay() {
  return (
    <div className="gn-intro" aria-hidden="true">
      <div className="gn-intro-halo" />
      <div className="gn-intro-logo">
        <div className="gn-intro-part gn-intro-part-globe">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gospel-nation.png" alt="" width={566} height={429} />
        </div>
        <div className="gn-intro-part gn-intro-part-gospel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gospel-nation.png" alt="" width={566} height={429} />
        </div>
        <div className="gn-intro-part gn-intro-part-nation">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gospel-nation.png" alt="" width={566} height={429} />
        </div>
        <div className="gn-intro-cross" />
      </div>
      <p className="gn-intro-tag">{church.tagline}</p>
      <button type="button" className="gn-intro-skip" tabIndex={-1} onClick={() => document.documentElement.removeAttribute('data-intro')}>
        Passer l’intro
      </button>
    </div>
  );
}
