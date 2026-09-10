export default function PlaceholderNote({
  children = "Contenu provisoire, à valider avec l'église avant publication."
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="placeholder-note rounded-lg px-4 py-3 text-sm">
      <span className="mr-1 font-semibold">À compléter —</span>
      {children}
    </div>
  );
}
