import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/certificates-api";
import { site } from "@/lib/site";

export function AdminLogin({ onSuccess }: { onSuccess: (password: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Enter the admin password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { ok } = await adminLogin({ data: { password } });
      if (ok) {
        onSuccess(password);
      } else {
        setError("That password is incorrect.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 border border-border bg-background p-8 duration-500">
        <div className="flex items-center gap-3 text-plum">
          <Lock className="size-5 animate-in zoom-in-50 duration-700" strokeWidth={1.5} />
          <p className="label-xs">{site.name} — Studio Admin</p>
        </div>
        <h1 className="mt-4 text-2xl text-ink">Owner sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin password to manage certificates and view the studio dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 transition-shadow focus-visible:shadow-sm"
              placeholder="••••••••••"
            />
            {error && (
              <p className="mt-2 animate-in fade-in slide-in-from-top-1 text-sm text-destructive duration-300">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full transition-transform duration-150 active:scale-[0.98]"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Checking…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          This page is only for the studio owner. If you don't know the password, check with
          whoever set up the site — it can be changed by setting the{" "}
          <code className="rounded bg-muted px-1 py-0.5">ADMIN_PASSWORD</code> environment
          variable before starting the server.
        </p>
      </div>
    </div>
  );
}
