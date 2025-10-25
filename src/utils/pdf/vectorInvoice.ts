import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export interface VectorInvoiceData {
  clientName: string;
  clientTel: string;
  clientAddress: string;
  clientCountry: string;
  date: string;
  piNo: string;
  currency: string;
  currencySymbol: string;
  invoiceType?: string; // Added to distinguish between invoice types
  items: Array<{
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  grandTotal: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  netTotal: number;
  // Optional additional fields
  paymentTerms?: string;
  priceValidity?: string;
  portOfLoading?: string;
  portOfDestination?: string;
  timeOfShipment?: string;
  bankName?: string;
  accountNo?: string;
  remarks?: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...(sub as unknown as number[]));
  }
  return btoa(binary);
}

async function loadArabicFont(doc: jsPDF) {
  try {
    const fontUrl = '/fonts/NotoNaskhArabic-Regular.ttf';
    const res = await fetch(fontUrl);
    if (!res.ok) throw new Error('Font not found');
    const buffer = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
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
    // Fallback to Arial Unicode MS for Arabic text
    try {
      doc.addFont('/fonts/Arial Unicode MS.ttf', 'Arial Unicode MS', 'normal');
      doc.setFont('Arial Unicode MS', 'normal');
    } catch (e2) {
      // Final fallback - use Helvetica with proper encoding
      doc.setFont('helvetica', 'normal');
    }
  }
  // Ensure proper UTF-8 encoding for Arabic text
  doc.text(text, x, y, { ...options, isSymbol: false });
}

function setEnglishText(doc: jsPDF, text: string, x: number, y: number, options?: any) {
  doc.setFont('helvetica', 'normal');
  doc.text(text, x, y, options);
}

export async function generateInvoicePDFVector(data: VectorInvoiceData) {
  // Create a new isolated PDF document for each invoice
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Deep clone the data to prevent any reference bleeding between invocations
  const invoiceData = JSON.parse(JSON.stringify(data));
  
  // Ensure complete data isolation by creating type-specific data containers
  const isProforma = invoiceData.invoiceType === 'proforma';
  const isCommercial = invoiceData.invoiceType === 'commercial';
  
  // Basic setup - English only
  doc.setLanguage("en");
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // HEADER SECTION - Professional Layout
  // Header border and background
  doc.setFillColor(245, 232, 28); // Yellow background (Hekma brand color)
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(0, 0, pageWidth, 45, 'S'); // Header border

  // Load and add company logo
  try {
    const logoPath = '/lovable-uploads/458f4693-2f94-4db5-8642-91cb8bff5eda.png';
    const logoResponse = await fetch(logoPath);
    const logoBlob = await logoResponse.blob();
    const logoReader = new FileReader();
    
    await new Promise((resolve) => {
      logoReader.onload = function() {
        try {
          doc.addImage(logoReader.result as string, 'PNG', margin + 2, 10, 26, 26);
        } catch (error) {
          console.warn('Failed to add logo to PDF:', error);
        }
        resolve(null);
      };
      logoReader.readAsDataURL(logoBlob);
    });
  } catch (error) {
    console.warn('Failed to load company logo:', error);
    // Fallback - create a placeholder rectangle
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, 8, 30, 30, 'FD');
  }
  
  // Main company name - centered and smaller
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EL HEKMA ENGINEERING OFFICE', pageWidth / 2, 20, { align: 'center' });
  
  // Professional tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Professional Engineering Solutions', pageWidth / 2, 28, { align: 'center' });
  
  // Contact Information
  doc.setFontSize(9);
  doc.text('41 Al-Mawardi Street, Al-Qasr Al-Aini, Cairo, Egypt', pageWidth / 2, 34, { align: 'center' });
  doc.text('Tel: +20 11 47304880 | Fax: +2027932115', pageWidth / 2, 38, { align: 'center' });
  doc.text('Email: el_hekma2013@yahoo.com', pageWidth / 2, 42, { align: 'center' });

  y = 55;

  // INVOICE TYPE SECTION - Clean and professional
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, y, pageWidth - 2 * margin, 18, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, pageWidth - 2 * margin, 18, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  const title = invoiceData.invoiceType === 'commercial' ? 'Quotation invoice' : 'PROFORMA INVOICE';
  doc.text(title, pageWidth / 2, y + 11, { align: 'center' });

  y += 25;

  // CLIENT INFORMATION SECTION - Organized layout
  doc.setFillColor(250, 250, 250);
  const clientSectionHeight = invoiceData.clientCountry ? 35 : 30;
  doc.rect(margin, y, pageWidth - 2 * margin, clientSectionHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, pageWidth - 2 * margin, clientSectionHeight, 'S');
  
  // Section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('CLIENT INFORMATION', margin + 5, y + 7);
  
  // Draw separator line
  doc.setDrawColor(150, 150, 150);
  doc.line(margin + 5, y + 10, pageWidth - margin - 5, y + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Left column - Client details
  const leftCol = margin + 5;
  doc.text('Client:', leftCol, y + 16);
  doc.text(invoiceData.clientName || 'N/A', leftCol + 20, y + 16);
  
  doc.text('Tel:', leftCol, y + 21);
  doc.text(invoiceData.clientTel || 'N/A', leftCol + 20, y + 21);
  
  doc.text('Address:', leftCol, y + 26);
  doc.text(invoiceData.clientAddress || 'N/A', leftCol + 20, y + 26);
  
  if (invoiceData.clientCountry) {
    doc.text('Country:', leftCol, y + 31);
    doc.text(invoiceData.clientCountry, leftCol + 20, y + 31);
  }
  
  // Right column - Invoice details
  const rightCol = pageWidth - margin - 60;
  doc.text('Date:', rightCol, y + 16);
  
  // Automatic date in DD/MM/YYYY format
  const today = new Date();
  const invoice_date = today.toLocaleDateString('en-GB');
  doc.text(invoiceData.date || invoice_date, rightCol + 15, y + 16);
  
  doc.text('Invoice No.:', rightCol, y + 21);
  doc.text(invoiceData.piNo || 'N/A', rightCol + 25, y + 21);
  
  doc.text('Currency:', rightCol, y + 26);
  doc.text(invoiceData.currency || 'USD', rightCol + 20, y + 26);

  y += clientSectionHeight + 8;

  // Items table with yellow header - include all items, ensuring proper encoding and non-empty descriptions
  const tableData = invoiceData.items.length > 0 ? invoiceData.items.map((item, index) => {
    // Calculate total as Quantity * Unit Price for each row
    const calculatedTotal = (item.quantity || 0) * (item.unitPrice || 0);
    // Ensure description is not empty - show 'No description' if empty
    const description = item.description && item.description.trim() !== '' ? item.description : 'No description';
    return [
      (index + 1).toString(),
      item.itemCode || 'N/A',
      description,
      (item.quantity || 0).toString(),
      `${invoiceData.currencySymbol}${(item.unitPrice || 0).toFixed(2)}`,
      `${invoiceData.currencySymbol}${calculatedTotal.toFixed(2)}`
    ];
  }) : [['1', 'N/A', 'No items added', '0', `${invoiceData.currencySymbol}0.00`, `${invoiceData.currencySymbol}0.00`]];

  autoTable(doc, {
    startY: y,
    head: [['#', 'Item Code', 'Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      font: 'helvetica',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [255, 235, 59],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'left', cellWidth: 75 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 }
    },
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
    theme: 'grid'
  });

  // Get position after table
  const finalY = (doc as any).lastAutoTable.finalY + 5;

  // TOTALS SUMMARY SECTION - Professional layout
  let totalsY = finalY + 8;
  const totalsWidth = 85;
  const totalsX = pageWidth - margin - totalsWidth;
  
  // Totals section with border
  doc.setFillColor(245, 245, 245);
  doc.rect(totalsX, totalsY, totalsWidth, 35, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(totalsX, totalsY, totalsWidth, 35, 'S');
  
  // Totals title
  doc.setFont('helvetica', 'bold');  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTALS SUMMARY', totalsX + totalsWidth/2, totalsY + 6, { align: 'center' });
  
  // Individual total lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Subtotal:`, totalsX + 3, totalsY + 12);
  doc.text(`${invoiceData.currencySymbol}${invoiceData.grandTotal.toFixed(2)}`, totalsX + totalsWidth - 3, totalsY + 12, { align: 'right' });
  
  doc.text(`Tax (${invoiceData.taxPercent}%):`, totalsX + 3, totalsY + 17);
  doc.text(`${invoiceData.currencySymbol}${invoiceData.taxAmount.toFixed(2)}`, totalsX + totalsWidth - 3, totalsY + 17, { align: 'right' });
  
  doc.text(`Discount (${invoiceData.discountPercent}%):`, totalsX + 3, totalsY + 22);
  doc.text(`-${invoiceData.currencySymbol}${invoiceData.discountAmount.toFixed(2)}`, totalsX + totalsWidth - 3, totalsY + 22, { align: 'right' });
  
  // Net total with emphasis
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX + 3, totalsY + 25, totalsX + totalsWidth - 3, totalsY + 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`NET TOTAL:`, totalsX + 3, totalsY + 31);
  doc.text(`${invoiceData.currencySymbol}${invoiceData.netTotal.toFixed(2)}`, totalsX + totalsWidth - 3, totalsY + 31, { align: 'right' });

  // SIGNATURE SECTION - Compact and organized seller block
  const signatureY = totalsY + 45;
  const signatureWidth = pageWidth - 2 * margin;
  const signatureHeight = 35; // Increased for better spacing with signature image
  
  // Signature section with clean border
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, signatureY, signatureWidth, signatureHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(margin, signatureY, signatureWidth, signatureHeight, 'S');
  
  // Section title - compact and centered
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('THE SELLER', pageWidth / 2, signatureY + 5, { align: 'center' });
  
  // Horizontal divider line under title
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.2);
  doc.line(margin + 10, signatureY + 7, pageWidth - margin - 10, signatureY + 7);
  
  // Organized seller information in two columns
  const leftColX = margin + 8;
  const rightColX = pageWidth / 2 + 10;
  const fieldStartY = signatureY + 12;
  
  // Left column - Name and Company
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Name:', leftColX, fieldStartY);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.1);
  doc.line(leftColX + 12, fieldStartY + 1, leftColX + 85, fieldStartY + 1);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('EL HEKMA Engineering Office', leftColX + 12, fieldStartY + 6);
  
  // Right column - Signature with image
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Signature:', rightColX, fieldStartY);
  
  // Load and add signature image
  try {
    const signaturePath = '/lovable-uploads/signature-dr-baker.png';
    const signatureResponse = await fetch(signaturePath);
    const signatureBlob = await signatureResponse.blob();
    const signatureReader = new FileReader();
    
    await new Promise((resolve) => {
      signatureReader.onload = function() {
        try {
          // Add signature image next to "Signature:" label - properly sized and positioned
          doc.addImage(signatureReader.result as string, 'PNG', rightColX + 22, fieldStartY - 4, 50, 13);
        } catch (error) {
          console.warn('Failed to add signature to PDF:', error);
        }
        resolve(null);
      };
      signatureReader.readAsDataURL(signatureBlob);
    });
  } catch (error) {
    console.warn('Failed to load signature image:', error);
  }
  
  // Date field below signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Date:', rightColX, fieldStartY + 12);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.1);
  doc.line(rightColX + 12, fieldStartY + 13, rightColX + 70, fieldStartY + 13);

  // FOOTER SECTION - Professional footer layout with yellow bar
  const footerY = signatureY + signatureHeight + 15;
  
  // Check if we need a new page for the footer
  if (footerY > pageHeight - 40) {
    doc.addPage();
    const newFooterY = 30;
    
    // Footer background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, newFooterY - 5, pageWidth, 30, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(0, newFooterY - 5, pageWidth, newFooterY - 5); // Top border
    
    // Footer content
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Thank you for your business!', pageWidth / 2, newFooterY + 3, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('For more information, visit: https://heomed.com/', pageWidth / 2, newFooterY + 10, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text('© 2024 EL HEKMA Engineering Office. All rights reserved.', pageWidth / 2, newFooterY + 18, { align: 'center' });
    
    
    // Yellow bottom bar
    doc.setFillColor(245, 232, 28); // Yellow brand color
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('HEKMA ENGINEERING OFFICE - Professional Solutions', pageWidth / 2, pageHeight - 3, { align: 'center' });
    
  } else {
    // Footer background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(0, footerY - 5, pageWidth, footerY - 5); // Top border
    
    // Footer content
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Thank you for your business!', pageWidth / 2, footerY + 3, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('For more information, visit: https://heomed.com/', pageWidth / 2, footerY + 10, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text('© 2024 EL HEKMA Engineering Office. All rights reserved.', pageWidth / 2, footerY + 18, { align: 'center' });
    
    
    // Yellow bottom bar
    doc.setFillColor(245, 232, 28); // Yellow brand color
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('HEKMA ENGINEERING OFFICE - Professional Solutions', pageWidth / 2, pageHeight - 3, { align: 'center' });
  }

  // Add payment terms section for Proforma invoices only
  if (isProforma && (invoiceData.paymentTerms || invoiceData.bankName || invoiceData.remarks)) {
    // Check if we need a new page for payment terms
    const paymentTermsY = signatureY + signatureHeight + 10;
    
    if (paymentTermsY > pageHeight - 60) {
      doc.addPage();
      const newPaymentTermsY = 30;
      addPaymentTermsSection(doc, invoiceData, margin, newPaymentTermsY, pageWidth);
    } else {
      addPaymentTermsSection(doc, invoiceData, margin, paymentTermsY, pageWidth);
    }
  }

  // Save the PDF with isolated data and type-specific filename
  const typePrefix = isProforma ? 'Proforma' : 'Commercial';
  const fileName = `${typePrefix}_Invoice_${invoiceData.piNo || 'New'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Helper function to add payment terms section
function addPaymentTermsSection(doc: jsPDF, invoiceData: VectorInvoiceData, margin: number, startY: number, pageWidth: number) {
  const paymentTermsHeight = 45;
  
  // Payment terms section background
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, startY, pageWidth - 2 * margin, paymentTermsHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(margin, startY, pageWidth - 2 * margin, paymentTermsHeight, 'S');
  
  // Section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('PAYMENT TERMS & CONDITIONS', pageWidth / 2, startY + 6, { align: 'center' });
  
  // Divider line
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.2);
  doc.line(margin + 10, startY + 9, pageWidth - margin - 10, startY + 9);
  
  // Payment terms content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let contentY = startY + 15;
  
  // Payment terms
  if (invoiceData.paymentTerms) {
    doc.text(`Payment Terms: ${invoiceData.paymentTerms}`, margin + 5, contentY);
    contentY += 4;
  }
  
  // Price validity
  if (invoiceData.priceValidity) {
    doc.text(`Price Validity: ${invoiceData.priceValidity}`, margin + 5, contentY);
    contentY += 4;
  }
  
  // Port information
  if (invoiceData.portOfLoading) {
    doc.text(`Port of Loading: ${invoiceData.portOfLoading}`, margin + 5, contentY);
    contentY += 4;
  }
  
  if (invoiceData.portOfDestination) {
    doc.text(`Port of Destination: ${invoiceData.portOfDestination}`, margin + 5, contentY);
    contentY += 4;
  }
  
  // Time of shipment
  if (invoiceData.timeOfShipment) {
    doc.text(`Time of Shipment: ${invoiceData.timeOfShipment}`, margin + 5, contentY);
    contentY += 4;
  }
  
  // Bank information
  if (invoiceData.bankName || invoiceData.accountNo) {
    doc.setFont('helvetica', 'bold');
    doc.text('Banking Details:', margin + 5, contentY);
    doc.setFont('helvetica', 'normal');
    contentY += 4;
    
    if (invoiceData.bankName) {
      doc.text(`Bank: ${invoiceData.bankName}`, margin + 10, contentY);
      contentY += 3;
    }
    
    if (invoiceData.accountNo) {
      doc.text(`Account No: ${invoiceData.accountNo}`, margin + 10, contentY);
      contentY += 3;
    }
  }
  
  // Remarks
  if (invoiceData.remarks) {
    doc.setFont('helvetica', 'bold');
    doc.text('Remarks:', margin + 5, contentY);
    doc.setFont('helvetica', 'normal');
    contentY += 4;
    
    // Handle long remarks text
    const remarksLines = doc.splitTextToSize(invoiceData.remarks, pageWidth - 2 * margin - 20);
    doc.text(remarksLines, margin + 10, contentY);
  }
}
