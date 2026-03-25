const navLinks = [
  { label: 'Home', href: '#hero', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];

const featureCards = [
  {
    icon: 'bolt',
    accent: 'text-primary bg-primary-container/20',
    title: 'Lightning Fast',
    description:
      'Local processing ensures your summaries are generated in milliseconds, not minutes.'
  },
  {
    icon: 'lock',
    accent: 'text-secondary bg-secondary-container/20',
    title: 'Privacy First',
    description:
      'No data ever leaves your machine. We process everything locally using on-device logic.'
  },
  {
    icon: 'psychology',
    accent: 'text-tertiary bg-tertiary-container/20',
    title: 'Smart Analysis',
    description:
      'Advanced NLP identifies hierarchy, code blocks, and critical action items automatically.'
  },
  {
    icon: 'insights',
    accent: 'text-primary bg-primary-container/20',
    title: 'Rich Insights',
    description: 'Extract key takeaways, estimated read times, and complexity scores from any file.'
  },
  {
    icon: 'auto_fix_high',
    accent: 'text-secondary bg-secondary-container/20',
    title: 'Beautiful Output',
    description:
      'Generates clean, valid markdown that integrates perfectly with your existing documentation.'
  },
  {
    icon: 'settings_input_component',
    accent: 'text-tertiary bg-tertiary-container/20',
    title: 'Zero Config',
    description: 'Works out of the box with sensible defaults. Customize only when you need to.'
  }
];

const steps = [
  {
    number: '01',
    title: 'Install CLI',
    accent: 'text-primary',
    command: 'npm install -g md-summarizer',
    description: 'Globally install the toolkit to your machine via npm or brew.'
  },
  {
    number: '02',
    title: 'Run Analysis',
    accent: 'text-secondary',
    command: 'md-summarizer --directory docs --output SUMMARY.md',
    description: 'Point the tool at any markdown file or entire directory for batch processing.'
  },
  {
    number: '03',
    title: 'Done',
    accent: 'text-tertiary',
    command: 'type SUMMARY.md',
    description: 'Receive an editorial-quality summary ready for team review or publishing.'
  }
];

const faqItems = [
  {
    question: 'Is my documentation shared with any servers?',
    answer:
      'Absolutely not. The CLI tool operates entirely on your local machine using compiled binaries. Your content never leaves your filesystem.'
  },
  {
    question: 'Which markdown flavors do you support?',
    answer:
      'We support GitHub Flavored Markdown (GFM), CommonMark, and Obsidian-style wikilinks out of the box.'
  },
  {
    question: 'Does it require an OpenAI API key?',
    answer:
      "No. The free version uses deterministic extraction algorithms and doesn't require external LLM calls."
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

function Icon({ name, className = '' }: Readonly<{ name: string; className?: string }>) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-on-surface">
      <nav className="fixed top-0 z-50 w-full bg-surface/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-headline text-xl font-bold tracking-tighter text-primary">
            <Icon name="data_exploration" />
            <span>MD Summarizer</span>
          </div>

          <div className="hidden items-center gap-8 font-headline text-sm font-medium tracking-tight md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.active
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'text-slate-400 transition-colors hover:text-primary'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 transition-colors hover:text-primary" aria-label="Toggle theme">
              <Icon name="light_mode" />
            </button>
            <button className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-on-primary transition-all duration-300 active:scale-95 hover:opacity-80">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-24 pt-32">
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
              <Icon name="auto_awesome" className="text-xs" />
              Beta Release 2.0
            </span>

            <h1 className="font-headline text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
              Transform Your Documentation into{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Clear, Actionable Summaries
              </span>
            </h1>

            <p className="max-w-lg text-xl leading-relaxed text-on-surface-variant">
              AI-quality markdown analysis powered by smart algorithms. No API keys, no rate limits,
              completely free.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-[0_10px_20px_rgba(189,194,255,0.2)] transition-all hover:shadow-primary/40">
                Get Started Free
                <Icon name="arrow_forward" />
              </button>
              <button className="rounded-xl border border-outline-variant bg-surface-container/50 px-8 py-4 font-bold backdrop-blur-md transition-all hover:bg-surface-container">
                View Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-container-lowest shadow-2xl">
              <div className="flex items-center justify-between bg-surface-container-high px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  bash — 80x24
                </div>
                <div className="w-12" />
              </div>

              <div className="space-y-4 p-6 font-mono text-sm leading-relaxed">
                <div className="flex gap-3">
                  <span className="text-primary/50">$</span>
                  <span className="text-on-surface">npm install -g md-summarizer</span>
                </div>
                <div className="italic text-slate-500">added 42 packages in 2s</div>
                <div className="flex gap-3">
                  <span className="text-primary/50">$</span>
                  <span className="text-on-surface">md-summarizer --directory . --output summary.md</span>
                </div>
                <div className="text-secondary">
                  <Icon name="check_circle" className="text-xs" /> Analysis complete. 2,450 words reduced
                  to 320 key insights.
                </div>
              </div>
            </div>

            <button className="absolute bottom-4 right-4 rounded-lg bg-surface-container-highest/80 p-2 text-primary-fixed-dim backdrop-blur transition-colors hover:text-white">
              <Icon name="content_copy" />
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <h2 className="mb-4 font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Why Developers Love MD Summarizer
            </h2>
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="glass-card group rounded-xl p-8 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${card.accent} transition-transform group-hover:scale-110`}>
                  <Icon name={card.icon} className="text-3xl" />
                </div>
                <h3 className="mb-3 font-headline text-xl font-bold">{card.title}</h3>
                <p className="leading-relaxed text-on-surface-variant">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-20 text-center font-headline text-3xl font-bold md:text-5xl">
            Get Started in 3 Simple Steps
          </h2>

          <div className="relative grid gap-12 md:grid-cols-3">
            <div className="absolute left-[10%] right-[10%] top-12 -z-10 hidden h-[2px] bg-gradient-to-r from-transparent via-outline-variant to-transparent md:block" />

            {steps.map((step) => (
              <div key={step.number} className="space-y-6 text-center">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-surface-container font-headline text-2xl font-bold ${step.accent}`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <div className="rounded-lg border border-white/5 bg-surface-container-lowest p-4 text-left font-mono text-xs">
                  <span className={step.accent}>$</span> {step.command}
                </div>
                <p className="text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-4 font-headline text-3xl font-bold tracking-tight md:text-4xl">
                See It In Action
              </h2>
              <p className="max-w-md text-on-surface-variant">
                Compare a raw technical document with the refined editorial output generated by our
                curation engine.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-1">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-on-primary">
                Markdown
              </button>
              <button className="rounded-md px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high">
                Plain Text
              </button>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-outline-variant/30 bg-outline-variant/30 shadow-2xl md:grid-cols-2">
            <div className="bg-surface-container-lowest p-8">
              <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                <Icon name="description" className="text-sm" />
                input_documentation.md
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-400">{`# API Implementation Guide
This guide covers the entire surface area of our V3 endpoints...
[... 142 lines of technical specification ...]

## Rate Limiting
Users are limited to 500 requests per minute...
## Authentication
Bearer tokens must be included in every header...`}</pre>
            </div>

            <div className="relative bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Icon name="auto_awesome" className="text-sm" />
                curated_summary.md
              </div>
              <div className="space-y-4">
                <h4 className="font-headline text-xl font-bold text-white">Summary: API Implementation</h4>
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm text-on-surface-variant">
                    <span className="text-primary">•</span>
                    <p>
                      <strong className="text-secondary">Core Focus:</strong> Transitioning from V2 to
                      V3 endpoints with legacy support.
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm text-on-surface-variant">
                    <span className="text-primary">•</span>
                    <p>
                      <strong className="text-secondary">Key Requirement:</strong> Standard Bearer token
                      authentication required.
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm text-on-surface-variant">
                    <span className="text-primary">•</span>
                    <p>
                      <strong className="text-secondary">Constraint:</strong> Rate limit set at 500 RPM.
                    </p>
                  </div>
                </div>
                <div className="mt-8 border-t border-white/5 pt-8">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant">
                    <span>Compression Ratio: 82%</span>
                    <span>Read Time: 45s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-16 text-center font-headline text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group border-b border-white/10 pb-4">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-left transition-colors hover:text-primary">
                  <span className="text-lg font-medium">{item.question}</span>
                  <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
                </summary>
                <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-card relative overflow-hidden rounded-[2rem] border-none bg-gradient-to-br from-primary-container/20 to-secondary-container/20 p-12 text-center md:p-24">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />

            <div className="relative z-10 space-y-8">
              <h2 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
                Ready to Curate Your Codebase?
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-on-surface-variant">
                Join over 10,000 developers using MD Summarizer to keep their documentation lean and
                readable.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 md:flex-row">
                <button className="rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                  Download CLI for Free
                </button>
                <button className="rounded-2xl border border-outline bg-surface-container/50 px-10 py-5 text-lg font-bold transition-all hover:bg-surface-container">
                  Read Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-white/5 bg-surface-container-low">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-8 py-16 md:grid-cols-4">
          <div className="col-span-2 space-y-6 md:col-span-1">
            <div className="font-headline text-lg font-bold text-primary">MD Summarizer</div>
            <p className="text-sm leading-relaxed text-slate-500">
              © 2024 MD Summarizer. Built for the Digital Curator.
            </p>
            <div className="flex gap-4">
              <Icon name="rss_feed" className="cursor-pointer text-slate-500 transition-colors hover:text-primary" />
              <Icon name="terminal" className="cursor-pointer text-slate-500 transition-colors hover:text-primary" />
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-semibold text-white">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 transition-colors hover:text-primary">
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
  );
}
