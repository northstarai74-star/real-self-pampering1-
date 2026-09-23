import { useEffect, useState } from "react";
import { Trash2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCustomerQueries, deleteCustomerQuery, type CustomerQuery } from "@/lib/queries-api";

export function AdminQueries({ password, onUnauthorized }: { password: string; onUnauthorized: () => void }) {
  const [queries, setQueries] = useState<CustomerQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      setLoading(true);
      const data = await getCustomerQueries({ data: { password } });
      setQueries(Array.isArray(data) ? data : []);
    } catch (error) {
      if ((error as Error).message === "Unauthorized") {
        onUnauthorized();
      } else {
        toast.error("Could not load queries");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuery = async (id: string) => {
    if (!confirm("Delete this query?")) return;

    try {
      await deleteCustomerQuery({ data: { id, password } });
      setQueries((current) => current.filter((q) => q.id !== id));
      toast.success("Query deleted");
    } catch (error) {
      if ((error as Error).message === "Unauthorized") {
        onUnauthorized();
      } else {
        toast.error("Could not delete query");
      }
      console.error(error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading queries...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-ink">Customer Queries</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Messages from customers who filled out the contact form.
        </p>
      </div>

      {queries.length === 0 ? (
        <div className="rounded border border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">No customer queries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <div key={query.id} className="animate-in fade-in slide-in-from-bottom-1 rounded border border-border bg-background p-6 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-ink">{query.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      <a href={`mailto:${query.email}`} className="hover:text-plum">
                        {query.email}
                      </a>
                    </div>
                    {query.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        <a href={`tel:${query.phone}`} className="hover:text-plum">
                          {query.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-ink/80">{query.message}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(query.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteQuery(query.id)}
                  className="shrink-0 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
