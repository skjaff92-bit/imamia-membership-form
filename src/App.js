import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembershipForm from "./membership_form";
import MadrassaForm from "./madrassa_form";
import PrivacyPolicy from "./privacy_policy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MembershipForm />} />
        <Route path="/madrassa" element={<MadrassaForm />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}