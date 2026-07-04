import React, { useState } from "react";

const logo = "https://raw.githubusercontent.com/skjaff92-bit/imamia-membership-form/main/logo.png";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgqpjyp";

const INTERESTS = [
  { id: "madressa", label: "Sunday Madressa for Children" },
  { id: "legal", label: "Legal Advice Clinics" },
  { id: "financial", label: "Financial Advice & Guidance" },
  { id: "medical", label: "Medical Clinics" },
  { id: "committees", label: "Sub Organising Committees" },
  { id: "lectures", label: "Educational Lectures & Workshops" },
  { id: "youth", label: "Youth & Family Programmes" },
  { id: "welfare", label: "Community Welfare & Support Initiatives" },
];

function Input({ label, required, ...props }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}{required && <span style={s.req}> *</span>}</label>
      <input style={s.input} {...props} />
    </div>
  );
}

function CheckItem({ checked, onChange, children }) {
  return (
    <label style={{...s.checkBox, ...(checked ? s.checkBoxOn : {})}}>
      <input type="checkbox" checked={checked} onChange={onChange} style={s.checkbox} />
      <span style={s.checkText}>{children}</span>
    </label>
  );
}

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showDD, setShowDD] = useState(false);
  const [form, setForm] = useState({
    fullName: "", age: "", occupation: "", phone: "", email: "",
    eircode: "", city: "", children: [], interests: [],
    amount: "", customAmount: "", accountName: "", iban: "", bic: "",
    ddConsent1: false, ddConsent2: false, ddConsent3: false, ddConsent4: false,
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (id) => set("interests",
    form.interests.includes(id)
      ? form.interests.filter(i => i !== id)
      : [...form.interests, id]
  );

  const updateChild = (idx, field, val) => {
    const updated = [...form.children];
    updated[idx] = { ...updated[idx], [field]: val };
    set("children", updated);
  };

  const addChild = () => set("children", [...form.children, { name: "", age: "" }]);
  const removeChild = (idx) => set("children", form.children.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.consent) e.consent = "Please confirm your consent";
    if (showDD) {
      if (!form.ddConsent1) e.ddConsent1 = "Required";
      if (!form.ddConsent2) e.ddConsent2 = "Required";
      if (!form.ddConsent3) e.ddConsent3 = "Required";
      if (!form.ddConsent4) e.ddConsent4 = "Required";
    }
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

    const childrenText = form.children.length > 0
      ? form.children.map((c, i) => `Child ${i+1}: ${c.name||"—"}, Age: ${c.age||"—"}`).join(" | ")
      : "None";

    const interestsText = form.interests.length > 0
      ? form.interests.map(id => INTERESTS.find(i => i.id === id)?.label).join(", ")
      : "None selected";

    const finalAmount = form.amount === "Custom" ? `€${form.customAmount}` : form.amount;

    const payload = {
      "Full Name": form.fullName,
      "Age": form.age || "—",
      "Occupation": form.occupation || "—",
      "Phone": form.phone,
      "Email": form.email,
      "City / Town": form.city || "—",
      "Eircode": form.eircode || "—",
      "Children": childrenText,
      "Community Interests": interestsText,
      "Monthly Direct Debit": showDD ? "Yes" : "No",
      "Amount": showDD ? (finalAmount || "Not specified") : "N/A",
      "Account Name": showDD ? (form.accountName || "—") : "N/A",
      "IBAN": showDD ? (form.iban || "—") : "N/A",
      "BIC": showDD ? (form.bic || "—") : "N/A",
      "_subject": `New Membership Registration — ${form.fullName}`,
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

  const SectionTitle = ({ children }) => (
    <div style={s.sectionTitle}>{children}</div>
  );

  const Divider = () => <div style={s.divider} />;

  if (submitted) {
    return (
      <div style={s.wrap}>
        <GlobalStyles />
        <Header />
        <div style={s.card}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successH2}>Registration Received</h2>
          <p style={s.successP}>JazakAllah Khair, <strong>{form.fullName}</strong>. Your membership application has been submitted successfully.</p>
          <p style={s.successSub}>We will be in touch shortly. Ya Ali Madad 🖤</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <GlobalStyles />
      <Header />
      <div style={s.card}>

        <SectionTitle>Personal Information</SectionTitle>

        <Input label="Full Name" required placeholder="e.g. Ali Hassan"
          value={form.fullName} onChange={e => set("fullName", e.target.value)}
          autoComplete="name" autoCapitalize="words" />
        <Err k="fullName" />

        <Input label="Email Address" required type="email" placeholder="name@email.com"
          value={form.email} onChange={e => set("email", e.target.value)}
          autoComplete="email" inputMode="email" autoCapitalize="none" />
        <Err k="email" />

        <Input label="Phone Number" required type="tel" placeholder="+353 87 000 0000"
          value={form.phone} onChange={e => set("phone", e.target.value)}
          autoComplete="tel" inputMode="tel" />
        <Err k="phone" />

        <div style={s.row}>
          <div style={{flex:1}}>
            <Input label="Age" type="number" min="1" max="120" placeholder="e.g. 34"
              value={form.age} onChange={e => set("age", e.target.value)}
              inputMode="numeric" />
          </div>
          <div style={{width:12}} />
          <div style={{flex:2}}>
            <Input label="Occupation" placeholder="e.g. Engineer"
              value={form.occupation} onChange={e => set("occupation", e.target.value)}
              autoCapitalize="words" />
          </div>
        </div>

        <div style={s.row}>
          <div style={{flex:1}}>
            <Input label="City / Town" placeholder="Galway"
              value={form.city} onChange={e => set("city", e.target.value)}
              autoCapitalize="words" />
          </div>
          <div style={{width:12}} />
          <div style={{flex:1}}>
            <Input label="Eircode" placeholder="H91 XXXX"
              value={form.eircode} onChange={e => set("eircode", e.target.value)}
              autoCapitalize="characters" autoCorrect="off" />
          </div>
        </div>

        <Divider />

        <SectionTitle>Children <span style={s.optional}>optional</span></SectionTitle>

        {form.children.map((c, i) => (
          <div key={i} style={s.childRow}>
            <div style={{flex:2}}>
              <div style={s.field}>
                <label style={s.labelSm}>Child {i+1} Name</label>
                <input style={s.input} placeholder="Name" value={c.name}
                  onChange={e => updateChild(i,"name",e.target.value)}
                  autoCapitalize="words" />
              </div>
            </div>
            <div style={{width:10}} />
            <div style={{flex:1}}>
              <div style={s.field}>
                <label style={s.labelSm}>Age</label>
                <input style={s.input} type="number" min="0" max="18" placeholder="Age"
                  value={c.age} onChange={e => updateChild(i,"age",e.target.value)}
                  inputMode="numeric" />
              </div>
            </div>
            <div style={{width:10}} />
            <button style={s.removeBtn} onClick={() => removeChild(i)}>×</button>
          </div>
        ))}
        <button style={s.addBtn} onClick={addChild}>+ Add Child</button>

        <Divider />

        <SectionTitle>Community Interests <span style={s.optional}>optional</span></SectionTitle>
        <p style={s.subText}>Tick any programmes you'd like to be involved in or notified about.</p>

        {INTERESTS.map(item => (
          <CheckItem key={item.id}
            checked={form.interests.includes(item.id)}
            onChange={() => toggleInterest(item.id)}>
            {item.label}
          </CheckItem>
        ))}

        <Divider />

        <CheckItem checked={showDD} onChange={e => setShowDD(e.target.checked)}>
          <div>
            <div style={s.ddToggleTitle}>I wish to support Imamia Centre through monthly membership</div>
            <div style={s.ddToggleSub}>Tap to set up a voluntary monthly direct debit</div>
          </div>
        </CheckItem>

        {showDD && (
          <div style={s.ddBox}>
            <div style={{...s.sectionTitle, marginBottom:8}}>Monthly Direct Debit</div>
            <p style={s.ddDesc}>Select your preferred monthly contribution.</p>

            <div style={s.amountRow}>
              {["€50","€100","€200","Custom"].map(a => (
                <button key={a}
                  style={{...s.amountBtn, ...(form.amount===a ? s.amountBtnOn : {})}}
                  onClick={() => set("amount", a)}>{a}</button>
              ))}
            </div>

            {form.amount === "Custom" && (
              <Input label="Custom Amount (€/month)" type="number" placeholder="e.g. 75"
                value={form.customAmount} onChange={e => set("customAmount", e.target.value)}
                inputMode="numeric" />
            )}

            <Divider />
            <div style={{...s.sectionTitle, marginBottom:12}}>Bank Details</div>

            <Input label="Account Name" placeholder="Name on bank account"
              value={form.accountName} onChange={e => set("accountName", e.target.value)}
              autoComplete="name" autoCapitalize="words" />
            <Input label="IBAN" placeholder="IE00 XXXX 0000 0000 0000 00"
              value={form.iban} onChange={e => set("iban", e.target.value)}
              autoCapitalize="characters" autoCorrect="off" autoComplete="off" />
            <Input label="BIC" placeholder="e.g. AIBKIE2D"
              value={form.bic} onChange={e => set("bic", e.target.value)}
              autoCapitalize="characters" autoCorrect="off" autoComplete="off" />

            <Divider />
            <div style={{...s.sectionTitle, marginBottom:12}}>Direct Debit Declarations</div>

            {[
              { key: "ddConsent1", text: "I understand the monthly payment will continue until I cancel or change it in writing." },
              { key: "ddConsent2", text: "I will inform Imamia Centre if my bank details or membership details change." },
              { key: "ddConsent3", text: "I consent to Imamia Centre using my details for membership administration and payment management only." },
              { key: "ddConsent4", text: "I authorise Imamia Centre Galway to collect the above monthly amount from my account." },
            ].map(({ key, text }) => (
              <div key={key}>
                <CheckItem checked={form[key]} onChange={e => set(key, e.target.checked)}>
                  {text}
                </CheckItem>
                <Err k={key} />
              </div>
            ))}

            <p style={s.secNote}>🔒 Your bank details are used solely for your standing order and will not be shared with third parties.</p>
          </div>
        )}

        <Divider />

        <SectionTitle>Declaration & Consent</SectionTitle>
        <CheckItem checked={form.consent} onChange={e => set("consent", e.target.checked)}>
          I confirm the information provided is accurate and I consent to Imamia Centre Galway
          storing my details for membership and community communication purposes.
          I understand my data will not be shared with third parties.
        </CheckItem>
        <Err k="consent" />

        {submitError && (
          <div style={s.errorBox}>⚠️ {submitError}</div>
        )}

        <button style={{...s.submitBtn, ...(submitting ? s.submitBtnDisabled : {})}}
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
        <div style={s.headerSub}>Membership Registration</div>
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
      input, button, select, textarea { font-family: inherit; }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    `}</style>
  );
}

const MAROON = "#8B0000";
const MAROON_DARK = "#6B0000";
const MAROON_LIGHT = "#fff5f5";
const BORDER = "#e0e0e0";

const s = {
  wrap: {
    minHeight: "100vh",
    background: "#f0eeeb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 48,
  },
  header: {
    width: "100%",
    maxWidth: 600,
    background: `linear-gradient(135deg, ${MAROON_DARK} 0%, #8B1A1A 60%, #7A0E0E 100%)`,
    color: "white",
    padding: "20px 20px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 3px 16px rgba(107,0,0,0.3)",
  },
  headerLogo: {
    width: 62,
    height: 62,
    objectFit: "contain",
    flexShrink: 0,
    background: "white",
    borderRadius: "50%",
    padding: 6,
  },
  headerText: { flex: 1, minWidth: 0 },
  bismillah: { fontSize: 17, color: "#f5c842", marginBottom: 3, fontFamily: "serif" },
  headerTitle: { fontSize: 16, fontWeight: 700, color: "white", marginBottom: 1 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  card: {
    width: "100%",
    maxWidth: 600,
    background: "white",
    padding: "24px 18px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginTop: 12,
    borderRadius: 12,
    marginLeft: 12,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: MAROON,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: `2px solid #f0d8d8`,
  },
  optional: {
    fontSize: 10,
    fontWeight: 400,
    color: "#bbb",
    marginLeft: 4,
    textTransform: "none",
    letterSpacing: 0,
  },

  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: { fontSize: 15, fontWeight: 600, color: "#222" },
  labelSm: { fontSize: 13, fontWeight: 600, color: "#555" },
  req: { color: MAROON },
  input: {
    border: `1.5px solid ${BORDER}`,
    borderRadius: 10,
    padding: "14px 14px",
    fontSize: 16,
    color: "#1a1a1a",
    background: "#fafafa",
    width: "100%",
    WebkitAppearance: "none",
    appearance: "none",
    outline: "none",
  },

  row: { display: "flex", alignItems: "flex-start" },

  errMsg: { fontSize: 13, color: "#c0392b", marginTop: -10, marginBottom: 12 },

  childRow: { display: "flex", alignItems: "flex-end", marginBottom: 10 },
  removeBtn: {
    background: "#fee",
    border: "1px solid #fcc",
    color: "#c0392b",
    borderRadius: 10,
    width: 48,
    height: 52,
    cursor: "pointer",
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 16,
    WebkitAppearance: "none",
  },
  addBtn: {
    background: "white",
    border: `1.5px dashed ${MAROON}`,
    color: MAROON,
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    marginBottom: 4,
    WebkitAppearance: "none",
  },

  subText: { fontSize: 14, color: "#666", marginBottom: 14, lineHeight: 1.5 },

  checkBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    background: "#fafafa",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 10,
    padding: "14px 14px",
    marginBottom: 10,
    cursor: "pointer",
  },
  checkBoxOn: {
    background: MAROON_LIGHT,
    borderColor: MAROON,
  },
  checkbox: {
    width: 22,
    height: 22,
    flexShrink: 0,
    marginTop: 1,
    accentColor: MAROON,
    cursor: "pointer",
  },
  checkText: { fontSize: 15, color: "#333", lineHeight: 1.5 },

  ddToggleTitle: { fontSize: 15, fontWeight: 700, color: MAROON, marginBottom: 3 },
  ddToggleSub: { fontSize: 13, color: "#888", lineHeight: 1.4 },

  ddBox: {
    background: "#fdf7f7",
    border: `1.5px solid #f0d0d0`,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    marginTop: 4,
  },
  ddDesc: { fontSize: 13, color: "#777", marginBottom: 14, lineHeight: 1.5 },

  amountRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  amountBtn: {
    border: `1.5px solid ${BORDER}`,
    background: "white",
    borderRadius: 10,
    padding: "13px 0",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    color: "#333",
    flex: 1,
    minWidth: 60,
    WebkitAppearance: "none",
    textAlign: "center",
  },
  amountBtnOn: {
    borderColor: MAROON,
    background: MAROON,
    color: "white",
  },

  secNote: { fontSize: 12, color: "#aaa", marginTop: 10, lineHeight: 1.5 },

  divider: { height: 1, background: "#f0f0f0", margin: "20px 0" },

  errorBox: {
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 14,
    color: "#c0392b",
    marginBottom: 16,
    lineHeight: 1.5,
  },

  submitBtn: {
    background: `linear-gradient(135deg, ${MAROON_DARK}, #8B1A1A)`,
    border: "none",
    color: "white",
    borderRadius: 12,
    padding: "16px 32px",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
    WebkitAppearance: "none",
    letterSpacing: 0.3,
  },
  submitBtnDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },

  successIcon: {
    width: 72,
    height: 72,
    background: `linear-gradient(135deg, ${MAROON_DARK}, #8B1A1A)`,
    color: "white",
    borderRadius: "50%",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  successH2: { textAlign: "center", fontSize: 22, marginBottom: 12, color: "#1a1a1a" },
  successP: { textAlign: "center", color: "#555", lineHeight: 1.6, fontSize: 15 },
  successSub: { textAlign: "center", color: "#999", fontSize: 13, marginTop: 12 },

  footer: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 20,
    textAlign: "center",
    padding: "0 20px",
    lineHeight: 1.6,
  },
};