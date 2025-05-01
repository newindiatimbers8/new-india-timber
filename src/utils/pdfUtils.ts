
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
    doc.text('Detailed Project Estimate', 14, 50);
    
    doc.setFontSize(10);
    doc.text(`Quote #: ${quoteDetails.quoteNumber}`, 14, 60);
    doc.text(`Date: ${quoteDetails.quoteDate}`, 14, 65);
    
    // Project basic details section
    doc.setFontSize(12);
    doc.text('Project Overview', 14, 75);
    
    const basicProjectData = [
      ['Project Type', `${quoteDetails.projectDetails.projectType}${quoteDetails.projectDetails.projectSubType ? ' - ' + quoteDetails.projectDetails.projectSubType : ''}`],
      ['Area Size', `${quoteDetails.projectDetails.areaSize} sq. ft.`],
      ['Number of Doors', quoteDetails.projectDetails.numDoors.toString()],
      ['Number of Windows', quoteDetails.projectDetails.numWindows.toString()],
      ['Selected Materials', quoteDetails.projectDetails.selectedMaterials.join(', ')]
    ];
    
    autoTable(doc, {
      startY: 80,
      head: [['Item', 'Details']],
      body: basicProjectData,
      theme: 'striped',
      headStyles: { fillColor: [114, 97, 76], textColor: 255 },
      styles: { cellPadding: 3 }
    });
    
    let currentY = (doc as any).lastAutoTable.finalY + 10;
    
    // Add more detailed specifications
    if (quoteDetails.projectDetails.doorDetails && quoteDetails.projectDetails.numDoors > 0) {
      doc.setFontSize(12);
      doc.text('Door Specifications', 14, currentY);
      currentY += 5;
      
      const doorData = [
        ['Types', quoteDetails.projectDetails.doorDetails.types.length > 0 ? 
          quoteDetails.projectDetails.doorDetails.types.join(', ') : 'Standard'],
        ['Dimensions', `${quoteDetails.projectDetails.doorDetails.sizes.width}' × ${quoteDetails.projectDetails.doorDetails.sizes.height}'`],
        ['Finishes', quoteDetails.projectDetails.doorDetails.finishes.length > 0 ? 
          quoteDetails.projectDetails.doorDetails.finishes.join(', ') : 'Standard']
      ];
      
      autoTable(doc, {
        startY: currentY,
        body: doorData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }
    
    if (quoteDetails.projectDetails.windowDetails && quoteDetails.projectDetails.numWindows > 0) {
      doc.setFontSize(12);
      doc.text('Window Specifications', 14, currentY);
      currentY += 5;
      
      const windowData = [
        ['Types', quoteDetails.projectDetails.windowDetails.types.length > 0 ? 
          quoteDetails.projectDetails.windowDetails.types.join(', ') : 'Standard'],
        ['Dimensions', `${quoteDetails.projectDetails.windowDetails.sizes.width}' × ${quoteDetails.projectDetails.windowDetails.sizes.height}'`]
      ];
      
      autoTable(doc, {
        startY: currentY,
        body: windowData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }
    
    if (quoteDetails.projectDetails.additionalWoodwork && 
        quoteDetails.projectDetails.additionalWoodwork.types.length > 0) {
      doc.setFontSize(12);
      doc.text('Additional Woodwork', 14, currentY);
      currentY += 5;
      
      const additionalWoodworkData = [
        ['Types', quoteDetails.projectDetails.additionalWoodwork.types.join(', ')],
        ['Details', quoteDetails.projectDetails.additionalWoodwork.details || 'None provided']
      ];
      
      autoTable(doc, {
        startY: currentY,
        body: additionalWoodworkData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }
    
    if (quoteDetails.projectDetails.designPreferences) {
      doc.setFontSize(12);
      doc.text('Design & Finish', 14, currentY);
      currentY += 5;
      
      const designData = [
        ['Style', quoteDetails.projectDetails.designPreferences.style || 'Not specified'],
        ['Finishes', quoteDetails.projectDetails.designPreferences.finishes.length > 0 ? 
          quoteDetails.projectDetails.designPreferences.finishes.join(', ') : 'Standard']
      ];
      
      autoTable(doc, {
        startY: currentY,
        body: designData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }
    
    if (quoteDetails.projectDetails.environmentalFactors) {
      doc.setFontSize(12);
      doc.text('Environmental Considerations', 14, currentY);
      currentY += 5;
      
      const envData = [
        ['Climate Zone', quoteDetails.projectDetails.environmentalFactors.climateZone || 'Not specified'],
        ['Sustainability Importance', `${quoteDetails.projectDetails.environmentalFactors.sustainabilityPreference}/5`],
        ['Special Treatments', [
          quoteDetails.projectDetails.environmentalFactors.termiteProtection ? 'Termite Protection' : '',
          quoteDetails.projectDetails.environmentalFactors.moistureResistance ? 'Moisture Resistance' : ''
        ].filter(Boolean).join(', ') || 'None']
      ];
      
      autoTable(doc, {
        startY: currentY,
        body: envData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }
    
    // Price section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Estimated Price:', 14, currentY);
    doc.text(`₹${quoteDetails.projectDetails.estimatedPrice.toLocaleString('en-IN')}`, 80, currentY);
    doc.setFont('helvetica', 'normal');
    
    // AI Insights section
    currentY += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Expert Insights:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const insightParagraphs = quoteDetails.insights.split('\n').filter(p => p.trim() !== '');
    currentY += 8;
    
    insightParagraphs.forEach(paragraph => {
      const textLines = doc.splitTextToSize(paragraph, 180);
      textLines.forEach(line => {
        doc.text(line, 14, currentY);
        currentY += 5;
      });
      currentY += 2;
    });
    
    // Add a new page if we've gone too far down
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add notes if additional info was provided
    if (quoteDetails.projectDetails.additionalInfo && 
        (quoteDetails.projectDetails.additionalInfo.projectPurpose || 
         quoteDetails.projectDetails.additionalInfo.timeline)) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Project Notes:', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      currentY += 8;
      
      if (quoteDetails.projectDetails.additionalInfo.projectPurpose) {
        doc.text(`• Purpose: ${quoteDetails.projectDetails.additionalInfo.projectPurpose}`, 14, currentY);
        currentY += 5;
      }
      
      if (quoteDetails.projectDetails.additionalInfo.timeline) {
        doc.text(`• Timeline: ${quoteDetails.projectDetails.additionalInfo.timeline}`, 14, currentY);
        currentY += 5;
      }
      
      if (quoteDetails.projectDetails.budgetInfo) {
        doc.text(`• Budget priority: ${quoteDetails.projectDetails.budgetInfo.priority}`, 14, currentY);
        currentY += 5;
      }
      
      currentY += 5;
    }
    
    // Footer
    const footerY = 270;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a detailed estimate based on the information provided. For a professional quotation, please contact our team.', 105, footerY, { align: 'center' });
    doc.text('South Indian Timbers | Phone: +91-9876543210 | Email: info@southindiantimbers.com', 105, footerY + 5, { align: 'center' });
    
    // Save PDF
    doc.save(`SIT_DetailedEstimate_${quoteDetails.quoteNumber}.pdf`);
    
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
