export default function AboutPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-black">Par projektu</h1>
      <p className="text-white/75">
        Šis ir auto sacensību portāls: Latvija, Baltija un pasaules populārākās sacensības.
        Ir filtri un īpaša sadaļa Latvijas braucējiem.
      </p>

      <h2 className="text-lg font-bold mt-6">Ko mēs realizējām</h2>
      <ul className="list-disc pl-5 text-white/75 space-y-1">
        <li>Kalendārs + sacensību saraksts</li>
        <li>Filtri: reģions, sērija, meklēšana</li>
        <li>Toggle “Tikai ar Latvijas dalību”</li>
        <li>Latvijas braucēji: sasniegumi + upcoming starti</li>
      </ul>
    </main>
  );
}