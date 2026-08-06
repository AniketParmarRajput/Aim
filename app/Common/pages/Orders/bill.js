"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

const loadImageAsDataURL = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load logo:", err);
    return null;
  }
};

export const downloadOrderBill = async (order, customerName) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logo = await loadImageAsDataURL("/websitelogo-circle.png");

  // Header bar
  doc.setFillColor(43, 28, 18);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Easy Shop", 14, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Order Invoice / Bill", 14, 22);

  // Easy Shop logo on the right (white circle behind so it shows on the dark bar)
  if (logo) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.circle(pageWidth - 16, 15, 9.5, "F");
      doc.addImage(logo, "PNG", pageWidth - 24, 7, 16, 16);
    } catch (err) {
      console.error("Failed to add logo to PDF:", err);
    }
  }

  // Bill meta
  const today = new Date();
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Bill No: ES-${order.id}`, 14, 42);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Date: ${today.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
    pageWidth - 14,
    42,
    { align: "right" }
  );

  // Customer details
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 54);
  doc.setFont("helvetica", "normal");
  let y = 60;
  if (customerName) {
    doc.text(`Name: ${customerName}`, 14, y);
    y += 6;
  }
  doc.text(`Email: ${order.email}`, 14, y);
  y += 6;
  if (order.mobile) {
    doc.text(`Mobile: ${order.mobile}`, 14, y);
    y += 6;
  }
  const addressParts = [order.address, order.district, order.state, order.pincode].filter(Boolean);
  if (addressParts.length) {
    doc.text(`Address: ${addressParts.join(", ")}`, 14, y, { maxWidth: pageWidth - 28 });
    y += 6;
  }

  // Items table
  const unitPrice = Math.max(1, Math.round(Number(order.price) / Number(order.quantity)));
  autoTable(doc, {
    startY: y + 8,
    head: [["#", "Item Name", "SKU", "Qty", "Unit Price (INR)", "Amount (INR)"]],
    body: [
      [
        "1",
        order.itemName,
        order.sku,
        String(order.quantity),
        fmt(unitPrice),
        fmt(order.price),
      ],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [43, 28, 18], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 66 },
      2: { cellWidth: 30 },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
      5: { cellWidth: 32, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = doc.lastAutoTable.finalY;

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total Amount: Rs.${fmt(order.price)}`, pageWidth - 14, finalY + 10, { align: "right" });

  // Order info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Payment Method: ${order.paymentMethod}`, 14, finalY + 22);
  doc.text(`Delivery: ${order.deliveryDate}`, 14, finalY + 28);
  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 14, finalY + 34);

  // Footer bar
  doc.setFillColor(43, 28, 18);
  doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Thank you for shopping with Easy Shop!", pageWidth / 2, pageHeight - 6, { align: "center" });

  doc.save(`EasyShop-Bill-${order.id}.pdf`);
};
