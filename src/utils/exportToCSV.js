import moment from 'moment';

const formatDate = (date) => {
  if (!date) return '';
  let parsedDate = moment(date, moment.ISO_8601, true);
  if (!parsedDate.isValid()) {
    parsedDate = moment(date, 'DD/MM/YY', true);
  }
  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : date;
};

export const exportAllInvoicesToCSV = (invoices) => {
  if (!invoices || invoices.length === 0) return;

  const headers = [
    "Invoice Name",
    "Invoice Number",
    "Status",
    "Date Added",
    "Invoice Date",
    "Due Date",
    "Seller Name",
    "Seller Address",
    "Seller SIRET",
    "Customer Name",
    "Customer Address",
    "TVA",
    "TVA Rate",
    "TVA Number",
    "HT",
    "TTC",
    "Currency"
  ];

  const rows = invoices.map((invoice) => [
    invoice.invoiceName || '',
    invoice.invoiceNumber || '',
    invoice.status || '',
    formatDate(invoice.addedAt),
    formatDate(invoice.invoiceDate),
    formatDate(invoice.dueDate),
    invoice.sellerName || '',
    invoice.sellerAddress || '',
    invoice.sellerSiretNumber || '',
    invoice.customerName || '',
    invoice.customerAddress || '',
    invoice.tva || '',
    invoice.tvaRate || '',
    invoice.tvaNumber || '',
    invoice.ht || '',
    invoice.ttc || '',
    invoice.currency || ''
  ]);

  const csvArray = [headers, ...rows];

  const csvContent = csvArray
    .map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", "all_invoices.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
