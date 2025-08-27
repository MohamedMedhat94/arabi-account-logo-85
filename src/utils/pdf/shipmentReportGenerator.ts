import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ShipmentReportData {
  // Company Information
  generatorCompany: {
    name: string;
    address: string;
    licenseId: string;
    taxId?: string;
  };
  transporterCompany: {
    name: string;
    address: string;
    licenseId: string;
  };
  recyclerCompany: {
    name: string;
    address: string;
    licenseId: string;
  };
  
  // Shipment Details
  shipmentDetails: {
    shipmentId: string;
    driver: string;
    wasteDescription: string;
    quantity: number;
    quantityUnit: string;
    status: string;
    packaging: string;
    disposalMethod: string;
    entryTime: string;
    exitTime: string;
    date: string;
  };
  
  // Tracking Status
  trackingStatus: {
    current: string;
    steps: Array<{
      step: string;
      completed: boolean;
      timestamp?: string;
    }>;
  };
}

async function loadArabicFont(doc: jsPDF) {
  try {
    const fontUrl = '/fonts/NotoNaskhArabic-Regular.ttf';
    const res = await fetch(fontUrl);
    if (!res.ok) throw new Error('Font not found');
    const buffer = await res.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    doc.addFileToVFS('NotoNaskhArabic-Regular.ttf', base64);
    doc.addFont('NotoNaskhArabic-Regular.ttf', 'NotoNaskhArabic', 'normal');
    return true;
  } catch (e) {
    console.warn('Arabic font failed to load:', e);
    return false;
  }
}

function setArabicText(doc: jsPDF, text: string, x: number, y: number, options?: any) {
  try {
    doc.setFont('NotoNaskhArabic', 'normal');
  } catch (e) {
    doc.setFont('helvetica', 'normal');
  }
  doc.text(text, x, y, { ...options, isSymbol: false });
}

export async function generateShipmentReportPDF(data: ShipmentReportData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Load Arabic font
  const arabicFontLoaded = await loadArabicFont(doc);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Header with company logo and title
  doc.setFillColor(255, 235, 59); // Yellow background
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company logo placeholder (centered)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(pageWidth/2 - 20, 8, 40, 30, 'D');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('COMPANY LOGO', pageWidth/2, 25, { align: 'center' });

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('SHIPMENT TRACKING REPORT', pageWidth / 2, 15, { align: 'center' });
  
  // Arabic title
  doc.setFontSize(14);
  if (arabicFontLoaded) {
    setArabicText(doc, 'تقرير تتبع الشحنة', pageWidth / 2, 35, { align: 'center' });
  }

  y = 55;

  // 1. Company Information Section
  doc.setFillColor(255, 235, 59);
  doc.rect(margin - 5, y - 3, pageWidth - 2 * (margin - 5), 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('COMPANY INFORMATION', pageWidth / 2, y + 4, { align: 'center' });

  y += 15;

  // Generator Company
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Generator Company:', margin, y);
  y += 5;
  
  const generatorData = [
    ['Company Name', data.generatorCompany.name],
    ['Address', data.generatorCompany.address],
    ['License ID', data.generatorCompany.licenseId],
    ...(data.generatorCompany.taxId ? [['Tax ID', data.generatorCompany.taxId]] : [])
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: generatorData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      font: 'helvetica'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 40, fontStyle: 'bold' },
      1: { halign: 'left', cellWidth: 140 }
    },
    theme: 'plain'
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Transporter Company
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Transporter Company:', margin, y);
  y += 5;
  
  const transporterData = [
    ['Company Name', data.transporterCompany.name],
    ['Address', data.transporterCompany.address],
    ['License ID', data.transporterCompany.licenseId]
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: transporterData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      font: 'helvetica'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 40, fontStyle: 'bold' },
      1: { halign: 'left', cellWidth: 140 }
    },
    theme: 'plain'
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Recycler Company
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Recycler Company:', margin, y);
  y += 5;
  
  const recyclerData = [
    ['Company Name', data.recyclerCompany.name],
    ['Address', data.recyclerCompany.address],
    ['License ID', data.recyclerCompany.licenseId]
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: recyclerData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      font: 'helvetica'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 40, fontStyle: 'bold' },
      1: { halign: 'left', cellWidth: 140 }
    },
    theme: 'plain'
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // 2. Shipment Details Section
  doc.setFillColor(255, 235, 59);
  doc.rect(margin - 5, y - 3, pageWidth - 2 * (margin - 5), 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('SHIPMENT DETAILS', pageWidth / 2, y + 4, { align: 'center' });

  y += 15;

  const shipmentData = [
    ['Shipment ID', data.shipmentDetails.shipmentId],
    ['Date', data.shipmentDetails.date],
    ['Driver', data.shipmentDetails.driver],
    ['Waste Description', data.shipmentDetails.wasteDescription],
    ['Quantity', `${data.shipmentDetails.quantity} ${data.shipmentDetails.quantityUnit}`],
    ['Status', data.shipmentDetails.status],
    ['Packaging', data.shipmentDetails.packaging],
    ['Disposal Method', data.shipmentDetails.disposalMethod],
    ['Entry Time', data.shipmentDetails.entryTime],
    ['Exit Time', data.shipmentDetails.exitTime]
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: shipmentData,
    styles: {
      fontSize: 11,
      cellPadding: 4,
      font: 'helvetica',
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 50, fontStyle: 'bold', fillColor: [248, 249, 250] },
      1: { halign: 'left', cellWidth: 120 }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // 3. Shipment Tracking Status Section
  doc.setFillColor(255, 235, 59);
  doc.rect(margin - 5, y - 3, pageWidth - 2 * (margin - 5), 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('SHIPMENT TRACKING STATUS', pageWidth / 2, y + 4, { align: 'center' });

  y += 15;

  // Current status highlight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Current Status: ${data.trackingStatus.current}`, margin, y);
  y += 10;

  // Status steps table
  const statusData = data.trackingStatus.steps.map(step => [
    step.step,
    step.completed ? '✓ Completed' : '⏳ Pending',
    step.timestamp || '-'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Status Step', 'Status', 'Timestamp']],
    body: statusData,
    styles: {
      fontSize: 10,
      cellPadding: 4,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [255, 235, 59],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 60 },
      1: { halign: 'center', cellWidth: 40 },
      2: { halign: 'center', cellWidth: 60 }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 1) {
        if (data.cell.text[0].includes('✓')) {
          data.cell.styles.fillColor = [200, 255, 200]; // Light green
          data.cell.styles.textColor = [0, 100, 0]; // Dark green
        } else {
          data.cell.styles.fillColor = [255, 245, 200]; // Light yellow
          data.cell.styles.textColor = [150, 100, 0]; // Dark yellow
        }
      }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 20;

  // Check if we need a new page
  if (y > pageHeight - 80) {
    doc.addPage();
    y = 30;
  }

  // 4. Official Signature Section
  doc.setFillColor(255, 235, 59);
  doc.rect(margin - 5, y - 3, pageWidth - 2 * (margin - 5), 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('OFFICIAL VERIFICATION', pageWidth / 2, y + 4, { align: 'center' });

  y += 20;

  // Signature sections
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Generator signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Generator Representative:', margin, y);
  doc.text('Name: _________________________', margin, y + 8);
  doc.text('Signature: _____________________', margin, y + 16);
  doc.text('Date: _________________________', margin, y + 24);
  doc.text('Official Stamp:', margin, y + 32);
  doc.rect(margin, y + 35, 40, 25, 'D'); // Stamp box

  // Transporter signature
  doc.text('Transporter Representative:', margin + signatureWidth + 20, y);
  doc.text('Name: _________________________', margin + signatureWidth + 20, y + 8);
  doc.text('Signature: _____________________', margin + signatureWidth + 20, y + 16);
  doc.text('Date: _________________________', margin + signatureWidth + 20, y + 24);
  doc.text('Official Stamp:', margin + signatureWidth + 20, y + 32);
  doc.rect(margin + signatureWidth + 20, y + 35, 40, 25, 'D'); // Stamp box

  y += 70;

  // Footer
  const footerY = Math.max(y, pageHeight - 30);
  doc.setFillColor(255, 235, 59);
  doc.rect(0, footerY - 5, pageWidth, 25, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Generated by EL HEKMA Engineering Office', pageWidth / 2, footerY + 5, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Report generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 12, { align: 'center' });

  // Save the PDF
  const fileName = `Shipment_Report_${data.shipmentDetails.shipmentId}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
}

// Sample data for testing
export const sampleShipmentData: ShipmentReportData = {
  generatorCompany: {
    name: "Eco Waste Solutions",
    address: "123 Green Street, Cairo, Egypt",
    licenseId: "TX-394820",
    taxId: "TX-394820-2024"
  },
  transporterCompany: {
    name: "Safe Transport Co.",
    address: "456 Transport Ave, Cairo, Egypt",
    licenseId: "TR-582947"
  },
  recyclerCompany: {
    name: "Green Recycling Ltd.",
    address: "789 Recycle Blvd, Cairo, Egypt",
    licenseId: "RC-738291"
  },
  shipmentDetails: {
    shipmentId: "SH-2024-001",
    driver: "Ahmed Ali",
    wasteDescription: "Plastic bottles and containers",
    quantity: 580,
    quantityUnit: "KG",
    status: "Solid",
    packaging: "Bags",
    disposalMethod: "Recycling",
    entryTime: "09:00 AM",
    exitTime: "12:00 PM",
    date: new Date().toLocaleDateString()
  },
  trackingStatus: {
    current: "In Transit",
    steps: [
      { step: "Pending", completed: true, timestamp: "2024-01-15 08:00" },
      { step: "Registered", completed: true, timestamp: "2024-01-15 08:30" },
      { step: "In Transit", completed: true, timestamp: "2024-01-15 09:00" },
      { step: "In Delivery", completed: false },
      { step: "Sorting", completed: false },
      { step: "Recycling", completed: false },
      { step: "Completed", completed: false }
    ]
  }
};