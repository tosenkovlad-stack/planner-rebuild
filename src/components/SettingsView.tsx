import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function SettingsView() {
  const { user, signOut } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold">Settings</h1>

      <Card className="mb-4 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-4 w-4" /> Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isInstalled ? (
            <p className="text-sm text-muted-foreground">✅ App is already installed on this device.</p>
          ) : deferredPrompt ? (
            <>
              <p className="text-sm text-muted-foreground">
                Install Super V as an app on your device for quick access.
              </p>
              <Button onClick={handleInstall} className="w-full gap-2">
                <Download className="h-4 w-4" /> Install App
              </Button>
            </>
          ) : (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>To install on your phone:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>iPhone:</strong> Open in Safari → tap Share → "Add to Home Screen"</li>
                <li><strong>Android:</strong> Open in Chrome → tap ⋮ menu → "Install app"</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm">{user?.email}</p>
          </div>
          <Button variant="destructive" onClick={signOut}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
