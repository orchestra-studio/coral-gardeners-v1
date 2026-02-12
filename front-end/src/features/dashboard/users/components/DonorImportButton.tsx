"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { IconUpload } from "@tabler/icons-react";
import DonorCsvImporter from "@/components/CsvImporter/DonorCsvImporter";

interface DonorImportButtonProps {
  onImportComplete?: () => void;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function DonorImportButton({
  onImportComplete,
  variant = "outline",
  size = "sm",
  className = "",
}: DonorImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImportComplete = () => {
    setIsOpen(false);
    if (onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
        className={className}
        startIcon={<IconUpload size={16} />}
      >
        Import CSV
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Import Donors from CSV"
        size="lg"
      >
        <div className="space-y-4">
          <div className="text-sm text-[var(--text-muted)]">
            <p className="mb-2">
              Upload a CSV file to import multiple donor records at once.
            </p>
            <p className="mb-2">
              <strong>Required columns:</strong> First Name, Last Name, Email
            </p>
            <p>
              <strong>Optional columns:</strong> Phone
            </p>
          </div>

          <DonorCsvImporter onImportComplete={handleImportComplete} />
        </div>
      </Modal>
    </>
  );
}

export { DonorImportButton };
