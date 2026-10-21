"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./docs.css";
import { DocsSearchModal, DocsTableOfContents } from "./docs-search";

export interface DocPageItem {
  id: string;
  title: string;
  href: string;
}

export interface DocSidebarGroup {
  group?: string;
  items: DocPageItem[];
}

export const docNavigation: DocSidebarGroup[] = [
  {
    items: [
      { id: "installation", title: "Installation", href: "/docs" },
      { id: "quickstart", title: "Quick Start", href: "/docs/quickstart" },
      {
        id: "configuration",
        title: "Configuration",
        href: "/docs/configuration",
      },
    ],
  },
  {
    group: "CLI Commands",
    items: [
      { id: "asset-cmd", title: "combo asset", href: "/docs/commands/asset" },
      { id: "voice-cmd", title: "combo voice", href: "/docs/commands/voice" },
      {
        id: "transcribe-cmd",
        title: "combo transcribe",
        href: "/docs/commands/transcribe",
      },
      { id: "mcp-cmd", title: "combo mcp", href: "/docs/commands/mcp" },
    ],
  },
  {
    group: "Core Capabilities",
    items: [
      {
        id: "storage-cap",
        title: "Direct Edge S3",
        href: "/docs/capabilities/storage",
      },
      {
        id: "voice-cap",
        title: "Studio Voices",
        href: "/docs/capabilities/voices",
      },
      {
        id: "transcribe-cap",
        title: "Timings & Subtitles",
        href: "/docs/capabilities/transcription",
      },
    ],
  },
  {
    group: "Agent Integrations",
    items: [
      {
        id: "claude-agent",
        title: "Claude Desktop",
        href: "/docs/integrations/claude",
      },
      {
        id: "cursor-agent",
        title: "Cursor & Windsurf",
        href: "/docs/integrations/cursor",
      },
      {
        id: "remotion-agent",
        title: "Remotion React Video",
        href: "/docs/integrations/remotion",
      },
    ],
  },
  {
    group: "REST API Reference",
    items: [
      {
        id: "api-presign",
        title: "POST /api/assets/presign",
        href: "/docs/api/presign",
      },
      {
        id: "api-synthesize",
        title: "POST /api/audio/synthesize",
        href: "/docs/api/synthesize",
      },
      {
        id: "api-transcribe",
        title: "POST /api/audio/transcribe",
        href: "/docs/api/transcribe",
      },
      {
        id: "api-voices",
        title: "GET /api/audio/voices",
        href: "/docs/api/voices",
      },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    if (pathname) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  // Global Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div data-page="docs" className="docs-shell">
      {/* ==================================================================== */}
      {/* 1. TOP NAVBAR (Matching Image 1: Logo + Tabs + Search box + GitHub)  */}
      {/* ==================================================================== */}
      <header className="docs-navbar">
        <div className="flex items-center">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-1 mr-3 text-[var(--color-icon)] cursor-pointer"
            aria-label="Toggle Docs Menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path
                d={
                  mobileMenuOpen
                    ? "M18 6L6 18M6 6L18 18"
                    : "M3 12H21M3 6H21M3 18H21"
                }
              />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <Image
              data-slot="logo light"
              src="/combo-logo-light.svg"
              alt="Combo"
              width={125}
              height={26}
              priority
            />
            <Image
              data-slot="logo dark"
              src="/combo-logo-dark.svg"
              alt="Combo"
              width={125}
              height={26}
              priority
            />
          </Link>

          {/* Horizontal section navigation tabs (Matching Image 1: Docs CLI Build API...) */}
          <nav className="docs-nav-tabs">
            <Link href="/docs" data-active="true" className="docs-nav-tab">
              Docs
            </Link>
            <Link
              href="/docs/commands/asset"
              data-active={
                pathname?.startsWith("/docs/commands") ? "true" : "false"
              }
              className="docs-nav-tab"
            >
              CLI
            </Link>
            <Link
              href="/docs/capabilities/storage"
              data-active={
                pathname?.startsWith("/docs/capabilities") ? "true" : "false"
              }
              className="docs-nav-tab"
            >
              Kits
            </Link>
            <Link
              href="/docs/commands/mcp"
              data-active={pathname === "/docs/commands/mcp" ? "true" : "false"}
              className="docs-nav-tab"
            >
              Agent MCP
            </Link>
            <Link
              href="/docs/api/presign"
              data-active={pathname?.startsWith("/docs/api") ? "true" : "false"}
              className="docs-nav-tab"
            >
              API
            </Link>
          </nav>
        </div>

        {/* Right side: Search Box (Matching Image 1) + GitHub link */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="docs-search-input-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search documentation"
          >
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>

          <a
            href="https://github.com/mody/cloud-api"
            target="_blank"
            rel="noopener noreferrer"
            className="github-nav-link"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] bottom-0 bg-[var(--color-background)] z-40 overflow-y-auto p-6 border-b border-[var(--color-border-weak)]">
          <div className="space-y-6 font-mono text-sm">
            {docNavigation.map((group, groupIdx) => (
              <div key={group.group || `m-grp-${groupIdx}`}>
                {group.group && (
                  <div className="text-xs uppercase text-[var(--color-text-strong)] font-bold mb-2 tracking-wider">
                    {group.group}
                  </div>
                )}
                <ul className="space-y-1 list-none p-0 m-0">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-1 text-sm no-underline ${
                          pathname === item.href
                            ? "text-[var(--color-text-strong)] font-bold"
                            : "text-[var(--color-text-weak)]"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. BODY CONTAINER (3 Columns: Left Sidebar + Center + Right TOC)     */}
      {/* ==================================================================== */}
      <div className="docs-body">
        {/* Left Sidebar (Matching Image 1: Clean, Pure Text, Bold Active) */}
        <aside className="docs-sidebar">
          {docNavigation.map((group, groupIdx) => (
            <div
              key={group.group || `d-grp-${groupIdx}`}
              className="sidebar-group"
            >
              {group.group && (
                <div className="sidebar-title">{group.group}</div>
              )}
              <ul className="sidebar-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      data-active={pathname === item.href ? "true" : "false"}
                      className="sidebar-link"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main Content Scroll Area: Scrollbar at the FAR RIGHT edge of the window */}
        <div className="docs-content-wrapper" id="docs-scroll-container">
          <div className="docs-content-inner">
            {/* Center Article Reading Column */}
            <main className="docs-main">
              <div className="docs-article">{children}</div>
            </main>

            {/* Right Sticky Table of Contents (Sticky at top while content scrolls) */}
            <DocsTableOfContents pathname={pathname} />
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <DocsSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
