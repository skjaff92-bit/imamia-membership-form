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

function Input({ label, required, hint, ...props }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {hint && <div className="hint">{hint}</div>}
      <input {...props} />
    </div>
  );
}

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showDD, setShowDD] = useState(false);
  const [form, setForm] = useState({
    fullName: "", age: "", occupation: "", phone: "", email: "",
    eircode: "", city: "",
    children: [],
    interests: [],
    amount: "", customAmount: "",
    accountName: "", iban: "", bic: "",
    ddConsent1: false, ddConsent2: false, ddConsent3: false, ddConsent4: false,
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (id) => {
    set("interests", form.interests.includes(id)
      ? form.interests.filter(i => i !== id)
      : [...form.interests, id]);
  };

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
    if (!form.consent) e.consent = "Please confirm your consent to proceed";
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
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    const childrenText = form.children.length > 0
      ? form.children.map((c, i) => "Child " + (i+1) + ": " + (c.name||"—") + ", Age: " + (c.age||"—")).join(" | ")
      : "None";

    const interestsText = form.interests.length > 0
      ? form.interests.map(id => INTERESTS.find(i => i.id === id)?.label).join(", ")
      : "None selected";

    const finalAmount = form.amount === "Custom" ? ("€" + form.customAmount) : form.amount;

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
      "_subject": "New Membership Registration — " + form.fullName,
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

  const err = (k) => errors[k] ? <div className="err-msg">{errors[k]}</div> : null;

  if (submitted) {
    return (
      <div className="wrap">
        <style>{css}</style>
        <div className="header-banner">
          <img src={logo} alt="Imamia Centre Galway" className="header-logo" />
          <div className="header-text">
            <div className="bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</div>
            <h1>Imamia Centre Galway</h1>
            <p>Membership Registration Form</p>
          </div>
        </div>
        <div className="card">
          <div className="success-icon">✓</div>
          <h2 style={{textAlign:"center",marginBottom:12}}>Registration Received</h2>
          <p style={{textAlign:"center",color:"#555",lineHeight:1.6}}>JazakAllah Khair, <strong>{form.fullName}</strong>. Your membership application has been submitted successfully.</p>
          <p style={{textAlign:"center",color:"#999",fontSize:13,marginTop:12}}>We will be in touch shortly. Ya Ali Madad 🖤</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <style>{css}</style>

      <div className="header-banner">
        <img src={logo} alt="Imamia Centre Galway" className="header-logo" />
        <div className="header-text">
          <div className="bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</div>
          <h1>Imamia Centre Galway</h1>
          <p>Membership Registration Form</p>
          <p className="header-sub">Unit 27 Kilkerrin Park, Liosban, Galway · H91 HC3Y</p>
        </div>
      </div>

      <div className="card">

        <div className="section-title">Personal Information</div>

        <Input label="Full Name" required placeholder="e.g. Ali Hassan"
          value={form.fullName} onChange={e => set("fullName", e.target.value)}
          autoComplete="name" />
        {err("fullName")}

        <Input label="Email Address" required type="email" placeholder="name@email.com"
          value={form.email} onChange={e => set("email", e.target.value)}
          autoComplete="email" inputMode="email" />
        {err("email")}

        <Input label="Phone Number" required type="tel" placeholder="+353 87 000 0000"
          value={form.phone} onChange={e => set("phone", e.target.value)}
          autoComplete="tel" inputMode="tel" />
        {err("phone")}

        <div className="grid-2">
          <Input label="Age" type="number" min="1" max="120" placeholder="e.g. 34"
            value={form.age} onChange={e => set("age", e.target.value)}
            inputMode="numeric" />
          <Input label="Occupation" placeholder="e.g. Engineer"
            value={form.occupation} onChange={e => set("occupation", e.target.value)} />
        </div>

        <div className="grid-2">
          <Input label="City / Town" placeholder="Galway"
            value={form.city} onChange={e => set("city", e.target.value)} />
          <Input label="Eircode" placeholder="H91 XXXX"
            value={form.eircode} onChange={e => set("eircode", e.target.value)}
            autoCapitalize="characters" />
        </div>

        <div className="divider" />

        <div className="section-title">Children <span className="optional-tag">optional</span></div>
        {form.children.map((c, i) => (
          <div className="child-row" key={i}>
            <div className="field" style={{marginBottom:0}}>
              <label style={{fontSize:13,color:"#666"}}>Child {i+1} Name</label>
              <input placeholder="Name" value={c.name}
                onChange={e => updateChild(i,"name",e.target.value)} />
            </div>
            <div className="field" style={{marginBottom:0}}>
              <label style={{fontSize:13,color:"#666"}}>Age</label>
              <input type="number" min="0" max="18" placeholder="Age" value={c.age}
                onChange={e => updateChild(i,"age",e.target.value)} inputMode="numeric" />
            </div>
            <button className="btn-remove" onClick={() => removeChild(i)}>×</button>
          </div>
        ))}
        <button className="btn-add" onClick={addChild}>+ Add Child</button>

        <div className="divider" />

        <div className="section-title">Community Interests <span className="optional-tag">optional</span></div>
        <p style={{fontSize:14,color:"#666",marginBottom:16,lineHeight:1.6}}>
          Tick any programmes you would like to be involved in or notified about.
        </p>
        <div className="interests-grid">
          {INTERESTS.map(item => (
            <label key={item.id}
              className={"interest-item" + (form.interests.includes(item.id) ? " checked" : "")}>
              <input type="checkbox" checked={form.interests.includes(item.id)}
                onChange={() => toggleInterest(item.id)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <div className="divider" />

        <label className="dd-toggle">
          <input type="checkbox" checked={showDD} onChange={e => setShowDD(e.target.checked)} />
          <div>
            <div className="dd-toggle-title">I wish to support Imamia Centre through monthly membership</div>
            <div className="dd-toggle-sub">Tick to set up a voluntary monthly direct debit contribution</div>
          </div>
        </label>

        {showDD && (
          <div className="dd-box">
            <h3>Monthly Direct Debit</h3>
            <p>Please select your preferred monthly contribution amount.</p>

            <div className="amount-options">
              {["€50","€100","€200","Custom"].map(a => (
                <button key={a} className={"amount-btn" + (form.amount===a?" selected":"")}
                  onClick={() => set("amount", a)}>{a}</button>
              ))}
            </div>

            {form.amount === "Custom" && (
              <Input label="Custom Monthly Amount (€)" type="number" placeholder="e.g. 75"
                value={form.customAmount} onChange={e => set("customAmount", e.target.value)}
                inputMode="numeric" />
            )}

            <div className="divider" style={{margin:"16px 0"}} />
            <div className="section-title" style={{fontSize:12,marginBottom:12}}>Bank Details</div>

            <Input label="Account Name" placeholder="Name on bank account"
              value={form.accountName} onChange={e => set("accountName", e.target.value)}
              autoComplete="name" />
            <Input label="IBAN" placeholder="IE00 XXXX 0000 0000 0000 00"
              value={form.iban} onChange={e => set("iban", e.target.value)}
              autoCapitalize="characters" />
            <Input label="BIC" placeholder="e.g. AIBKIE2D"
              value={form.bic} onChange={e => set("bic", e.target.value)}
              autoCapitalize="characters" />

            <div className="divider" style={{margin:"16px 0"}} />
            <div className="section-title" style={{fontSize:12,marginBottom:12}}>Direct Debit Declarations</div>

            {[
              { key: "ddConsent1", text: "I understand the monthly payment will continue until I cancel or change it in writing." },
              { key: "ddConsent2", text: "I will inform Imamia Centre if my bank details or membership details change." },
              { key: "ddConsent3", text: "I consent to Imamia Centre using my details for membership administration and payment management only." },
              { key: "ddConsent4", text: "I authorise Imamia Centre Galway to collect the above monthly amount from my account." },
            ].map(({ key, text }) => (
              <div key={key}>
                <label className="consent-box" style={{marginBottom:8}}>
                  <input type="checkbox" checked={form[key]}
                    onChange={e => set(key, e.target.checked)} />
                  <span>{text}</span>
                </label>
                {err(key)}
              </div>
            ))}

            <p style={{fontSize:12,color:"#aaa",marginTop:8,lineHeight:1.5}}>
              🔒 Your bank details are used solely to set up your voluntary standing order and will not be shared with any third parties.
            </p>
          </div>
        )}

        <div className="divider" />

        <div className="section-title">Declaration & Consent</div>
        <label className="consent-box">
          <input type="checkbox" checked={form.consent}
            onChange={e => set("consent", e.target.checked)} />
          <span>
            I confirm the information provided is accurate and I consent to Imamia Centre Galway
            storing my details for membership and community communication purposes.
            I understand my data will not be shared with third parties.
          </span>
        </label>
        {err("consent")}

        {submitError && (
          <div style={{background:"#fee",border:"1px solid #fcc",borderRadius:8,
            padding:"14px 16px",fontSize:14,color:"#c0392b",marginBottom:16,lineHeight:1.5}}>
            ⚠️ {submitError}
          </div>
        )}

        <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Registration ✓"}
        </button>

      </div>

      <p style={{fontSize:12,color:"#aaa",marginTop:16,textAlign:"center",padding:"0 16px"}}>
        Imamia Centre Galway · Unit 27 Kilkerrin Park, Liosban · H91 HC3Y · Ya Ali Madad 🖤
      </p>
    </div>
  );
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { font-size: 16px; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f0eeeb; -webkit-font-smoothing: antialiased; }
  .wrap { min-height: 100vh; background: #f0eeeb; display: flex; flex-direction: column; align-items: center; padding: 0 0 60px; }

  .header-banner { width: 100%; max-width: 680px; background: linear-gradient(135deg, #6B0000 0%, #8B1A1A 50%, #7A0E0E 100%); color: white; border-radius: 0 0 14px 14px; padding: 24px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 24px rgba(139,0,0,0.25); }
  .header-logo { width: 70px; height: 70px; object-fit: contain; flex-shrink: 0; background: white; border-radius: 50%; padding: 7px; }
  .header-text { flex: 1; min-width: 0; }
  .bismillah { font-size: 18px; color: #f5c842; margin-bottom: 4px; font-family: serif; }
  .header-banner h1 { font-size: 17px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .header-banner p { font-size: 13px; opacity: 0.85; }
  .header-sub { opacity: 0.6 !important; font-size: 11px !important; margin-top: 2px; }

  .card { width: 100%; max-width: 680px; background: white; border-radius: 14px; padding: 24px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.07); margin-top: 16px; }

  .success-icon { width: 70px; height: 70px; background: linear-gradient(135deg,#6B0000,#8B1A1A); color: white; border-radius: 50%; font-size: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }

  .section-title { font-size: 12px; font-weight: 700; color: #8B0000; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f0d8d8; }
  .optional-tag { font-size: 11px; font-weight: 400; color: #bbb; margin-left: 4px; text-transform: none; letter-spacing: 0; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .field label { font-size: 14px; font-weight: 600; color: #333; }
  .hint { font-size: 12px; color: #aaa; }
  .req { color: #8B0000; }

  input[type=text], input[type=email], input[type=tel], input[type=number] {
    border: 1.5px solid #ddd;
    border-radius: 10px;
    padding: 13px 14px;
    font-size: 16px;
    color: #1a1a1a;
    background: #fafafa;
    width: 100%;
    font-family: inherit;
    transition: border 0.15s;
    -webkit-appearance: none;
    appearance: none;
  }
  input[type=text]:focus, input[type=email]:focus, input[type=tel]:focus, input[type=number]:focus {
    outline: none; border-color: #8B0000; background: white;
  }

  .err-msg { font-size: 12px; color: #c0392b; margin-top: 2px; margin-bottom: 6px; }

  .child-row { display: grid; grid-template-columns: 1fr 90px 44px; gap: 10px; align-items: end; margin-bottom: 12px; }
  .btn-remove { background: #fee; border: 1px solid #fcc; color: #c0392b; border-radius: 10px; width: 44px; height: 48px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .btn-add { background: white; border: 1.5px dashed #8B0000; color: #8B0000; border-radius: 10px; padding: 13px 16px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 4px; }

  .interests-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 4px; }
  .interest-item { display: flex; align-items: flex-start; gap: 12px; background: #fafafa; border: 1.5px solid #eee; border-radius: 10px; padding: 14px 12px; cursor: pointer; transition: all 0.15s; min-height: 56px; }
  .interest-item.checked { background: #fff5f5; border-color: #8B0000; }
  .interest-item input[type=checkbox] { width: 20px; height: 20px; margin-top: 1px; flex-shrink: 0; accent-color: #8B0000; cursor: pointer; }
  .interest-item span { font-size: 13px; color: #333; line-height: 1.4; }

  .dd-toggle { display: flex; align-items: flex-start; gap: 14px; background: #fff8f8; border: 2px solid #8B0000; border-radius: 12px; padding: 16px; cursor: pointer; margin-bottom: 16px; min-height: 64px; }
  .dd-toggle input[type=checkbox] { width: 22px; height: 22px; margin-top: 2px; flex-shrink: 0; accent-color: #8B0000; cursor: pointer; }
  .dd-toggle-title { font-size: 15px; font-weight: 700; color: #8B0000; margin-bottom: 3px; line-height: 1.3; }
  .dd-toggle-sub { font-size: 12px; color: #888; line-height: 1.4; }

  .dd-box { background: #fdf7f7; border: 1.5px solid #f0d0d0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .dd-box h3 { font-size: 15px; font-weight: 700; color: #8B0000; margin-bottom: 6px; }
  .dd-box p { font-size: 13px; color: #777; margin-bottom: 16px; line-height: 1.5; }

  .amount-options { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .amount-btn { border: 1.5px solid #ddd; background: white; border-radius: 10px; padding: 13px 22px; font-size: 16px; font-weight: 600; cursor: pointer; color: #333; transition: all 0.15s; min-width: 70px; text-align: center; -webkit-appearance: none; }
  .amount-btn.selected { border-color: #8B0000; background: #8B0000; color: white; }

  .consent-box { display: flex; align-items: flex-start; gap: 14px; background: #f9f9f9; border: 1.5px solid #eee; border-radius: 12px; padding: 16px; margin-bottom: 16px; cursor: pointer; }
  .consent-box input { width: 22px; height: 22px; flex-shrink: 0; accent-color: #8B0000; margin-top: 2px; }
  .consent-box span { font-size: 14px; color: #444; line-height: 1.6; }

  .divider { height: 1px; background: #f0f0f0; margin: 20px 0; }

  .btn-submit { background: linear-gradient(135deg,#6B0000,#8B1A1A); border: none; color: white; border-radius: 12px; padding: 16px 32px; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 8px; transition: opacity 0.15s; -webkit-appearance: none; letter-spacing: 0.3px; }
  .btn-submit:hover { opacity: 0.9; }
  .btn-submit:disabled { background: #ccc; cursor: not-allowed; }

  @media (max-width: 600px) {
    .wrap { padding-bottom: 40px; }
    .header-banner { border-radius: 0; padding: 20px 16px; }
    .card { border-radius: 12px; padding: 20px 16px; margin: 12px 12px 0; width: auto; }
    .grid-2 { grid-template-columns: 1fr; gap: 0; }
    .interests-grid { grid-template-columns: 1fr; }
    .amount-options { gap: 8px; }
    .amount-btn { flex: 1; padding: 13px 10px; font-size: 15px; }
    .child-row { grid-template-columns: 1fr 80px 44px; }
    .header-banner h1 { font-size: 16px; }
    .bismillah { font-size: 17px; }
  }
`;
