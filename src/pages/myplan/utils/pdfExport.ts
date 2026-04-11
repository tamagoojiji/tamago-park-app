import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function canShareFile(file: File): boolean {
  return typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });
}

function dataURLtoBlob(dataURL: string): Blob {
  const [header, base64] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

export async function exportToPng(elementId: string, filename: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const blob = dataURLtoBlob(canvas.toDataURL('image/png'));
  const file = new File([blob], filename, { type: 'image/png' });

  if (canShareFile(file)) {
    await navigator.share({ files: [file] });
  } else {
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

export async function exportToPdf(elementId: string, filename: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pdfWidth = 210;
  const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, Math.max(pdfHeight, 297)],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  const pdfBlob = pdf.output('blob');
  const file = new File([pdfBlob], filename, { type: 'application/pdf' });

  if (canShareFile(file)) {
    await navigator.share({ files: [file] });
  } else {
    pdf.save(filename);
  }
}
