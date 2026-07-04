import React, { useState } from "react";

const logo = "https://i.imgur.com/JfNBhAt.png";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdlopon";

const CONTACT_PREFS = ["WhatsApp", "Text Message", "Email"];
const CHILD_COUNTS = ["1", "2", "3", "4", "5+"];
const AGE_GROUPS = ["4–7 years", "8–13 years", "14–18 years"];
const VOLUNTEER_ROLES = [
  "Teacher (teaching background required)",
  "Teacher Assistant",
  "Administrative Tasks",
  "Child Minding & Supervision",
  "Managing Refreshments",
];
const CONTRIBUTION_OPTIONS = [
  "€20 per child per month",
  "Family cap — fixed amount for 2 or more children",
  "Both options acceptable",
];

function Input({ label, required, ...props }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}{required && <span style={s.req}> *</span>}</label>
      <input style={s.input} {...props} />
    </div>
  );
}

function CheckItem({ checked, onChange, children, highlight }) {
  return (
    <label style={{
      ...s.checkBox,
      ...(checked ? s.checkBoxOn : {}),
      ...(highlight ? s.checkBoxHighlight : {}),
    }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={s.checkbox} />
      <span style={s.checkText}>{children}</span>
    </label>
  );
}

function RadioItem({ selected, onChange, children }) {
  return (
    <label style={{...s.checkBox, ...(selected ? s.checkBoxOn : {})}}>
      <input type="radio" checked={selected} onChange={onChange} style={s.checkbox} />
      <span style={s.checkText}>{children}</span>
    </label>
  );
}

export default function MadrassaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "", mobile: "", email: "",
    contactPref: "",
    childCount: "",
    ageGroups: [],
    volunteerRoles: [],
    contribution: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAge = (g) => set("ageGroups",
    form.ageGroups.includes(g)
      ? form.ageGroups.filter(a => a !== g)
      : [...form.ageGroups, g]
  );

  const toggleRole = (r) => set("volunteerRoles",
    form.volunteerRoles.includes(r)
      ? form.volunteerRoles.filter(x => x !== r)
      : [...form.volunteerRoles, r]
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.contactPref) e.contactPref = "Please select a preferred contact method";
    if (!form.childCount) e.childCount = "Please select number of children";
    if (form.ageGroups.length === 0) e.ageGroups = "Please select at least one age group";
    if (!form.contribution) e.contribution = "Please select a contribution option";
    if (!form.consent) e.consent = "Please confirm your consent";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    const payload = {
      "Parent / Guardian Name": form.name,
      "Mobile": form.mobile,
      "Email": form.email,
      "Preferred Contact": form.contactPref,
      "Number of Children": form.childCount,
      "Age Groups": form.ageGroups.join(", ") || "—",
      "Volunteer Roles": form.volunteerRoles.length > 0 ? form.volunteerRoles.join(", ") : "None selected",
      "Monthly Contribution": form.contribution,
      "_subject": `Summer Madrassa Registration — ${form.name}`,
      "_replyto": form.email,
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        setSubmitError(data?.error || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const Err = ({ k }) => errors[k]
    ? <div style={s.errMsg}>{errors[k]}</div>
    : null;

  const SectionTitle = ({ children }) => <div style={s.sectionTitle}>{children}</div>;
  const Divider = () => <div style={s.divider} />;

  if (submitted) {
    return (
      <div style={s.wrap}>
        <GlobalStyles />
        <Header />
        <div style={s.card}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successH2}>Registration Received</h2>
          <p style={s.successP}>JazakAllah Khair, <strong>{form.name}</strong>. Your Summer Madrassa registration has been submitted successfully.</p>
          <p style={s.successSub}>We will be in touch shortly. Ya Ali Madad 🖤</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <GlobalStyles />
      <Header />

      {/* Mandatory notice */}
      <div style={s.noticeBox}>
        <span style={s.noticeIcon}>📌</span>
        <span style={s.noticeText}>
          <strong>Important:</strong> For this Summer Madrassa, it is mandatory for at least one parent or guardian to be present during all classes.
        </span>
      </div>

      <div style={s.card}>

        <SectionTitle>Parent / Guardian Details</SectionTitle>

        <Input label="Full Name" required placeholder="e.g. Ali Hassan"
          value={form.name} onChange={e => set("name", e.target.value)}
          autoComplete="name" autoCapitalize="words" />
        <Err k="name" />

        <Input label="Mobile" required type="tel" placeholder="+353 87 000 0000"
          value={form.mobile} onChange={e => set("mobile", e.target.value)}
          autoComplete="tel" inputMode="tel" />
        <Err k="mobile" />

        <Input label="Email" required type="email" placeholder="name@email.com"
          value={form.email} onChange={e => set("email", e.target.value)}
          autoComplete="email" inputMode="email" autoCapitalize="none" />
        <Err k="email" />

        <Divider />

        <SectionTitle>Preferred Contact Method <span style={s.req}>*</span></SectionTitle>
        {CONTACT_PREFS.map(p => (
          <RadioItem key={p} selected={form.contactPref === p}
            onChange={() => set("contactPref", p)}>{p}</RadioItem>
        ))}
        <Err k="contactPref" />

        <Divider />

        <SectionTitle>Number of Children <span style={s.req}>*</span></SectionTitle>
        <div style={s.countRow}>
          {CHILD_COUNTS.map(c => (
            <button key={c}
              style={{...s.countBtn, ...(form.childCount === c ? s.countBtnOn : {})}}
              onClick={() => set("childCount", c)}>{c}</button>
          ))}
        </div>
        <Err k="childCount" />

        <Divider />

        <SectionTitle>Age Groups <span style={s.req}>*</span></SectionTitle>
        <p style={s.subText}>Select all age groups that apply to your children.</p>
        {AGE_GROUPS.map(g => (
          <CheckItem key={g} checked={form.ageGroups.includes(g)}
            onChange={() => toggleAge(g)}>{g}</CheckItem>
        ))}
        <Err k="ageGroups" />

        <Divider />

        <SectionTitle>Volunteer Availability <span style={s.optional}>optional</span></SectionTitle>
        <p style={s.subText}>Please select any roles you are available to support with.</p>
        {VOLUNTEER_ROLES.map(r => (
          <CheckItem key={r} checked={form.volunteerRoles.includes(r)}
            onChange={() => toggleRole(r)}>{r}</CheckItem>
        ))}

        <Divider />

        <SectionTitle>Monthly Contribution <span style={s.req}>*</span></SectionTitle>
        <div style={s.contributionNote}>
          💡 A small monthly contribution helps cover costs for the Madrassa programme.
        </div>
        {CONTRIBUTION_OPTIONS.map(o => (
          <RadioItem key={o} selected={form.contribution === o}
            onChange={() => set("contribution", o)}>{o}</RadioItem>
        ))}
        <Err k="contribution" />

        <Divider />

        <SectionTitle>Consent</SectionTitle>
        <CheckItem checked={form.consent} onChange={e => set("consent", e.target.checked)}>
          I confirm the details provided are accurate and I consent to Imamia Centre Galway
          storing this information for the purpose of the Summer Madrassa programme.
        </CheckItem>
        <Err k="consent" />

        {submitError && (
          <div style={s.errorBox}>⚠️ {submitError}</div>
        )}

        <p style={{fontSize:13,color:"#888",textAlign:"center",marginTop:8,marginBottom:4,lineHeight:1.6}}>
          By submitting you agree to our{" "}
          <a href="/privacy" style={{color:MAROON,fontWeight:600,textDecoration:"none"}}>Privacy Policy</a>.
          Your data is handled in accordance with GDPR.
        </p>
        <button
          style={{...s.submitBtn, ...(submitting ? s.submitBtnDisabled : {})}}
          onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Registration ✓"}
        </button>

      </div>

      <p style={s.footer}>
        Imamia Centre Galway · Unit 27 Kilkerrin Park, Liosban · H91 HC3Y · Ya Ali Madad 🖤
      </p>
    </div>
  );
}

function Header() {
  return (
    <div style={s.header}>
      <img src={logo} alt="Imamia Centre Galway" style={s.headerLogo} />
      <div style={s.headerText}>
        <div style={s.bismillah}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</div>
        <div style={s.headerTitle}>Imamia Centre Galway</div>
        <div style={s.headerSub}>Summer Madrassa — Registration Form</div>
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
      html { font-size: 16px; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f0eeeb; -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
      input, button { font-family: inherit; }
      input[type="radio"], input[type="checkbox"] { accent-color: #8B0000; }
    `}</style>
  );
}

const MAROON = "#8B0000";
const MAROON_DARK = "#6B0000";
const MAROON_LIGHT = "#fff5f5";
const BORDER = "#e0e0e0";

const s = {
  wrap: { minHeight: "100vh", background: "#f0eeeb", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 48 },
  header: { width: "100%", maxWidth: 600, background: `linear-gradient(135deg, ${MAROON_DARK} 0%, #8B1A1A 60%, #7A0E0E 100%)`, color: "white", padding: "20px 20px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 3px 16px rgba(107,0,0,0.3)" },
  headerLogo: { width: 62, height: 62, objectFit: "contain", flexShrink: 0, background: "white", borderRadius: "50%", padding: 6 },
  headerText: { flex: 1, minWidth: 0 },
  bismillah: { fontSize: 17, color: "#f5c842", marginBottom: 3, fontFamily: "serif" },
  headerTitle: { fontSize: 16, fontWeight: 700, color: "white", marginBottom: 1 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.85)" },

  noticeBox: { width: "100%", maxWidth: 600, background: "#fffbea", border: "1.5px solid #f0c040", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, marginTop: 12 },
  noticeIcon: { fontSize: 18, flexShrink: 0, marginTop: 1 },
  noticeText: { fontSize: 14, color: "#5a4000", lineHeight: 1.5 },

  card: { width: "100%", maxWidth: 600, background: "white", padding: "24px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginTop: 12, borderRadius: 12, marginLeft: 12, marginRight: 12 },

  sectionTitle: { fontSize: 11, fontWeight: 700, color: MAROON, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid #f0d8d8` },
  optional: { fontSize: 10, fontWeight: 400, color: "#bbb", marginLeft: 4, textTransform: "none", letterSpacing: 0 },

  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: { fontSize: 15, fontWeight: 600, color: "#222" },
  req: { color: MAROON },
  input: { border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "14px 14px", fontSize: 16, color: "#1a1a1a", background: "#fafafa", width: "100%", WebkitAppearance: "none", appearance: "none", outline: "none" },

  errMsg: { fontSize: 13, color: "#c0392b", marginTop: -8, marginBottom: 12 },

  subText: { fontSize: 14, color: "#666", marginBottom: 12, lineHeight: 1.5 },

  countRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 },
  countBtn: { border: `1.5px solid ${BORDER}`, background: "white", borderRadius: 10, padding: "13px 0", fontSize: 16, fontWeight: 600, cursor: "pointer", color: "#333", flex: 1, minWidth: 48, WebkitAppearance: "none", textAlign: "center" },
  countBtnOn: { borderColor: MAROON, background: MAROON, color: "white" },

  checkBox: { display: "flex", alignItems: "flex-start", gap: 14, background: "#fafafa", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "14px 14px", marginBottom: 10, cursor: "pointer" },
  checkBoxOn: { background: MAROON_LIGHT, borderColor: MAROON },
  checkBoxHighlight: { background: "#fffbea", borderColor: "#f0c040" },
  checkbox: { width: 22, height: 22, flexShrink: 0, marginTop: 2, accentColor: MAROON, cursor: "pointer" },
  checkText: { fontSize: 15, color: "#333", lineHeight: 1.5 },

  contributionNote: { fontSize: 13, color: "#666", background: "#f9f9f9", border: `1px solid #eee`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, lineHeight: 1.5 },

  divider: { height: 1, background: "#f0f0f0", margin: "20px 0" },

  errorBox: { background: "#fee", border: "1px solid #fcc", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#c0392b", marginBottom: 16, lineHeight: 1.5 },

  submitBtn: { background: `linear-gradient(135deg, ${MAROON_DARK}, #8B1A1A)`, border: "none", color: "white", borderRadius: 12, padding: "16px 32px", fontSize: 17, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 8, WebkitAppearance: "none", letterSpacing: 0.3 },
  submitBtnDisabled: { background: "#ccc", cursor: "not-allowed" },

  successIcon: { width: 72, height: 72, background: `linear-gradient(135deg, ${MAROON_DARK}, #8B1A1A)`, color: "white", borderRadius: "50%", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  successH2: { textAlign: "center", fontSize: 22, marginBottom: 12, color: "#1a1a1a" },
  successP: { textAlign: "center", color: "#555", lineHeight: 1.6, fontSize: 15 },
  successSub: { textAlign: "center", color: "#999", fontSize: 13, marginTop: 12 },

  footer: { fontSize: 12, color: "#aaa", marginTop: 20, textAlign: "center", padding: "0 20px", lineHeight: 1.6 },
};
