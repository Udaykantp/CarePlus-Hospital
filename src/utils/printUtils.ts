/**
 * Print utility functions for patient bookings, appointment passes,
 * and clinical medical records / e-prescriptions.
 */

import { AppointmentBooking } from '../types';
import { BillingInvoice, LabOrder, MedicalRecordEntry, SyntheticPatient, Tenant } from '../types/management';
import { CLINIC_INFO } from '../data/clinicData';

/**
 * Triggers standard browser window print with optional callback or safety checks.
 */
export function triggerPrint(): void {
  try {
    window.print();
  } catch (err) {
    console.error('Error triggering window.print():', err);
  }
}

/**
 * Generates an isolated, printable window/document for an Appointment Confirmation Pass.
 * Features extended upper margin (45mm) for pre-printed letterhead, hospital pads & punch/clip clearance.
 */
export function printAppointmentPassDocument(
  booking: AppointmentBooking,
  clinic = CLINIC_INFO
): void {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    // If popups are blocked in iframe, trigger in-page print
    window.print();
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment Confirmation Pass - ${booking.referenceCode}</title>
      <style>
        @page { 
          size: A4 portrait; 
          margin-top: 45mm; /* Extended upper space for pre-printed hospital letterhead / pad stationary */
          margin-bottom: 14mm; 
          margin-left: 14mm; 
          margin-right: 14mm; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          color: #0f172a; 
          line-height: 1.45; 
          background: #fff; 
          padding: 20px; 
          padding-top: 35mm; /* Reserved top space for clinic pad */
        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00897b; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-title { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
        .logo-subtitle { font-size: 11px; color: #00897b; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
        .clinic-meta { font-size: 11px; color: #475569; margin-top: 6px; line-height: 1.4; max-width: 450px; }
        .token-box { text-align: right; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 10px 16px; min-width: 180px; }
        .token-label { font-size: 10px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; }
        .token-val { font-size: 20px; font-weight: 900; color: #14532d; font-family: monospace; }
        .status-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-top: 4px; background: #dcfce7; color: #15803d; }
        
        .doc-title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; margin-bottom: 14px; text-align: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
        .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #fafafa; }
        .card-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
        .row-label { color: #64748b; }
        .row-val { font-weight: 600; color: #0f172a; text-align: right; }

        .barcode-strip { display: flex; align-items: center; justify-content: space-between; border: 1px dashed #94a3b8; border-radius: 6px; padding: 10px 16px; margin: 16px 0; background: #f8fafc; }
        .barcode-text { font-family: monospace; font-size: 13px; font-weight: bold; }
        .barcode-sim { letter-spacing: 3px; font-size: 18px; font-weight: 900; }

        .instructions { font-size: 11px; color: #334155; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 14px; }
        .instructions h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #00897b; margin-bottom: 6px; }
        .instructions ul { padding-left: 18px; line-height: 1.5; }

        .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
        
        .clearance-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f0fdf4;
          border: 1px dashed #00897b;
          border-radius: 6px;
          font-size: 11px;
          color: #004d40;
          margin-bottom: 14px;
        }

        @media print {
          body { 
            padding-top: 35mm !important; 
          }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="clearance-badge no-print">
        <span>✓ <strong>Extended Upper Space (45mm)</strong> configured for hospital letterhead stationary and doctor pad printing.</span>
      </div>
      <div class="header">
        <div>
          <div class="logo-title">CarePlus <span style="color:#00897b">Hospital</span></div>
          <div class="logo-subtitle">CarePlus Multispeciality Healthcare (Demo)</div>
          <div class="clinic-meta">
            ${clinic.address}<br />
            Emergency 24x7: ${clinic.phonePrimary} | Appointments: ${clinic.phoneAppointments1}<br />
            NABH Accredited Healthcare Provider • Reg No: DL/MC/2026/0942
          </div>
        </div>
        <div class="token-box">
          <div class="token-label">Consultation Token</div>
          <div class="token-val">${booking.referenceCode}</div>
          <span class="status-badge">${booking.status.toUpperCase()}</span>
        </div>
      </div>

      <div class="doc-title">Official Outpatient Consultation Pass</div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Patient Demographics</div>
          <div class="row"><span class="row-label">Full Name:</span><span class="row-val">${booking.patientName}</span></div>
          <div class="row"><span class="row-label">Age / Gender:</span><span class="row-val">${booking.patientAge} Yrs / ${booking.patientGender}</span></div>
          <div class="row"><span class="row-label">Contact Phone:</span><span class="row-val">${booking.patientPhone}</span></div>
          <div class="row"><span class="row-label">Email:</span><span class="row-val">${booking.patientEmail || 'N/A'}</span></div>
          <div class="row"><span class="row-label">Booking Date:</span><span class="row-val">${new Date(booking.bookedAt).toLocaleDateString()}</span></div>
        </div>

        <div class="card">
          <div class="card-title">Consultation Schedule</div>
          <div class="row"><span class="row-label">Consultant:</span><span class="row-val">${booking.doctorName}</span></div>
          <div class="row"><span class="row-label">Specialty:</span><span class="row-val">${booking.departmentName}</span></div>
          <div class="row"><span class="row-label">Scheduled Date:</span><span class="row-val" style="color:#00897b;font-weight:800;">${booking.date}</span></div>
          <div class="row"><span class="row-label">Time Slot:</span><span class="row-val">${booking.timeSlot}</span></div>
          <div class="row"><span class="row-label">Consultation Mode:</span><span class="row-val">${booking.consultationType}</span></div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 14px;">
        <div class="card-title">Billing & Payment Summary</div>
        <div class="row"><span class="row-label">Consultation Fee:</span><span class="row-val" style="font-size:13px;font-weight:800;">₹${booking.fee}</span></div>
        <div class="row"><span class="row-label">Payment Mode:</span><span class="row-val">${booking.paymentMode}</span></div>
        <div class="row"><span class="row-label">Reported Symptoms:</span><span class="row-val" style="max-width:350px;">${booking.symptoms || 'General medical follow-up'}</span></div>
      </div>

      <div class="barcode-strip">
        <div>
          <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;">OPD Check-In Verification Barcode</div>
          <div class="barcode-text">*${booking.referenceCode}*</div>
        </div>
        <div class="barcode-sim">|||| | ||||| || |||| || |||</div>
      </div>

      <div class="instructions">
        <h4>Important Patient Instructions:</h4>
        <ul>
          <li>Please report to the OPD Reception Counter 15 minutes prior to your allocated time slot.</li>
          <li>Carry all previous medical prescriptions, lab reports, discharge summaries, or imaging films (X-Ray/MRI).</li>
          <li>For Fasting blood diagnostics or ultrasound appointments, maintain 8-10 hours overnight fasting.</li>
          <li>If you need to reschedule or cancel, please inform 2 hours in advance via our helpline.</li>
        </ul>
      </div>

      <div class="footer">
        <div>Generated digitally by CarePlus Hospital Information Management System</div>
        <div>Authorized OPD Signatory • Valid for consultation date</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates an isolated, printable window/document for full Bookings History Ledger.
 */
export function printBookingsHistoryDocument(
  bookings: AppointmentBooking[],
  patientIdentifier?: string,
  clinic = CLINIC_INFO
): void {
  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (!printWindow) {
    window.print();
    return;
  }

  const activeCount = bookings.filter(b => b.status !== 'cancelled').length;
  const totalFees = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.fee || 0), 0);

  const rowsHtml = bookings.map((b, i) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-weight:bold;">${b.referenceCode}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;">${b.patientName}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">
        <strong>${b.doctorName}</strong><br />
        <span style="font-size:10px;color:#64748b;">${b.departmentName}</span>
      </td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${b.date}<br /><span style="font-size:10px;color:#64748b;">${b.timeSlot}</span></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-size:11px;">${b.consultationType}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;">₹${b.fee}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">
        <span style="font-size:10px;font-weight:bold;padding:2px 6px;border-radius:4px;text-transform:uppercase;background:${b.status === 'confirmed' ? '#dcfce7;color:#166534' : b.status === 'rescheduled' ? '#fef3c7;color:#92400e' : '#fee2e2;color:#991b1b'};">
          ${b.status}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Patient Appointment History Report</title>
      <style>
        @page { 
          size: A4 landscape; 
          margin-top: 40mm; /* Extended upper space for hospital header / stationary */
          margin-bottom: 12mm; 
          margin-left: 12mm; 
          margin-right: 12mm; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          color: #0f172a; 
          line-height: 1.4; 
          padding: 20px; 
          padding-top: 32mm; /* Upper clearance for hospital pre-printed pad */
        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00897b; padding-bottom: 14px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: 900; }
        .stats-strip { display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; }
        .stat-item { flex: 1; }
        .stat-label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; }
        .stat-val { font-size: 16px; font-weight: 800; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; font-size: 10px; text-transform: uppercase; font-weight: 800; color: #475569; border-bottom: 2px solid #cbd5e1; }
        @media print {
          body { padding-top: 32mm !important; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div style="display:inline-block;padding:5px 10px;background:#f0fdf4;border:1px dashed #00897b;border-radius:6px;font-size:11px;color:#004d40;margin-bottom:12px;" class="no-print">
        ✓ <strong>Extended Upper Space (40mm)</strong> configured for hospital stationary &amp; letterhead.
      </div>
      <div class="header">
        <div>
          <div class="title">CarePlus <span style="color:#00897b">Hospital</span></div>
          <div style="font-size:11px;color:#475569;">${clinic.address} • Phone: ${clinic.phonePrimary}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:14px;font-weight:bold;text-transform:uppercase;color:#00897b;">Patient Appointment Ledger</div>
          <div style="font-size:11px;color:#64748b;">Printed on: ${new Date().toLocaleString()}</div>
          ${patientIdentifier ? `<div style="font-size:11px;font-weight:600;">Filter: ${patientIdentifier}</div>` : ''}
        </div>
      </div>

      <div class="stats-strip">
        <div class="stat-item">
          <div class="stat-label">Total Bookings Recorded</div>
          <div class="stat-val">${bookings.length} Appointments</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Active / Confirmed Visits</div>
          <div class="stat-val" style="color:#166534;">${activeCount} Active</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Consultation Value</div>
          <div class="stat-val" style="color:#00897b;">₹${totalFees.toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Token Ref</th>
            <th>Patient Name</th>
            <th>Doctor & Department</th>
            <th>Date & Slot</th>
            <th>Mode</th>
            <th style="text-align:right;">Fee</th>
            <th style="text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div style="margin-top:24px;border-top:1px solid #cbd5e1;padding-top:10px;font-size:10px;color:#64748b;display:flex;justify-content:space-between;">
        <div>CarePlus Hospital • Health Information Management System</div>
        <div>Page 1 of 1 • System Generated Record</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates an isolated, printable window/document for a Patient EMR Medical Record / Outpatient Slip.
 */
export function printMedicalRecordDocument(
  record: MedicalRecordEntry,
  patient: SyntheticPatient,
  clinic = CLINIC_INFO
): void {
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    window.print();
    return;
  }

  const rxRows = record.prescriptions.map((rx, idx) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;">
        <strong style="color:#0f172a;">${rx.medicineName}</strong>
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-weight:600;">${rx.dosage}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;">${rx.frequency}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;">${rx.duration}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#475569;">${rx.instructions}</td>
    </tr>
  `).join('');

  const icdChips = record.icd10Diagnosis.map(icd => `
    <span style="display:inline-block;padding:2px 6px;margin:2px;border:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;border-radius:4px;">
      <strong>${icd.code}</strong>: ${icd.description}
    </span>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Medical Outpatient Case Sheet & Rx - ${patient.mrn}</title>
      <style>
        @page { 
          size: A4 portrait; 
          margin-top: 45mm; /* Extended top space for doctor's pre-printed letterhead and prescription pad */
          margin-bottom: 14mm; 
          margin-left: 14mm; 
          margin-right: 14mm; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          color: #0f172a; 
          line-height: 1.45; 
          padding: 16px; 
          padding-top: 36mm; /* Upper clearance for clinic pad */
          font-size: 12px; 
        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00897b; padding-bottom: 12px; margin-bottom: 14px; }
        .logo-title { font-size: 20px; font-weight: 900; }
        .banner { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #166534; display: flex; justify-content: space-between; margin-bottom: 14px; }
        
        .patient-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; background: #fafafa; margin-bottom: 14px; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; }
        .vitals-bar { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; background: #f8fafc; margin-bottom: 14px; text-align: center; }
        .vital-box .label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .vital-box .val { font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 1px; }

        .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #00897b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 6px; }
        .soap-box { margin-bottom: 12px; padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
        
        table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-top: 6px; margin-bottom: 12px; }
        th { background: #f1f5f9; text-align: left; padding: 6px 8px; font-size: 10px; text-transform: uppercase; font-weight: 800; color: #475569; border-bottom: 2px solid #cbd5e1; }
        
        .sig-block { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 14px; border-top: 1px solid #cbd5e1; }

        @media print {
          body { padding-top: 36mm !important; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#f0fdf4;border:1px dashed #00897b;border-radius:6px;font-size:11px;color:#004d40;margin-bottom:12px;" class="no-print">
        <span>✓ <strong>Extended Upper Clearance (45mm)</strong> formatted for medical prescription pads &amp; hospital letterhead printing.</span>
      </div>
      <div class="header">
        <div>
          <div class="logo-title">CarePlus <span style="color:#00897b">Hospital</span></div>
          <div style="font-size:11px;color:#00897b;font-weight:700;">Department of Outpatient Clinical Medicine & Specialized Care</div>
          <div style="font-size:10.5px;color:#475569;margin-top:2px;">
            ${clinic.address} • Helpline: ${clinic.phonePrimary}<br />
            NABH Accredited Comprehensive Care Centre
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:bold;color:#0f172a;">OPD CASE RECORD & Rx</div>
          <div style="font-size:11px;font-family:monospace;font-weight:bold;color:#00897b;">MRN: ${patient.mrn}</div>
          <div style="font-size:10px;color:#64748b;">Visit Date: ${record.visitDate}</div>
        </div>
      </div>

      <div class="banner">
        <span>Attending Physician: <strong>${record.doctorName}</strong></span>
        <span>Record ID: <strong>${record.id}</strong></span>
      </div>

      <div class="patient-card">
        <div>
          <span style="color:#64748b;font-size:10px;text-transform:uppercase;font-weight:bold;display:block;">Patient Details</span>
          <strong style="font-size:13px;">${patient.firstName} ${patient.lastName}</strong>
          <div style="color:#475569;font-size:11px;">Age: ${patient.age} Yrs • Gender: ${patient.gender} • Blood Group: <strong>${patient.bloodGroup}</strong></div>
          <div style="color:#475569;font-size:11px;">Phone: ${patient.phone}</div>
        </div>
        <div>
          <span style="color:#64748b;font-size:10px;text-transform:uppercase;font-weight:bold;display:block;">Known Allergies</span>
          <span style="color:#b91c1c;font-weight:bold;font-size:11px;">${patient.allergies.join(', ') || 'None Known'}</span>
        </div>
        <div>
          <span style="color:#64748b;font-size:10px;text-transform:uppercase;font-weight:bold;display:block;">Chronic History</span>
          <span style="color:#334155;font-size:11px;">${patient.chronicConditions.join(', ') || 'None'}</span>
        </div>
      </div>

      ${record.vitals ? `
        <div class="vitals-bar">
          <div class="vital-box">
            <div class="label">Blood Pressure</div>
            <div class="val">${record.vitals.bloodPressureSys}/${record.vitals.bloodPressureDia} mmHg</div>
          </div>
          <div class="vital-box">
            <div class="label">Heart Rate</div>
            <div class="val">${record.vitals.heartRateBpm} bpm</div>
          </div>
          <div class="vital-box">
            <div class="label">SpO2</div>
            <div class="val">${record.vitals.oxygenSaturationSpO2}%</div>
          </div>
          <div class="vital-box">
            <div class="label">Temperature</div>
            <div class="val">${record.vitals.temperatureF}°F</div>
          </div>
          <div class="vital-box">
            <div class="label">Resp Rate</div>
            <div class="val">${record.vitals.respiratoryRate}/min</div>
          </div>
          <div class="vital-box">
            <div class="label">Weight / BMI</div>
            <div class="val">${record.vitals.weightKg} kg (${record.vitals.bmi || 24.2})</div>
          </div>
        </div>
      ` : ''}

      <div class="soap-box">
        <div class="section-title">Chief Complaint & Clinical Assessment</div>
        <p style="margin-bottom:6px;"><strong>Chief Complaint:</strong> ${record.chiefComplaint}</p>
        <p style="margin-bottom:6px;color:#334155;"><strong>Clinical Examination (Objective):</strong> ${record.soapNotes.objective}</p>
        <p style="margin-bottom:6px;color:#334155;"><strong>Assessment & Diagnosis:</strong> ${record.soapNotes.assessment}</p>
        <div style="margin-top:6px;">
          <span style="font-weight:bold;font-size:10.5px;color:#475569;">ICD-10 Clinical Codes:</span>
          ${icdChips}
        </div>
      </div>

      <div class="soap-box">
        <div class="section-title">Prescribed Medications (Rx)</div>
        <table>
          <thead>
            <tr>
              <th style="width:30px;text-align:center;">#</th>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Special Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${rxRows}
          </tbody>
        </table>
      </div>

      <div class="soap-box">
        <div class="section-title">Treatment Plan & Follow-Up Advice</div>
        <p style="color:#334155;margin-bottom:4px;">${record.soapNotes.plan}</p>
        ${record.orderedLabTests && record.orderedLabTests.length > 0 ? `
          <p style="color:#00897b;font-weight:bold;margin-top:4px;">
            Recommended Investigations: ${record.orderedLabTests.join(', ')}
          </p>
        ` : ''}
        ${record.followUpDate ? `
          <p style="margin-top:4px;font-weight:bold;color:#1e293b;">
            Recommended Next Follow-Up: ${record.followUpDate}
          </p>
        ` : ''}
      </div>

      <div class="sig-block">
        <div style="font-size:10px;color:#64748b;">
          Valid with registered practitioner electronic authentication.<br />
          Generated via CarePlus Hospital EHR Portal • Reg ID: #DEL-DOC-${record.doctorId}
        </div>
        <div style="text-align:center;min-width:200px;">
          <div style="font-size:14px;font-family:'Courier New', monospace;font-weight:bold;color:#00897b;">Dr. Authorized Signatory</div>
          <div style="border-top:1px solid #0f172a;margin-top:4px;padding-top:2px;font-size:11px;font-weight:bold;">
            ${record.doctorName}
          </div>
          <div style="font-size:10px;color:#64748b;">Consultant Treating Specialist</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates an isolated, printable window/document for a Patient's Complete Medical Record History.
 */
export function printMedicalHistoryDocument(
  patient: SyntheticPatient,
  records: MedicalRecordEntry[],
  clinic = CLINIC_INFO
): void {
  const printWindow = window.open('', '_blank', 'width=900,height=950');
  if (!printWindow) {
    window.print();
    return;
  }

  const recordsHtml = records.map((rec, i) => `
    <div style="border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin-bottom:14px;background:#fafafa;">
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">
        <div>
          <strong style="font-size:13px;color:#0f172a;">Visit #${records.length - i}: ${rec.chiefComplaint}</strong>
          <div style="font-size:11px;color:#64748b;">Doctor: <strong>${rec.doctorName}</strong></div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px;font-weight:bold;color:#00897b;">Date: ${rec.visitDate}</span>
          <div style="font-size:10px;color:#64748b;">ID: ${rec.id}</div>
        </div>
      </div>

      <div style="font-size:11.5px;line-height:1.5;margin-bottom:8px;">
        <p><strong>Clinical Assessment:</strong> ${rec.soapNotes.assessment}</p>
        <p><strong>Treatment & Plan:</strong> ${rec.soapNotes.plan}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:8px;">
        <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;margin-bottom:4px;">Prescriptions Dispensed:</div>
        <ul style="padding-left:18px;font-size:11px;">
          ${rec.prescriptions.map(p => `
            <li><strong>${p.medicineName}</strong> (${p.dosage}) - ${p.frequency}, ${p.duration}</li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Complete Clinical Health History - ${patient.firstName} ${patient.lastName}</title>
      <style>
        @page { 
          size: A4 portrait; 
          margin-top: 42mm; /* Extended upper space for hospital stationery */
          margin-bottom: 14mm; 
          margin-left: 14mm; 
          margin-right: 14mm; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          color: #0f172a; 
          line-height: 1.45; 
          padding: 20px; 
          padding-top: 34mm; /* Top padding clearance */
          font-size: 12px; 
        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00897b; padding-bottom: 12px; margin-bottom: 16px; }
        @media print {
          body { padding-top: 34mm !important; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div style="display:inline-block;padding:5px 10px;background:#f0fdf4;border:1px dashed #00897b;border-radius:6px;font-size:11px;color:#004d40;margin-bottom:12px;" class="no-print">
        ✓ <strong>Extended Upper Space (42mm)</strong> configured for hospital stationery &amp; medical folders.
      </div>
      <div class="header">
        <div>
          <div style="font-size:20px;font-weight:900;">CarePlus <span style="color:#00897b">Hospital</span></div>
          <div style="font-size:11px;color:#475569;">${clinic.address} • Phone: ${clinic.phonePrimary}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:bold;text-transform:uppercase;color:#00897b;">Consolidated Health Record History</div>
          <div style="font-size:11px;font-family:monospace;font-weight:bold;">MRN: ${patient.mrn}</div>
          <div style="font-size:10px;color:#64748b;">Printed on: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div style="border:1px solid #cbd5e1;border-radius:8px;padding:12px;background:#f8fafc;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;">Patient Information</div>
          <strong style="font-size:13px;">${patient.firstName} ${patient.lastName}</strong>
          <div style="font-size:11px;color:#475569;">${patient.age} Yrs / ${patient.gender} • Blood Group: <strong>${patient.bloodGroup}</strong></div>
          <div style="font-size:11px;color:#475569;">Phone: ${patient.phone}</div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;">Allergies & Sensitivities</div>
          <div style="font-size:11px;font-weight:bold;color:#b91c1c;">${patient.allergies.join(', ') || 'None Known'}</div>
          <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;margin-top:6px;">Insurance TPA</div>
          <div style="font-size:11px;color:#334155;">${patient.insuranceProvider || 'Direct Patient Pay'}</div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;">Chronic Conditions</div>
          <div style="font-size:11px;color:#334155;">${patient.chronicConditions.join(', ') || 'None Reported'}</div>
          <div style="font-size:10px;text-transform:uppercase;font-weight:bold;color:#64748b;margin-top:6px;">Total Visits Recorded</div>
          <div style="font-size:13px;font-weight:bold;color:#00897b;">${records.length} Clinical Visits</div>
        </div>
      </div>

      <div style="font-size:12px;font-weight:bold;text-transform:uppercase;color:#334155;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">
        Consultation & Treatment Encounters Log
      </div>

      ${recordsHtml.length > 0 ? recordsHtml : '<p style="padding:20px;text-align:center;color:#64748b;">No clinical history records on file.</p>'}

      <div style="margin-top:24px;border-top:1px solid #cbd5e1;padding-top:10px;font-size:10px;color:#64748b;display:flex;justify-content:space-between;">
        <div>CarePlus Hospital EHR Records Department • Official Patient Copy</div>
        <div>Page 1 of 1</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
