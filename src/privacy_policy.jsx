import React from "react";

const logo = "https://i.imgur.com/JfNBhAt.png";

const SECTIONS = [
  {
    title: "1. Who We Are",
    content: `Imamia Centre Galway (ICG) is a community organisation based at Unit 27 Kilkerrin Park, Liosban, Galway City Centre, H91 HC3Y, Ireland. We are the data controller responsible for the personal information collected through our online forms.

For any data-related queries, contact us at: imamiacentregalway@gmail.com`,
  },
  {
    title: "2. What Data We Collect",
    content: `Through our Membership Registration and Summer Madrassa forms, we may collect the following personal data:

— Full name, age, occupation
— Phone number and email address
— Home city and Eircode
— Children's names and ages
— Community interest preferences
— Volunteer availability
— Bank account details (Account Name, IBAN, BIC) — only if you choose to set up a voluntary standing order

We do not collect sensitive personal data such as religious beliefs, health information, or political opinions through these forms.`,
  },
  {
    title: "3. Why We Collect It (Legal Basis)",
    content: `We collect and process your data on the following legal bases under GDPR (EU) 2016/679:

— Consent (Article 6(1)(a)): You have given explicit consent by ticking the consent checkbox on our forms.
— Legitimate Interests (Article 6(1)(f)): To manage community membership and programme administration.

You may withdraw your consent at any time by contacting us at imamiacentregalway@gmail.com.`,
  },
  {
    title: "4. How We Use Your Data",
    content: `Your personal data is used solely for the following purposes:

— Administering your community membership
— Communicating updates about ICG programmes and events
— Managing Summer Madrassa registrations
— Processing voluntary standing order contributions
— Contacting you via your preferred method (WhatsApp, text, or email)

We will never use your data for marketing, profiling, or any purpose beyond what is stated above.`,
  },
  {
    title: "5. Who We Share Your Data With",
    content: `We do not sell, rent, or share your personal data with third parties for commercial purposes. Your data may be processed by the following trusted service providers solely to operate our forms:

— Formspree Inc. (form submission processing) — formspree.io/privacy
— Google LLC (email hosting via Gmail) — policies.google.com/privacy
— Vercel Inc. (website hosting) — vercel.com/legal/privacy-policy

Each of these providers is GDPR-compliant and processes data only on our behalf.`,
  },
  {
    title: "6. Bank Details",
    content: `If you provide bank details (IBAN/BIC) for a voluntary standing order, this information is transmitted securely via Formspree over HTTPS and delivered to our secure email inbox. 

Bank details are used solely to set up your standing order with Imamia Centre Galway and are not stored in any digital database, shared with third parties, or used for any other purpose. Physical records containing bank details are stored securely and access is restricted to authorised ICG administrators only.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your personal data only for as long as necessary:

— Membership data: retained for the duration of your membership plus 1 year after lapsing
— Madrassa registration data: retained for the duration of the programme plus 6 months
— Bank details: retained only until your standing order is confirmed as active, then securely destroyed

You may request deletion of your data at any time (see Section 9).`,
  },
  {
    title: "8. Data Security",
    content: `We take reasonable technical and organisational measures to protect your personal data including:

— All form submissions are transmitted over HTTPS (TLS encryption)
— Access to submitted data is restricted to authorised ICG administrators
— Email accounts holding personal data are protected by strong passwords and two-factor authentication
— We do not store personal data in publicly accessible locations

While we take all reasonable precautions, no internet transmission is 100% secure. If you have concerns about submitting sensitive data online, please contact us directly.`,
  },
  {
    title: "9. Your Rights Under GDPR",
    content: `As a data subject under GDPR, you have the following rights:

— Right of Access: Request a copy of the data we hold about you
— Right to Rectification: Ask us to correct inaccurate data
— Right to Erasure: Ask us to delete your data ("right to be forgotten")
— Right to Restrict Processing: Ask us to limit how we use your data
— Right to Data Portability: Request your data in a portable format
— Right to Object: Object to processing based on legitimate interests
— Right to Withdraw Consent: Withdraw consent at any time without affecting prior processing

To exercise any of these rights, contact us at imamiacentregalway@gmail.com. We will respond within 30 days.

If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Data Protection Commission (DPC) Ireland at dataprotection.ie.`,
  },
  {
    title: "10. Cookies",
    content: `Our forms do not use cookies or tracking technologies. We do not use analytics tools, advertising pixels, or third-party trackers on our form pages.`,
  },
  {
    title: "11. Children's Data",
    content: `Where parents or guardians provide information about their children (names and ages) for the Summer Madrassa programme, this data is collected with explicit parental consent and used solely for programme administration. We do not knowingly collect data directly from children under 16.`,
  },
  {
    title: "12. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Any changes will be posted at this URL with an updated effective date. We encourage you to review this policy periodically.`,
  },
  {
    title: "13. Contact Us",
    content: `For any questions, concerns, or requests regarding this Privacy Policy or your personal data:

Imamia Centre Galway
Unit 27 Kilkerrin Park, Liosban
Galway City Centre, H91 HC3Y
Ireland

Email: imamiacentregalway@gmail.com`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div style={s.wrap}>
      <GlobalStyles />
      <div style={s.header}>
        <img src={logo} alt="Imamia Centre Galway" style={s.headerLogo} />
        <div style={s.headerText}>
          <div style={s.bismillah}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</div>
          <div style={s.headerTitle}>Imamia Centre Galway</div>
          <div style={s.headerSub}>Privacy Policy</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.effectiveDate}>Effective Date: 4th July 2026 &nbsp;|&nbsp; GDPR Compliant</div>

        <p style={s.intro}>
          Imamia Centre Galway is committed to protecting your privacy and handling your personal data
          with transparency, care, and in full compliance with the General Data Protection Regulation
          (GDPR) and the Data Protection Acts 1988–2018 (Ireland).
        </p>

        {SECTIONS.map((sec, i) => (
          <div key={i} style={s.section}>
            <div style={s.sectionTitle}>{sec.title}</div>
            <p style={s.sectionContent}>{sec.content}</p>
          </div>
        ))}

        <div style={s.dpcBox}>
          <div style={s.dpcTitle}>🇮🇪 Data Protection Commission Ireland</div>
          <p style={s.dpcText}>
            If you wish to make a complaint about how your data is handled, you can contact the Data
            Protection Commission at <strong>dataprotection.ie</strong> or by phone at <strong>+353 57 868 4800</strong>.
          </p>
        </div>
      </div>

      <div style={s.backLinks}>
        <a href="/" style={s.link}>← Membership Registration</a>
        <span style={s.linkDivider}>|</span>
        <a href="/madrassa" style={s.link}>← Madrassa Registration</a>
      </div>

      <p style={s.footer}>
        Imamia Centre Galway · Unit 27 Kilkerrin Park, Liosban · H91 HC3Y · Ya Ali Madad 🖤
      </p>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { font-size: 16px; -webkit-text-size-adjust: 100%; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f0eeeb; -webkit-font-smoothing: antialiased; }
    `}</style>
  );
}

const MAROON = "#8B0000";
const MAROON_DARK = "#6B0000";

const s = {
  wrap: { minHeight: "100vh", background: "#f0eeeb", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 48 },

  header: { width: "100%", maxWidth: 700, background: `linear-gradient(135deg, ${MAROON_DARK} 0%, #8B1A1A 60%, #7A0E0E 100%)`, color: "white", padding: "20px 20px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 3px 16px rgba(107,0,0,0.3)" },
  headerLogo: { width: 62, height: 62, objectFit: "contain", flexShrink: 0, background: "white", borderRadius: "50%", padding: 6 },
  headerText: { flex: 1 },
  bismillah: { fontSize: 17, color: "#f5c842", marginBottom: 3, fontFamily: "serif" },
  headerTitle: { fontSize: 16, fontWeight: 700, color: "white", marginBottom: 1 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.85)" },

  card: { width: "100%", maxWidth: 700, background: "white", padding: "28px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginTop: 12, borderRadius: 12, marginLeft: 12, marginRight: 12 },

  effectiveDate: { fontSize: 12, color: "#999", marginBottom: 18, fontStyle: "italic" },

  intro: { fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 28, padding: "16px 18px", background: "#fdf7f7", border: "1.5px solid #f0d8d8", borderRadius: 10 },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: MAROON, marginBottom: 10, paddingBottom: 8, borderBottom: "2px solid #f0d8d8" },
  sectionContent: { fontSize: 14, color: "#444", lineHeight: 1.8, whiteSpace: "pre-line" },

  dpcBox: { background: "#f0f7ff", border: "1.5px solid #cce0ff", borderRadius: 10, padding: "16px 18px", marginTop: 12 },
  dpcTitle: { fontSize: 14, fontWeight: 700, color: "#1a4a8a", marginBottom: 8 },
  dpcText: { fontSize: 13, color: "#333", lineHeight: 1.6 },

  backLinks: { display: "flex", gap: 12, alignItems: "center", marginTop: 20 },
  link: { fontSize: 13, color: MAROON, textDecoration: "none", fontWeight: 600 },
  linkDivider: { color: "#ccc", fontSize: 13 },

  footer: { fontSize: 12, color: "#aaa", marginTop: 16, textAlign: "center", padding: "0 20px", lineHeight: 1.6 },
};
