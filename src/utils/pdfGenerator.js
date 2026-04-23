import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (invoice, t) => {
  try {
    const doc = new jsPDF();
    
    // Safety check for translations
    const safeT = (key, fallback) => {
      try {
        if (typeof t !== 'function') return fallback;
        const val = t(key);
        return (typeof val === 'string') ? val : fallback;
      } catch (e) { return fallback; }
    };

    const currency = invoice.currency || '$';
    const qty = Number(invoice.quantity) || 0;
    const price = Number(invoice.price) || 0;
    const total = qty * price;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(66, 185, 131);
    let headerText = safeT('invoice', 'INVOICE');
    if (invoice.mode === 'medical') headerText = `${safeT('invoice', 'INVOICE')} / ${safeT('prescription', 'PRESCRIPTION')}`;
    if (invoice.mode === 'restaurant') headerText = safeT('receipt', 'RECEIPT');
    doc.text(headerText, 105, 20, { align: "center" });

    // Info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${safeT('customer', 'Customer')}: ${invoice.clientName || 'N/A'}`, 15, 40);
    doc.text(`${safeT('date', 'Date')}: ${invoice.date || new Date().toLocaleDateString()}`, 15, 48);
    doc.text(`ID: INV-${(invoice.id || Date.now()).toString().slice(-6)}`, 15, 56);

    // Dynamic AutoTable call (Robust Version)
    const tableConfig = {
      startY: 65,
      head: [[
        safeT('itemName', 'Item'), 
        safeT('spec', 'Spec'), 
        safeT('quantity', 'Qty'), 
        safeT('price', 'Price'), 
        safeT('total', 'Total')
      ]],
      body: [[
        invoice.itemName || "Item", 
        invoice.dosage || invoice.condition || "-", 
        `${qty} ${invoice.unit || 'pcs'}`, 
        `${currency} ${price.toLocaleString()}`, 
        `${currency} ${total.toLocaleString()}`
      ]],
      headStyles: { fillColor: [66, 185, 131] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    };

    // Use the most compatible way to call autoTable
    if (typeof doc.autoTable === 'function') {
      doc.autoTable(tableConfig);
    } else {
      autoTable(doc, tableConfig);
    }

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    if (invoice.instructions) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${safeT('instructions', 'Instructions')}:`, 15, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(String(invoice.instructions), 15, finalY + 7);
      finalY += 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${safeT('total', 'Total')}: ${currency} ${total.toLocaleString()}`, 15, finalY);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(safeT('thankYou', 'Thank you for choosing us!'), 105, 280, { align: "center" });

    doc.save(`Receipt_${invoice.id || Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF EXCEPTION:", error);
    alert("Could not generate PDF. Please try again or check browser console.");
    throw error;
  }
};

export const generateDailyReportPDF = (invoices, dateString, t) => {
  try {
    const doc = new jsPDF();
    const safeT = (key, fallback) => {
      try {
        if (typeof t !== 'function') return fallback;
        const val = t(key);
        return (typeof val === 'string') ? val : fallback;
      } catch (e) { return fallback; }
    };

    doc.setFontSize(22);
    doc.setTextColor(66, 185, 131);
    doc.text(safeT('dailyReport', 'DAILY SALES REPORT'), 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${safeT('date', 'Date')}: ${dateString}`, 15, 35);
    doc.text(`${safeT('totalTransactions', 'Total Transactions')}: ${invoices.length}`, 15, 42);

    const tableConfig = {
      startY: 50,
      head: [[
        safeT('date', 'Date'), 
        safeT('customer', 'Client'), 
        safeT('itemName', 'Item'), 
        safeT('quantity', 'Qty'), 
        safeT('total', 'Total')
      ]],
      body: invoices.map(inv => [
        inv.date,
        inv.clientName,
        inv.itemName,
        `${inv.quantity} ${inv.unit || 'pcs'}`,
        `${inv.currency || '$'} ${(Number(inv.quantity) * Number(inv.price)).toLocaleString()}`
      ]),
      headStyles: { fillColor: [66, 185, 131] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    };

    if (typeof doc.autoTable === 'function') {
      doc.autoTable(tableConfig);
    } else {
      autoTable(doc, tableConfig);
    }

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${safeT('grandTotals', 'Grand Totals')}:`, 15, finalY);
    
    const totals = invoices.reduce((acc, inv) => {
      const curr = inv.currency || '$';
      acc[curr] = (acc[curr] || 0) + (Number(inv.quantity) * Number(inv.price));
      return acc;
    }, {});

    Object.entries(totals).forEach(([curr, amount]) => {
      finalY += 8;
      doc.text(`${curr} ${amount.toLocaleString()}`, 20, finalY);
    });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(safeT('generatedBy', 'Generated by Invoxa'), 105, 280, { align: "center" });

    doc.save(`Daily_Report_${dateString.replace(/\//g, '-')}.pdf`);
    return true;
  } catch (error) {
    console.error("REPORT EXCEPTION:", error);
    throw error;
  }
};
