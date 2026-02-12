"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function ModalDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DemoCard
      title={t("components.modal.title")}
      description={t("components.modal.description")}
    >
      <Button onClick={() => setIsOpen(true)} className="w-max m-auto">
        {t("components.modal.labels.openModal")}
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("components.modal.labels.modalTitle")}
      >
        <div className="p-4">
          <p className="text-[var(--text)]">
            {t("components.modal.messages.modalContent")}
          </p>
        </div>
      </Modal>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Modal
</Button>

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <div className="p-4">
    <p>This is the modal content.</p>
  </div>
</Modal>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
