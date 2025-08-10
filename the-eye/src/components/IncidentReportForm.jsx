import React, { useState } from "react";

export default function IncidentReportForm() {
  const [formData, setFormData] = useState({
    incidentDate: "",
    contactDetails: "",
    name: "",
    affectedSystem: "",
    symptoms: "",
    technicalInfo: "",
    securityInfo: "",
    nonTechnicalInfo: "",
    otherInfo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Incident Report:", formData);
    // Handle form submission here
  };

  return (
    <div className="incident-form">
      <h2>Incident Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="incidentDate">Date when incident occurred</label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">What's your good name?</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contactDetails">
            Contact details (Name, Email, Phone, etc. - Optional)
          </label>
          <input
            type="text"
            id="contactDetails"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            placeholder="Email, phone, or other contact details"
          />
        </div>

        <div className="form-group">
          <label htmlFor="affectedSystem">
            Affected system/network/user information
          </label>
          <textarea
            id="affectedSystem"
            name="affectedSystem"
            value={formData.affectedSystem}
            onChange={handleChange}
            placeholder="Provide details about the affected system, network, or users..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">
            Symptoms observed and incident background
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe what you observed and the background context of the incident..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="technicalInfo">Relevant technical information</label>
          <textarea
            id="technicalInfo"
            name="technicalInfo"
            value={formData.technicalInfo}
            onChange={handleChange}
            placeholder="Include logs, error messages, system configurations, or other technical details..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="securityInfo">
            Security systems and mitigation actions
          </label>
          <textarea
            id="securityInfo"
            name="securityInfo"
            value={formData.securityInfo}
            onChange={handleChange}
            placeholder="List security systems in place and any actions taken to mitigate damage..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nonTechnicalInfo">
            Relevant non-technical information
          </label>
          <textarea
            id="nonTechnicalInfo"
            name="nonTechnicalInfo"
            value={formData.nonTechnicalInfo}
            onChange={handleChange}
            placeholder="Business impact, user complaints, or other non-technical aspects..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="otherInfo">Additional information</label>
          <textarea
            id="otherInfo"
            name="otherInfo"
            value={formData.otherInfo}
            onChange={handleChange}
            placeholder="Any other relevant information..."
            rows="3"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-send">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
