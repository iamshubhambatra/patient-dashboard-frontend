
import React, { useState, useEffect } from 'react';
import './App.css';
import imageURLs from './utils';
import io from 'socket.io-client';
import { keyTexts } from './utils';
import { BASE_URL } from './enums';

const socket = io(BASE_URL);

function App() {
  const [completedOpen, setCompletedOpen] = useState(true); // Default to open
  const [processingOpen, setProcessingOpen] = useState(false);
  const [completePatients, setCompletePatients] = useState([]);
  const [processingPatients, setProcessingPatients] = useState([]);

  useEffect(() => {
    // Listen for patient data from the server
    socket.on('patients', (data) => {
      let cPatients = data.filter((item) => (item.status === keyTexts.COMPLETED))
      let pPatients = data.filter((item) => (item.status === keyTexts.PROCESSING))
      setCompletePatients(cPatients);
      setProcessingPatients(pPatients);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('patients');
    };
  }, []);

  const toggleCollapse = (section) => {
    if (section === keyTexts.COMPLETED) {
      setCompletedOpen(!completedOpen);
    } else if (section === keyTexts.PROCESSING) {
      setProcessingOpen(!processingOpen);
    }
  };

  return (
    <div className="container main-container">
      {/* Completed Uploads Section */}
      <div className="section">
        <div className="table-header">
          <span>{keyTexts.PATIENT_ID}</span>
          <span>{keyTexts.AGE_AND_GENDER}</span>
          <span>{keyTexts.CONDITION}</span>
          <span>{keyTexts.DATE_OF_UPLOAD}</span>
          <span>{keyTexts.FILES_UPLOADED}</span>
          <span>{keyTexts.PROCESS_STATUS}</span>
          <span>{keyTexts.ACTIONS_STRING}</span>
        </div>
        <div className="section-header" onClick={() => toggleCollapse(keyTexts.COMPLETED)}>
          <div className="section-title">
            <span className="icon"><img src={imageURLs.completeIcon} alt='complete-img' /></span> {keyTexts.COMPLETED_UPLOADS}
          </div>
          <span className={`arrow ${completedOpen ? 'open' : ''}`}>▼</span>
        </div>
        {completedOpen && (
          <div className="section-content">
            {completePatients?.map(patient => (
              <div className="table-row" key={patient.id}>
                <span>{patient.patientId}</span>
                <span>{patient.age}, {patient.sex}</span>
                <span>{patient.condition}</span>
                <span>{patient.dateOfUpload}</span>
                <span>
                  <span><img src={imageURLs.completeIcon} alt='complete-icon' className={"status-icon-row"} /></span>
                  {patient.filesUploaded.map((file, index) => (
                    <span key={index} className="file-tag">{file}</span>
                  ))}
                </span>
                <span>
                  <span className={`status-tag ${patient.status.toLowerCase()}`}>{patient.status}</span>
                </span>
                <span className="actions">
                  <span className="action-icon"><img src={imageURLs.saveIcon} alt='save-img' /></span>
                  <span className="action-icon"><img src={imageURLs.viewIcon} alt='view-img' /></span>
                  <button className="view-btn">{keyTexts.VIEW_STRING}</button>
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="section-header" onClick={() => toggleCollapse(keyTexts.PROCESSING)}>
          <div className="section-title">
            <span className="icon"><img src={imageURLs.failedIcon} alt='processing-img' /></span> {keyTexts.PROCESSING_UPLOADS}
          </div>
          <span className={`arrow ${processingOpen ? 'open' : ''}`}>▼</span>
        </div>
        {processingOpen && (
          <div className="section-content">
            {processingPatients?.map(patient => (
              <div className="table-row" key={patient.id}>
                <span>{patient.patientId}</span>
                <span>{patient.age}, {patient.sex}</span>
                <span>{patient.condition}</span>
                <span>{patient.dateOfUpload}</span>
                <span>
                  <span><img src={imageURLs.processingIcon} alt='complete-icon' className={"status-icon-row"} /></span>
                  {patient?.filesUploaded?.map((file, index) => (
                    <span key={index} className="file-tag">{file}</span>
                  ))}
                </span>
                <span>
                  <span className={`status-tag status-tag-processing ${patient?.status?.toLowerCase()}`}>{patient.status}</span>
                </span>
                <span className="actions">
                  <span className="action-icon"><img src={imageURLs.saveIcon} alt='save-img' /></span>
                  <span className="action-icon"><img src={imageURLs.viewIcon} alt='view-img' /></span>
                  <button className="view-btn">{keyTexts.VIEW_STRING}</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



