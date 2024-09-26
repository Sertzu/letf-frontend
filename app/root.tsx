import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { SwitchProvider } from "./lib/SwitchContext";
import BackgroundAnimation from "./components/BackgroundAnimation";
import { MenubarTop } from "./components/MenuTop";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Heiliger Amumbo</title>
        <script defer data-domain="heiliger-amumbo.org" src="https://analytics.heiliger-amumbo.org/js/script.js"></script>
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <SwitchProvider>
        <div className="fixed top-0 left-0 w-full h-full z-1">
          <BackgroundAnimation />
        </div>
        <div className="relative">
          <MenubarTop />
        </div>
      </SwitchProvider>
      <Outlet />;
    </>
  )

}
