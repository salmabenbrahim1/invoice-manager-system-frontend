import Papa from "papaparse";

export const exportInvoiceToCSV = (invoice) => {
  if (!invoice) return;

  const pad = "        ";

  const data = [
    { Label: "Invoice Number" + pad, Value: invoice.invoiceNumber },
    { Label: "Invoice Name" + pad, Value: invoice.invoiceName },
    { Label: "Status" + pad, Value: invoice.status },
    { Label: "Date Added" + pad, Value: invoice.addedAt },
    { Label: "Invoice Date" + pad, Value: invoice.invoiceDate },
    { Label: "Due Date" + pad, Value: invoice.dueDate },
    { Label: "Seller Name" + pad, Value: invoice.sellerName },
    { Label: "Seller Address" + pad, Value: invoice.sellerAddress },
    { Label: "Seller SIRET" + pad, Value: invoice.sellerSiretNumber },
    { Label: "Customer Name" + pad, Value: invoice.customerName },
    { Label: "Customer Address" + pad, Value: invoice.customerAddress },
    { Label: "TVA" + pad, Value: invoice.tva },
    { Label: "TVA Rate" + pad, Value: invoice.tvaRate },
    { Label: "TVA Number" + pad, Value: invoice.tvaNumber },
    { Label: "HT Amount" + pad, Value: invoice.ht },
    { Label: "Total TTC" + pad, Value: `${invoice.ttc} ${invoice.currency}` },
  ];

  const csv = Papa.unparse(data, {
    quotes: true,
    delimiter: ";",
    newline: "\r\n",
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice_${invoice.invoiceNumber || "export"}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
