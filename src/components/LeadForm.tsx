"use client";
import { useState } from "react";
import { useShell } from "./Shell";
import { FRANCHISE_COUNTRIES, EVENT_TYPES } from "@/lib/data";

export type Field = { name: string; label: string; type?: "text" | "email" | "tel" | "date" | "textarea" | "select" | "file"; required?: boolean; options?: string[]; full?: boolean };

export const FORMS: Record<string, { cta: string; fields: Field[]; success: string }> = {
  franchise: {
    cta: "Submit Franchise Enquiry", success: "Thank you! Our franchise team will contact you shortly.",
    fields: [
      { name: "name", label: "Name", required: true }, { name: "email", label: "Email ID", type: "email", required: true },
      { name: "dob", label: "Date of Birth", type: "date" }, { name: "business", label: "Business" },
      { name: "designation", label: "Designation" }, { name: "experience", label: "Experience" },
      { name: "income", label: "Annual Income" }, { name: "contact", label: "Contact No", type: "tel", required: true },
      { name: "country", label: "Country", type: "select", options: FRANCHISE_COUNTRIES, required: true }, { name: "city", label: "City / State", required: true },
      { name: "area", label: "Area", required: true }, { name: "floor", label: "Floor" }, { name: "ref", label: "Ref. by", full: true },
    ],
  },
  catering: {
    cta: "Request Catering", success: "Thank you! We’ll get back to you with a catering plan soon.",
    fields: [
      { name: "name", label: "Name", required: true }, { name: "email", label: "Email ID", type: "email", required: true },
      { name: "contact", label: "Contact No", type: "tel", required: true }, { name: "date", label: "Date of Event", type: "date", required: true },
      { name: "event", label: "Type of Event", type: "select", options: EVENT_TYPES, required: true }, { name: "country", label: "Country", type: "select", options: FRANCHISE_COUNTRIES, required: true },
      { name: "city", label: "City / State", required: true }, { name: "area", label: "Area", required: true }, { name: "ref", label: "Ref. by" },
      { name: "address", label: "Address", type: "textarea", required: true, full: true },
    ],
  },
  career: {
    cta: "Submit Application", success: "Thank you! Your application has been received.",
    fields: [
      { name: "name", label: "Name", required: true }, { name: "email", label: "Email ID", type: "email", required: true },
      { name: "contact", label: "Contact No", type: "tel" }, { name: "position", label: "Position", type: "select", options: ["Position 1", "Position 2"], required: true },
      { name: "address", label: "Address", required: true, full: true }, { name: "message", label: "Message", type: "textarea", full: true },
      { name: "resume", label: "Upload Resume", type: "file", required: true, full: true },
    ],
  },
  contact: {
    cta: "Send Message", success: "Thank you! We’ll reply as soon as we can.",
    fields: [
      { name: "name", label: "Name", required: true }, { name: "email", label: "Email ID", type: "email", required: true },
      { name: "contact", label: "Contact No", type: "tel", required: true, full: true }, { name: "message", label: "Message", type: "textarea", full: true },
    ],
  },
};

/** Demo form: validates client-side and shows a confirmation. Wire `action` to a Worker / form endpoint for production. */
export default function LeadForm({ kind, action }: { kind: keyof typeof FORMS; action?: string }) {
  const { toast } = useShell();
  const def = FORMS[kind];
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget), er: Record<string, string> = {};
    def.fields.forEach((x) => {
      const v = f.get(x.name);
      if (x.required && (!v || (v instanceof File ? !v.size : !String(v).trim()))) er[x.name] = `${x.label} is required`;
      else if (x.type === "email" && v && !/^\S+@\S+\.\S+$/.test(String(v))) er[x.name] = "Enter a valid email";
      else if (x.type === "tel" && v && !/^[+\d][\d\s-]{8,14}$/.test(String(v).trim())) er[x.name] = "Enter a valid phone number";
    });
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try { if (action) await fetch(action, { method: "POST", body: f }); else await new Promise((r) => setTimeout(r, 700)); toast(def.success); (e.target as HTMLFormElement).reset(); }
    catch { toast("Something went wrong — please call us on +91 75758 05500."); }
    setBusy(false);
  };
  return (
    <form className="form" onSubmit={submit} noValidate aria-label={`${kind} form`}>
      {def.fields.map((x) => (
        <label key={x.name} className={x.full || x.type === "textarea" ? "full" : ""}>
          <span>{x.label}{x.required && " *"}</span>
          {x.type === "textarea" ? <textarea className="fld" name={x.name} aria-invalid={!!err[x.name]} />
            : x.type === "select" ? <select className="fld" name={x.name} defaultValue="" aria-invalid={!!err[x.name]}><option value="" disabled>Select {x.label}</option>{x.options!.map((o) => <option key={o}>{o}</option>)}</select>
            : <input className="fld" name={x.name} type={x.type || "text"} accept={x.type === "file" ? ".pdf,.doc,.docx" : undefined} aria-invalid={!!err[x.name]} autoComplete="off" />}
          {err[x.name] && <span className="err" role="alert">{err[x.name]}</span>}
        </label>
      ))}
      <div className="full"><button className="btn" disabled={busy} type="submit">{busy ? "Sending…" : def.cta}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button></div>
    </form>
  );
}
