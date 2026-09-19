import { jsPDF } from 'jspdf';
import { AppointmentBooking } from '../types';
import { MedicalRecordEntry, SyntheticPatient } from '../types/management';
import { CLINIC_INFO } from '../data/clinicData';

/**
 * Clean helper to draw hospital header on any document
 */
function drawHospitalHeader(
  doc: jsPDF, 
  title: string, 
  subtitle: string, 
  topY = 14
): number {
  // Brand Header Bar
  doc.setFillColor(0, 137, 123); // Teal primary
  doc.rect(15, topY, 180, 2.5, 'F');

  let y = topY + 8;

  // Hospital Name & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('CAREPLUS HOSPITAL', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 137, 123);
  doc.text('MULTISPECIALITY HEALTHCARE & DIAGNOSTIC CENTRE', 15, y + 4.5);

  // Clinic metadata on the right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(CLINIC_INFO.address, 195, y - 1, { align: 'right', maxWidth: 85 });
  doc.text(`Emergency 24x7: ${CLINIC_INFO.phonePrimary} | Appts: ${CLINIC_INFO.phoneAppointments1}`, 195, y + 6, { align: 'right' });
  doc.text('NABH Accredited • Reg No: DL/MC/2026/0942', 195, y + 9.5, { align: 'right' });

  y += 14;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 6;

  // Document Title Banner
  doc.setFillColor(240, 253, 250); // Light teal tint
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(15, y, 180, 9, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 118, 110);
  doc.text(title.toUpperCase(), 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(subtitle, 190, y + 5.8, { align: 'right' });

  return y + 13;
}

/**
 * Clean helper to draw footer with page number and timestamp
 */
function drawFooter(doc: jsPDF, pageNumber = 1, totalPages = 1): void {
  const pageHeight = doc.internal.pageSize.height || 297;
  const y = pageHeight - 12;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, y, 195, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CarePlus Hospital EHR System • Confidential Medical Document', 15, y + 5);
  doc.text(`Generated: ${new Date().toLocaleString()} | Page ${pageNumber} of ${totalPages}`, 195, y + 5, { align: 'right' });
}

/**
 * Generate and download an Outpatient Case Record & Prescription PDF
 */
export function downloadMedicalRecordPDF(
  record: MedicalRecordEntry,
  patient: SyntheticPatient
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let y = drawHospitalHeader(
    doc,
    'Outpatient Medical Case Sheet & Rx',
    `Visit Date: ${record.visitDate} | MRN: ${patient.mrn}`
  );

  // Patient Info & Medical Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, 180, 25, 2, 2, 'FD');

  // Column 1: Patient Identity
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PATIENT IDENTIFICATION', 20, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${patient.firstName} ${patient.lastName}`, 20, y + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`MRN: ${patient.mrn}  |  Age: ${patient.age} Yrs  |  Gender: ${patient.gender}`, 20, y + 15.5);
  doc.text(`Blood Group: ${patient.bloodGroup}  |  Phone: ${patient.phone}`, 20, y + 20);

  // Column 2: Clinical Alerts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28); // rose-700
  doc.text('KNOWN ALLERGIES:', 125, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const allergyText = patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None Reported';
  doc.text(allergyText, 125, y + 9, { maxWidth: 65 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CHRONIC CONDITIONS:', 125, y + 15.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const chronicText = patient.chronicConditions.length > 0 ? patient.chronicConditions.slice(0, 2).join(', ') : 'None Reported';
  doc.text(chronicText, 125, y + 19.5, { maxWidth: 65 });

  y += 29;

  // Attending Doctor Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 7.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Attending Physician: ${record.doctorName}`, 20, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Consultation ID: ${record.id}  |  OPD Slot: General Consultation`, 190, y + 5, { align: 'right' });

  y += 11;

  // Vitals Row (if present)
  if (record.vitals) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 137, 123);
    doc.text('RECORDED CLINICAL VITALS & TRIAGE', 15, y);
    y += 2.5;

    const vitals = [
      { label: 'Blood Pressure', val: `${record.vitals.bloodPressureSys}/${record.vitals.bloodPressureDia} mmHg` },
      { label: 'Heart Rate', val: `${record.vitals.heartRateBpm} bpm` },
      { label: 'Oxygen (SpO2)', val: `${record.vitals.oxygenSaturationSpO2}%` },
      { label: 'Temperature', val: `${record.vitals.temperatureF}°F` },
      { label: 'Resp. Rate', val: `${record.vitals.respiratoryRate}/min` },
      { label: 'Weight / BMI', val: `${record.vitals.weightKg} kg (${record.vitals.bmi || 24.2})` },
    ];

    const boxW = 28;
    const gap = 2.4;
    vitals.forEach((v, idx) => {
      const bx = 15 + idx * (boxW + gap);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(bx, y, boxW, 11, 1, 1, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(v.label.toUpperCase(), bx + boxW / 2, y + 3.8, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(v.val, bx + boxW / 2, y + 8.5, { align: 'center' });
    });

    y += 15;
  }

  // Chief Complaint & Clinical Assessment
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 28, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 137, 123);
  doc.text('CHIEF COMPLAINT & CLINICAL ASSESSMENT (SOAP)', 20, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Chief Complaint:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(record.chiefComplaint, 48, y + 10, { maxWidth: 140 });

  doc.setFont('helvetica', 'bold');
  doc.text('Clinical Findings:', 20, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(record.soapNotes.objective, 48, y + 15, { maxWidth: 140 });

  doc.setFont('helvetica', 'bold');
  doc.text('Assessment / Dx:', 20, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(record.soapNotes.assessment, 48, y + 20, { maxWidth: 140 });

  // ICD 10 codes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const icdStr = record.icd10Diagnosis.map(d => `${d.code} (${d.description})`).join('  •  ');
  doc.text(`ICD-10 Diagnoses: ${icdStr}`, 20, y + 25, { maxWidth: 170 });

  y += 32;

  // Prescriptions Table (Rx)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 137, 123);
  doc.text('PRESCRIBED MEDICATIONS (Rx)', 15, y);
  y += 3;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('#', 18, y + 4.5);
  doc.text('MEDICINE NAME', 26, y + 4.5);
  doc.text('DOSAGE', 82, y + 4.5);
  doc.text('FREQUENCY', 106, y + 4.5);
  doc.text('DURATION', 132, y + 4.5);
  doc.text('INSTRUCTIONS', 154, y + 4.5);
  y += 6.5;

  // Table Rows
  if (record.prescriptions && record.prescriptions.length > 0) {
    record.prescriptions.forEach((rx, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250);
      doc.rect(15, y, 180, 7.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(15, y + 7.5, 195, y + 7.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(String(idx + 1), 18, y + 5);
      doc.text(rx.medicineName, 26, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(rx.dosage, 82, y + 5);
      doc.text(rx.frequency, 106, y + 5);
      doc.text(rx.duration, 132, y + 5);
      doc.setTextColor(71, 85, 105);
      doc.text(rx.instructions, 154, y + 5, { maxWidth: 38 });

      y += 7.5;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No oral pharmaceuticals prescribed during this session.', 20, y + 5);
    y += 8;
  }

  y += 4;

  // Treatment Plan & Follow Up
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 21, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 137, 123);
  doc.text('CARE PLAN, INVESTIGATIONS & FOLLOW-UP', 20, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Advice & Plan: ${record.soapNotes.plan}`, 20, y + 9.5, { maxWidth: 170 });

  if (record.orderedLabTests && record.orderedLabTests.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110);
    doc.text(`Ordered Diagnostics: ${record.orderedLabTests.join(', ')}`, 20, y + 14);
  }

  if (record.followUpDate) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Recommended Follow-Up Date: ${record.followUpDate}`, 20, y + 18.5);
  }

  y += 26;

  // Signature Block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Digitally verified & authenticated by medical officer.', 15, y + 5);
  doc.text(`Consultant Specialist ID: DOC-${record.doctorId}`, 15, y + 9);

  doc.setDrawColor(15, 23, 42);
  doc.line(140, y + 5, 195, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(record.doctorName, 140, y + 9.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Attending Consultant Specialist', 140, y + 13.5);

  drawFooter(doc, 1, 1);

  // Trigger browser download
  const cleanMRN = patient.mrn.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanDate = record.visitDate.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`CarePlus_Medical_Record_${cleanMRN}_${cleanDate}.pdf`);
}

/**
 * Generate and download Complete Patient Medical History Dossier PDF
 */
export function downloadMedicalHistoryPDF(
  patient: SyntheticPatient,
  records: MedicalRecordEntry[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let y = drawHospitalHeader(
    doc,
    'Comprehensive Patient Medical History Dossier',
    `MRN: ${patient.mrn} | Total Recorded Visits: ${records.length}`
  );

  // Patient Dossier Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, 180, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${patient.firstName} ${patient.lastName}`, 20, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`MRN: ${patient.mrn}  |  Age: ${patient.age} Yrs  |  Gender: ${patient.gender}  |  Blood: ${patient.bloodGroup}`, 20, y + 12);
  doc.text(`Primary Contact: ${patient.phone}  |  Email: ${patient.email || 'N/A'}`, 20, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text(`Allergies: ${patient.allergies.join(', ') || 'None Known'}`, 20, y + 21);
  doc.setTextColor(15, 23, 42);
  doc.text(`Chronic Conditions: ${patient.chronicConditions.join(', ') || 'None'}`, 95, y + 21);

  y += 28;

  // History Records
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 137, 123);
  doc.text('CHRONOLOGICAL OUTPATIENT CONSULTATION RECORDS', 15, y);
  y += 4;

  records.forEach((rec, idx) => {
    // Check page break clearance
    if (y > 230) {
      drawFooter(doc, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 36, 1.5, 1.5, 'FD');

    // Record header strip
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Visit #${records.length - idx}: ${rec.chiefComplaint}`, 20, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 137, 123);
    doc.text(`Date: ${rec.visitDate}`, 155, y + 4.8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Doctor: ${rec.doctorName}`, 20, y + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Clinical Assessment: ${rec.soapNotes.assessment}`, 20, y + 16.5, { maxWidth: 170 });
    doc.text(`Plan: ${rec.soapNotes.plan}`, 20, y + 21.5, { maxWidth: 170 });

    if (rec.prescriptions.length > 0) {
      const rxSummary = rec.prescriptions.map(p => `${p.medicineName} (${p.dosage}, ${p.frequency})`).join('; ');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`Rx: ${rxSummary}`, 20, y + 27, { maxWidth: 170 });
    }

    if (rec.followUpDate) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Follow-up Advice: ${rec.followUpDate}`, 20, y + 32);
    }

    y += 40;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  const cleanMRN = patient.mrn.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`CarePlus_Medical_History_${cleanMRN}.pdf`);
}

/**
 * Generate and download an Official Appointment Pass / Token PDF
 */
export function downloadAppointmentPassPDF(
  booking: AppointmentBooking
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let y = drawHospitalHeader(
    doc,
    'Official Outpatient Consultation Pass',
    `Pass Ref: ${booking.referenceCode} | Status: ${booking.status.toUpperCase()}`
  );

  // Large Token & Status Box
  doc.setFillColor(240, 253, 244); // light green
  doc.setDrawColor(134, 239, 172);
  doc.roundedRect(15, y, 180, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('OFFICIAL OPD CONSULTATION TOKEN', 22, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 83, 45);
  doc.text(booking.referenceCode, 22, y + 14.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text(`STATUS: ${booking.status.toUpperCase()}`, 188, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Booked On: ${new Date(booking.bookedAt).toLocaleDateString()}`, 188, y + 14, { align: 'right' });

  y += 26;

  // Grid: Patient Info & Doctor Schedule
  const colW = 88;
  
  // Left Box: Patient Details
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, colW, 40, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT DEMOGRAPHICS', 20, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(booking.patientName, 20, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Age / Gender: ${booking.patientAge} Yrs / ${booking.patientGender}`, 20, y + 17.5);
  doc.text(`Phone: ${booking.patientPhone}`, 20, y + 22.5);
  doc.text(`Email: ${booking.patientEmail || 'N/A'}`, 20, y + 27.5);
  doc.text(`Consultation Mode: ${booking.consultationType}`, 20, y + 32.5);

  // Right Box: Doctor & Schedule
  doc.roundedRect(107, y, colW, 40, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('APPOINTMENT SCHEDULE', 112, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(booking.doctorName, 112, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Specialty: ${booking.departmentName}`, 112, y + 17.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 137, 123);
  doc.text(`Date: ${booking.date}`, 112, y + 23);
  doc.text(`Slot: ${booking.timeSlot}`, 112, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Fee: ₹${booking.fee} (${booking.paymentMode})`, 112, y + 33);

  y += 44;

  // Reported Symptoms & Notes
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 15, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('REPORTED SYMPTOMS / CLINICAL NOTES:', 20, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(booking.symptoms || 'General clinical consultation & routine medical assessment.', 20, y + 10.5, { maxWidth: 170 });

  y += 19;

  // Barcode Verification Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, 180, 15, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('OPD CHECK-IN SCANNER VERIFICATION', 20, y + 5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`*${booking.referenceCode}*`, 20, y + 10.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('||| | |||| | ||||| ||| |||| | |||', 125, y + 10.5);

  y += 20;

  // Patient Instructions Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 32, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 137, 123);
  doc.text('IMPORTANT PATIENT ADVISORY & CHECK-IN PROTOCOLS', 20, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('1. Please report to the CarePlus Outpatient Reception 15 minutes before your slot with this token pass.', 20, y + 11.5);
  doc.text('2. Carry previous discharge summaries, investigation reports, radiology films (X-Ray/MRI), and active medication slips.', 20, y + 16.5);
  doc.text('3. If overnight fasting blood glucose or ultrasound scans are requested, maintain 8-10 hours fasting prior.', 20, y + 21.5);
  doc.text('4. To reschedule or cancel your consultation without penalty, kindly notify via 011-4303 6518 at least 2 hours in advance.', 20, y + 26.5);

  y += 38;

  // Hospital Signoff
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CarePlus Hospital OPD Central Desk • Digitally Issued Token Pass', 15, y + 5);

  doc.setDrawColor(15, 23, 42);
  doc.line(140, y + 5, 195, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized OPD Registration Officer', 140, y + 9);

  drawFooter(doc, 1, 1);

  const cleanRef = booking.referenceCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`CarePlus_Appointment_Pass_${cleanRef}.pdf`);
}

/**
 * Generate and download Patient Bookings History Ledger PDF
 */
export function downloadBookingsHistoryPDF(
  bookings: AppointmentBooking[],
  patientIdentifier?: string
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Brand Header Bar
  doc.setFillColor(0, 137, 123);
  doc.rect(15, 12, pageWidth - 30, 2.5, 'F');

  let y = 20;

  // Hospital Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('CAREPLUS HOSPITAL', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 137, 123);
  doc.text('PATIENT APPOINTMENT & CONSULTATION HISTORY REPORT', 15, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(CLINIC_INFO.address, pageWidth - 15, y - 1, { align: 'right' });
  doc.text(`Helpline: ${CLINIC_INFO.phonePrimary} | Appts: ${CLINIC_INFO.phoneAppointments1}`, pageWidth - 15, y + 4.5, { align: 'right' });

  y += 11;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, y, pageWidth - 15, y);

  y += 5;

  // Stats Strip
  const activeCount = bookings.filter(b => b.status !== 'cancelled').length;
  const totalFees = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.fee || 0), 0);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Records: ${bookings.length} Appointments`, 22, y + 7.5);
  doc.setTextColor(22, 101, 52);
  doc.text(`Active / Confirmed: ${activeCount}`, 95, y + 7.5);
  doc.setTextColor(15, 118, 110);
  doc.text(`Consultation Value: ₹${totalFees.toLocaleString()}`, 165, y + 7.5);

  if (patientIdentifier) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Filter Query: ${patientIdentifier}`, pageWidth - 20, y + 7.5, { align: 'right' });
  }

  y += 16;

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TOKEN REF', 18, y + 4.8);
  doc.text('PATIENT NAME', 48, y + 4.8);
  doc.text('DOCTOR & SPECIALTY', 95, y + 4.8);
  doc.text('SCHEDULED DATE & SLOT', 160, y + 4.8);
  doc.text('MODE', 215, y + 4.8);
  doc.text('FEE', 245, y + 4.8, { align: 'right' });
  doc.text('STATUS', 270, y + 4.8, { align: 'center' });

  y += 7;

  // Table Rows
  bookings.forEach((b, idx) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;

      // Repeat Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y, pageWidth - 30, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('TOKEN REF', 18, y + 4.8);
      doc.text('PATIENT NAME', 48, y + 4.8);
      doc.text('DOCTOR & SPECIALTY', 95, y + 4.8);
      doc.text('SCHEDULED DATE & SLOT', 160, y + 4.8);
      doc.text('MODE', 215, y + 4.8);
      doc.text('FEE', 245, y + 4.8, { align: 'right' });
      doc.text('STATUS', 270, y + 4.8, { align: 'center' });
      y += 7;
    }

    doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250);
    doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 7.5, pageWidth - 15, y + 7.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(b.referenceCode, 18, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(b.patientName, 48, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${b.doctorName} (${b.departmentName})`, 95, y + 5, { maxWidth: 62 });

    doc.text(`${b.date}  •  ${b.timeSlot}`, 160, y + 5);
    doc.text(b.consultationType, 215, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(`₹${b.fee}`, 245, y + 5, { align: 'right' });

    // Status chip
    if (b.status === 'confirmed') {
      doc.setTextColor(22, 101, 52);
    } else if (b.status === 'rescheduled') {
      doc.setTextColor(180, 83, 9);
    } else {
      doc.setTextColor(185, 28, 28);
    }
    doc.text(b.status.toUpperCase(), 270, y + 5, { align: 'center' });

    y += 7.5;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const py = pageHeight - 10;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(15, py, pageWidth - 15, py);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CarePlus Hospital Health Records Registry • Official Consultation History', 15, py + 4.5);
    doc.text(`Printed: ${new Date().toLocaleString()} | Page ${p} of ${totalPages}`, pageWidth - 15, py + 4.5, { align: 'right' });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`CarePlus_Appointments_Ledger_${dateStr}.pdf`);
}
