import QRCode from 'qrcode';
import { SITE_URL } from '@/lib/site';

// QR code de la page « Première visite » (affiches, écran de l'église, story Instagram).
// Il pointe vers l'adresse du site telle que définie par NEXT_PUBLIC_SITE_URL au
// déploiement, avec ?s=qr : la provenance « QR code » est alors déjà choisie dans
// le formulaire. Après l'achat du nom de domaine, redéployer et réimprimer l'affiche.
export async function GET() {
  const svg = await QRCode.toString(`${SITE_URL}/visite?s=qr`, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' });
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
