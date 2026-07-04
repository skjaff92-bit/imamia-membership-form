import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembershipForm from "./membership_form";
import MadrassaForm from "./madrassa_form";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MembershipForm />} />
        <Route path="/madrassa" element={<MadrassaForm />} />
      </Routes>
    </BrowserRouter>
  );
}