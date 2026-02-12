"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, DatePickerInput } from "@/components/ui/input";
import TextArea from "@/components/ui/input/TextArea";
import FileInput from "@/components/ui/input/FileInput";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function InputDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <DemoCard
      title={t("components.input.title")}
      description={t("components.input.description")}
    >
      {/* Basic Input */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.input.sections.basicInput")}
        </p>
        <Input
          label={t("components.input.labels.textInput")}
          placeholder={t("components.input.placeholders.enterText")}
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
        />
      </div>

      {/* TextArea */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.input.sections.textArea")}
        </p>
        <TextArea
          label={t("components.input.labels.multiline")}
          placeholder={t("components.input.placeholders.enterMultiline")}
          value={textareaValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setTextareaValue(e.target.value)
          }
          rows={3}
        />
      </div>

      {/* File Input */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.input.sections.fileInput")}
        </p>
        <FileInput
          label={t("components.input.labels.file")}
          placeholder={t("components.input.placeholders.uploadFile")}
          browseButtonText={t("components.input.buttons.browse")}
          value={file || undefined}
          onChange={(url: string | null) => setFile(url)}
        />
        {file && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {t("components.input.messages.fileSelected")}: {file}
          </p>
        )}
      </div>

      {/* DatePicker Input */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.input.sections.dateInput")}
        </p>
        <DatePickerInput
          label={t("components.input.labels.date")}
          placeholder={t("components.input.placeholders.selectDate")}
          value={date}
          onChange={setDate}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Basic Input
<Input
  label="Text Input"
  placeholder="Enter text..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>

// TextArea
<TextArea
  label="Multiline Input"
  placeholder="Enter multiline text..."
  value={textareaValue}
  onChange={(e) => setTextareaValue(e.target.value)}
  rows={3}
/>

// File Input
<FileInput
  label="File Upload"
  value={file}
  onChange={setFile}
/>

// DatePicker Input
<DatePickerInput
  label="Select Date"
  placeholder="Pick a date..."
  value={date}
  onChange={setDate}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
