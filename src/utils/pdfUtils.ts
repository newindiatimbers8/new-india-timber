import { ProjectDetails } from "./aiUtils";

interface QuoteDetails {
  projectDetails: ProjectDetails;
  insights: string;
  quoteDate: string;
  quoteNumber: string;
}

export async function generatePDF(quoteDetails: QuoteDetails): Promise<void> {
  // Dynamically import jspdf and jspdf-autotable to keep bundle size smaller
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  
  try {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFillColor(76, 97, 76); // Forest green color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('South Indian Timbers', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('No. 134/20, 5th Main, HSR Layout Sector 7, Bangalore - 560068', 105, 30, { align: 'center' });
    
    // Quote details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Project Estimate', 14, 50);
    
    doc.setFontSize(10);
    doc.text(`Quote #: ${quoteDetails.quoteNumber}`, 14, 60);
    doc.text(`Date: ${quoteDetails.quoteDate}`, 14, 65);
    
    // Project details section
    doc.setFontSize(12);
    doc.text('Project Details', 14, 75);
    
    const projectData = [
      ['Project Type', quoteDetails.projectDetails.projectType],
      ['Area Size', `${quoteDetails.projectDetails.areaSize} sq. ft.`],
      ['Number of Doors', quoteDetails.projectDetails.numDoors.toString()],
      ['Number of Windows', quoteDetails.projectDetails.numWindows.toString()],
      ['Selected Materials', quoteDetails.projectDetails.selectedMaterials.join(', ')],
    ];
    
    autoTable(doc, {
      startY: 80,
      head: [['Item', 'Details']],
      body: projectData,
      theme: 'striped',
      headStyles: { fillColor: [114, 97, 76], textColor: 255 },
      styles: { cellPadding: 3 }
    });
    
    // Price section
    const priceY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Estimated Price:', 14, priceY);
    doc.text(`₹${quoteDetails.projectDetails.estimatedPrice.toLocaleString('en-IN')}`, 80, priceY);
    doc.setFont('helvetica', 'normal');
    
    // AI Insights section
    const insightsY = priceY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Expert Insights:', 14, insightsY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const insightParagraphs = quoteDetails.insights.split('\n').filter(p => p.trim() !== '');
    let currentY = insightsY + 8;
    
    insightParagraphs.forEach(paragraph => {
      const textLines = doc.splitTextToSize(paragraph, 180);
      textLines.forEach(line => {
        doc.text(line, 14, currentY);
        currentY += 5;
      });
      currentY += 2;
    });
    
    // Footer
    const footerY = 270;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is only an estimate. For a detailed quote, please contact our team.', 105, footerY, { align: 'center' });
    doc.text('South Indian Timbers | Phone: +91-9876543210 | Email: info@southindiantimbers.com', 105, footerY + 5, { align: 'center' });
    
    // Save PDF
    doc.save(`SIT_Estimate_${quoteDetails.quoteNumber}.pdf`);
    
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

export function generateQuoteNumber(): string {
  const prefix = "SIT-";
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}${timestamp}-${random}`;
}
