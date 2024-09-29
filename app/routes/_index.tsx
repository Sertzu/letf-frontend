import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // Assuming your shadcn card components are imported from ui/card

const LandingPage = () => {
  return (
    <div className="relative container mx-auto flex flex-col items-center justify-center space-y-4 pt-12 z-3">
      <Card className="w-full max-w-6xl p-5 bg-white bg-opacity-40 shadow-lg backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {"Um was geht's hier?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-5">
            <div>
              <h3 className="text-lg font-semibold">Was ist der Heilige Amumbo?</h3>
              <p className="text-gray-700">
                Der Heilige Amumbo ist der Amundi ETF Leveraged MSCI USA Daily (WKN A0X8ZS), welcher seinen Jüngern Kraft und Leben (Erträge und Lambo) spendet.
                So wie Jesus das Wasser in Wein verwandelte, verwandelt der Heilige Amumbo jedes Investment in pure Rendite – und seine Gläubigen folgen ihm, getragen von der Hoffnung, dass sich das gelobte Land des ewigen Reichtums vor ihnen auftut, wo der Privatjet wartet und die Erträge ins Unendliche wachsen.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                ZahlGrafs Exzellente Abenteuer?
              </h3>
              <p className="text-gray-700">
                {
                  "Ich bezweifle, dass irgendjemand, der hierher gefunden hat, nicht weiß, wer der ZahlGraf ist oder was seine exzellenten Abenteuer sind."
                }
              </p>
              <p className="text-gray-700">
                {"Falls doch: Bitte "}
                <a
                  href="https://www.reddit.com/r/mauerstrassenwetten/comments/s71qds/zahlgrafs_exzellente_abenteuer_teil_1/"
                  className="text-blue-600 underline"
                >
                  HIER
                </a>
                {" weiterbilden."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">200D SMA Strategie?</h3>
              <p className="text-gray-700">
                Eine detaillierte Beschreibung ist wieder beim Zahlgraf
                nachzulesen. Aber um es kurz zu machen: Wir kaufen 2x gehebelten
                S&P 500 (Heiliger Amumbo), wenn der Kurs des
                <strong> ungehebelten</strong> S&P 500 ETFs über dem 200-Tage
                Simple Moving Average ist und halten Cash, wenn der Kurs unter
                diesem liegt.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Was kann ich hier machen?
              </h3>
              <p className="text-gray-700">
                Im Rechner-Tab oben links kannst du selbst mit verschiedenen
                Ausgangswerten herumspielen. Zurzeit gibt es Anfangs- und
                Enddatum, sowie Investment-Summe und monatlichen Sparplan.
                Verglichen wird die Strategie mit dem 2x gehebelten ohne
                Strategie und dem Basis ETF.
                <br />
                {
                  "Weitere Features können gerne angefragt werden. Am besten schreibst du mir direkt auf "
                }
                <a
                  href="https://www.reddit.com/user/Sertzu"
                  className="text-blue-600 underline"
                >
                  Reddit
                </a>
                {", oder per "}
                <a
                  href="mailto:your-email@example.com"
                  className="text-blue-600 underline"
                >
                  Mail.
                </a>
                <br />
                {"Bei Beschwerden bezüglich UX/UI bitte beim "}
                <a
                  href="https://de.wikipedia.org/wiki/Salzamt#%E2%80%9ESalzamt%E2%80%9C_im_heutigen_Sprachgebrauch"
                  className="text-blue-600 underline"
                >
                  {"Salzamt"}
                </a>
                {
                  " melden. Ich weiß, dass die Seite auf dem Handy nicht gut funktioniert und hab keinen Plan daran bald was zu ändern."
                }
              </p>
            </div>

            {/* Question 4 */}
            <div>
              <h3 className="text-lg font-semibold">
                Sind die Daten hier korrekt?
              </h3>
              <p className="text-gray-700">
                Ich gebe keine Garantie für die Richtigkeit der Daten, aber bis
                2020 habe ich die Daten vom Zahlgraf verwendet und danach selbst
                ergänzt. Ich habe die Renditen für bestimmte Zeiträume mit denen
                vom Zahlgraf verglichen, und sie stimmen ziemlich gut überein.
                Die Zusatzrendite bei der 200D SMA + Zinsen-Strategie basiert
                auf der Fed Funds Rate, da ich von dieser die meisten
                historischen Daten hatte.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Bist du selber investiert?
              </h3>
              <p className="text-gray-700">
                {
                  "Nein, bin noch Student und hier im Ösiland sind synthetische ETFs steuerlicher Selbstmord. Noch dazu kommt, dass der billigste steuereinfache Brecher hier (Flatex) mindestens 5,90€ pro Trade verlangt..."
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Was macht der M O N E Y Schalter?
              </h3>
              <p className="text-gray-700">
                {
                  "Finds heraus :) (Und schau was deine Maus mit den Objekten machen kann!)"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
