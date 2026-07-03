import React, { useState } from "react";
const logo = "https://i.imgur.com/JfNBhAt.png";

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

const MARITAL = ["Single", "Married", "Widowed", "Divorced"];

function Input({ label, required, hint, ...props }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {hint && <span className="hint">{hint}</span>}
      <input {...props} />
    </div>
  );
}

function Select({ label, required, options, ...props }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      <select {...props}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Header() {
  return (
    <div className="header-banner">
      <img src={logo} alt="Imamia Centre Galway" className="header-logo" />
      <div className="header-text">
        <div className="bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</div>
        <h1>Imamia Centre Galway</h1>
        <p>Membership Registration Form</p>
        <p style={{opacity:0.7,fontSize:11,marginTop:2}}>Unit 27 Kilkerrin Park, Liosban, Galway · H91 HC3Y</p>
      </div>
    </div>
  );
}

export default function MembershipForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    fullName: "", dob: "", occupation: "", phone: "", email: "",
    address1: "", address2: "", city: "", eircode: "",
    marital: "", children: [],
    interests: [],
    amount: "", customAmount: "",
    accountName: "", iban: "", bic: "",
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

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!form.dob) e.dob = "Required";
      if (!form.phone.trim()) e.phone = "Required";
      if (!form.address1.trim()) e.address1 = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.marital) e.marital = "Required";
    }
    if (step === 3) {
      if (!form.consent) e.consent = "Please confirm your consent to proceed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
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
      "Date of Birth": form.dob,
      "Occupation": form.occupation || "—",
      "Phone": form.phone,
      "Email": form.email || "—",
      "Address": [form.address1, form.address2, form.city, form.eircode].filter(Boolean).join(", "),
      "Marital Status": form.marital,
      "Children": childrenText,
      "Community Interests": interestsText,
      "Monthly Standing Order Amount": finalAmount || "Not specified",
      "Account Name": form.accountName || "—",
      "IBAN": form.iban || "—",
      "BIC": form.bic || "—",
      "_subject": "New Membership Registration — " + form.fullName,
      "_replyto": form.email || "",
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
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
        <Header />
        <div className="card success-card">
          <div className="success-icon">✓</div>
          <h2>Registration Received</h2>
          <p>JazakAllah Khair, <strong>{form.fullName}</strong>. Your membership application has been submitted successfully.</p>
          <p className="sub-text">We will be in touch shortly. Ya Ali Madad 🖤</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <style>{css}</style>
      <Header />
      <div className="card">

        <div className="progress">
          {[1,2,3].map((n, i) => (
            <div key={n} style={{display:"flex",alignItems:"center"}}>
              <div className={"step-dot" + (step===n?" active":step>n?" done":"")}>
                {step > n ? "✓" : n}
              </div>
              {i < 2 && <div className={"step-line" + (step>n?" done":"")} />}
            </div>
          ))}
        </div>
        <div className="step-label">
          Step {step} of 3 — <span>{step===1?"Personal Details":step===2?"Community Interests":"Standing Order & Consent"}</span>
        </div>

        {step === 1 && <>
          <div className="section-title">Personal Information</div>
          <Input label="Full Name" required placeholder="e.g. Ali Hassan" value={form.fullName}
            onChange={e => set("fullName", e.target.value)} />
          {err("fullName")}

          <div className="grid-2">
            <div>
              <Input label="Date of Birth" required type="date" value={form.dob}
                onChange={e => set("dob", e.target.value)} />
              {err("dob")}
            </div>
            <Input label="Occupation" placeholder="e.g. Engineer" value={form.occupation}
              onChange={e => set("occupation", e.target.value)} />
          </div>

          <div className="grid-2">
            <div>
              <Input label="Phone Number" required type="tel" placeholder="+353 87 000 0000"
                value={form.phone} onChange={e => set("phone", e.target.value)} />
              {err("phone")}
            </div>
            <Input label="Email Address" type="email" placeholder="name@email.com"
              value={form.email} onChange={e => set("email", e.target.value)} />
          </div>

          <div className="divider" />
          <div className="section-title">Home Address</div>
          <div>
            <Input label="Address Line 1" required placeholder="House / Street" value={form.address1}
              onChange={e => set("address1", e.target.value)} />
            {err("address1")}
          </div>
          <Input label="Address Line 2" placeholder="Area / Estate"
            value={form.address2} onChange={e => set("address2", e.target.value)} />
          <div className="grid-2">
            <div>
              <Input label="City / Town" required placeholder="Galway" value={form.city}
                onChange={e => set("city", e.target.value)} />
              {err("city")}
            </div>
            <Input label="Eircode" placeholder="H91 XXXX"
              value={form.eircode} onChange={e => set("eircode", e.target.value)} />
          </div>

          <div className="divider" />
          <div className="section-title">Family</div>
          <div style={{maxWidth:260}}>
            <Select label="Marital Status" required options={MARITAL} value={form.marital}
              onChange={e => set("marital", e.target.value)} />
            {err("marital")}
          </div>

          <label style={{fontSize:13,fontWeight:600,color:"#333",display:"block",marginBottom:10}}>
            Children <span className="optional-tag">optional</span>
          </label>
          {form.children.map((c, i) => (
            <div className="child-row" key={i}>
              <div className="field" style={{marginBottom:0}}>
                <label style={{fontSize:12,color:"#666"}}>Child {i+1} Name</label>
                <input placeholder="Name" value={c.name} onChange={e => updateChild(i,"name",e.target.value)} />
              </div>
              <div className="field" style={{marginBottom:0}}>
                <label style={{fontSize:12,color:"#666"}}>Age</label>
                <input type="number" min="0" max="18" placeholder="Age" value={c.age}
                  onChange={e => updateChild(i,"age",e.target.value)} />
              </div>
              <button className="btn-remove" onClick={() => removeChild(i)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addChild}>+ Add Child</button>

          <div className="btn-row">
            <div />
            <button className="btn-next" onClick={next}>Continue →</button>
          </div>
        </>}

        {step === 2 && <>
          <div className="section-title">Community Interests</div>
          <p style={{fontSize:13,color:"#666",marginBottom:18,lineHeight:1.5}}>
            Tick any programmes or initiatives you would like to be involved in or notified about.
          </p>
          <div className="interests-grid">
            {INTERESTS.map(item => (
              <label key={item.id}
                className={"interest-item" + (form.interests.includes(item.id)?" checked":"")}>
                <input type="checkbox" checked={form.interests.includes(item.id)}
                  onChange={() => toggleInterest(item.id)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn-back" onClick={back}>← Back</button>
            <button className="btn-next" onClick={next}>Continue →</button>
          </div>
        </>}

        {step === 3 && <>
          <div className="section-title">Voluntary Standing Order</div>
          <div className="dd-box">
            <h3>Support Imamia Centre Galway</h3>
            <p>Setting up a monthly standing order helps cover the centre's running costs. This is entirely voluntary.</p>

            <div className="amount-options">
              {["€50","€100","€200","Custom"].map(a => (
                <button key={a} className={"amount-btn" + (form.amount===a?" selected":"")}
                  onClick={() => set("amount", a)}>{a}</button>
              ))}
            </div>

            {form.amount === "Custom" && (
              <Input label="Custom Monthly Amount (€)" type="number" placeholder="e.g. 75"
                value={form.customAmount}
                onChange={e => set("customAmount", e.target.value)} />
            )}

            <div className="divider" style={{margin:"16px 0"}} />
            <div className="section-title" style={{fontSize:12,marginBottom:12}}>Bank Details</div>

            <Input label="Account Name" placeholder="Name on bank account"
              value={form.accountName} onChange={e => set("accountName", e.target.value)} />
            <div className="grid-2">
              <Input label="IBAN" placeholder="IE00 XXXX 0000 0000 0000 00"
                value={form.iban} onChange={e => set("iban", e.target.value)} />
              <Input label="BIC" placeholder="e.g. AIBKIE2D"
                value={form.bic} onChange={e => set("bic", e.target.value)} />
            </div>
            <p style={{fontSize:11,color:"#aaa",marginTop:4,lineHeight:1.5}}>
              Your bank details are used solely to set up a voluntary standing order to Imamia Centre Galway and will not be stored digitally or shared with any third parties.
            </p>
          </div>

          <div className="divider" />
          <div className="section-title">Declaration & Consent</div>
          <label className="consent-box">
            <input type="checkbox" checked={form.consent}
              onChange={e => set("consent", e.target.checked)} />
            <span>
              I confirm that the information provided is accurate and I consent to Imamia Centre Galway
              storing my details for membership and community communication purposes.
              I understand my data will not be shared with third parties.
            </span>
          </label>
          {err("consent")}

          {submitError && (
            <div style={{background:"#fee",border:"1px solid #fcc",borderRadius:8,padding:"12px 16px",
              fontSize:13,color:"#c0392b",marginBottom:16}}>
              ⚠️ {submitError}
            </div>
          )}

          <div className="btn-row">
            <button className="btn-back" onClick={back}>← Back</button>
            <button className="btn-next" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Registration ✓"}
            </button>
          </div>
        </>}
      </div>
      <p style={{fontSize:11,color:"#aaa",marginTop:16,textAlign:"center"}}>
        Imamia Centre Galway · Unit 27 Kilkerrin Park, Liosban · H91 HC3Y · Ya Ali Madad 🖤
      </p>
    </div>
  );
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f0eeeb; }
  .wrap { min-height: 100vh; background: #f0eeeb; display: flex; flex-direction: column; align-items: center; padding: 24px 16px 60px; }
  .header-banner { width: 100%; max-width: 680px; background: linear-gradient(135deg, #6B0000 0%, #8B1A1A 50%, #7A0E0E 100%); color: white; border-radius: 14px 14px 0 0; padding: 28px 32px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 24px rgba(139,0,0,0.25); }
  .header-logo { width: 80px; height: 80px; object-fit: contain; flex-shrink: 0; background: white; border-radius: 50%; padding: 8px; }
  .header-text { flex: 1; }
  .bismillah { font-size: 20px; color: #f5c842; margin-bottom: 6px; font-family: serif; }
  .header-banner h1 { font-size: 20px; font-weight: 700; letter-spacing: 0.2px; margin-bottom: 2px; }
  .header-banner p { font-size: 13px; opacity: 0.85; }
  .card { width: 100%; max-width: 680px; background: white; border-radius: 0 0 14px 14px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .success-card { border-radius: 14px; text-align: center; padding: 48px 32px; }
  .success-icon { width: 64px; height: 64px; background: linear-gradient(135deg,#6B0000,#8B1A1A); color: white; border-radius: 50%; font-size: 28px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .success-card h2 { font-size: 22px; margin-bottom: 12px; color: #1a1a1a; }
  .success-card p { color: #555; margin-bottom: 8px; line-height: 1.5; }
  .sub-text { font-size: 12px; color: #999; }
  .progress { display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .step-dot { width: 32px; height: 32px; border-radius: 50%; background: #e5e5e5; color: #999; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; }
  .step-dot.active { background: #8B0000; color: white; }
  .step-dot.done { background: #6B0000; color: white; }
  .step-line { width: 60px; height: 2px; background: #e5e5e5; }
  .step-line.done { background: #8B0000; }
  .step-label { text-align: center; font-size: 12px; color: #999; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
  .step-label span { color: #8B0000; font-weight: 600; }
  .section-title { font-size: 13px; font-weight: 700; color: #8B0000; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f0d8d8; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .field label { font-size: 13px; font-weight: 600; color: #333; }
  .hint { font-size: 11px; color: #aaa; }
  .req { color: #8B0000; }
  .optional-tag { font-size: 11px; font-weight: 400; color: #bbb; margin-left: 4px; }
  input, select { border: 1.5px solid #ddd; border-radius: 8px; padding: 10px 13px; font-size: 14px; color: #1a1a1a; background: #fafafa; width: 100%; font-family: inherit; transition: border 0.15s; }
  input:focus, select:focus { outline: none; border-color: #8B0000; background: white; }
  .err-msg { font-size: 11px; color: #c0392b; margin-top: 2px; margin-bottom: 8px; }
  .child-row { display: grid; grid-template-columns: 1fr 100px 36px; gap: 10px; align-items: end; margin-bottom: 10px; }
  .btn-remove { background: #fee; border: 1px solid #fcc; color: #c0392b; border-radius: 8px; width: 36px; height: 38px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .btn-add { background: white; border: 1.5px dashed #8B0000; color: #8B0000; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 20px; }
  .btn-add:hover { background: #fdf0f0; }
  .interests-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .interest-item { display: flex; align-items: flex-start; gap: 10px; background: #fafafa; border: 1.5px solid #eee; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.15s; }
  .interest-item.checked { background: #fff5f5; border-color: #8B0000; }
  .interest-item input[type=checkbox] { width: 16px; height: 16px; margin-top: 1px; flex-shrink: 0; accent-color: #8B0000; cursor: pointer; }
  .interest-item span { font-size: 13px; color: #333; line-height: 1.4; }
  .dd-box { background: #fdf7f7; border: 1.5px solid #f0d0d0; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
  .dd-box h3 { font-size: 14px; font-weight: 700; color: #8B0000; margin-bottom: 6px; }
  .dd-box p { font-size: 12px; color: #777; margin-bottom: 16px; line-height: 1.5; }
  .amount-options { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .amount-btn { border: 1.5px solid #ddd; background: white; border-radius: 8px; padding: 10px 22px; font-size: 15px; font-weight: 600; cursor: pointer; color: #333; transition: all 0.15s; }
  .amount-btn.selected { border-color: #8B0000; background: #8B0000; color: white; }
  .consent-box { display: flex; align-items: flex-start; gap: 12px; background: #f9f9f9; border: 1.5px solid #eee; border-radius: 10px; padding: 16px; margin-bottom: 16px; cursor: pointer; }
  .consent-box input { width: 18px; height: 18px; flex-shrink: 0; accent-color: #8B0000; margin-top: 2px; }
  .consent-box span { font-size: 13px; color: #444; line-height: 1.5; }
  .divider { height: 1px; background: #f0f0f0; margin: 20px 0; }
  .btn-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }
  .btn-back { background: white; border: 1.5px solid #ddd; color: #555; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; }
  .btn-back:hover { border-color: #aaa; }
  .btn-next { background: linear-gradient(135deg,#6B0000,#8B1A1A); border: none; color: white; border-radius: 8px; padding: 12px 32px; font-size: 14px; font-weight: 700; cursor: pointer; flex: 1; transition: opacity 0.15s; }
  .btn-next:hover { opacity: 0.9; }
  .btn-next:disabled { background: #ccc; cursor: not-allowed; }
  @media (max-width: 560px) { .grid-2, .interests-grid { grid-template-columns: 1fr; } .header-banner { flex-direction: column; text-align: center; } }
`;
