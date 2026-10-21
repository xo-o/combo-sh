"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EcosystemLogos } from "@/components/ecosystem-logos";
import {
  StatIllustration1,
  StatIllustration2,
  StatIllustration3,
} from "@/components/illustrations";

function CopyStatus() {
  return (
    <div data-component="copy-status">
      <svg
        data-slot="copy"
        width="16"
        height="16"
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
        width="16"
        height="16"
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

function Faq({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      data-slot="faq-item"
      data-closed={!isOpen ? "" : undefined}
      data-expanded={isOpen ? "" : undefined}
    >
      <button
        type="button"
        data-slot="faq-question"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <svg
          data-slot="faq-icon-plus"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12.5 11.5H19V12.5H12.5V19H11.5V12.5H5V11.5H11.5V5H12.5V11.5Z"
            fill="currentColor"
          />
        </svg>
        <svg
          data-slot="faq-icon-minus"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M5 11.5H19V12.5H5Z" fill="currentColor" />
        </svg>
        <div data-slot="faq-question-text">{question}</div>
      </button>
      <div data-slot="faq-answer" data-closed={!isOpen ? "" : undefined}>
        {children}
      </div>
    </div>
  );
}

const installCommands: Record<
  string,
  { prefix: string; highlight: string; suffix: string; full: string }
> = {
  curl: {
    prefix: "curl -fsSL https://",
    highlight: "combo.sh/install",
    suffix: " | bash",
    full: "curl -fsSL https://combo.sh/install | bash",
  },
  npm: {
    prefix: "npm install -g ",
    highlight: "@combo-sh/cli",
    suffix: "",
    full: "npm install -g @combo-sh/cli",
  },
  bun: {
    prefix: "bun install -g ",
    highlight: "@combo-sh/cli",
    suffix: "",
    full: "bun install -g @combo-sh/cli",
  },
  brew: {
    prefix: "brew install ",
    highlight: "combosh/tap/combo",
    suffix: "",
    full: "brew install combosh/tap/combo",
  },
  pnpm: {
    prefix: "pnpm add -g ",
    highlight: "@combo-sh/cli",
    suffix: "",
    full: "pnpm add -g @combo-sh/cli",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("curl");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCopyClick = (cmd: string, tab: string) => {
    void navigator.clipboard.writeText(cmd);
    setCopiedTab(tab);
    setTimeout(() => {
      setCopiedTab(null);
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main data-page="opencode">
      <div data-component="container">
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}
        <section data-component="top">
          <div>
            <Link href="/">
              <Image
                data-slot="logo light"
                src="/combo-logo-light.svg"
                alt="Combo"
                width={154}
                height={34}
                priority
              />
              <Image
                data-slot="logo dark"
                src="/combo-logo-dark.svg"
                alt="Combo"
                width={154}
                height={34}
                priority
              />
            </Link>
          </div>

          <nav data-component="nav-desktop">
            <ul>
              <li>
                <a
                  href="https://github.com/mody/cloud-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ whiteSpace: "nowrap" }}
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/docs">Docs</Link>
              </li>
              <li>
                <a href="#what">Capabilities</a>
              </li>
              <li>
                <a href="#mcp">MCP</a>
              </li>
              <li>
                <a href="#installation" data-slot="cta-button">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M12.1875 9.75L9.00001 12.9375L5.8125 9.75M9.00001 2.0625L9 12.375M14.4375 15.9375H3.5625"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                  Install Free
                </a>
              </li>
            </ul>
          </nav>

          <nav data-component="nav-mobile">
            <button
              type="button"
              data-component="nav-mobile-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div data-component="nav-mobile-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d={
                      mobileMenuOpen
                        ? "M18 6L6 18M6 6L18 18"
                        : "M4 6H20M4 12H20M4 18H20"
                    }
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </button>
            {mobileMenuOpen && (
              <div data-component="nav-mobile-menu-list">
                <ul>
                  <li>
                    <a
                      href="https://github.com/mody/cloud-api"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                      Docs
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        document
                          .getElementById("what")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Capabilities
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        document
                          .getElementById("mcp")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      MCP
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        document
                          .getElementById("faq")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      FAQ
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </section>

        {/* ================================================================== */}
        {/* CONTENT WRAPPER                                                    */}
        {/* ================================================================== */}
        <div data-component="content">
          {/* HERO SECTION */}
          <section data-component="hero" id="installation">
            <div data-slot="hero-copy">
              <a data-slot="releases" href="/docs">
                What’s new in v1.0.0
              </a>
              <h1>
                Cloud kits for <span data-slot="br"></span>AI agent workflows.
              </h1>
              <p>
                Equip agents with asset storage, studio voices, and audio
                transcription <span data-slot="br"></span>via MCP, CLI, and
                more.
              </p>
            </div>

            <div data-slot="installation">
              <section
                data-component="tabs"
                className="tabs"
                data-active={activeTab}
                aria-label="Installation instructions"
              >
                <div data-slot="tablist">
                  {(["curl", "npm", "bun", "brew", "pnpm"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        data-slot="tab"
                        aria-selected={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ),
                  )}
                </div>
                <div data-slot="panels">
                  <pre data-slot="panel">
                    <button
                      type="button"
                      data-copy
                      data-slot="command"
                      data-copied={copiedTab === activeTab ? "" : undefined}
                      onClick={() =>
                        handleCopyClick(
                          installCommands[activeTab].full,
                          activeTab,
                        )
                      }
                    >
                      <span data-slot="command-script">
                        <span data-slot="protocol">
                          {installCommands[activeTab].prefix}
                        </span>
                        <span data-slot="highlight">
                          {installCommands[activeTab].highlight}
                        </span>
                        <span>{installCommands[activeTab].suffix}</span>
                      </span>
                      <CopyStatus />
                    </button>
                  </pre>
                </div>
              </section>
            </div>
          </section>

          {/* VIDEO SHOWCASE SECTION */}
          <section data-component="video">
            <video
              src="/opencode-min.mp4"
              autoPlay
              playsInline
              loop
              muted
              preload="auto"
              poster="/opencode-poster.png"
            >
              Video unsupported
            </video>
          </section>

          {/* WHAT IS COMBO SECTION */}
          <section data-component="what" id="what">
            <div data-slot="section-title">
              <h3>What is Combo?</h3>
              <p>
                A lightweight cloud utility belt designed for the agentic era.
                Direct-to-S3 uploads, studio voices, and millisecond speech
                recognition without the complexity of sprawling cloud consoles.
              </p>
            </div>
            <ul>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Presigned edge storage.</strong> Direct client-to-S3
                  uploads via signed URLs. Never buffer gigabytes of user
                  uploads through backend servers. Global delivery on
                  cdn.combo.sh.
                </div>
              </li>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Studio voiceover engine.</strong> Sub-second voice
                  synthesis with dynamic expressivity (-2 to +2), pitch, and
                  pacing controls. Auto-saved directly to CDN storage.
                </div>
              </li>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Audio transcription &amp; timings.</strong>{" "}
                  Millisecond-accurate word timestamps and ready-to-use SRT,
                  VTT, and JSON transcription tracks for video editors and AI
                  agents.
                </div>
              </li>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Model Context Protocol (MCP).</strong> Native stdio
                  MCP server for Claude Desktop, Cursor, and autonomous agent
                  loops to invoke storage and speech tools directly in prompts.
                </div>
              </li>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Zero-dependency CLI.</strong> Single binary/command
                  executable anywhere — GitHub Actions, Docker containers, local
                  shells, and cron workers.
                </div>
              </li>
              <li>
                <span>[*]</span>
                <div>
                  <strong>Developer-first REST API.</strong> Clean, typed JSON
                  endpoints with standard authentication and streaming responses
                  for easy integration.
                </div>
              </li>
            </ul>
            <a href="/docs">
              <span>Read docs </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6.5 12L17 12M13 16.5L17.5 12L13 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </a>
          </section>

          {/* GROWTH / STATS SECTION */}
          <section data-component="growth">
            <div data-slot="section-title">
              <h3>Engineered for Edge Performance</h3>
              <div>
                <span>[*]</span>
                <p>
                  Direct edge delivery, zero proxy hops, and sub-100ms response
                  times across global regions for AI workflows and automated
                  pipelines.
                </p>
              </div>

              <div data-component="growth-stats">
                <div data-component="growth-stat">
                  <div data-component="stat-illustration">
                    <StatIllustration1 />
                  </div>
                  <span>
                    <figure>[1]</figure> <strong>&lt; 42ms</strong> presigned
                    URL generation
                  </span>
                </div>

                <div data-component="growth-stat">
                  <div data-component="stat-illustration">
                    <StatIllustration2 />
                  </div>
                  <span>
                    <figure>[2]</figure> <strong>100% Edge</strong> permanent
                    CDN delivery
                  </span>
                </div>

                <div data-component="growth-stat">
                  <div data-component="stat-illustration">
                    <StatIllustration3 />
                  </div>
                  <span>
                    <figure>[3]</figure> <strong>3-in-1</strong> CLI, REST API,
                    and native MCP
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* DIRECT-TO-EDGE SECURITY */}
          <section data-component="privacy">
            <div data-slot="privacy-title">
              <h3>Direct-to-Edge Security</h3>
              <div>
                <span>[*]</span>
                <p>
                  Client media files never pass through intermediate server
                  proxies. Presigned PUT tokens connect directly to S3 edge
                  buckets. Secrets stay isolated in your local environment.
                  Learn more in our{" "}
                  <Link href="/docs#configuration">configuration guide</Link>.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section data-component="faq" id="faq">
            <div data-slot="section-title">
              <h3>Frequently Asked Questions</h3>
            </div>
            <ul>
              <li>
                <Faq
                  question="How does presigned edge asset storage work?"
                  defaultOpen={true}
                >
                  When you invoke <code>combo asset upload</code>, the CLI makes
                  a lightweight metadata request to receive a short-lived
                  presigned PUT upload URL. Your machine or agent sends the
                  binary directly to S3-compatible edge storage, completely
                  bypassing backend web proxies. You get back a permanent global
                  CDN URL on <code>cdn.combo.sh</code> in under 50ms.
                </Faq>
              </li>
              <li>
                <Faq question="How do I connect Combo to Claude Desktop or Cursor via MCP?">
                  Run <code>combo mcp</code> directly or add Combo to your
                  Claude Desktop configuration at{" "}
                  <code>
                    ~/Library/Application
                    Support/Claude/claude_desktop_config.json
                  </code>{" "}
                  under <code>mcpServers</code> with command <code>combo</code>{" "}
                  and args <code>["mcp"]</code>. Claude will automatically
                  discover the <code>get_asset_upload_url</code>,{" "}
                  <code>synthesize_speech</code>, and{" "}
                  <code>transcribe_audio</code> tools.
                </Faq>
              </li>
              <li>
                <Faq question="What voiceover controls and styles are supported?">
                  We provide six studio voices (Alexis, Hannah, Cliff, Kit,
                  Brooke, and Celeste). You can fine-tune speech output using{" "}
                  <code>--pace [0.5 - 2.0]</code> for speed adjustment and{" "}
                  <code>--expressivity [-2.0 to +2.0]</code> for dynamic
                  emotional range. Generated audio files are auto-published to
                  CDN edge storage.
                </Faq>
              </li>
              <li>
                <Faq question="What transcription and subtitle formats are exported?">
                  The transcription engine leverages Deepgram Nova models to
                  return millisecond-accurate word timestamps. You can output
                  standard SubRip (.srt) subtitle tracks, WebVTT (.vtt) caption
                  tracks, or complete structured JSON with token timings.
                </Faq>
              </li>
              <li>
                <Faq question="Can I use Combo in headless CI/CD and Docker?">
                  Yes. All CLI commands accept the <code>--json</code> flag,
                  which suppresses decorative logs and emits raw JSON to stdout.
                  This makes Combo effortless to integrate into bash scripts,
                  GitHub Actions, or serverless workers.
                </Faq>
              </li>
              <li>
                <Faq question="What credentials or environment variables are required?">
                  Combo reads <code>DEEPGRAM_API_KEY</code> for voice synthesis
                  and transcription, and <code>AWS_ACCESS_KEY_ID</code>,{" "}
                  <code>AWS_SECRET_ACCESS_KEY</code>, and <code>S3_BUCKET</code>{" "}
                  for presigned storage. Variables can be placed in{" "}
                  <code>.env</code> or exported in your shell profile.
                </Faq>
              </li>
              <li>
                <Faq question="Is Combo open source?">
                  Yes. Combo CLI, MCP server, and backend services are released
                  under the permissive MIT license. You can inspect the source
                  code, contribute, or self-host your own edge infrastructure.
                </Faq>
              </li>
            </ul>
          </section>

          {/* ZEN / AGENT ECOSYSTEM CTA */}
          <section data-component="zen-cta" id="mcp">
            <div data-slot="zen-cta-copy">
              <strong>Use with any AI agent or video pipeline</strong>
              <p>
                Combo speaks Model Context Protocol natively. Connect Claude
                Desktop, Cursor, Remotion, Premiere, or custom autonomous agent
                tool loops in seconds.
              </p>
              <EcosystemLogos />
              <a href="/docs#mcp-cmd">
                <span>Configure MCP server </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 12L17 12M13 16.5L17.5 12L13 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
            </div>
          </section>

          {/* EMAIL SIGNUP */}
          <section data-component="email">
            <div data-slot="section-title">
              <h3>Stay updated on new releases</h3>
              <p>
                Get notified when new voice styles, transcription engines, and
                agent capabilities are shipped.
              </p>
            </div>
            <form
              data-slot="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setSubscribed(true);
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="developer@domain.com"
                aria-label="developer@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={subscribed}>
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </form>
          </section>

          {/* FOOTER */}
          <footer data-component="footer">
            <div data-slot="cell">
              <a
                href="https://github.com/mody/cloud-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span>[v1.0.0]</span>
              </a>
            </div>
            <div data-slot="cell">
              <Link href="/docs">Docs</Link>
            </div>
            <div data-slot="cell">
              <Link href="/docs#commands">Commands</Link>
            </div>
            <div data-slot="cell">
              <Link href="/docs#mcp-cmd">MCP Protocol</Link>
            </div>
            <div data-slot="cell">
              <Link href="/api/audio/voices">Voices API</Link>
            </div>
          </footer>
        </div>
      </div>

      {/* LEGAL BAR */}
      <div data-component="legal">
        <span>© 2026 Combo • combo.sh</span>
        <span>
          <Link href="/docs">Docs</Link>
        </span>
        <span>
          <a
            href="https://github.com/mody/cloud-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </span>
        <span>
          <Link href="/docs#configuration">Architecture</Link>
        </span>
      </div>
    </main>
  );
}
