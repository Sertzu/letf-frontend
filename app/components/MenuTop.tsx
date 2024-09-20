import { Link, useLocation } from '@remix-run/react';
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useFunSwitch } from '../lib/SwitchContext'; // import the context hook
import { useEffect } from 'react';

export function MenubarTop() {
  const location = useLocation();
  const pathname = location.pathname;

  const { isFunEnabled, toggleFun } = useFunSwitch(); // get state and toggle function

  const navItems = [
    { name: 'Startseite', href: '/' },
    { name: 'Rechner', href: '/calculator' },
    { name: 'Über', href: '/about' },
  ];

  useEffect(() => {
    if (isFunEnabled) {
      document.body.classList.add('fun-hover');
      document.body.style.cursor = 'url("/rocket.png"), auto';
    } else {
      document.body.classList.remove('fun-hover');
      document.body.style.cursor = 'default'; // reset to default when fun is disabled
    }

    // Clean up on unmount to reset the cursor to default
    return () => {
      document.body.classList.remove('fun-hover');
      document.body.style.cursor = 'default';
    };
  }, [isFunEnabled]);

  return (
    <nav className="w-full bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side with nav items */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
              >
                <Link to={item.href}>
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>

          {/* Right side with the Switch and "FUN" text */}
          <div className="flex items-center ml-auto space-x-2">
            <Switch checked={isFunEnabled} onCheckedChange={toggleFun} />
            <span>M O N E Y</span>
          </div>
        </div>
      </div>
    </nav>
  );
}