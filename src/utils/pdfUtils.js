import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export const exportDashboardAsPDF = async (dashboardRef) => {
  const input = dashboardRef.current;
  if (!input) return;

  // Find the export button
  const exportButton = input.querySelector("button");

  // Hide the button before capturing
  if (exportButton) {
    exportButton.style.display = "none";
  }

  //Creating the canvas with better quality
  const canvas = await html2canvas(input, {
    scale: 2,
    logging: false,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight
  });

  //Setting the PDF in landscape mode
  const pdf = new jsPDF("l", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  //Calculating dimensions to maintain proportions
  const imgRatio = canvas.width / canvas.height;
  const pdfRatio = pdfWidth / pdfHeight;

  let finalWidth, finalHeight;

  if (imgRatio > pdfRatio) {

    // If the image is wider than the PDF
    finalWidth = pdfWidth;
    finalHeight = pdfWidth / imgRatio;
  } else {
  // If the image is taller than the PDF
    finalHeight = pdfHeight;
    finalWidth = pdfHeight * imgRatio;
  }

// If the image is taller than the PDF
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  //Adding the image
  pdf.addImage(
    canvas.toDataURL("image/png", 1.0),
    "PNG",
    x,
    y,
    finalWidth,
    finalHeight
  );

 //Backup
  pdf.save("dashboard_report.pdf");

  // Redisplay the button after capture
  if (exportButton) {
    exportButton.style.display = "inline-block";
  }
};
