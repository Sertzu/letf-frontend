
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function NotFound() {
  return (
    <>
      <div className="relative container mx-auto flex flex-col items-center justify-center min-h-screen space-y-4 z-3">
        <Card className="w-full max-w-lg bg-white bg-opacity-40 shadow-lg backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">404 Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              The page you are looking for does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
