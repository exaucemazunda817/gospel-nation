'use client';

import type { ReactNode } from 'react';

// Rangée à défilement horizontal natif : ne répond qu'aux vrais gestes
// horizontaux (glissement deux doigts sur trackpad, molette+Shift, glisser
// tactile) — jamais à un simple défilement vertical de la molette, qui
// continue de faire défiler la page normalement au-dessus de la rangée.
//
// Corrige un défaut signalé par Mazunda le 17/09/2026 sur la précédente
// version "rangée épinglée" (technique sticky + translateX pilotée par la
// progression du défilement vertical, inspirée de webflow-path-one.webflow.io) :
// un simple défilement vertical de la souris faisait glisser la rangée
// horizontalement, ce qu'il jugeait contre-intuitif — pour lui, un
// mouvement horizontal de la souris/du geste doit être nécessaire pour
// obtenir un défilement horizontal. Le défilement natif du navigateur a
// exactement cette propriété : un `overflow-x-auto` sans overflow vertical
// ignore la molette verticale (qui remonte donc scroller la page), et ne
// répond qu'à un geste horizontal explicite.
export default function HorizontalScroller({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
