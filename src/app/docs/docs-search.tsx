"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { docNavigation } from "./layout";

export function DocsSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allItems = docNavigation.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      category: group.group || "Overview",
    })),
  );

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()),
      )
    : allItems.slice(0, 8);

  useEffect(() => {
    if (query !== undefined) {
      setSelectedIndex(0);
    }
  }, [query]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        window.location.href = filtered[selectedIndex].href;
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-backdrop">
      <button
        type="button"
        className="fixed inset-0 w-full h-full bg-transparent border-0 cursor-default"
        onClick={onClose}
        aria-label="Close search overlay"
      />
      <div
        className="search-modal z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Search Documentation"
      >
        <div className="search-input-box">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
            className="text-[var(--color-icon)]"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21L16.65 16.65" />
          </svg>
          <input
            ref={(el) => {
              if (el) el.focus();
            }}
            type="text"
            className="search-input"
            placeholder="Search commands, capabilities, APIs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--color-text-weak)] hover:text-[var(--color-text-strong)] cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="search-results">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                data-selected={idx === selectedIndex ? "true" : "false"}
                className="search-result-item"
              >
                <div className="search-result-title">{item.title}</div>
                <div className="search-result-cat">{item.category}</div>
              </Link>
            ))
          ) : (
            <div className="search-empty">No matching documentation topics</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DocsTableOfContents({ pathname }: { pathname: string }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    // Re-query headings whenever pathname changes
    if (!pathname) return;

    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".docs-article h2, .docs-article h3"),
      );

      const parsed = elements.map((el, i) => {
        if (!el.id) {
          el.id = `section-${i}-${el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: el.tagName === "H2" ? 2 : 3,
        };
      });

      setHeadings(parsed);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <aside className="docs-toc" aria-label="On this page">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item ${h.level === 3 ? "h3" : "h2"}`}>
            <a
              href={`#${h.id}`}
              className="toc-link"
              onClick={(e) => {
                e.preventDefault();
                const container = document.getElementById(
                  "docs-scroll-container",
                );
                const el = document.getElementById(h.id);
                if (el && container) {
                  const containerRect = container.getBoundingClientRect();
                  const elRect = el.getBoundingClientRect();
                  const targetScrollTop =
                    container.scrollTop + (elRect.top - containerRect.top) - 48;
                  container.scrollTo({
                    top: targetScrollTop,
                    behavior: "smooth",
                  });
                  window.history.pushState(null, "", `#${h.id}`);
                }
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
