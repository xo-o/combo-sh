"use client";

import Link from "next/link";
import { useState } from "react";

export function CopyStatus() {
  return (
    <div data-component="copy-status">
      <svg
        data-slot="copy"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M13 5.5H6.5C5.67157 5.5 5 6.17157 5 7V13.5C5 14.3284 5.67157 15 6.5 15H13C13.8284 15 14.5 14.3284 14.5 13.5V7C14.5 6.17157 13.8284 5.5 13 5.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M11 5.5V2.5C11 1.67157 10.3284 1 9.5 1H3C2.17157 1 1.5 1.67157 1.5 2.5V9C1.5 9.82843 2.17157 10.5 3 10.5H5"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
      <svg
        data-slot="check"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 8.5L6.5 12L13 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      data-copy
      data-copied={copied ? "" : undefined}
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
      className="cursor-pointer flex items-center gap-1.5 text-xs text-[var(--color-text-weak)] hover:text-[var(--color-text-strong)]"
    >
      <span className="text-[11px] font-mono">
        {copied ? "Copied!" : "Copy"}
      </span>
      <CopyStatus />
    </button>
  );
}

function renderHighlightedCode(code: string) {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      return (
        <span
          key={`l-${lineIdx}-${line.slice(0, 5)}`}
          className="token-comment"
        >
          {line}
          {"\n"}
        </span>
      );
    }

    const rawParts = line.split(
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|export|from|const|let|var|function|return|async|await|default|type|interface)\b|--[a-zA-Z0-9_-]+)/g,
    );

    const tokenList = rawParts.map((part, i) => ({
      tokenKey: `tok-${lineIdx}-${i}`,
      part,
    }));

    return (
      <span key={`l-${lineIdx}-${line.slice(0, 5)}`}>
        {tokenList.map(({ tokenKey, part }) => {
          if (part.startsWith('"') || part.startsWith("'")) {
            return (
              <span key={tokenKey} className="token-string">
                {part}
              </span>
            );
          }
          if (
            /^(?:import|export|from|const|let|var|function|return|async|await|default|type|interface)$/.test(
              part,
            )
          ) {
            return (
              <span key={tokenKey} className="token-keyword">
                {part}
              </span>
            );
          }
          if (part.startsWith("--")) {
            return (
              <span key={tokenKey} className="token-flag">
                {part}
              </span>
            );
          }
          return part;
        })}
        {"\n"}
      </span>
    );
  });
}

export function DocPanel({
  title,
  code,
  copyText,
}: {
  title?: string;
  code: string;
  copyText?: string;
}) {
  return (
    <div className="doc-panel">
      {title && (
        <div className="panel-header">
          <span>{title}</span>
          <CopyButton text={copyText || code} />
        </div>
      )}
      <pre>{renderHighlightedCode(code)}</pre>
    </div>
  );
}

export function DocBadge({ label }: { label: string }) {
  return <span className="doc-badge">{label}</span>;
}

export function DocHeader({
  title,
  lead,
}: {
  category?: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mb-6">
      <h1>{title}</h1>
      <p className="doc-lead">{lead}</p>
    </header>
  );
}

export function DocBreadcrumbs({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <nav className="doc-breadcrumbs" aria-label="Breadcrumb">
      <Link href="/docs">Docs</Link>
      <span className="separator">/</span>
      <span>{category}</span>
      <span className="separator">/</span>
      <span className="text-[var(--color-text-strong)]">{title}</span>
    </nav>
  );
}
