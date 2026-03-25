type IconName =
  | 'analysis'
  | 'sparkles'
  | 'sun'
  | 'moon'
  | 'arrow-right'
  | 'check-circle'
  | 'copy'
  | 'document'
  | 'chevron-down'
  | 'rss'
  | 'terminal'
  | 'zap'
  | 'lock'
  | 'brain'
  | 'chart'
  | 'wand'
  | 'sliders';

const navLinks = [
  { label: 'Home', href: '#hero', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];

const featureCards = [
  {
    icon: 'zap' as const,
    title: 'Lightning Fast',
    description:
      'Local processing ensures your summaries are generated in milliseconds, not minutes.'
  },
  {
    icon: 'lock' as const,
    title: 'Privacy First',
    description:
      'No data ever leaves your machine. We process everything locally using on-device logic.'
  },
  {
    icon: 'brain' as const,
    title: 'Smart Analysis',
    description:
      'Advanced parsing identifies hierarchy, code blocks, and critical action items automatically.'
  },
  {
    icon: 'chart' as const,
    title: 'Rich Insights',
    description: 'Extract key takeaways, estimated read times, and complexity scores from any file.'
  },
  {
    icon: 'wand' as const,
    title: 'Beautiful Output',
    description:
      'Generate clean, valid markdown that integrates perfectly with your existing documentation.'
  },
  {
    icon: 'sliders' as const,
    title: 'Zero Config',
    description: 'Works out of the box with sensible defaults. Customize only when you need to.'
  }
];

const steps = [
  {
    number: '01',
    title: 'Install CLI',
    command: 'npm install -g md-summarizer',
    description: 'Install the toolkit globally with npm or your preferred package manager.'
  },
  {
    number: '02',
    title: 'Run Analysis',
    command: 'md-summarizer --directory docs --output SUMMARY.md',
    description: 'Point the tool at a markdown file or an entire docs directory for batch processing.'
  },
  {
    number: '03',
    title: 'Ship the Summary',
    command: 'type SUMMARY.md',
    description: 'Review an editorial-quality summary that is ready for team review or publishing.'
  }
];

const faqItems = [
  {
    question: 'Is my documentation shared with any servers?',
    answer:
      'No. The CLI operates entirely on your machine using local processing. Your content never leaves your filesystem.'
  },
  {
    question: 'Which markdown flavors do you support?',
    answer:
      'GitHub Flavored Markdown, CommonMark, and Obsidian-style wikilinks are supported out of the box.'
  },
  {
    question: 'Does it require an OpenAI API key?',
    answer:
      "No. The core experience uses deterministic extraction techniques and does not require external LLM calls."
  }
];

const footerGroups = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Changelog']
  },
  {
    title: 'Resources',
    links: ['Docs', 'GitHub', 'Examples']
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookie Policy']
  }
];

function Icon({ name, className = '' }: Readonly<{ name: IconName; className?: string }>) {
  const paths: Record<IconName, JSX.Element> = {
    analysis: (
      <>
        <path d="M4 18h16" />
        <path d="M7 15V9" />
        <path d="M12 15V6" />
        <path d="M17 15v-3" />
        <path d="M5 6h14" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
        <path d="m5 16 .8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5" />
        <path d="M12 19.5V22" />
        <path d="m4.9 4.9 1.8 1.8" />
        <path d="m17.3 17.3 1.8 1.8" />
        <path d="M2 12h2.5" />
        <path d="M19.5 12H22" />
        <path d="m4.9 19.1 1.8-1.8" />
        <path d="m17.3 6.7 1.8-1.8" />
      </>
    ),
    moon: (
      <path d="M20 15.5A8.5 8.5 0 1 1 12.5 4a6.5 6.5 0 0 0 7.5 11.5Z" />
    ),
    'arrow-right': (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    'check-circle': (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-4.8" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="10" height="10" rx="2" />
        <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
      </>
    ),
    'chevron-down': <path d="m6 9 6 6 6-6" />,
    rss: (
      <>
        <path d="M5 19a1 1 0 1 0 0 .01" />
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
      </>
    ),
    terminal: (
      <>
        <path d="m6 8 4 4-4 4" />
        <path d="M13 16h5" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </>
    ),
    zap: (
      <>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </>
    ),
    brain: (
      <>
        <path d="M9 7a3 3 0 0 1 6 0 3.5 3.5 0 0 1 3 3.5A3.5 3.5 0 0 1 16.5 17H15a3 3 0 1 1-6 0H7.5A3.5 3.5 0 0 1 6 10.5 3.5 3.5 0 0 1 9 7Z" />
        <path d="M12 7v10" />
        <path d="M9.5 11.5h1.5" />
        <path d="M13 14h1.5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19h16" />
        <path d="M7 15l3-3 3 2 4-5" />
        <path d="M7 19v-4" />
        <path d="M10 19v-7" />
        <path d="M13 19v-5" />
        <path d="M17 19v-10" />
      </>
    ),
    wand: (
      <>
        <path d="m4 20 10-10" />
        <path d="m14 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
        <path d="m18 12 .7 1.3L20 14l-1.3.7L18 16l-.7-1.3L16 14l1.3-.7L18 12Z" />
        <path d="m5 15 4 4" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 6h9" />
        <path d="M17 6h3" />
        <path d="M9 12h11" />
        <path d="M4 12h1" />
        <path d="M4 18h13" />
        <path d="M21 18h-1" />
        <circle cx="15" cy="6" r="2" />
        <circle cx="7" cy="12" r="2" />
        <circle cx="19" cy="18" r="2" />
      </>
    )
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="logo-mark shrink-0">
        <span className="logo-mark__orb" />
        <Icon name="analysis" className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-headline text-sm font-bold tracking-tight text-[var(--text-strong)] sm:text-lg">
            MD Summarizer
          </span>
        </div>
        <p className="hidden truncate text-xs text-[var(--muted)] sm:block">
          Readable summaries for real docs workflows
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="theme-controller">
      <input id="theme-mode" type="checkbox" className="theme-input" aria-label="Toggle light and dark mode" />
      <main className="landing-shell">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--nav-bg)] backdrop-blur-xl">
        <div className="page-container flex min-h-[78px] items-center justify-between gap-3 sm:gap-5">
          <a href="#hero" className="min-w-0 flex-1 lg:flex-none">
            <Logo />
          </a>

          <div className="hidden items-center gap-6 font-headline text-sm font-medium tracking-tight text-[var(--muted-strong)] lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.active
                  ? 'border-b-2 border-[var(--primary-strong)] pb-1 text-[var(--text-strong)]'
                  : 'transition-colors hover:text-[var(--text-strong)]'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <label htmlFor="theme-mode" className="theme-toggle cursor-pointer" aria-label="Toggle light and dark mode">
              <Icon name="sun" className="theme-icon theme-icon-sun h-4 w-4 shrink-0" />
              <Icon name="moon" className="theme-icon theme-icon-moon h-4 w-4 shrink-0" />
            </label>
            <button className="pill-button hidden min-[480px]:inline-flex">Get Started</button>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
        <div className="floating-glow right-[-10rem] top-[-6rem] h-[20rem] w-[20rem] bg-[var(--primary-glow)]" />
        <div className="floating-glow bottom-0 left-[-10rem] h-[18rem] w-[18rem] bg-[var(--secondary-glow)]" />

        <div className="page-container">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:gap-16">
            <div className="relative z-10 max-w-2xl space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)] shadow-[var(--card-shadow)]">
                <Icon name="sparkles" className="h-4 w-4 text-[var(--primary-strong)]" />
                Beta Release 2.0
              </span>

              <div className="space-y-5">
                <h1 className="max-w-[11ch] font-headline text-5xl font-bold leading-[0.92] tracking-[-0.06em] text-[var(--text-strong)] sm:text-6xl lg:text-7xl xl:text-[6.25rem]">
                  Transform Your Documentation into Clear, Actionable Summaries
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[var(--muted-strong)] sm:text-xl">
                  AI-quality markdown analysis powered by smart local algorithms. No API keys, no
                  rate limits, and a polished interface that adapts cleanly to every screen size.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <button className="pill-button justify-center sm:justify-start">
                  Get Started Free
                  <Icon name="arrow-right" className="h-4 w-4" />
                </button>
                <button className="secondary-button justify-center sm:justify-start">View Demo</button>
              </div>

              <div className="grid gap-3 text-sm text-[var(--muted-strong)] sm:grid-cols-3">
                <div className="soft-panel rounded-2xl px-4 py-4">
                  <div className="text-2xl font-bold text-[var(--text-strong)]">82%</div>
                  <p>Average compression ratio</p>
                </div>
                <div className="soft-panel rounded-2xl px-4 py-4">
                  <div className="text-2xl font-bold text-[var(--text-strong)]">320</div>
                  <p>Key insights from complex docs</p>
                </div>
                <div className="soft-panel rounded-2xl px-4 py-4">
                  <div className="text-2xl font-bold text-[var(--text-strong)]">0</div>
                  <p>External APIs required</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full max-w-[34rem] justify-self-center lg:justify-self-end">
              <div className="glass-card overflow-hidden rounded-[1.75rem]">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--soft-panel-bg)] px-5 py-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
                    bash — 80x24
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--panel-bg)] text-[var(--muted-strong)] transition-colors hover:text-[var(--text-strong)]"
                    aria-label="Copy sample command"
                  >
                    <Icon name="copy" className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5 bg-[var(--panel-strong)] p-6 sm:p-7">
                  <div className="font-mono text-sm leading-7 text-[var(--text-strong)]">
                    <div className="flex gap-3">
                      <span className="text-[var(--primary-strong)]">$</span>
                      <span>npm install -g md-summarizer</span>
                    </div>
                    <div className="mt-2 pl-6 italic text-[var(--muted)]">added 42 packages in 2s</div>
                    <div className="mt-5 flex gap-3">
                      <span className="text-[var(--primary-strong)]">$</span>
                      <span>md-summarizer --directory . --output summary.md</span>
                    </div>
                  </div>

                  <div className="soft-panel rounded-2xl px-4 py-4 text-sm text-[var(--muted-strong)]">
                    <div className="mb-2 flex items-center gap-2 text-[var(--text-strong)]">
                      <Icon name="check-circle" className="h-4 w-4 text-[var(--secondary-strong)]" />
                      Analysis complete
                    </div>
                    <p>2,450 words reduced to 320 key insights with action items and read-time estimates.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Input</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">Technical API docs</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Output</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">Ready-to-share markdown</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 sm:py-28">
        <div className="page-container">
          <div className="mb-14 max-w-2xl sm:mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary-strong)]">
              Why teams keep it installed
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-[var(--text-strong)] sm:text-4xl md:text-5xl">
              Why Developers Love MD Summarizer
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--muted-strong)] sm:text-lg">
              The landing page now scales cleanly and the product value is easier to scan, regardless
              of whether the visitor prefers a light or dark interface.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <div key={card.title} className="glass-card group h-full rounded-[1.5rem] p-7 sm:p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--icon-chip-bg)] text-[var(--primary-strong)] transition-transform duration-300 group-hover:scale-105">
                  <Icon name={card.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-headline text-xl font-bold text-[var(--text-strong)]">
                  {card.title}
                </h3>
                <p className="leading-7 text-[var(--muted-strong)]">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 sm:py-28">
        <div className="page-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary-strong)]">
              Workflow
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold text-[var(--text-strong)] sm:text-4xl md:text-5xl">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="relative mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="glass-card relative rounded-[1.75rem] p-7 text-left sm:p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--soft-panel-bg)] font-headline text-xl font-bold text-[var(--primary-strong)]">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-strong)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">{step.description}</p>
                <div className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-strong)] px-4 py-4 font-mono text-xs leading-6 text-[var(--muted-strong)]">
                  <span className="mr-2 text-[var(--primary-strong)]">$</span>
                  {step.command}
                </div>
                {index < steps.length - 1 ? (
                  <div className="pointer-events-none absolute right-[-1rem] top-1/2 hidden -translate-y-1/2 text-[var(--border-strong)] lg:block">
                    <Icon name="arrow-right" className="h-6 w-6" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-28">
        <div className="page-container">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary-strong)]">
                Side-by-side comparison
              </span>
              <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-[var(--text-strong)] sm:text-4xl md:text-5xl">
                See It In Action
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--muted-strong)] sm:text-lg">
                Compare the raw technical source with the concise summary your team can actually use.
              </p>
            </div>
            <div className="inline-flex w-full max-w-sm items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] p-1.5">
              <button className="pill-button flex-1 justify-center px-4 py-3 text-sm">Markdown</button>
              <button className="secondary-button flex-1 justify-center rounded-full px-4 py-3 text-sm">
                Plain Text
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="glass-card rounded-[1.75rem] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
                <Icon name="document" className="h-4 w-4" />
                input_documentation.md
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-[var(--muted-strong)]">{`# API Implementation Guide
This guide covers the full surface area of our V3 endpoints.

## Rate Limiting
Users are limited to 500 requests per minute...

## Authentication
Bearer tokens must be included in every header...

## Rollout Notes
Legacy V2 support remains available during the migration window...`}</pre>
            </div>

            <div className="glass-card rounded-[1.75rem] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-strong)]">
                <Icon name="sparkles" className="h-4 w-4" />
                curated_summary.md
              </div>
              <div className="space-y-5">
                <h4 className="font-headline text-2xl font-bold text-[var(--text-strong)]">
                  Summary: API Implementation
                </h4>
                <div className="space-y-4 text-sm leading-7 text-[var(--muted-strong)]">
                  <div className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                    <p>
                      <strong className="text-[var(--text-strong)]">Core Focus:</strong> Transitioning
                      from V2 to V3 endpoints with a staged migration plan.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                    <p>
                      <strong className="text-[var(--text-strong)]">Key Requirement:</strong> Standard
                      Bearer token authentication remains mandatory.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                    <p>
                      <strong className="text-[var(--text-strong)]">Constraint:</strong> Rate limiting is
                      fixed at 500 requests per minute.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-[var(--border-soft)] pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Compression ratio</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--text-strong)]">82%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Read time</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--text-strong)]">45 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 sm:py-28">
        <div className="page-container max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary-strong)]">
              Need clarity?
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold text-[var(--text-strong)] sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="faq-item glass-card rounded-[1.5rem] px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[var(--text-strong)]">
                  <span>{item.question}</span>
                  <Icon name="chevron-down" className="faq-chevron h-5 w-5 shrink-0 text-[var(--muted-strong)]" />
                </summary>
                <p className="pt-4 text-sm leading-7 text-[var(--muted-strong)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-4 sm:pb-28">
        <div className="page-container">
          <div className="glass-card relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="floating-glow left-[-7rem] top-[-7rem] h-[16rem] w-[16rem] bg-[var(--secondary-glow)]" />
            <div className="floating-glow bottom-[-8rem] right-[-5rem] h-[18rem] w-[18rem] bg-[var(--primary-glow)]" />

            <div className="relative z-10 mx-auto max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                <Icon name="sparkles" className="h-4 w-4 text-[var(--primary-strong)]" />
                Ready to ship cleaner docs?
              </span>
              <h2 className="font-headline text-4xl font-bold tracking-tight text-[var(--text-strong)] sm:text-5xl md:text-6xl">
                Ready to Curate Your Codebase?
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--muted-strong)] sm:text-xl">
                Join teams using MD Summarizer to keep documentation lean, readable, and easy to act on.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row sm:flex-wrap">
                <button className="pill-button justify-center px-8 py-4 text-base">
                  Download CLI for Free
                </button>
                <button className="secondary-button justify-center px-8 py-4 text-base">
                  Read Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-soft)] bg-[var(--footer-bg)]">
        <div className="page-container grid gap-10 py-16 sm:grid-cols-2 xl:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-7 text-[var(--muted-strong)]">
              © 2024 MD Summarizer. Built for engineers who want high-signal documentation without the clutter.
            </p>
            <div className="flex gap-3 text-[var(--muted-strong)]">
              <a
                href="#"
                aria-label="RSS feed"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] transition-colors hover:text-[var(--text-strong)]"
              >
                <Icon name="rss" className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Terminal docs"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--soft-panel-bg)] transition-colors hover:text-[var(--text-strong)]"
              >
                <Icon name="terminal" className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-headline text-lg font-semibold text-[var(--text-strong)]">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[var(--muted-strong)] transition-colors hover:text-[var(--text-strong)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      </main>
    </div>
  );
}
