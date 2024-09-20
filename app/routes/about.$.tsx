import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // Assuming your shadcn card components are imported from ui/card

const AboutPage = () => {
  return (
    <div className="relative container mx-auto flex flex-col items-center justify-center space-y-4 pt-12 z-3">
      <Card className="w-full max-w-6xl p-5 bg-white bg-opacity-40 shadow-lg backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {"Wieso mach ich das?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-5">
            <div>
              <h3 className="text-lg font-semibold">Erfahrung sammeln:</h3>
              <p className="text-gray-700">
                {
                  "Als jemand, der eigentlich aus dem Bereich Computer Vision kommt, habe ich mit Frontend-Themen keine Erfahrung und dachte mir: Bevor ich jetzt 10 Stunden freecodecamp.org anschaue und nichts dabei lerne, weil meine Zoomer Aufmerksamkeitsspanne das ohnehin nicht zulässt, starte ich einfach ein Projekt, das mich interessiert. Also ChatGPT aufgemacht und einfach losgelegt..."
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Wieso genau die Zahlgraf 200D Strategie?
              </h3>
              <p className="text-gray-700">
                {
                  "Die Strategie interessiert mich, weil sonst immer ein offensichtlicher Fehler in solchen DDs ist, ich ihn hier aber nicht finden konnte. Also habe ich zuerst lokal einige Rechnungen gemacht und nun teile ich hier ein paar der Ergebnisse."
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Wo bist du her?</h3>
              <p className="text-gray-700">Aus dem schönen Ösiland 🇦🇹</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
