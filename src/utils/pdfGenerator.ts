import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
  clientName: string;
  clientTel: string;
  clientAddress: string;
  date: string;
  piNo: string;
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
}

export const generateInvoicePDF = async (data: InvoiceData): Promise<void> => {
  try {
    // Load the logo image
    const logoUrl = '/lovable-uploads/e61122c2-7cd9-4946-ba8c-9ea8dc5ff2b6.png';
    
    // Create a temporary HTML structure for better PDF generation
    const invoiceHTML = `
      <div style="font-family: 'Cairo', 'Amiri', Arial, sans-serif; width: 800px; margin: 0 auto; background: white; padding: 15px; color: black;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FFE026, #F5D916); padding: 18px; border-radius: 10px; margin-bottom: 20px; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: right; flex: 1;">
              <h1 style="margin: 0; font-size: 16px; font-weight: bold; color: #1a1a1a; font-family: 'Cairo', sans-serif;">مكتب الحكمة الهندسي</h1>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a; font-family: 'Cairo', sans-serif;">العنوان: ٤١ شارع الماوردي، القصر العيني، القاهرة، مصر</p>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a; font-family: 'Cairo', sans-serif;">تليفون: ٢٠ ١١ ٤٧٣٠٤٨٨٠+ | فاكس: ٢٠٢٧٩٣٢١١٥+</p>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a; font-family: 'Cairo', sans-serif;">البريد الإلكتروني: el_hekma2013@yahoo.com</p>
            </div>
            
            <div style="background: white; width: 90px; height: 90px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid #E5E5E5; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin: 0 15px;">
              <img src="${logoUrl}" alt="EL HEKMA Logo" style="width: 75px; height: 75px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div style="text-align: center; display: none;">
                <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 3px;">EL HEKMA</div>
                <div style="font-size: 10px; color: #666; margin-bottom: 2px;">ENGINEERING</div>
                <div style="font-size: 10px; color: #666;">OFFICE</div>
              </div>
            </div>
            
            <div style="text-align: left; flex: 1;">
              <h1 style="margin: 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">EL HEKMA Engineering Office</h1>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a;">41 Al-Mawardi Street, Al-Qasr Al-Aini,</p>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a;">Cairo, Egypt</p>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a;">Tel: +20 11 47304880 | Fax: +2027932115</p>
              <p style="margin: 4px 0; font-size: 10px; color: #2a2a2a;">Email: el_hekma2013@yahoo.com</p>
            </div>
          </div>
        </div>

        <!-- Invoice Title -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="font-size: 22px; margin: 0; color: #1a1a1a; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${data.invoiceType === 'commercial' ? 'COMMERCIAL INVOICE' : 'PROFORMA INVOICE'}</h2>
          <p style="font-size: 14px; margin: 6px 0; color: #555; font-family: 'Cairo', sans-serif; font-weight: 500;">${data.invoiceType === 'commercial' ? 'فاتورة تجارية' : 'فاتورة مبدئية'}</p>
        </div>

        <!-- Client Information -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 15px; border-radius: 10px; border-left: 4px solid #FFE026;">
          <div>
            <p style="margin: 6px 0; font-size: 12px; font-family: 'Cairo', sans-serif;"><strong style="color: #333;">Client / العميل:</strong> <span style="color: #555;">${data.clientName}</span></p>
            <p style="margin: 6px 0; font-size: 12px; font-family: 'Cairo', sans-serif;"><strong style="color: #333;">Tel / التليفون:</strong> <span style="color: #555;">${data.clientTel}</span></p>
            <p style="margin: 6px 0; font-size: 12px; font-family: 'Cairo', sans-serif;"><strong style="color: #333;">Address / العنوان:</strong> <span style="color: #555;">${data.clientAddress}</span></p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 6px 0; font-size: 12px; font-family: 'Cairo', sans-serif;"><strong style="color: #333;">Date / التاريخ:</strong> <span style="color: #555;">${data.date}</span></p>
            <p style="margin: 6px 0; font-size: 12px; font-family: 'Cairo', sans-serif;"><strong style="color: #333;">PI No. / رقم الفاتورة:</strong> <span style="color: #555;">${data.piNo}</span></p>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;">
          <thead>
            <tr style="background: linear-gradient(135deg, #FFE026, #F5D916);">
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px;">#</th>
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px;">Item Code</th>
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px; font-family: 'Cairo', sans-serif;">Description / الوصف</th>
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px;">Qty</th>
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px;">Unit Price</th>
              <th style="padding: 12px; border: none; text-align: center; color: #1a1a1a; font-weight: bold; font-size: 11px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, index) => `
              <tr style="background: ${index % 2 === 0 ? '#f8f9fa' : 'white'}; border-bottom: 1px solid #e9ecef;">
                <td style="padding: 10px; text-align: center; color: #333; font-weight: 500; font-size: 11px;">${index + 1}</td>
                <td style="padding: 10px; text-align: center; color: #333; font-weight: 500; font-size: 11px;">${item.itemCode}</td>
                <td style="padding: 10px; color: #333; font-family: 'Cairo', sans-serif; font-size: 11px;">${item.description}</td>
                <td style="padding: 10px; text-align: center; color: #333; font-weight: 500; font-size: 11px;">${item.quantity}</td>
                <td style="padding: 10px; text-align: center; color: #333; font-weight: 500; font-size: 11px;">${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 10px; text-align: center; font-weight: bold; color: #1a1a1a; font-size: 11px;">${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 35px;">
          <div style="width: 350px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="padding: 14px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; background: #f8f9fa; font-family: 'Cairo', sans-serif;">
              <span style="font-weight: 600; color: #333;">Grand Total / الإجمالي:</span>
              <span style="font-weight: bold; color: #1a1a1a;">${data.grandTotal.toFixed(2)}</span>
            </div>
            <div style="padding: 14px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; background: white; font-family: 'Cairo', sans-serif;">
              <span style="font-weight: 600; color: #333;">Tax (${data.taxPercent}%) / الضريبة:</span>
              <span style="font-weight: bold; color: #1a1a1a;">${data.taxAmount.toFixed(2)}</span>
            </div>
            <div style="padding: 14px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; background: #f8f9fa; font-family: 'Cairo', sans-serif;">
              <span style="font-weight: 600; color: #333;">Discount (${data.discountPercent}%) / الخصم:</span>
              <span style="font-weight: bold; color: #1a1a1a;">-${data.discountAmount.toFixed(2)}</span>
            </div>
            <div style="padding: 18px; background: linear-gradient(135deg, #FFE026, #F5D916); display: flex; justify-content: space-between;">
              <span style="font-size: 17px; font-weight: bold; color: #1a1a1a; font-family: 'Cairo', sans-serif;">Net Total / صافي الإجمالي:</span>
              <span style="font-size: 17px; font-weight: bold; color: #1a1a1a;">${data.netTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- THE SELLER Section - Compact Design -->
        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 12px; border-radius: 8px; border-left: 3px solid #FFE026; margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px; text-align: center; font-family: 'Cairo', sans-serif;">THE SELLER / البائع</h3>
          
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #333; font-family: 'Cairo', sans-serif; font-size: 12px;">Name / الاسم:</span>
            <span style="margin-left: 8px; color: #555; font-size: 12px;">EL HEKMA Engineering Office</span>
          </div>
          
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #333; font-family: 'Cairo', sans-serif; font-size: 12px;">Signature / التوقيع:</span>
            <div style="border-bottom: 2px solid #333; width: 150px; margin-top: 8px; height: 25px;"></div>
          </div>
          
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #333; font-family: 'Cairo', sans-serif; font-size: 12px;">Date / التاريخ:</span>
            <div style="border-bottom: 2px solid #333; width: 120px; margin-top: 8px; height: 20px;"></div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 25px; border-top: 2px solid #FFE026; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 8px; margin-top: 20px;">
          <p style="margin: 8px 0; font-size: 13px; color: #555;">For more information, visit: <a href="https://heomed.com/" style="color: #FFE026; text-decoration: none; font-weight: 600;">https://heomed.com/</a></p>
          <p style="margin: 8px 0; font-size: 13px; color: #555;">© 2024 EL HEKMA Engineering Office. All rights reserved.</p>
        </div>
      </div>
    `;

    // Create a temporary element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-9999px';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      // Use html2canvas to convert to image, then to PDF
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.firstElementChild?.scrollHeight || 1000
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      const fileName = `Invoice_${data.piNo || Date.now()}_${data.date}.pdf`;
      pdf.save(fileName);
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('فشل في إنشاء ملف PDF');
  }
};

export const generateInvoicePDFFromElement = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('العنصر غير موجود');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw new Error('فشل في إنشاء ملف PDF من العنصر');
  }
};