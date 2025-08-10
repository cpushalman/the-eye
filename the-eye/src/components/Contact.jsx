import React, { useState } from "react";
import "./contact.css";
import VulnerabilityReportForm from "./VulnerabilityReportForm";
import IncidentReportForm from "./IncidentReportForm";

export default function Contact() {
  const [activeForm, setActiveForm] = useState("incident");

  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className="heading">
          <h1>CONTACT</h1>
          <p>Report Vulnerability</p>
        </div>

        <div className="form-tabs">
          <button
            className={`tab-button ${
              activeForm === "incident" ? "active" : ""
            }`}
            onClick={() => setActiveForm("incident")}
          >
            Incident Report
          </button>
          <button
            className={`tab-button ${
              activeForm === "vulnerability" ? "active" : ""
            }`}
            onClick={() => setActiveForm("vulnerability")}
          >
            Vulnerability Report
          </button>
        </div>

        <div className="form-container">
          {activeForm === "vulnerability" ? (
            <VulnerabilityReportForm
              onSwitchToIncident={() => setActiveForm("incident")}
            />
          ) : (
            <IncidentReportForm />
          )}
        </div>
      </div>
    </div>
  );
}
