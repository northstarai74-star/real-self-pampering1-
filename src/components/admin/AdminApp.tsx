import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminCertificates } from "@/components/admin/AdminCertificates";

const SESSION_KEY = "sp_admin_password";

type Tab = "overview" | "certificates";

export function AdminApp() {
  const [password, setPassword] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    setPassword(sessionStorage.getItem(SESSION_KEY));
    setReady(true);
  }, []);

  const onLoggedIn = (pw: string) => {
    sessionStorage.setItem(SESSION_KEY, pw);
    setPassword(pw);
  };

  const onLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPassword(null);
    setTab("overview");
  };

  if (!ready) return null;

  if (!password) {
    return (
      <>
        <AdminLogin onSuccess={onLoggedIn} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 animate-in fade-in slide-in-from-top-2 border-b border-border bg-background/95 backdrop-blur duration-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-5 md:px-8 md:py-6">
          <div>
            <p className="label-xs text-plum">{site.name} — Studio Admin</p>
            <h1 className="mt-1 text-xl text-ink sm:text-2xl">Owner Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              View live site ↗
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="transition-transform duration-150 active:scale-95"
            >
              <LogOut className="size-4" /> Log out
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 md:px-8">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
            icon={<LayoutDashboard className="size-4" />}
            label="Overview"
          />
          <TabButton
            active={tab === "certificates"}
            onClick={() => setTab("certificates")}
            icon={<BadgeCheck className="size-4" />}
            label="Certificates"
          />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <div key={tab} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          {tab === "overview" ? (
            <AdminOverview
              password={password}
              onManageCertificates={() => setTab("certificates")}
              onUnauthorized={onLogout}
            />
          ) : (
            <AdminCertificates password={password} onUnauthorized={onLogout} />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "border-plum text-plum"
          : "border-transparent text-muted-foreground hover:border-border hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
