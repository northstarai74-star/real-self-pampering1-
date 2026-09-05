import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminAddCertificate,
  adminDeleteCertificate,
  adminListCertificates,
  adminUpdateCertificate,
  type Certificate,
} from "@/lib/certificates-api";

type FormFields = Omit<Certificate, "id">;

const emptyForm: FormFields = {
  number: "",
  holder: "",
  course: "",
  issued: "",
  expires: "",
  level: "",
};

export function AdminCertificates({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminListCertificates({ data: { password } })
      .then(setCertificates)
      .catch((error: unknown) => handleError(error))
      .finally(() => setLoading(false));
  };

  useEffect(load, [password]);

  const handleError = (error: unknown, fallback = "Something went wrong.") => {
    const message = error instanceof Error ? error.message : fallback;
    if (message.toLowerCase().includes("password")) {
      toast.error("Your session expired — please sign in again.");
      onUnauthorized();
      return;
    }
    toast.error(message || fallback);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (certificate: Certificate) => {
    setEditing(certificate);
    const { id: _id, ...fields } = certificate;
    setForm(fields);
    setDialogOpen(true);
  };

  const onFieldChange = (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed: FormFields = {
      number: form.number.trim(),
      holder: form.holder.trim(),
      course: form.course.trim(),
      issued: form.issued.trim(),
      expires: form.expires.trim(),
      level: form.level.trim(),
    };
    if (Object.values(trimmed).some((v) => !v)) {
      toast.error("Please fill in every field.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const updated = await adminUpdateCertificate({
          data: { password, id: editing.id, certificate: trimmed },
        });
        setCertificates((list) => (list ? list.map((c) => (c.id === updated.id ? updated : c)) : list));
        toast.success(`Updated certificate ${updated.number}.`);
      } else {
        const created = await adminAddCertificate({ data: { password, certificate: trimmed } });
        setCertificates((list) => (list ? [created, ...list] : [created]));
        toast.success(`Added certificate ${created.number}.`);
      }
      setDialogOpen(false);
    } catch (error) {
      handleError(error, "Could not save that certificate.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (certificate: Certificate) => {
    if (!window.confirm(`Delete certificate ${certificate.number} for ${certificate.holder}?`)) return;
    setDeletingId(certificate.id);
    try {
      await adminDeleteCertificate({ data: { password, id: certificate.id } });
      setCertificates((list) => (list ? list.filter((c) => c.id !== certificate.id) : list));
      toast.success(`Deleted certificate ${certificate.number}.`);
    } catch (error) {
      handleError(error, "Could not delete that certificate.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl text-ink">Certificate register</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What clients see when they verify a certificate on the live site.
          </p>
        </div>
        <Button onClick={openAdd} className="group transition-transform duration-200 active:scale-95">
          <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" /> Add certificate
        </Button>
      </div>

      <div className="mt-6 border border-border bg-background transition-shadow duration-300 hover:shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading certificates…
          </div>
        ) : !certificates || certificates.length === 0 ? (
          <p className="animate-in fade-in p-12 text-center text-sm text-muted-foreground">
            No certificates yet. Add the first one to get started.
          </p>
        ) : (
          <>
            {/* Table — sm and up */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Holder</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((c, i) => (
                    <TableRow
                      key={c.id}
                      className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300"
                      style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                    >
                      <TableCell className="font-medium text-ink">{c.number}</TableCell>
                      <TableCell>{c.holder}</TableCell>
                      <TableCell className="max-w-56 truncate" title={c.course}>
                        {c.course}
                      </TableCell>
                      <TableCell>{c.level}</TableCell>
                      <TableCell className="whitespace-nowrap">{c.issued}</TableCell>
                      <TableCell className="whitespace-nowrap">{c.expires}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${c.number}`}
                            className="transition-transform duration-150 hover:scale-110 hover:text-plum"
                            onClick={() => openEdit(c)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${c.number}`}
                            disabled={deletingId === c.id}
                            className="transition-transform duration-150 hover:scale-110"
                            onClick={() => onDelete(c)}
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Card list — below sm */}
            <ul className="divide-y divide-border sm:hidden">
              {certificates.map((c, i) => (
                <li
                  key={c.id}
                  className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both p-4 duration-300"
                  style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{c.number}</p>
                      <p className="mt-0.5 text-sm text-ink/80">{c.holder}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${c.number}`}
                        className="transition-transform duration-150 active:scale-90"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${c.number}`}
                        disabled={deletingId === c.id}
                        className="transition-transform duration-150 active:scale-90"
                        onClick={() => onDelete(c)}
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.course}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Level: {c.level}</span>
                    <span>Issued: {c.issued}</span>
                    <span>Expires: {c.expires}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] duration-300 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit certificate" : "Add certificate"}</DialogTitle>
            <DialogDescription>
              {editing
                ? `Editing ${editing.number}. Changes apply as soon as you save.`
                : "This will be checkable immediately on the public verify page."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Certificate number" value={form.number} onChange={onFieldChange("number")} placeholder="SP-2026-0102" />
            <Field label="Holder name" value={form.holder} onChange={onFieldChange("holder")} placeholder="Jane Doe" />
            <Field
              label="Course / training"
              value={form.course}
              onChange={onFieldChange("course")}
              placeholder="Gel Manicure & Nail Preparation"
              className="sm:col-span-2"
            />
            <Field label="Level" value={form.level} onChange={onFieldChange("level")} placeholder="Foundation" />
            <Field label="Issued" value={form.issued} onChange={onFieldChange("issued")} placeholder="18 March 2024" />
            <Field label="Expires" value={form.expires} onChange={onFieldChange("expires")} placeholder="18 March 2027" />
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="transition-transform duration-150 active:scale-95"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="transition-transform duration-150 active:scale-95">
                {saving && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Add certificate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} placeholder={placeholder} className="mt-2" />
    </div>
  );
}
