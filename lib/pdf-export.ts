// PDF Export functionality for renovation checklists

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { RenovationPlan } from '@/types';

export async function generatePlanPDF(plan: RenovationPlan): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = 750;
  const margin = 50;
  const lineHeight = 20;
  const fontSize = 12;

  // Title
  page.drawText('AFH Renovation Plan', {
    x: margin,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  // Property Information
  page.drawText('Property Information', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  yPosition -= lineHeight;

  const propertyInfo = [
    `Address: ${plan.property.address}, ${plan.property.city}, ${plan.property.state} ${plan.property.zipCode}`,
    plan.property.mlsNumber ? `MLS Number: ${plan.property.mlsNumber}` : '',
    plan.property.squareFeet ? `Square Feet: ${plan.property.squareFeet}` : '',
    plan.property.bedrooms ? `Bedrooms: ${plan.property.bedrooms}` : '',
    plan.property.bathrooms ? `Bathrooms: ${plan.property.bathrooms}` : '',
    plan.property.yearBuilt ? `Year Built: ${plan.property.yearBuilt}` : '',
  ].filter(Boolean);

  propertyInfo.forEach((info) => {
    page.drawText(info, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  });

  yPosition -= 20;

  // Summary
  page.drawText('Summary', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  yPosition -= lineHeight;

  const summaryText = [
    `Total Tasks: ${plan.summary.totalTasks}`,
    `Total Estimated Cost: $${plan.summary.totalEstimatedCost.toLocaleString()}`,
    `Critical Issues: ${plan.summary.criticalIssues}`,
    `DIY Tasks: ${plan.summary.diyTasks}`,
    `Professional Tasks: ${plan.summary.professionalTasks}`,
  ];

  summaryText.forEach((text) => {
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  });

  yPosition -= 20;

  // Compliance Issues
  if (plan.complianceIssues.length > 0) {
    page.drawText('Compliance Issues', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
    });
    yPosition -= lineHeight;

    let currentPage = page;
    plan.complianceIssues.slice(0, 10).forEach((issue) => {
      if (yPosition < 100) {
        currentPage = pdfDoc.addPage([612, 792]);
        yPosition = 750;
      }

      const severityColor = issue.severity === 'critical' 
        ? rgb(1, 0, 0) 
        : issue.severity === 'warning' 
        ? rgb(1, 0.5, 0) 
        : rgb(0, 0, 1);

      currentPage.drawText(`[${issue.severity.toUpperCase()}] ${issue.description}`, {
        x: margin,
        y: yPosition,
        size: fontSize - 2,
        font: font,
        color: severityColor,
      });
      yPosition -= lineHeight;
    });

    yPosition -= 20;
  }

  // Tasks
  page.drawText('Renovation Tasks', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  yPosition -= lineHeight;

  let taskPage = page;
  plan.tasks.forEach((task, index) => {
    if (yPosition < 100) {
      taskPage = pdfDoc.addPage([612, 792]);
      yPosition = 750;
    }

    const taskText = [
      `${index + 1}. [${task.priority.toUpperCase()}] ${task.title}`,
      `   Location: ${task.location}`,
      `   Cost: $${task.estimatedCost.toLocaleString()} | Time: ${task.estimatedTime}`,
      `   ${task.diyFriendly ? 'DIY-Friendly' : 'Professional Required'}${task.requiresPermit ? ' | Permit Required' : ''}`,
      `   ${task.description}`,
    ];

    taskText.forEach((text) => {
      taskPage.drawText(text, {
        x: margin,
        y: yPosition,
        size: fontSize - 2,
        font: font,
      });
      yPosition -= lineHeight;
    });

    yPosition -= 10;
  });

  // Footer
  const footerY = 30;
  page.drawText(`Generated: ${plan.generatedAt.toLocaleString()}`, {
    x: margin,
    y: footerY,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function downloadPlanPDF(plan: RenovationPlan, filename: string = 'afh-renovation-plan.pdf') {
  const pdfBytes = await generatePlanPDF(plan);
  
  // Check if running in Tauri
  const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
  
  if (isTauri) {
    // Use Tauri file system for desktop app
    try {
      const { savePDFToFile } = await import('@/lib/tauri-commands');
      const filePath = await savePDFToFile(pdfBytes, filename);
      // Show success notification (you can add a toast library)
      console.log(`PDF saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Failed to save PDF via Tauri:', error);
      // Fallback to browser download
    }
  }
  
  // Browser download fallback
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

