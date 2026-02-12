"use client";

import { useTranslations } from "next-intl";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface CollapsibleCodeDemoProps {
  className?: string;
}

export default function CollapsibleCodeDemo({
  className,
}: CollapsibleCodeDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  const exampleCode = `import React from "react";

export default function HelloWorld() {
  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <p>This is a collapsible code example.</p>
    </div>
  );
}`;

  const typescriptCode = `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};`;

  return (
    <DemoCard
      title={t("components.collapsibleCode.labels.codeExample")}
      description={t("components.collapsibleCode.description")}
      className={className}
    >
      <div className="space-y-4">
        <CollapsibleCode
          defaultOpen={false}
          title={t("components.collapsibleCode.labels.reactExample")}
          code={exampleCode}
          language="tsx"
          defaultExpanded={true}
          copyLabel={t("components.collapsibleCode.labels.copy")}
          copiedLabel={t("components.collapsibleCode.labels.copied")}
          copyAriaLabel={t("components.collapsibleCode.aria.copy")}
          copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
        />

        <CollapsibleCode
          defaultOpen={false}
          title={t("components.collapsibleCode.labels.typeScriptExample")}
          code={typescriptCode}
          language="typescript"
          copyLabel={t("components.collapsibleCode.labels.copy")}
          copiedLabel={t("components.collapsibleCode.labels.copied")}
          copyAriaLabel={t("components.collapsibleCode.aria.copy")}
          copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<CollapsibleCode
        defaultOpen={false}
        title="React Component"
  code={code}
  language="tsx"
  defaultExpanded={true}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
