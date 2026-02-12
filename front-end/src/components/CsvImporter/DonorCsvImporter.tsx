"use client";

import React, { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { IconUpload, IconX, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";
import axios from "axios";

interface DonorRow {
  "First Name"?: string;
  "Last Name"?: string;
  Email?: string;
  Phone?: string;
  [key: string]: string | undefined;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface DonorCsvImporterProps {
  onImportComplete?: () => void;
}

export default function DonorCsvImporter({
  onImportComplete,
}: DonorCsvImporterProps) {
  const { CSVReader } = useCSVReader();
  const [parsedData, setParsedData] = useState<DonorRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const validateData = (data: DonorRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const emails = new Set<string>();

    data.forEach((row, index) => {
      const rowNum = index + 1;

      // Check required fields
      if (!row["First Name"] || row["First Name"].trim() === "") {
        errors.push({
          row: rowNum,
          field: "First Name",
          message: "First Name is required",
        });
      }

      if (!row["Last Name"] || row["Last Name"].trim() === "") {
        errors.push({
          row: rowNum,
          field: "Last Name",
          message: "Last Name is required",
        });
      }

      if (!row.Email || row.Email.trim() === "") {
        errors.push({
          row: rowNum,
          field: "Email",
          message: "Email is required",
        });
      } else {
        // Check for duplicate emails in the CSV
        const emailLower = row.Email.trim().toLowerCase();
        if (emails.has(emailLower)) {
          errors.push({
            row: rowNum,
            field: "Email",
            message: `Duplicate email: ${row.Email}`,
          });
        } else {
          emails.add(emailLower);
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.Email)) {
          errors.push({
            row: rowNum,
            field: "Email",
            message: "Invalid email format",
          });
        }
      }
    });

    return errors;
  };

  const handleUploadAccepted = (results: any) => {
    const data = results.data as DonorRow[];
    const filteredData = data.filter((row) => {
      // Filter out empty rows
      return Object.values(row).some((val) => val && val.trim() !== "");
    });

    setParsedData(filteredData);
    setFileName(results.file?.name || "file.csv");

    // Validate the data
    const errors = validateData(filteredData);
    setValidationErrors(errors);

    if (errors.length === 0) {
      toast.success(`Successfully parsed ${filteredData.length} donor records`);
    } else {
      toast.warning(
        `Found ${errors.length} validation error${errors.length > 1 ? "s" : ""}`
      );
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error("No data to import");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error(
        "Please fix validation errors before importing"
      );
      return;
    }

    setIsImporting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Transform data to match backend API format
      const donorsToImport = parsedData.map((row) => ({
        first_name: row["First Name"]?.trim() || "",
        last_name: row["Last Name"]?.trim() || "",
        email: row.Email?.trim().toLowerCase() || "",
        phone: row.Phone?.trim() || "",
        username: row.Email?.trim().toLowerCase().split("@")[0] || "",
        password: "TempPassword123!", // Temporary password - users should reset
      }));

      // Import donors one by one (backend doesn't have bulk endpoint)
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const donor of donorsToImport) {
        try {
          await axios.post(`${apiUrl}/api/users`, donor);
          successCount++;
        } catch (error: any) {
          failCount++;
          const errorMsg = error.response?.data?.detail || error.message;
          errors.push(`${donor.email}: ${errorMsg}`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully imported ${successCount} donor${successCount > 1 ? "s" : ""}`
        );
      }

      if (failCount > 0) {
        toast.error(
          `Failed to import ${failCount} donor${failCount > 1 ? "s" : ""}. Check console for details.`
        );
        console.error("Import errors:", errors);
      }

      // Clear the parsed data
      setParsedData([]);
      setValidationErrors([]);
      setFileName("");

      // Call the completion callback
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      toast.error("Import failed: " + (error.message || "Unknown error"));
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = () => {
    setParsedData([]);
    setValidationErrors([]);
    setFileName("");
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 bg-[var(--surface)]">
        <CSVReader
          onUploadAccepted={handleUploadAccepted}
          config={{
            header: true,
            skipEmptyLines: true,
          }}
        >
          {({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
            <div className="space-y-4">
              <div {...getRootProps()} className="cursor-pointer">
                {!acceptedFile ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <IconUpload
                      size={48}
                      className="text-[var(--text-muted)] mb-4"
                    />
                    <p className="text-sm text-[var(--text)] font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      CSV file with columns: First Name, Last Name, Email, Phone (optional)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <IconCheck size={20} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">
                          {fileName}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {parsedData.length} records found
                        </p>
                      </div>
                    </div>
                    <Button
                      {...getRemoveFileProps()}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        getRemoveFileProps().onClick(e);
                        handleClear();
                      }}
                      startIcon={<IconX size={16} />}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CSVReader>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="border border-[var(--errorColor)] rounded-lg p-4 bg-[var(--errorColor)]/5">
          <div className="flex items-start gap-2 mb-2">
            <IconAlertCircle size={20} className="text-[var(--errorColor)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[var(--errorColor)] mb-2">
                {validationErrors.length} Validation Error{validationErrors.length > 1 ? "s" : ""}
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-xs text-[var(--text-muted)]">
                    Row {error.row}: {error.field} - {error.message}
                  </p>
                ))}
                {validationErrors.length > 10 && (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    ... and {validationErrors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {parsedData.length > 0 && validationErrors.length === 0 && (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="bg-[var(--surface-hover)] px-4 py-2 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text)]">
              Preview (first 5 rows)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-muted)]">
                    First Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-muted)]">
                    Last Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-muted)]">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-muted)]">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {parsedData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="bg-[var(--surface)]">
                    <td className="px-4 py-2 text-[var(--text)]">{row["First Name"]}</td>
                    <td className="px-4 py-2 text-[var(--text)]">{row["Last Name"]}</td>
                    <td className="px-4 py-2 text-[var(--text)]">{row.Email}</td>
                    <td className="px-4 py-2 text-[var(--text)]">{row.Phone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Button */}
      {parsedData.length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isImporting}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={validationErrors.length > 0 || isImporting}
            loading={isImporting}
            loadingText="Importing..."
            startIcon={<IconUpload size={16} />}
            size="sm"
          >
            Import {parsedData.length} Donor{parsedData.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}

export { DonorCsvImporter };
