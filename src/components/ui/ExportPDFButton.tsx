"use client";

import React from "react";
import { Button } from "./Button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPDFButtonProps {
  title: string;
  columns: string[];
  data: any[][];
  fileName: string;
}

export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ title, columns, data, fileName }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Generate table
    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.save(`${fileName}.pdf`);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      className="border-border shadow-sm text-foreground hover:bg-muted"
    >
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};
