import { Fragment, useEffect, useState, type ReactNode } from "react";
import superAppHero from "./assets/super-app-hero.png";
import ekycHero from "./assets/ekyc-hero.png";
import superAppRoadmap from "./assets/super-app-roadmap.png";
import superAppQc from "./assets/super-app-qc-tracker.png";
import superAppModules from "./assets/super-app-modules.png";
import resumePdf from "./assets/manilla-chandrika-resume.pdf";

/* ───────────── Editable content ───────────── */

const NAME = "Manilla Chandrika";
const EMAIL = "hello@aditirao.com";
const LINKEDIN = "https://linkedin.com/in/";

type Case = {
  slug: string;
  name: string;
  tags: string[];
  problem: string;
  role: string;
  highlights: string[];
  context: string;
  // Optional case-specific copy; template placeholders show when omitted.
  detail?: {
    timeline?: string;
    team?: string;
    platform?: string;
    contextMore?: string;
    contextRich?: ReactNode;
    hideLogo?: boolean;
    hideResearchShots?: boolean;
    hideSections?: number[];
    thinking?: [string, string, string];
    decisionLogic?: string;
    businessCase?: string;
    expectedOutcomes?: string[];
    collab?: Record<number, { role?: string; initials?: string; question?: string; text?: string }>;
    problemLead?: string;
    userProblem?: string;
    businessProblem?: string;
    hmw?: string;
    businessImpact?: ReactNode;
    userImpact?: ReactNode;
    strategicImpact?: string;
    research?: Record<number, { title?: string; text?: string; listLabel?: string; bullets?: string[]; items?: [string, string][]; takeaway?: string; points?: string[]; tableIntro?: string; table?: { head: [string, string]; rows: [string, string][] }; groups?: { title: string; text?: string; label?: string; bullets?: string[] }[] }>;
  };
};

const CASES: Case[] = [
  {
    slug: "super-app",
    name: "Alice Blue Super App",
    tags: ["Product Strategy", "Roadmap Execution", "Cross-functional Delivery"],
    problem: "Coordinated product planning and delivery for a multi-product Super App across eight financial product areas, on mobile and web.",
    role: "Product planning · Delivery coordination",
    highlights: ["Roadmap execution", "Design sign-off & handoff", "QA, UAT & bug triage"],
    context: "Alice Blue Super App was a product transformation initiative aimed at bringing multiple financial services and trading experiences into a connected digital platform.",
  },
  {
    slug: "ekyc-activation",
    name: "From eKYC to First Trade",
    tags: ["Activation", "Product Research", "Funnel Analysis"],
    problem: "Researched why newly opened customers stall between eKYC and their first trade, and turned the findings into a product-led activation plan.",
    role: "Product research · Journey audit · Funnel analysis",
    highlights: ["Onboarding & eKYC audit", "First-trade rejection analysis", "Behaviour-based activation strategy"],
    context: "This project examined the customer journey from eKYC and account opening through app installation, login, account funding and order execution.",
  },
  {
    slug: "ask-ant-audit",
    name: "ASK ANT — Product Audit",
    tags: ["Product Audit", "Discovery", "Product Analysis"],
    problem: "Led a structured product audit to identify feature gaps, usability issues and strategic opportunities.",
    role: "Audit lead · Framework & recommendations",
    highlights: ["Audit framework", "Problem identification", "Strategic recommendation", "Prioritisation"],
    context: "ASK ANT is a product surface whose feature set had grown faster than a shared understanding of what it should be best at.",
  },
  {
    slug: "mutual-funds",
    name: "Mutual Fund Experience",
    tags: ["Product Strategy", "UX", "Product Leadership"],
    problem: "Owned the mutual fund product experience across discovery, investment, SIPs, portfolio management and supporting journeys.",
    role: "Product owner · End-to-end experience",
    highlights: ["Product roadmap development", "User research insights", "Feature prioritisation", "User outcome improvement"],
    context: "The mutual fund product covers fund discovery, lump-sum and SIP investing, portfolio tracking, and servicing journeys like redemption and switches.",
  },
  {
    slug: "trading",
    name: "Trading Experience",
    tags: ["Product Design", "UX", "User Research"],
    problem: "Led simplification of complex trading experiences while improving discoverability, decision-making and execution efficiency.",
    role: "Experience lead · Research to architecture",
    highlights: ["User needs research", "Experience architecture", "Feature discovery optimisation", "Product metrics"],
    context: "The trading platform serves users from first-time equity buyers to active derivatives traders, all within a single interface.",
  },
  {
    slug: "pay-in-out",
    name: "Pay-in / Pay-out Experience",
    tags: ["Product Strategy", "User Research", "Fintech"],
    problem: "Owned the analysis and redesign of fund addition and withdrawal journeys to reduce friction, build trust and eliminate unnecessary steps.",
    role: "Journey owner · Analysis & redesign",
    highlights: ["Trust-led flow design", "Step elimination", "Payment-method strategy"],
    context: "Adding and withdrawing funds is the most trust-sensitive moment on the platform — money leaves a user's bank and must be visibly safe.",
  },
];

const PM_FLOW = ["Problem", "Research", "Insight", "Opportunity", "Hypothesis", "Solution", "Measurement", "Learning"];

/* ───────────── Routing (hash) ───────────── */

type Route = { name: "home" } | { name: "case"; i: number } | { name: "system" };
function parse(): Route {
  const h = window.location.hash;
  const c = h.match(/^#\/case\/([\w-]+)/);
  if (c) {
    const i = CASES.findIndex((x) => x.slug === c[1]);
    if (i >= 0) return { name: "case", i };
  }
  if (h.startsWith("#/system")) return { name: "system" };
  return { name: "home" };
}

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ───────────── Primitives ───────────── */

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`size-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
const DownIcon = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v9M4 7l4 4 4-4M3 14h10" /></svg>
);

function Btn({ variant = "primary", children, onClick, href, download, disabled, className = "" }: { variant?: "primary" | "secondary" | "ghost"; children: ReactNode; onClick?: () => void; href?: string; download?: string; disabled?: boolean; className?: string }) {
  const base = "group inline-flex items-center gap-2 text-[14px] font-medium transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed";
  const v = {
    primary: "h-11 px-5 rounded-md bg-ink text-paper hover:bg-sage active:bg-[#173f37] active:scale-[.98] disabled:bg-line disabled:text-ink-3",
    secondary: "h-11 px-5 rounded-md border border-ink/20 text-ink hover:border-ink hover:bg-white active:bg-paper-2 disabled:border-line disabled:text-ink-3",
    ghost: "text-ink hover:text-sage underline-offset-4 decoration-1 hover:underline disabled:text-ink-3",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  if (href) return <a href={href} download={download} className={cls} target={!download && href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>;
  return <button onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

const Tag = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "sage" | "outline" | "status" }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-[4px] px-2 py-[3px] font-mono text-[11px] uppercase tracking-[.06em] ${
    { neutral: "bg-paper-2 text-ink-2", sage: "bg-sage-soft text-sage", outline: "border border-line text-ink-3", status: "border border-sage/30 text-sage" }[tone]
  }`}>
    {tone === "status" && <span className="size-1.5 rounded-full bg-sage pulse" />}
    {children}
  </span>
);

const Eyebrow = ({ n, children }: { n?: string; children: ReactNode }) => (
  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">
    {n && <span className="text-sage">{n}</span>}
    <span className="h-px w-6 bg-line" />
    {children}
  </div>
);

function Placeholder({ label = "[Insert screenshot]", ratio = "aspect-[16/10]", onOpen, dense, src }: { label?: string; ratio?: string; onOpen?: () => void; dense?: boolean; src?: string }) {
  if (src) {
    return (
      <button onClick={onOpen} className={`relative block w-full ${ratio} overflow-hidden rounded-md border border-line bg-paper-2 ${onOpen ? "cursor-zoom-in" : "cursor-default"}`}>
        <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      </button>
    );
  }
  return (
    <button
      onClick={onOpen}
      className={`group relative w-full ${ratio} overflow-hidden rounded-md border border-line bg-paper-2 text-left ${onOpen ? "cursor-zoom-in" : "cursor-default"}`}
    >
      <div className="absolute inset-0 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      {!dense && (
        <div className="absolute inset-x-[10%] top-[16%] bottom-0 rounded-t-md border border-b-0 border-line bg-white/80 p-4 transition-transform duration-300 group-hover:-translate-y-1">
          <div className="mb-3 h-2 w-1/3 rounded-full bg-line" />
          <div className="mb-2 h-2 w-2/3 rounded-full bg-paper-2" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-10 rounded bg-paper-2" /><div className="h-10 rounded bg-sage-soft" /><div className="h-10 rounded bg-paper-2" />
          </div>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-[3px] bg-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">Placeholder</span>
      <span className="absolute bottom-3 right-3 rounded-[3px] bg-white/90 px-2 py-1 font-mono text-[11px] text-ink-3">{label}</span>
    </button>
  );
}

function Lightbox({ label, src, onClose }: { label: string | null; src?: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!label) return null;
  return (
    <div onClick={onClose} className="page-enter fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-6 backdrop-blur-sm">
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex justify-between font-mono text-[12px] text-paper/70"><span>{label}</span><button onClick={onClose} className="hover:text-paper">Close · Esc</button></div>
        {src ? <img src={src} alt={label} className="w-full rounded-md" /> : <Placeholder label={label} ratio="aspect-[16/9]" />}
      </div>
    </div>
  );
}

/* ───────────── Navigation ───────────── */

const NAV = [
  ["Work", "work"], ["Approach", "approach"], ["Metrics", "metrics"], ["About", "about"], ["Resume", "resume"],
] as const;

function Header({ route, progress }: { route: Route; progress?: number }) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    if (route.name !== "home") { window.location.hash = "#/"; setTimeout(() => scrollToId(id), 60); } else scrollToId(id);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <a href="#/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-[5px] bg-ink font-mono text-[11px] text-paper">{NAME.split(" ").map((w) => w[0]).join("")}</span>
          {NAME}
          <span className="hidden font-normal text-ink-3 sm:inline">/ Product</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="text-[14px] text-ink-2 transition-colors duration-200 hover:text-ink">{l}</button>
          ))}
          <a href="#/system" className={`text-[14px] transition-colors ${route.name === "system" ? "text-sage" : "text-ink-2 hover:text-ink"}`}>System</a>
          <Btn variant="primary" className="!h-9 !px-4 !text-[13px]" onClick={() => go("contact")}>Contact</Btn>
        </nav>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="relative grid size-10 place-items-center md:hidden">
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
        </button>
      </div>
      {progress !== undefined && (
        <div className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent"><div className="h-full bg-sage transition-[width] duration-150" style={{ width: `${progress * 100}%` }} /></div>
      )}
      <div className={`fixed inset-x-0 top-16 bottom-0 bg-paper transition-all duration-300 md:hidden ${open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <div className="flex flex-col px-6 pt-6">
          {[...NAV, ["Contact", "contact"] as const].map(([l, id], i) => (
            <button key={id} onClick={() => go(id)} className="flex items-baseline justify-between border-b border-line py-5 text-left text-[26px] tracking-tight">
              {l}<span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
            </button>
          ))}
          <a href="#/system" onClick={() => setOpen(false)} className="py-5 text-[26px] tracking-tight text-ink-3">Design system</a>
        </div>
      </div>
    </header>
  );
}

/* ───────────── Home: Hero + system diagram ───────────── */

const SYS = [
  { k: "Problem", d: "Users abandon after KYC; the business loses activated accounts.", q: "What is breaking, and for whom?" },
  { k: "Insight", d: "The drop isn't the form — it's uncertainty about what happens next.", q: "Why is it really happening?" },
  { k: "Strategy", d: "Sequence the journey around confidence, not compliance steps.", q: "Where should we bet?" },
  { k: "Execution", d: "Ship in slices with engineering, measure each step.", q: "How do we deliver with the team?" },
  { k: "Impact", d: "Activation rate · time-to-first-investment · [Add metric]", q: "Did it move the outcome?" },
];

function SystemDiagram() {
  const [a, setA] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setA((x) => (x + 1) % SYS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative rounded-xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Product system · v1</span>
        <Tag tone="status">Live model</Tag>
      </div>
      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-line" />
        <div className="absolute left-[11px] top-3 w-px bg-sage transition-all duration-500" style={{ height: `calc(${(a / (SYS.length - 1)) * 100}% - 24px * ${a / (SYS.length - 1)})` }} />
        {SYS.map((s, i) => (
          <button key={s.k} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} className="relative flex w-full gap-5 py-3 text-left">
            <span className={`relative z-10 mt-0.5 grid size-[23px] shrink-0 place-items-center rounded-full border bg-white transition-colors duration-300 ${i <= a ? "border-sage" : "border-line"}`}>
              <span className={`size-[7px] rounded-full transition-all duration-300 ${i === a ? "bg-sage scale-125" : i < a ? "bg-sage/60" : "bg-line"}`} />
            </span>
            <span className="flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-[17px] font-medium tracking-tight transition-colors ${i === a ? "text-ink" : "text-ink-3"}`}>{s.k}</span>
                <span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
              </span>
              <span className={`grid transition-all duration-300 ${i === a ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <span className="overflow-hidden">
                  <span className="block pt-1 font-serif text-[15px] italic text-sage">{s.q}</span>
                  <span className="block pt-1 text-[14px] leading-relaxed text-ink-2">{s.d}</span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-ink-3">Example shown: eKYC → first investment</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:px-10 lg:pt-24 lg:pb-32">
      <div className="reveal">
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <h1 className="text-[15px] font-semibold">{NAME}</h1>
          <span className="h-4 w-px bg-line" />
          <span className="text-[15px] text-ink-3">Product Manager</span>
        </div>
        <h2 className="text-[40px] font-medium leading-[1.04] tracking-[-.03em] text-balance sm:text-[56px] lg:text-[66px]">
          Building products by understanding the <span className="font-serif font-normal italic text-sage">problem</span> before designing the solution.
        </h2>
        <p className="mt-8 max-w-[560px] text-[17px] leading-[1.65] text-ink-2">
          I work at the intersection of product strategy, user research and business problems, turning complex user journeys into simpler, more valuable product experiences. I combine user experience with product management to solve user and business problems.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Btn onClick={() => scrollToId("work")}>View Case Studies <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" /></Btn>
          <Btn variant="secondary" href="#"><DownIcon /> Download Resume</Btn>
          <span className="ml-2"><Btn variant="ghost" onClick={() => scrollToId("contact")}>Let's connect <Arrow /></Btn></span>
        </div>
        <dl className="mt-16 grid max-w-[560px] grid-cols-3 border-t border-line pt-6">
          {[["Domain", "Fintech · Investing"], ["Focus", "Discovery → Impact"], ["Status", "Open to PM roles"]].map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1.5 text-[14px]">{v}</dd></div>
          ))}
        </dl>
      </div>
      <div className="reveal lg:pt-10"><SystemDiagram /></div>
    </section>
  );
}

/* ───────────── Section wrapper ───────────── */

function Section({ id, n, eyebrow, title, sub, children, tone }: { id: string; n: string; eyebrow: string; title: ReactNode; sub?: string; children: ReactNode; tone?: "alt" | "dark" }) {
  return (
    <section id={id} className={`scroll-mt-16 ${tone === "alt" ? "bg-white border-y border-line" : tone === "dark" ? "bg-ink text-paper" : ""}`}>
      <div className="mx-auto max-w-[1240px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="reveal mb-14 grid gap-6 lg:mb-20 lg:grid-cols-[1fr_2fr]">
          <Eyebrow n={n}>{eyebrow}</Eyebrow>
          <div>
            <h2 className="max-w-[760px] text-[32px] font-medium leading-[1.1] tracking-[-.025em] text-balance sm:text-[44px]">{title}</h2>
            {sub && <p className={`mt-5 max-w-[620px] text-[17px] leading-relaxed ${tone === "dark" ? "text-paper/65" : "text-ink-2"}`}>{sub}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function FlowChain({ steps, dark }: { steps: string[]; dark?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          <span className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${dark ? "border-paper/20 hover:border-paper hover:bg-paper hover:text-ink" : "border-line bg-white hover:border-sage hover:text-sage"}`}>
            <span className={`mr-2 font-mono text-[10px] ${dark ? "text-paper/40" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>{s}
          </span>
          {i < steps.length - 1 && <span className={`mx-1.5 h-px w-5 ${dark ? "bg-paper/25" : "bg-line"}`} />}
        </li>
      ))}
    </ol>
  );
}

/* ───────────── Home sections ───────────── */

const CAPS = [
  ["Product Discovery & Strategy", "User research, problem framing, competitive analysis, opportunity identification, product roadmap development."],
  ["Product Thinking", "Feature prioritisation, user journey mapping, business case development, product hypothesis, go-to-market strategy."],
  ["User Experience & Design", "UX architecture, interaction design, information hierarchy, high-fidelity execution grounded in product decisions."],
  ["Cross-functional Leadership", "Alignment with Engineering, Design, Data and business stakeholders; driving decisions and moving products toward impact."],
];

function CapabilityCard({ i, t, d }: { i: number; t: string; d: string }) {
  return (
    <div className="reveal group relative flex min-h-[260px] flex-col border-line bg-paper p-7 transition-colors duration-300 hover:bg-white">
      <span className="font-mono text-[12px] text-sage">0{i + 1}</span>
      <h3 className="mt-auto text-[21px] font-medium leading-tight tracking-tight">{t}</h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{d}</p>
      <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-sage transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}

function Value() {
  return (
    <Section id="value" n="01" eyebrow="Value" title={<>I don't just design solutions. <span className="text-ink-3">I solve product problems.</span></>} tone="alt">
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map(([t, d], i) => <CapabilityCard key={t} i={i} t={t} d={d} />)}
      </div>
      <div className="reveal mt-16 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <p className="font-serif text-[22px] italic leading-snug text-ink-2">My approach, every time:</p>
        <FlowChain steps={PM_FLOW} />
      </div>
    </Section>
  );
}

function CaseCard({ c, i }: { c: Case; i: number }) {
  return (
    <a href={`#/case/${c.slug}`} className="reveal group flex flex-col rounded-lg border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(18,22,20,.25)] sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="font-mono text-[12px] text-ink-3">Case {String(i + 1).padStart(2, "0")}</span>
        <span className="text-right font-mono text-[11px] text-ink-3">{c.role}</span>
      </div>
      <h3 className="text-[26px] font-semibold leading-tight tracking-[-.02em]">{c.name}</h3>
      <p className="mt-2 text-[13px] text-sage">{c.tags.join(" · ")}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{c.problem}</p>
      <div className="my-7">{c.slug === "super-app" ? <Placeholder label={`${c.name} desktop and mobile screens`} src={superAppHero} /> : <Placeholder label={`[Insert screenshot] · ${c.name}`} />}</div>
      <ul className="space-y-2 border-t border-line pt-5">
        {c.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex items-center gap-3 text-[14px]"><span className="size-1 rounded-full bg-sage" />{h}</li>
        ))}
      </ul>
      <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium">View Case Study <Arrow className="transition-transform duration-200 group-hover:translate-x-1" /></span>
    </a>
  );
}

function Work() {
  return (
    <Section id="work" n="02" eyebrow="Selected work" title="Selected Product Work" sub="A selection of fintech and product problems I've owned or led across discovery, strategy, user experience and execution.">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {CASES.map((c, i) => <CaseCard key={c.slug} c={c} i={i} />)}
      </div>
    </Section>
  );
}

const THINK = [
  ["Problem Framing", "What core problem are we solving for users and the business?", ["Separate symptoms from root causes", "Write the problem statement before any solution", "Name who loses — the user, the business, or both"]],
  ["User Understanding", "What are users actually trying to accomplish?", ["Jobs-to-be-done interviews", "Observe behaviour, not stated preference", "Segment by intent, not demographics"]],
  ["Friction Analysis", "Where is the experience breaking or causing user/business loss?", ["Map the funnel step by step", "Pair drop-off data with session evidence", "Quantify the cost of each break"]],
  ["Opportunity Mapping", "Where can product decisions create measurable value?", ["Opportunity-solution trees", "Size by reach × impact × confidence", "Check strategic fit before effort"]],
  ["Prioritisation & Hypothesis", "What should we build first and what outcome do we expect?", ["Write falsifiable hypotheses", "Smallest slice that tests the bet", "Agree success criteria with engineering & business up front"]],
  ["Measurement & Learning", "How do we know it worked and what does it tell us?", ["Define a primary metric and guardrails", "Read results honestly — including null results", "Feed learning back into the roadmap"]],
] as const;

function ThinkingCard({ i, t, q, pts }: { i: number; t: string; q: string; pts: readonly string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`reveal rounded-lg border bg-white transition-all duration-300 ${open ? "border-sage/40 shadow-[0_10px_30px_-18px_rgba(31,90,78,.35)]" : "border-line hover:border-ink/20"}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-5 p-6 text-left">
        <span className="pt-1 font-mono text-[12px] text-sage">0{i + 1}</span>
        <span className="flex-1">
          <span className="block text-[19px] font-medium tracking-tight">{t}</span>
          <span className="mt-1.5 block font-serif text-[16.5px] italic leading-snug text-ink-2">{q}</span>
        </span>
        <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${open ? "rotate-45 bg-ink text-paper" : ""}`}>
          <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M1 6h10" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <ul className="mx-6 mb-6 space-y-2.5 border-t border-line pt-5 pl-[34px]">
            {pts.map((p) => <li key={p} className="text-[14.5px] text-ink-2 before:mr-3 before:text-sage before:content-['—']">{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <Section id="approach" n="03" eyebrow="Approach" title="How I Approach Product Problems" tone="alt">
      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {THINK.map(([t, q, pts], i) => <ThinkingCard key={t} i={i} t={t} q={q} pts={pts} />)}
      </div>
      <div className="reveal mt-14 rounded-lg border border-dashed border-line p-6 sm:p-8">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">The loop</p>
        <FlowChain steps={["User Problem", "Research", "Insight", "Opportunity", "Hypothesis", "Solution", "Metric", "Learning"]} />
      </div>
    </Section>
  );
}

const KPI = [
  ["Activation drop-off", "Funnel analytics", "Completion rate", "< 70%", "Investigate and redesign friction points", "Break the funnel by step and device; pair with session recordings to locate the exact step losing users."],
  ["Feature adoption", "Product analytics", "Usage %", "< 15%", "Improve discoverability or value communication", "Check whether users can't find it or don't want it — the fix is different for each."],
  ["User retention", "Cohort analysis", "Retention rate", "Declining", "Analyse churn drivers and reprioritise", "Compare cohorts before and after releases to separate product effects from market effects."],
  ["Revenue impact", "Business intelligence", "Revenue / user", "Below target", "Test pricing or feature access strategies", "Run controlled tests; watch guardrails like support tickets and churn."],
  ["User satisfaction", "Research / NPS", "NPS or sentiment", "Below benchmark", "Conduct user interviews and assess priorities", "Code verbatims by theme; weight themes by affected segment size."],
];

function Metrics() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section id="metrics" n="04" eyebrow="Metrics" title="I think in terms of business and user outcomes." sub="Example product KPI framework for decision-making.">
      <div className="reveal overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[.1em] text-ink-3">
              {["Signal", "Data source", "Metric", "Threshold", "Product action", ""].map((h) => <th key={h} className="px-6 py-4 font-normal">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {KPI.map((r, i) => (
              <Fragment key={r[0]}>
                <tr onClick={() => setOpen(open === i ? null : i)} className={`group cursor-pointer border-b border-line/70 text-[14.5px] transition-colors duration-200 hover:bg-sage-soft/50 ${open === i ? "bg-sage-soft/50" : ""}`}>
                  <td className="px-6 py-5 font-medium">{r[0]}</td>
                  <td className="px-6 py-5 text-ink-2">{r[1]}</td>
                  <td className="px-6 py-5 text-ink-2">{r[2]}</td>
                  <td className="px-6 py-5"><span className="rounded bg-paper-2 px-2 py-1 font-mono text-[12.5px] group-hover:bg-white">{r[3]}</span></td>
                  <td className="px-6 py-5">{r[4]}</td>
                  <td className="px-6 py-5 text-right text-ink-3"><span className={`inline-block transition-transform duration-300 ${open === i ? "rotate-90" : ""}`}><Arrow /></span></td>
                </tr>
                {open === i && (
                  <tr key={r[0] + "x"} className="border-b border-line/70 bg-sage-soft/30">
                    <td colSpan={6} className="page-enter px-6 pb-6 pt-1"><p className="max-w-[640px] pl-0 text-[14px] text-ink-2"><span className="mr-2 font-mono text-[11px] uppercase text-sage">How I'd investigate</span>{r[5]}</p></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-3">Illustrative framework · thresholds are examples, not reported results. Click a row for detail.</p>
    </Section>
  );
}

const STAGES = [
  ["Design", "Visual & interaction craft", "[Add years]"],
  ["Product Design", "Journeys, systems, research", "[Add years]"],
  ["Product Strategy", "Problem framing, roadmaps", "[Add years]"],
  ["Product Management", "End-to-end ownership", "Now"],
];
const AREAS = ["Fintech", "Trading", "Investments", "Mutual Funds", "Onboarding", "Activation", "Product Strategy", "User Research", "Market Analysis", "Product Leadership", "Cross-functional execution"];

function Timeline() {
  return (
    <Section id="progression" n="05" eyebrow="Progression" title="My Product Progression" tone="dark">
      <div className="reveal relative grid gap-10 md:grid-cols-4 md:gap-0">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-paper/15 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto" />
        <div className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-transparent to-sage-2 md:left-0 md:top-[7px] md:h-px md:w-full md:bg-gradient-to-r" />
        {STAGES.map(([t, d, y], i) => (
          <div key={t} className="relative pl-10 md:pl-0 md:pr-8">
            <span className={`absolute left-0 top-0 grid size-[15px] place-items-center rounded-full border md:relative ${i === 3 ? "border-sage-2 bg-sage-2" : "border-paper/40 bg-ink"}`}>
              {i === 3 && <span className="size-[5px] rounded-full bg-paper pulse" />}
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[.12em] text-paper/45 md:mt-7">{String(i + 1).padStart(2, "0")} · {y}</p>
            <h3 className={`mt-2 text-[24px] font-medium tracking-tight ${i === 3 ? "text-paper" : "text-paper/75"}`}>{t}</h3>
            <p className="mt-1 text-[14px] text-paper/55">{d}</p>
          </div>
        ))}
      </div>
      <div className="reveal mt-20 border-t border-paper/10 pt-10">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[.14em] text-paper/45">Experience areas</p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => <span key={a} className="rounded-full border border-paper/15 px-3.5 py-1.5 text-[13.5px] text-paper/80 transition-colors duration-200 hover:border-paper/50 hover:text-paper">{a}</span>)}
        </div>
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" n="06" eyebrow="About" title="A product manager building products with a design perspective.">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="reveal"><Placeholder label="[Insert portrait]" ratio="aspect-[4/5]" dense /></div>
        <div className="reveal max-w-[640px] space-y-6 text-[18px] leading-[1.7] text-ink-2">
          <p>I started in design, but as I worked more closely with product decisions, I became increasingly focused on strategy: <span className="font-serif italic text-ink">Why does this problem exist? What is the user really trying to do? What should we build first and why?</span></p>
          <p>That curiosity evolved into product management, where I lead product decisions end-to-end — from discovery through delivery and measurement.</p>
          <p className="text-ink">Today I combine:</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {["User Research", "Product Strategy", "Design Thinking", "Business Context"].map((x, i) => (
              <div key={x} className="bg-white p-4"><span className="font-mono text-[11px] text-sage">{i < 3 ? "+" : "="}</span><p className="mt-6 text-[15px] font-medium leading-tight text-ink">{x}</p></div>
            ))}
          </div>
          <p>…to solve problems that matter.</p>
        </div>
      </div>
    </Section>
  );
}

const CV = {
  name: "P Manilla Chandrika",
  title: "Product Manager · UX Experience · AI & Fintech Product",
  contact: [
    ["Email", "chandrikamanilla@gmail.com", "mailto:chandrikamanilla@gmail.com"],
    ["Phone", "+91 78427 76721", "tel:+917842776721"],
    ["LinkedIn", "linkedin.com/in/manilla1306", "https://www.linkedin.com/in/manilla1306/"],
    ["Location", "Bangalore, India", ""],
  ] as [string, string, string][],
  summary:
    "Organized and detail-oriented Product Manager with hands-on experience across fintech products at Alice Blue, specialising in trading, investing, wealth, onboarding, eKYC and customer experience. Transforms user problems and product observations into clear requirements, PRDs, user stories, product roadmaps, product audit reports and data analysis. Coordinates product discovery, competitor analysis, prioritisation and Agile execution, and collaborates closely with engineering, business, quality and design teams through UAT and iterative releases. Focuses on building simple, scalable products using user research, data-informed decisions and strong product thinking.",
  skills: [
    ["Product Strategy", "Vision, roadmap thinking, opportunity analysis, information architecture, feature definition, product market benchmarking."],
    ["Product Execution", "PRDs, user stories, acceptance criteria, workflows, UAT, release reviews, cross-functional collaboration."],
    ["Product Discovery", "User problem identification, user observation, competitor research, journey mapping, UX research."],
    ["Product Analytics", "Funnel metrics, user journey analysis, feedback analysis, adoption, activation, engagement."],
    ["Prioritisation & Decisions", "Impact versus effort analysis, trade-off evaluation, feature prioritisation, MVP thinking."],
    ["Fintech Domain", "Trading, investing, mutual funds, wealth, eKYC, onboarding, portfolio management, order workflows, API products."],
  ] as [string, string][],
  tools: ["Figma", "Jira", "Google Sheets", "Notion", "Power BI", "Copilot", "Perplexity", "NotebookLM", "Claude", "ChatPRD", "OpenAI"],
  experience: [
    {
      org: "Alice Blue",
      role: "Product Designer, Product Execution",
      period: "April 2024 – Present",
      groups: [
        ["Product Strategy and Execution", [
          "Defined product requirements and translated business decisions into PRDs, user stories, acceptance criteria and release plans.",
          "Collaborated with engineering, design and business teams to identify user problems and evaluate solutions.",
          "Contributed to the product vision for a unified investment ecosystem bridging stocks, mutual funds, wealth and trading.",
          "Developed the Learn → Practice → Invest → Trade → Grow product concept to connect educational and financial platforms.",
          "Conducted competitor research across Groww, Zerodha, Angel One and INDmoney to identify market opportunity gaps and usability improvements.",
          "Organized UAT, release reviews and stakeholder discussions to resolve product gaps before launch.",
        ]],
        ["Fintech and Trading Products", [
          "Structured the product architecture for the new trading UI to optimise navigation, positions, holdings, watchlists and order workflows.",
          "Defined the UX requirements for ANT Scalper by organising NIFTY charts, open interest data and stop-loss interactions.",
          "Created product concepts for a Trading Command Center to guide users from market intent to actionable trading steps.",
          "Researched intent-based navigation models tailored for Trader, Investor and Explorer personas to simplify product discovery.",
          "Evaluated 1ly Algos and API product experiences against competitors to identify improvements for strategy building and beginner accessibility.",
          "Reviewed ASK ANT user flows and feature experiences to improve functional usability.",
        ]],
        ["Growth, eKYC and Customer Activation", [
          "Improved eKYC and onboarding journeys by resolving friction across registration, verification and account activation.",
          "Designed a post-eKYC experience that allows users to explore the product while backend verification is in progress.",
          "Optimised workflows for guest login, app installation tracking, verification status communication and WhatsApp confirmation.",
          "Streamlined the onboarding process by reducing unnecessary pop-ups while maintaining compliance and communication requirements.",
        ]],
        ["Wealth Management and Product Analytics", [
          "Defined the information architecture for Alice Blue Wealth to cover equities, mutual funds, asset allocation and external investments.",
          "Partnered on the FinFactor integration to map how external financial data appears within the native wealth ecosystem.",
          "Explored native product expansion opportunities for SIP, FD, NPS and portfolio health.",
          "Built a new UI feedback initiative to categorise user observations into discoverability, usability and functional problems to guide product prioritisation.",
        ]],
      ] as [string, string[]][],
    },
    {
      org: "Mobile Premier League",
      role: "Senior Designer",
      period: "Feb 2020 – Sep 2023",
      groups: [["", [
        "Designed platform assets and user experiences for a mobile gaming platform serving over 9 crore users.",
        "Supported product engagement and discoverability across 60+ games in categories such as fantasy sports and arcade games.",
        "Created logo designs and visual deliverables for real-money gaming features within a high-traffic consumer application.",
      ]]] as [string, string[]][],
    },
    {
      org: "Fabric Monde",
      role: "Merchandiser and Designer",
      period: "Aug 2018 – Jan 2020",
      groups: [["", [
        "Managed supplier onboarding workflows to connect small-scale producers with global fashion brands.",
        "Executed quality control tasks to ensure product deliverables met standard acceptance criteria.",
        "Handled fabric merchandising and design requirements in a fast-growing B2B startup environment.",
      ]]] as [string, string[]][],
    },
  ],
  education: [
    ["Indian Institute of Technology Hyderabad", "Design and Visual Communication", "Jan 2023 – Aug 2023"],
    ["Tamil Nadu Open University", "Bachelor of Commerce (B.Com)", "2014 – 2017"],
    ["Kendriya Vidyalaya", "CBSE", "2001 – 2013"],
  ] as [string, string, string][],
  certifications: [
    ["AI Product Management", "Coursera"],
    ["Enterprise Product Management Fundamentals", "Coursera"],
    ["Power BI", "Coursera"],
    ["Product Management: Building a Product Strategy", "LinkedIn Learning"],
    ["What Is Generative AI", "LinkedIn Learning"],
    ["Becoming a Product Manager: A Complete Guide", "LinkedIn Learning"],
  ] as [string, string][],
};

const CvLabel = ({ children }: { children: ReactNode }) => <p className="font-mono text-[11px] uppercase tracking-[.14em] text-sage">{children}</p>;

function Resume() {
  return (
    <Section id="resume" n="07" eyebrow="Resume" title="Resume" tone="alt">
      <div className="reveal rounded-lg border border-line bg-paper p-2">
        <div className="rounded-md border border-line bg-white p-6 sm:p-10 lg:p-12">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="text-[28px] font-semibold tracking-[-.02em] sm:text-[34px]">{CV.name}</p>
              <p className="mt-1 text-[15px] text-ink-2">{CV.title}</p>
            </div>
            <Tag tone="outline">2 pages · PDF</Tag>
          </div>
          <dl className="grid gap-4 border-b border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
            {CV.contact.map(([k, v, href]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt>
                <dd className="mt-1 text-[14px]">{href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline decoration-line underline-offset-4 transition-colors hover:text-sage hover:decoration-sage">{v}</a> : v}</dd>
              </div>
            ))}
          </dl>

          {/* Summary */}
          <div className="grid gap-4 border-b border-line py-8 lg:grid-cols-[200px_1fr]">
            <CvLabel>Summary</CvLabel>
            <p className="max-w-[760px] text-[15.5px] leading-[1.75] text-ink-2">{CV.summary}</p>
          </div>

          {/* Experience */}
          <div className="grid gap-4 border-b border-line py-8 lg:grid-cols-[200px_1fr]">
            <CvLabel>Experience</CvLabel>
            <div className="space-y-10">
              {CV.experience.map((e) => (
                <div key={e.org}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-[18px] font-medium tracking-[-.01em]">{e.org} <span className="font-normal text-ink-3">· {e.role}</span></p>
                    <p className="font-mono text-[12px] text-ink-3">{e.period}</p>
                  </div>
                  <div className="mt-4 space-y-5">
                    {e.groups.map(([g, pts]) => (
                      <div key={g || e.org}>
                        {g && <p className="mb-2.5 text-[14px] font-medium text-ink">{g}</p>}
                        <Bullets list={pts} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="grid gap-4 border-b border-line py-8 lg:grid-cols-[200px_1fr]">
            <CvLabel>Skills</CvLabel>
            <div>
              <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                {CV.skills.map(([h, t]) => (
                  <div key={h}><p className="text-[14px] font-medium">{h}</p><p className="mt-1 text-[14px] leading-relaxed text-ink-2">{t}</p></div>
                ))}
              </div>
              <p className="mt-7 text-[14px] font-medium">Tools</p>
              <div className="mt-3 flex flex-wrap gap-2">{CV.tools.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </div>
          </div>

          {/* Education & certifications */}
          <div className="grid gap-10 pt-8 md:grid-cols-2">
            <div>
              <CvLabel>Education</CvLabel>
              <ul className="mt-5 space-y-4">
                {CV.education.map(([school, course, years]) => (
                  <li key={school}><p className="text-[15px] font-medium">{school}</p><p className="text-[14px] text-ink-2">{course}</p><p className="mt-0.5 font-mono text-[11px] text-ink-3">{years}</p></li>
                ))}
              </ul>
            </div>
            <div>
              <CvLabel>Certifications</CvLabel>
              <ul className="mt-5 divide-y divide-line">
                {CV.certifications.map(([name, by]) => (
                  <li key={name} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0"><span className="text-[14px]">{name}</span><span className="shrink-0 font-mono text-[11px] text-ink-3">{by}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Btn href={resumePdf} download="P-Manilla-Chandrika-Resume.pdf"><DownIcon /> Download Resume (PDF)</Btn>
        <Btn variant="secondary" href="https://www.linkedin.com/in/manilla1306/">View LinkedIn <Arrow /></Btn>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-40">
        <div className="reveal">
          <Eyebrow n="08">Contact</Eyebrow>
          <h2 className="mt-8 max-w-[900px] text-[44px] font-medium leading-[1.02] tracking-[-.035em] text-balance sm:text-[72px]">
            Have a product problem <span className="font-serif font-normal italic text-sage">worth solving?</span>
          </h2>
          <p className="mt-8 max-w-[560px] text-[17px] leading-relaxed text-ink-2">I'm interested in product management, fintech and user experience problems where strategy, research and execution can work together.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={`mailto:${EMAIL}`}>Email Me <Arrow /></Btn>
            <Btn variant="secondary" href={LINKEDIN}>LinkedIn</Btn>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-6 py-8 font-mono text-[11px] text-ink-3 lg:px-10">
      <span>© {new Date().getFullYear()} {NAME}</span>
      <span>Problem → Evidence → Decision → Execution → Impact</span>
      <a href="#/system" className="hover:text-ink">Design system ↗</a>
    </div>
  </footer>
);

function Home() {
  return <><Hero /><Value /><Work /><Thinking /><Metrics /><Timeline /><About /><Resume /><Contact /></>;
}

/* ───────────── Case study template ───────────── */

const CS_SECTIONS = ["Context", "Problem", "Why It Matters", "Research", "Key Insights", "Opportunity", "Product Thinking", "Solution", "Collaboration", "Measurement", "Outcome", "Learnings"];

function CSBlock({ i, n = i + 1, children, lead }: { i: number; n?: number; children: ReactNode; lead?: string }) {
  if (n === 0) return null;
  return (
    <section id={`s${i}`} className="reveal scroll-mt-24 border-t border-line py-16 first:border-t-0 first:pt-0">
      <p className="font-mono text-[12px] text-sage">{String(n).padStart(2, "0")} —</p>
      <h2 className="mt-2 text-[30px] font-medium tracking-[-.02em] sm:text-[36px]">{CS_SECTIONS[i]}</h2>
      {lead && <p className="mt-4 max-w-[640px] font-serif text-[20px] italic leading-snug text-ink-2">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const Bullets = ({ list }: { list: string[] }) => (
  <ul className="space-y-2.5">
    {list.map((t) => <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-2"><span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-sage" />{t}</li>)}
  </ul>
);

const P = ({ children }: { children: ReactNode }) => <p className="max-w-[680px] text-[17px] leading-[1.7] text-ink-2">{children}</p>;
const Ph = ({ children }: { children: ReactNode }) => <span className="rounded bg-sage-soft px-1.5 py-0.5 font-mono text-[13px] text-sage">{children}</span>;

function CaseStudy({ i, onProgress }: { i: number; onProgress: (p: number) => void }) {
  const c = CASES[i];
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<string | null>(null);
  const d = c.detail ?? {};
  const shown = CS_SECTIONS.map((_, k) => k).filter((k) => !d.hideSections?.includes(k));
  const num = (k: number) => shown.indexOf(k) + 1;

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      onProgress(Math.min(1, h.scrollTop / (h.scrollHeight - h.clientHeight || 1)));
      let cur = 0;
      CS_SECTIONS.forEach((_, k) => {
        const el = document.getElementById(`s${k}`);
        if (el && el.getBoundingClientRect().top < 160) cur = k;
      });
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); onProgress(0); };
  }, [i, onProgress]);

  const next = CASES[(i + 1) % CASES.length];

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-[1240px] px-6 pt-10 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
          <a href="#/" className="hover:text-ink">Home</a><span>/</span>
          <button onClick={() => { window.location.hash = "#/"; setTimeout(() => scrollToId("work"), 60); }} className="hover:text-ink">Work</button><span>/</span>
          <span className="text-ink">{c.name}</span>
        </nav>
        <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">{c.tags.map((t) => <Tag key={t} tone="sage">{t}</Tag>)}</div>
            <h1 className="text-[42px] font-semibold leading-[1.02] tracking-[-.035em] sm:text-[64px]">{c.name}</h1>
            <p className="mt-6 max-w-[640px] text-[18px] leading-relaxed text-ink-2">{c.problem}</p>
          </div>
          <dl className="grid grid-cols-2 gap-5 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {[["Role", c.role], ["Timeline", d.timeline ?? "[Add dates]"], ["Team", d.team ?? "[Describe team]"], ["Platform", d.platform ?? "[iOS · Android · Web]"]].map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1 text-[14px]">{v}</dd></div>
            ))}
          </dl>
        </div>
        <Placeholder label={`[Insert screenshot] · ${c.name} hero`} ratio="aspect-[21/9]" onOpen={() => setLb(`${c.name} — hero`)} />
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pt-20 pb-10 lg:grid-cols-[220px_1fr] lg:gap-20 lg:px-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">On this page</p>
            <ol className="space-y-0.5 border-l border-line">
              {shown.map((k) => CS_SECTIONS[k]).map((s, j) => { const k = shown[j]; return (
                <li key={s}>
                  <button onClick={() => scrollToId(`s${k}`)} className={`-ml-px flex w-full gap-3 border-l py-1.5 pl-4 text-left text-[13.5px] transition-colors duration-200 ${active === k ? "border-sage text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                    <span className="font-mono text-[11px] pt-px">{String(j + 1).padStart(2, "0")}</span>{s}
                  </button>
                </li>
              ); })}
            </ol>
          </nav>
        </aside>
        {/* mobile section chip */}
        <div className="sticky top-16 z-30 -mx-6 -mt-12 border-b border-line bg-paper/90 px-6 py-3 backdrop-blur lg:hidden">
          <select value={active} onChange={(e) => scrollToId(`s${e.target.value}`)} className="w-full bg-transparent font-mono text-[12px]">
            {shown.map((k, j) => <option key={k} value={k}>{String(j + 1).padStart(2, "0")} — {CS_SECTIONS[k]}</option>)}
          </select>
        </div>

        <article className="min-w-0">
          <CSBlock i={0} n={num(0)}>
            <div className={`grid gap-8 ${d.hideLogo ? "" : "md:grid-cols-[1fr_200px]"}`}>
              <div className="space-y-5"><P>{d.contextRich ?? c.context}</P><P>{d.contextMore ?? "[Add 1–2 sentences: who the users are, scale of the product, and where this work sits in the company's strategy.]"}</P></div>
              {!d.hideLogo && <Placeholder label="[Logo / identifier]" ratio="aspect-square" dense />}
            </div>
          </CSBlock>

          <CSBlock i={1} n={num(1)} lead={d.problemLead ?? "Framed as a product problem — not a UX complaint."}>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
              {[["User problem", d.userProblem ?? "[Describe what users were trying to do and where they got stuck.]"], ["Business problem", d.businessProblem ?? "[Describe the cost to the business — lost activation, revenue, trust or support load.]"]].map(([h, t]) => (
                <div key={h} className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{h}</p><p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{t}</p></div>
              ))}
            </div>
            <blockquote className="mt-8 border-l-2 border-sage pl-6 font-serif text-[22px] leading-snug">{d.hmw ?? '"How might we [problem statement] so that [user outcome] and [business outcome]?"'}</blockquote>
          </CSBlock>

          <CSBlock i={2} n={num(2)}>
            <div className="grid gap-4 md:grid-cols-3">
              {[["Business impact", d.businessImpact ?? <Ph>[Add metric]</Ph>], ["User impact", d.userImpact ?? "[Qualitative or quantitative]"], ["Strategic importance", d.strategicImpact ?? "[Why the org cared now]"]].map(([h, t], k) => (
                <div key={k} className="rounded-lg border border-line bg-white p-6"><p className="text-[15px] font-medium">{h}</p><div className="mt-6 text-[15px] text-ink-2">{t}</div></div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={3} n={num(3)} lead="Evidence before opinions.">
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {[["User research & interviews", "[Add research findings]"], ["Product & market analysis", "[Add research findings]"], ["Competitive landscape", "[Add competitors reviewed and takeaways]"], ["Data analysis & funnel metrics", "[Insert screenshot or metric]"], ["Stakeholder feedback", "[Describe collaboration point]"], ["Key observations & synthesis", "[Add synthesis]"]].map(([h, t], k) => (
                <div key={h} className="grid gap-2 p-6 md:grid-cols-[40px_1fr_1.3fr]">
                  <span className="font-mono text-[11px] text-ink-3">4.{k + 1}</span>
                  <p className="text-[15px] font-medium">{d.research?.[k]?.title ?? h}</p>
                  {(() => {
                    const r = d.research?.[k];
                    if (!r || !(r.text || r.points || r.bullets || r.items || r.table || r.groups)) return <p><Ph>{t}</Ph></p>;
                    return (
                      <div className="space-y-4">
                        {r.text && <p className="text-[15px] leading-relaxed text-ink-2">{r.text}</p>}
                        {r.listLabel && <p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{r.listLabel}</p>}
                        {r.points && (
                          <ol className="space-y-2.5">
                            {r.points.map((pt, n) => (
                              <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-ink-2"><span className="pt-[3px] font-mono text-[11px] text-sage">{String(n + 1).padStart(2, "0")}</span>{pt}</li>
                            ))}
                          </ol>
                        )}
                        {r.bullets && <Bullets list={r.bullets} />}
                        {r.items && (
                          <ul className="space-y-2.5">
                            {r.items.map(([name, note]) => (
                              <li key={name} className="text-[15px] leading-relaxed text-ink-2"><span className="font-medium text-ink">{name}:</span> {note}</li>
                            ))}
                          </ul>
                        )}
                        {r.tableIntro && <p className="text-[15px] leading-relaxed text-ink-2">{r.tableIntro}</p>}
                        {r.table && (
                          <div className="overflow-hidden rounded-md border border-line">
                            <table className="w-full text-left text-[14px]">
                              <thead className="bg-paper-2">
                                <tr>{r.table.head.map((th) => <th key={th} className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-[.12em] text-ink-3">{th}</th>)}</tr>
                              </thead>
                              <tbody className="divide-y divide-line">
                                {r.table.rows.map(([stage, metric]) => (
                                  <tr key={stage}><td className="px-4 py-2.5 font-medium text-ink">{stage}</td><td className="px-4 py-2.5 text-ink-2">{metric}</td></tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {r.groups && (
                          <div className="space-y-5">
                            {r.groups.map((g) => (
                              <div key={g.title} className="space-y-2.5">
                                <p className="text-[15px] font-medium text-ink">{g.title}</p>
                                {g.text && <p className="text-[15px] leading-relaxed text-ink-2">{g.text}</p>}
                                {g.label && <p className="text-[14px] italic text-ink-3">{g.label}</p>}
                                {g.bullets && <Bullets list={g.bullets} />}
                              </div>
                            ))}
                          </div>
                        )}
                        {r.takeaway && (
                          <p className="border-l-2 border-sage pl-4 text-[15px] leading-relaxed text-ink-2"><span className="font-medium text-ink">Key takeaway:</span> {r.takeaway}</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
            {!d.hideResearchShots && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Placeholder label="[Insert screenshot] · funnel" onOpen={() => setLb("Funnel analysis")} />
                <Placeholder label="[Insert screenshot] · affinity map" onOpen={() => setLb("Research synthesis")} />
              </div>
            )}
          </CSBlock>

          <CSBlock i={4} n={num(4)}>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="group rounded-lg border border-line bg-white p-6 transition-colors duration-300 hover:border-sage/40">
                  <span className="font-serif text-[44px] leading-none text-sage/30 transition-colors group-hover:text-sage">{n}.</span>
                  <p className="mt-4 text-[16px] font-medium">[Problem identified]:</p>
                  <p className="mt-1 text-[15px] text-ink-2">[Evidence or observation]</p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={5} n={num(5)} lead="From insight → to actionable product opportunity.">
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="grid items-center gap-3 rounded-lg border border-line bg-white p-5 md:grid-cols-[1fr_32px_1fr]">
                  <p className="text-[15px] text-ink-2"><span className="mr-2 font-mono text-[11px] text-ink-3">INSIGHT {n}</span>[Insight summary]</p>
                  <Arrow className="hidden text-sage md:block" />
                  <p className="text-[15px] font-medium"><span className="mr-2 font-mono text-[11px] font-normal text-sage">OPPORTUNITY</span>[Product opportunity]</p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={6} n={num(6)}>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
              {[["Problem", d.thinking?.[0] ?? "[What we're solving]"], ["Hypothesis", d.thinking?.[1] ?? "If we [change], then [users] will [behaviour], measured by [metric]."], ["Product solution", d.thinking?.[2] ?? "[The bet we chose]"]].map(([h, t], k) => (
                <div key={h} className={`p-6 ${k === 2 ? "bg-ink text-paper" : "bg-white"}`}>
                  <p className={`font-mono text-[11px] uppercase tracking-[.12em] ${k === 2 ? "text-paper/50" : "text-ink-3"}`}>{String(k + 1).padStart(2, "0")} · {h}</p>
                  <p className="mt-6 text-[16px] leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div><p className="text-[15px] font-medium">Decision logic</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d.decisionLogic ?? "[Options considered, what was rejected, and why.]"}</p></div>
              <div><p className="text-[15px] font-medium">Business case & expected outcomes</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d.businessCase ?? "[Expected user and business outcomes.]"}</p>
                {d.expectedOutcomes && (
                  <>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[.12em] text-sage">Expected outcomes</p>
                    <ul className="mt-3 space-y-2">
                      {d.expectedOutcomes.map((o) => <li key={o} className="flex items-center gap-3 text-[15px] text-ink-2"><span className="size-1 shrink-0 rounded-full bg-sage" />{o}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </CSBlock>

          <CSBlock i={7} n={num(7)}>
            <Placeholder label="[Insert flow diagram]" ratio="aspect-[16/7]" onOpen={() => setLb("Product flow")} />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {["Screen A", "Screen B", "Screen C"].map((s) => <Placeholder key={s} label="[Insert screenshot]" ratio="aspect-[9/16]" dense onOpen={() => setLb(s)} />)}
            </div>
            <div className="mt-8"><P>[Explain each key product decision and how it ties back to the business case and user need.]</P></div>
          </CSBlock>

          <CSBlock i={8} n={num(8)}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[["Product team", "What strategy did you drive?"], ["Engineering", "How did you align on feasibility and roadmap?"], ["Design", "How did you guide the execution?"], ["Business stakeholders", "What outcomes did you commit to?"]].map(([r0, q0], k) => { const o = d.collab?.[k] ?? {}; const r = o.role ?? r0; const q = o.question ?? q0; return (
                <div key={r0} className="rounded-lg border border-line bg-white p-6">
                  <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-sage-soft font-mono text-[11px] text-sage">{o.initials ?? r.split(" ").map((w) => w[0]).join("")}</span><p className="text-[16px] font-medium">{r}</p></div>
                  <p className="mt-4 font-serif text-[15.5px] italic text-ink-3">{q}</p>
                  {o.text === "" ? null : o.text ? <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{o.text}</p> : <p className="mt-2"><Ph>[Describe collaboration point]</Ph></p>}
                </div>
              ); })}
            </div>
          </CSBlock>

          <CSBlock i={9} n={num(9)}>
            <div className="rounded-lg bg-ink p-8 text-paper">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">North Star Metric</p>
              <p className="mt-3 text-[28px] font-medium tracking-tight">[Add metric]</p>
            </div>
            <div className="mt-px grid divide-y divide-line rounded-b-lg border border-t-0 border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {["Supporting KPI", "Supporting KPI", "Guardrail"].map((k, n) => (
                <div key={n} className="p-6"><p className="font-mono text-[11px] uppercase text-ink-3">{k}</p><p className="mt-3 text-[20px] font-medium">[Add metric]</p><p className="mt-1 text-[13px] text-ink-3">Baseline → target</p></div>
              ))}
            </div>
            <p className="mt-6 text-[15px] text-ink-2"><span className="font-medium text-ink">Success criteria:</span> [What would "success" look like?]</p>
          </CSBlock>

          <CSBlock i={10} n={num(10)}>
            <div className="space-y-4">
              {[["Expected impact", "[description]"], ["Success criteria", "[description]"], ["What changed after this shipped?", "[Narrative — what users and the team did differently.]"]].map(([h, d]) => (
                <div key={h} className="grid gap-2 border-b border-line pb-4 md:grid-cols-[260px_1fr]"><p className="text-[15px] font-medium">{h}</p><p className="text-[15px] text-ink-2">{d}</p></div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={11} n={num(11)}>
            <div className="rounded-lg border border-sage/30 bg-sage-soft p-8">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-sage">What I learned as a product leader</p>
              <p className="mt-4 font-serif text-[23px] leading-snug">[2–3 sentences specific to {c.name}: a product decision you'd make differently, a cross-functional lesson, and what it taught you about impact.]</p>
            </div>
          </CSBlock>

          <a href={`#/case/${next.slug}`} className="group mt-10 flex items-center justify-between rounded-lg border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(18,22,20,.3)]">
            <div><p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Next case study</p><p className="mt-2 text-[24px] font-semibold tracking-tight">{next.name}</p></div>
            <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:bg-ink group-hover:text-paper"><Arrow /></span>
          </a>
        </article>
      </div>
      <Footer />
      <Lightbox label={lb} onClose={() => setLb(null)} />
    </div>
  );
}

/* ───────────── Alice Blue Super App (bespoke case study) ───────────── */

const SA_SECTIONS = [
  "Project overview",
  "Business context",
  "Product scope",
  "Planning & roadmap",
  "Execution & delivery",
  "Stakeholders",
  "Quality & bug triage",
  "Milestones & release",
  "Measurement",
  "Outcome",
  "Key learnings",
  "Portfolio summary",
];

function SABlock({ k, children, lead }: { k: number; children: ReactNode; lead?: string }) {
  return (
    <section id={`sa${k}`} className="reveal scroll-mt-24 border-t border-line py-16 first:border-t-0 first:pt-0">
      <p className="font-mono text-[12px] text-sage">{String(k + 1).padStart(2, "0")} —</p>
      <h2 className="mt-2 text-[30px] font-medium tracking-[-.02em] sm:text-[36px]">{SA_SECTIONS[k]}</h2>
      {lead && <p className="mt-4 max-w-[640px] font-serif text-[20px] italic leading-snug text-ink-2">{lead}</p>}
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}

const H3 = ({ children }: { children: ReactNode }) => <h3 className="pt-4 text-[19px] font-medium tracking-[-.01em]">{children}</h3>;

const Note = ({ label = "Note", children }: { label?: string; children: ReactNode }) => (
  <p className="max-w-[680px] border-l-2 border-sage pl-4 text-[15px] leading-relaxed text-ink-2"><span className="font-medium text-ink">{label}:</span> {children}</p>
);

function DataTable({ head, rows, first = "font-medium text-ink" }: { head: string[]; rows: ReactNode[][]; first?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[520px] text-left text-[14px]">
        <thead className="bg-paper-2">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[.12em] text-ink-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, n) => (
            <tr key={n}>{r.map((cell, j) => <td key={j} className={`px-4 py-3 align-top leading-relaxed ${j === 0 ? first : "text-ink-2"}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SA_PRODUCTS: [string, string, boolean, boolean][] = [
  // name, modules, CodiFi delivery stream, draft definition
  ["Stocks", "Dashboard, watchlist, orders, portfolio, IPO and funds", true, false],
  ["Mutual Funds", "Fund discovery, SIPs, portfolio and order book", false, false],
  ["F&O", "Option chain, positions, screeners and trading ideas", true, false],
  ["eKYC", "Account opening, verification and status tracking", false, false],
  ["Insurance", "Plan discovery, purchase, policies and claims", false, true],
  ["Wealth", "Net worth, goals, portfolio and reports", true, true],
  ["1LY Algos", "Strategies, signals, marketplace and orders", true, false],
  ["Ask ANT", "Conversational insights, screeners and portfolio queries", true, false],
];

const SA_LIFECYCLE: [string, string][] = [
  ["Product requirements and design", "Alice Blue Product and Design defined product intent, user journeys, business rules, screens and acceptance criteria."],
  ["Design handoff", "Design files and requirements were shared with development team, with handoff and receipt tracked."],
  ["Technical review and estimation", "Development team reviewed feasibility, APIs, backend dependencies, third-party integrations, edge cases and effort."],
  ["Clarification and design closure", "Open questions and dependencies were resolved, requirements updated and designs signed off by both teams."],
  ["Development", "Engineering implemented the agreed functionality against the signed-off requirements."],
  ["Internal QA", "CodiFi validated functionality, API integrations, UI behaviour, error handling, devices and regression."],
  ["Alice Blue UAT", "Product and QA teams validated the build against requirements, business logic and acceptance criteria."],
  ["Defect resolution", "Issues were logged, prioritised, fixed and revalidated through regression testing."],
  ["Release readiness", "The teams reviewed outstanding defects and completed the release-readiness checklist."],
];

const SA_ARTEFACTS: [string, string, string?][] = [
  ["Spreadsheet", "Product-wise roadmap", "https://docs.google.com/spreadsheets/d/1ak3k2MuYqOEc2V2ApiZ_AY8OpHVtekOV6Vl_ETg_e7Y/edit?usp=sharing"],
  ["Spreadsheet", "CodiFi execution roadmap", "https://docs.google.com/spreadsheets/d/1DMDBrW3AZDEUOZxW3FUNVxoSt2y8EoZHPZvqF6qvTmk/edit?usp=sharing"],
  ["Spreadsheet", "QC & bug tracker"],
  ["Document", "Product requirements (PRD)", "https://docs.google.com/document/d/1xmnbgo4bJKTlCiUHeOoLEA7HsH-djgaKHSFoFQrlhbg/edit?usp=sharing"],
];

function SuperAppCase({ i, onProgress }: { i: number; onProgress: (p: number) => void }) {
  const c = CASES[i];
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<string | null>(null);
  const next = CASES[(i + 1) % CASES.length];
  const heroLabel = `${c.name} — hero`;

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      onProgress(Math.min(1, h.scrollTop / (h.scrollHeight - h.clientHeight || 1)));
      let cur = 0;
      SA_SECTIONS.forEach((_, k) => {
        const el = document.getElementById(`sa${k}`);
        if (el && el.getBoundingClientRect().top < 160) cur = k;
      });
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); onProgress(0); };
  }, [i, onProgress]);

  const meta: [string, string][] = [
    ["Industry", "Fintech · Stockbroking · Wealth Management"],
    ["Platforms", "Mobile App and Web"],
    ["Execution period", "July 29 – October 30, 2026"],
    ["Delivery partners", "Alice Blue and CodiFi"],
  ];

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-[1240px] px-6 pt-10 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
          <a href="#/" className="hover:text-ink">Home</a><span>/</span>
          <button onClick={() => { window.location.hash = "#/"; setTimeout(() => scrollToId("work"), 60); }} className="hover:text-ink">Work</button><span>/</span>
          <span className="text-ink">{c.name}</span>
        </nav>
        <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[.14em] text-sage">Product Management · Product Strategy · Roadmap Execution · Cross-functional Delivery</p>
            <h1 className="mt-6 text-[42px] font-semibold leading-[1.02] tracking-[-.035em] sm:text-[64px]">Alice Blue Super App: Managing Design Handoffs, Reviews &amp; Execution</h1>
            <p className="mt-6 max-w-[640px] text-[18px] leading-relaxed text-ink-2">Product execution across eight financial product areas: roadmap tracking, design handoffs, engineering coordination, QA and release readiness, on mobile and web.</p>
          </div>
          <dl className="grid grid-cols-2 gap-5 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {meta.map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1 text-[14px] leading-snug">{v}</dd></div>
            ))}
            <div className="col-span-2"><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">My role</dt><dd className="mt-1 text-[14px] leading-snug">Product planning, design coordination, roadmap tracking, cross-functional execution and quality review.</dd></div>
          </dl>
        </div>
        <Placeholder label={`${c.name} desktop and mobile screens`} ratio="aspect-[21/9]" src={superAppHero} onOpen={() => setLb(heroLabel)} />
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pt-20 pb-10 lg:grid-cols-[220px_1fr] lg:gap-20 lg:px-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">On this page</p>
            <ol className="space-y-0.5 border-l border-line">
              {SA_SECTIONS.map((s, k) => (
                <li key={s}>
                  <button onClick={() => scrollToId(`sa${k}`)} className={`-ml-px flex w-full gap-3 border-l py-1.5 pl-4 text-left text-[13.5px] transition-colors duration-200 ${active === k ? "border-sage text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                    <span className="pt-px font-mono text-[11px]">{String(k + 1).padStart(2, "0")}</span>{s}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="sticky top-16 z-30 -mx-6 -mt-12 border-b border-line bg-paper/90 px-6 py-3 backdrop-blur lg:hidden">
          <select value={active} onChange={(e) => scrollToId(`sa${e.target.value}`)} className="w-full bg-transparent font-mono text-[12px]">
            {SA_SECTIONS.map((s, k) => <option key={s} value={k}>{String(k + 1).padStart(2, "0")} — {s}</option>)}
          </select>
        </div>

        <article className="min-w-0">
          {/* 01 */}
          <SABlock k={0}>
            <P>{c.context}</P>
            <P>The initiative covered the evolution of existing Alice Blue experiences across Stocks, Mutual Funds, F&amp;O, eKYC, Insurance, Wealth, 1LY Algos and Ask ANT.</P>
            <P>The objective was to create a consistent experience across mobile and web while coordinating multiple product workstreams, design dependencies, engineering delivery, QA, UAT and deployment readiness within a defined execution timeline.</P>
            <blockquote className="max-w-[680px] border-l-2 border-sage pl-6 font-serif text-[22px] leading-snug">Rather than treating this as a standalone UI revamp, the initiative required product-level coordination across eight product areas, multiple teams and a phased delivery plan.</blockquote>
          </SABlock>

          {/* 02 */}
          <SABlock k={1} lead="From individual product experiences to one connected platform.">
            <P>Alice Blue’s strategy was to expand its core trading experience into a broader financial services ecosystem. The Super App initiative supported three strategic objectives:</P>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Ecosystem expansion", "Bring trading, investing, wealth management, onboarding and financial services into one platform."],
                ["Customer experience improvement", "Create consistent navigation and interaction patterns across products and platforms."],
                ["Product adoption", "Make it easier for customers to discover and access multiple services within the Alice Blue ecosystem."],
              ].map(([h, t], n) => (
                <div key={h} className="rounded-lg border border-line bg-white p-6">
                  <span className="font-mono text-[11px] text-sage">{String(n + 1).padStart(2, "0")}</span>
                  <p className="mt-3 text-[16px] font-medium">{h}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t}</p>
                </div>
              ))}
            </div>
            <P>The strategic shift was from delivering individual product experiences independently to managing them as connected parts of one larger platform.</P>
          </SABlock>

          {/* 03 */}
          <SABlock k={2}>
            <P>The roadmap covered eight product areas, each with its own modules, delivery dependencies and release sequence.</P>
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="bg-ink px-6 py-6 text-paper">
                <p className="text-[20px] font-semibold tracking-tight">Alice Blue Super App</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[.14em] text-paper/55">Connected financial services ecosystem</p>
              </div>
              <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
                {SA_PRODUCTS.map(([name, mods], n) => (
                  <div key={name} className="flex flex-col bg-white p-5">
                    <span className="font-mono text-[11px] text-ink-3">{String(n + 1).padStart(2, "0")}</span>
                    <p className="mt-2 text-[16px] font-medium">{name}</p>
                    <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-2">{mods}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-ink-3">Product scope based on the product-wise roadmap. Insurance and Wealth module definitions were marked as draft and pending confirmation in the roadmap.</p>
            <P>The product scope was not identical across every execution document. The CodiFi delivery roadmap defined five primary delivery streams: Stocks, F&amp;O, Ask ANT, 1LY Algos and Wealth. The broader product-wise roadmap additionally tracked Mutual Funds, eKYC and Insurance.</P>
            <Note label="Why it matters">The wider ecosystem scope and the partner delivery scope had different workstream boundaries.</Note>
          </SABlock>

          {/* 04 */}
          <SABlock k={3} lead="Keep one dependency from delaying the whole programme.">
            <P>One of the main product management challenges was coordinating several product workstreams without allowing dependencies in one area to delay the entire programme. The execution plan was structured around:</P>
            <FlowChain steps={["Prioritisation", "Mobile & web tracks", "Phased waves", "Design sign-off", "Development", "QA & UAT", "Release readiness"]} />
            <H3>Prioritisation and delivery waves</H3>
            <P>The development execution roadmap used four priority waves.</P>
            <DataTable
              head={["Priority", "Product", "Delivery wave"]}
              first=""
              rows={[["P0", "Stocks", "Wave 1"], ["P0", "F&O", "Wave 2"], ["P1", "Ask ANT", "Wave 3"], ["P1", "1LY Algos", "Wave 3"], ["P2", "Wealth", "Wave 4"]].map(([p, prod, w]) => [
                <Tag key={p} tone={p === "P0" ? "sage" : p === "P1" ? "neutral" : "outline"}>{p}</Tag>,
                <span key={prod} className="font-medium text-ink">{prod}</span>,
                w,
              ])}
            />
            <P>This sequencing placed core trading experiences first, followed by AI-assisted and algorithmic experiences, with Wealth scheduled as a later priority. The broader product-wise roadmap also included Mutual Funds, eKYC and Insurance with their own planned build, QA and deployment windows.</P>

            <H3>Timeline and platform planning</H3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Mobile execution", "13 weeks", "29 July – 30 October", 0],
                ["Web execution", "10 weeks", "20 August – 30 October", 23.7],
              ].map(([label, weeks, range, offset]) => (
                <div key={label as string} className="rounded-lg border border-line bg-white p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{label}</p>
                  <p className="mt-3 text-[40px] font-semibold leading-none tracking-[-.03em]">{weeks}</p>
                  <p className="mt-2 text-[14px] text-ink-2">{range}</p>
                  <div className="relative mt-6 h-1.5 rounded-full bg-paper-2">
                    <div className="absolute inset-y-0 right-0 rounded-full bg-sage" style={{ left: `${offset}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-3"><span>29 Jul</span><span>30 Oct</span></div>
                </div>
              ))}
            </div>
            <Note label="Why separate tracks mattered">Mobile execution started on July 29, while the web track began on August 20 after the Stocks and F&amp;O web designs were handed over to CodiFi. Separate timelines helped account for platform-specific design and development dependencies.</Note>
            <P>The programme was planned around a hard completion milestone of October 30, 2026.</P>
            <Placeholder label="Product-wise roadmap: build, QA & feedback and deployment by product" ratio="aspect-[1262/670]" src={superAppRoadmap} onOpen={() => setLb("Product-wise roadmap")} />
          </SABlock>

          {/* 05 */}
          <SABlock k={4}>
            <P>The initiative required a structured handoff between Alice Blue’s product and design teams and CodiFi’s engineering and QA teams. The delivery process established a common lifecycle for every feature.</P>
            <H3>Feature delivery lifecycle</H3>
            <ol className="divide-y divide-line rounded-lg border border-line bg-white">
              {SA_LIFECYCLE.map(([h, t], n) => (
                <li key={h} className="grid gap-2 p-5 md:grid-cols-[40px_220px_1fr]">
                  <span className="font-mono text-[11px] text-sage">{String(n + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] font-medium">{h}</p>
                  <p className="text-[15px] leading-relaxed text-ink-2">{t}</p>
                </li>
              ))}
            </ol>
            <H3>Product management responsibilities</H3>
            <P>My work within this process involved coordinating the design and delivery side of the product lifecycle:</P>
            <Bullets list={[
              "Tracking product-wise progress against the agreed roadmap.",
              "Coordinating daily and weekly discussions with the design partner.",
              "Reviewing design deliverables and communicating feedback.",
              "Aligning design requirements with developers before implementation.",
              "Following up on technical clarifications and changes affecting delivery.",
              "Coordinating with QA teams on reported issues and required fixes.",
              "Reviewing product gaps and ensuring they were communicated to the responsible teams.",
              "Supporting UAT and release-readiness follow-ups.",
            ]} />
            <P>This helped connect product requirements, design decisions and engineering execution rather than treating them as separate activities.</P>
          </SABlock>

          {/* 06 */}
          <SABlock k={5}>
            <P>The project involved coordination between internal teams and an external development partner.</P>
            <DataTable
              head={["Stakeholder", "Area of responsibility", "Coordination focus"]}
              rows={[
                ["Alice Blue Product", "Product scope and priorities", "Requirements, roadmap and delivery tracking"],
                ["Alice Blue Design", "UX and interface specifications", "Design feedback, consistency and sign-off"],
                ["CodiFi", "Engineering and implementation", "Feasibility, development and technical dependencies"],
                ["CodiFi QA", "Internal quality validation", "Functional and regression testing"],
                ["Alice Blue QA", "UAT and acceptance", "Defect reporting and verification"],
                ["Business stakeholders", "Business priorities", "Scope, timelines and release alignment"],
              ]}
            />
            <Note label="Key coordination challenge">The teams needed to maintain alignment across multiple products and platforms while design changes, technical dependencies and QA findings were being addressed in parallel.</Note>
            <P>The structured review and sign-off process helped establish clear ownership and reduced ambiguity before development moved forward.</P>
          </SABlock>

          {/* 07 */}
          <SABlock k={6}>
            <P>Quality management was an important part of the Super App execution, particularly because the initiative involved multiple complex trading and investment workflows. The QC tracker captured issues across functional behaviour, UI consistency, API integrations, navigation, data display and user interactions.</P>
            <H3>Examples of issues identified</H3>
            <DataTable
              head={["Area", "Reported issue", "Product impact"]}
              rows={[
                ["Login", "Forgot User ID flow failed at OTP stage", "Users could be blocked during account recovery"],
                ["Login", "Sensitive OTP inputs remained available through browser navigation", "Security and privacy concern"],
                ["Ticker tape", "Missing absolute point change", "Incomplete market information"],
                ["Ticker tape", "Did not pause on hover", "Difficulty reading market data"],
                ["Workspace", "Chart data became invalid when other widgets opened", "Disrupted trading workflow"],
                ["Watchlist", "Search results lacked quick Buy/Sell/Chart actions", "Additional steps to execute actions"],
                ["Order and trading workspace", "Widget resizing lag and interaction issues", "Reduced usability for active traders"],
                ["Login", "Incorrect or misleading CTA labels", "User confusion during authentication"],
              ]}
            />
            <H3>Defect severity and ownership</H3>
            <P>The CodiFi bug tracker contained 40 populated issue records:</P>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {[["20", "High severity", 50], ["16", "Medium severity", 40], ["4", "Low severity", 10]].map(([n, l, pct]) => (
                <div key={l as string} className="bg-white p-6">
                  <p className="text-[44px] font-semibold leading-none tracking-[-.03em]">{n}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{l}</p>
                  <div className="mt-5 h-1 rounded-full bg-paper-2"><div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} /></div>
                </div>
              ))}
            </div>
            <Note label="Recorded status">At the time represented in the tracker, all 40 CodiFi records were marked Open in QA and Pending Review in development status. These should be treated as recorded status, not as evidence that all issues remained unresolved at final release.</Note>
            <P>The separate Alice Blue issue sheet contained four populated observations: one was marked Closed, two were High severity and one each was Medium and Low severity.</P>
            <H3>Quality management approach</H3>
            <P>The product-side focus was to:</P>
            <ol className="space-y-2.5">
              {[
                "Review reported issues and understand their impact on user journeys.",
                "Distinguish functional defects from design, content and scope gaps.",
                "Communicate findings to the responsible design or development team.",
                "Track severity and resolution status.",
                "Verify fixes through QA and regression.",
                "Escalate critical issues affecting login, trading or financial information.",
              ].map((pt, n) => (
                <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-ink-2"><span className="pt-[3px] font-mono text-[11px] text-sage">{String(n + 1).padStart(2, "0")}</span>{pt}</li>
              ))}
            </ol>
            <P>This made bug tracking part of product delivery management rather than simply a list of visual corrections.</P>
            <Placeholder label="QC tracker: issues logged with severity, priority, dev and QA status" ratio="aspect-[1699/725]" src={superAppQc} onOpen={() => setLb("QC tracker")} />
          </SABlock>

          {/* 08 */}
          <SABlock k={7}>
            <P>The CodiFi execution plan established eight programme milestones to control progress and delivery readiness.</P>
            <DataTable
              head={["Milestone", "Planned date", "Key checkpoint"]}
              first="font-mono text-[13px] text-sage"
              rows={[
                ["M1", "29 July", "Mobile execution baseline"],
                ["M2", "20 August", "Stocks and F&O web design handover"],
                ["M3", "4 September", "Stocks mobile UAT and web review"],
                ["M4", "11 September", "First web development-ready packages"],
                ["M5", "18 September", "Mobile design sign-off completion"],
                ["M6", "9 October", "Feature freeze"],
                ["M7", "23 October", "In-window UAT completion"],
                ["M8", "30 October", "Release readiness sign-off"],
              ]}
            />
            <P>A key distinction in the programme was that <strong className="font-semibold text-ink">release readiness was not the same as production deployment</strong>. The CodiFi roadmap defined October 30 as the release-readiness sign-off milestone, while the product-wise roadmap targeted the full eight-product platform deployment by that date.</P>
            <P>This separation helped make the delivery expectations clearer across teams.</P>
          </SABlock>

          {/* 09 */}
          <SABlock k={8} lead="Success measured at both the delivery and product levels.">
            <H3>Delivery metrics</H3>
            <DataTable
              head={["Metric", "What it measures"]}
              rows={[
                ["Roadmap milestone adherence", "Progress against planned dates"],
                ["Design sign-off completion", "Readiness of requirements for development"],
                ["Development completion", "Delivery against agreed scope"],
                ["UAT completion", "Product acceptance against requirements"],
                ["Critical defect closure", "Quality and release risk"],
                ["Release readiness", "Completion of required delivery gates"],
              ]}
            />
            <H3>Product performance metrics</H3>
            <P>Following deployment, the product should also be measured through:</P>
            <Bullets list={[
              "Adoption of the new Super App experience.",
              "Usage across Stocks, Mutual Funds, F&O and other modules.",
              "Account opening to activation conversion.",
              "First fund addition and first trade conversion.",
              "Feature discovery and task completion.",
              "Repeat engagement and retention.",
              "Crash rates, error rates and customer feedback.",
            ]} />
            <Note label="Proposed measures">The supplied roadmaps and bug trackers establish the delivery plan and quality findings, but do not provide verified post-launch adoption or business performance results.</Note>
          </SABlock>

          {/* 10 */}
          <SABlock k={9}>
            <P>The project established a structured execution framework for a multi-product, multi-platform Super App initiative. The documented work included:</P>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Eight product areas tracked through a product-wise roadmap.",
                "Separate mobile and web execution plans.",
                "Priority-based delivery waves.",
                "Defined design review, development, QA and UAT stages.",
                "Eight programme-level delivery milestones.",
                "A documented defect-tracking process across development and QA.",
                "A planned October 30, 2026 completion and release-readiness milestone.",
              ].map((t) => (
                <div key={t} className="flex gap-3 rounded-lg border border-line bg-white p-5 text-[15px] leading-relaxed text-ink-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sage" />{t}
                </div>
              ))}
            </div>
            <Note label="Planned, not confirmed">The broader product-wise roadmap targeted all eight products for deployment by October 30. The CodiFi programme separately defined release readiness by that date. These are planned milestones, not confirmation of actual production deployment.</Note>
            <Placeholder label="Product & module breakdown: phase-wise timelines and module status" ratio="aspect-[897/741]" src={superAppModules} onOpen={() => setLb("Module breakdown")} />
          </SABlock>

          {/* 11 */}
          <SABlock k={10}>
            <div className="space-y-4">
              {[
                ["Managing a product programme requires more than tracking feature completion.", "I learned to look at dependencies between design, engineering, QA and business priorities, because delays or unresolved decisions in one stage can affect multiple downstream activities."],
                ["Clear ownership and sign-off are essential.", "A design being shared does not mean it is ready for development. Technical clarification, acceptance criteria and formal design closure are important checkpoints."],
                ["Quality is part of product experience.", "Issues involving login, market data, order workflows and navigation can directly affect user trust and task completion. Bug triage must therefore consider business and user impact, not just severity labels."],
              ].map(([h, t], n) => (
                <div key={h} className="grid gap-3 rounded-lg border border-line bg-white p-6 md:grid-cols-[40px_1fr]">
                  <span className="font-serif text-[32px] leading-none text-sage">{n + 1}.</span>
                  <div><p className="font-serif text-[21px] leading-snug">{h}</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t}</p></div>
                </div>
              ))}
            </div>
          </SABlock>

          {/* 12 */}
          <SABlock k={11}>
            <div className="rounded-lg bg-ink p-8 text-paper sm:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">{c.name}</p>
              <p className="mt-3 text-[26px] font-medium leading-tight tracking-tight sm:text-[30px]">Product execution across eight financial product areas</p>
              <p className="mt-5 max-w-[680px] text-[16px] leading-relaxed text-paper/70">Led and coordinated product design and delivery activities for Alice Blue’s multi-product Super App initiative across mobile and web. Worked across roadmap tracking, design handoffs, engineering coordination, stakeholder alignment, QA reviews and defect follow-ups to support a phased delivery programme with an October 2026 release-readiness target.</p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">Product management capabilities demonstrated</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Product roadmap execution", "Prioritisation", "Cross-functional collaboration", "Stakeholder management", "Requirements coordination", "Design sign-off", "QA and UAT", "Bug triage", "Release readiness"].map((t) => (
                  <span key={t} className="rounded-[4px] border border-paper/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.06em] text-paper/80">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-8">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Supporting artefacts</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {SA_ARTEFACTS.map(([kind, title, href]) => href ? (
                  <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-md border border-line px-5 py-4 transition-colors hover:border-sage/40 hover:bg-sage-soft">
                    <div><p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{kind}</p><p className="mt-1 text-[16px] font-medium">{title}</p></div>
                    <Arrow className="-rotate-45 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <div key={title} className="flex items-center justify-between rounded-md border border-dashed border-line px-5 py-4">
                    <div><p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{kind}</p><p className="mt-1 text-[16px] font-medium">{title}</p></div>
                    <span className="font-mono text-[11px] text-ink-3">[Add link]</span>
                  </div>
                ))}
              </div>
            </div>
          </SABlock>

          <a href={`#/case/${next.slug}`} className="group mt-10 flex items-center justify-between rounded-lg border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(18,22,20,.3)]">
            <div><p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Next case study</p><p className="mt-2 text-[24px] font-semibold tracking-tight">{next.name}</p></div>
            <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:bg-ink group-hover:text-paper"><Arrow /></span>
          </a>
        </article>
      </div>
      <Footer />
      <Lightbox label={lb} src={lb === heroLabel ? superAppHero : lb === "Product-wise roadmap" ? superAppRoadmap : lb === "QC tracker" ? superAppQc : lb === "Module breakdown" ? superAppModules : undefined} onClose={() => setLb(null)} />
    </div>
  );
}

/* ───────────── From eKYC to First Trade (bespoke case study) ───────────── */

const EK_SECTIONS: [string, string][] = [
  ["Context", "Account opening is only the beginning."],
  ["Problem definition", "Two connected problems."],
  ["Research approach", "Evidence before solutions."],
  ["Research synthesis", "Where customers need help."],
  ["Product thinking", "From research to product opportunities."],
  ["Activation strategy", "Connect product interventions with customer follow-up."],
  ["Prioritisation", "What should be addressed first?"],
  ["Measurement", "Define what success looks like."],
  ["Progress & outputs", "What the work has produced so far."],
  ["Key learnings", ""],
  ["Research & working files", "The detailed evidence behind this case study."],
];

function EKBlock({ k, children }: { k: number; children: ReactNode }) {
  const [title, lead] = EK_SECTIONS[k];
  return (
    <section id={`ek${k}`} className="reveal scroll-mt-24 border-t border-line py-16">
      <p className="font-mono text-[12px] text-sage">{String(k + 1).padStart(2, "0")} —</p>
      <h2 className="mt-2 text-[30px] font-medium tracking-[-.02em] sm:text-[36px]">{title}</h2>
      {lead && <p className="mt-4 max-w-[640px] font-serif text-[20px] italic leading-snug text-ink-2">{lead}</p>}
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}

const Num = ({ n }: { n: number }) => <span className="font-mono text-[11px] text-sage">{String(n).padStart(2, "0")}</span>;
const fmt = (n: number) => n.toLocaleString("en-IN");

const EK_JOURNEY = ["Lead", "eKYC", "Account opened", "App installation", "First login", "Pay-in", "First order attempt", "First successful trade"];

const EK_AUDIT: [string, string][] = [
  ["PAN Skip flow", "Selecting Skip did not redirect users to the expected guest-login experience and instead returned them to the beginning of the eKYC journey."],
  ["Incorrect KYC-success messaging", "A success message appeared at a stage where eKYC was not yet fully completed, creating confusion."],
  ["Unclear application redirection", "The end-of-eKYC CTA and subsequent app-download experience did not consistently match the user’s expectation."],
  ["Limited brand communication", "eKYC-stage emails were vendor-branded, with no corresponding Alice Blue communication at that stage."],
  ["Guest-login and mid-funnel gaps", "Users who entered guest login or dropped out midway did not have a complete nurturing journey."],
];

const EK_REJECTIONS: [string, number][] = [
  ["No rejection reason recorded", 28040],
  ["Insufficient funds / margin", 7195],
  ["Exchange / segment / security permission", 2517],
  ["Other / needs review", 2063],
  ["Market timing / session restriction", 1056],
  ["Order type / price / quantity restriction", 904],
  ["System / technical issue", 213],
  ["Account / PAN / KYC validation", 156],
  ["Order cancellation / exchange response", 81],
];

const EK_CAMPAIGNS: [string, number, number, number][] = [
  ["Diwali dormant", 518, 427, 10],
  ["Diwali pay-in", 5599, 4555, 164],
  ["Diwali trade", 668, 536, 53],
  ["Pay-in follow-up", 4554, 3859, 62],
  ["Trade follow-up", 536, 488, 16],
];

const EK_STATES: [string, string, string][] = [
  ["Account opened, no first login", "The user has an opened account but has not yet accessed the application.", "Improve app discovery, login guidance and account-opening follow-up."],
  ["Logged in, no pay-in", "The user has accessed the product but has not added funds.", "Explain the funding process, available payment options and relevant next steps."],
  ["Pay-in completed, no first trade", "The user has funded the account but has not completed a successful first trade.", "Understand whether the user needs platform guidance, instrument discovery, margin clarity or human assistance."],
  ["Order attempted, not successfully executed", "The user has shown trading intent but has encountered a barrier during order placement.", "Investigate the actual rejection reason and provide contextual recovery rather than a generic error message."],
  ["First trade completed", "The user has completed the initial activation milestone.", "Move the customer into a separate repeat-trade and engagement journey instead of continuing first-trade nudges."],
];

function EkycCase({ i, onProgress }: { i: number; onProgress: (p: number) => void }) {
  const c = CASES[i];
  const [active, setActive] = useState(-1);
  const [lb, setLb] = useState<string | null>(null);
  const next = CASES[(i + 1) % CASES.length];
  const heroLabel = `${c.name} — hero`;

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      onProgress(Math.min(1, h.scrollTop / (h.scrollHeight - h.clientHeight || 1)));
      let cur = -1;
      EK_SECTIONS.forEach((_, k) => {
        const el = document.getElementById(`ek${k}`);
        if (el && el.getBoundingClientRect().top < 160) cur = k;
      });
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); onProgress(0); };
  }, [i, onProgress]);

  const meta: [string, string][] = [
    ["Research period", "August – November 2026"],
    ["Platforms", "Android · iOS · Web"],
    ["Role", "Product Research · Journey Audit · Funnel Analysis · Product Opportunity Planning"],
    ["Cross-functional areas", "Product, Design, eKYC/Quality, DWH, CRM/Campaigns and Business Operations"],
  ];
  const maxRej = EK_REJECTIONS[0][1];

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-[1240px] px-6 pt-10 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
          <a href="#/" className="hover:text-ink">Home</a><span>/</span>
          <button onClick={() => { window.location.hash = "#/"; setTimeout(() => scrollToId("work"), 60); }} className="hover:text-ink">Work</button><span>/</span>
          <span className="text-ink">{c.name}</span>
        </nav>
        <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">{c.tags.map((t) => <Tag key={t} tone="sage">{t}</Tag>)}</div>
            <h1 className="mt-6 text-[42px] font-semibold leading-[1.02] tracking-[-.035em] sm:text-[64px]">{c.name}</h1>
            <p className="mt-4 text-[18px] font-medium tracking-[-.01em] text-ink-2 sm:text-[20px]">Product Research, Activation Analysis &amp; First-Trade Improvement Strategy</p>
            <p className="mt-6 max-w-[620px] font-serif text-[22px] italic leading-snug text-ink">How can Alice Blue help more newly opened customers progress from account verification to their first successful trade?</p>
          </div>
          <dl className="grid grid-cols-2 gap-5 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {meta.map(([k, v], n) => (
              <div key={k} className={n > 1 ? "col-span-2" : ""}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1 text-[14px] leading-snug">{v}</dd></div>
            ))}
          </dl>
        </div>
        <Placeholder label="End-to-end activation funnel journey map" ratio="aspect-[1043/557]" src={ekycHero} onOpen={() => setLb(heroLabel)} />
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pt-20 pb-10 lg:grid-cols-[220px_1fr] lg:gap-20 lg:px-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">On this page</p>
            <ol className="space-y-0.5 border-l border-line">
              {EK_SECTIONS.map(([s], k) => (
                <li key={s}>
                  <button onClick={() => scrollToId(`ek${k}`)} className={`-ml-px flex w-full gap-3 border-l py-1.5 pl-4 text-left text-[13.5px] transition-colors duration-200 ${active === k ? "border-sage text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                    <span className="pt-px font-mono text-[11px]">{String(k + 1).padStart(2, "0")}</span>{s}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          {/* Overview */}
          <section className="reveal pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Project overview</p>
            <div className="mt-6 space-y-5">
              <P>This project examined the customer journey from eKYC and account opening through app installation, login, account funding and order execution. The objective was to identify where customers were getting stuck, understand the reasons behind activation drop-offs, and translate those findings into product and operational improvements.</P>
              <P>Rather than treating first-trade conversion as a campaign problem alone, the research examined the complete activation experience, including product usability, customer behaviour, communication gaps, trading permissions and order-rejection barriers.</P>
            </div>
          </section>

          {/* 01 Context */}
          <EKBlock k={0}>
            <P>Alice Blue’s customer journey does not end when an account is successfully opened. A newly registered customer still needs to understand how to access the platform, complete the initial setup, add funds, discover trading opportunities and place an order successfully.</P>
            <p className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">The broader activation journey</p>
            <FlowChain steps={EK_JOURNEY} />
            <P>Each transition represents an opportunity for the customer to progress, or drop off. The initial activation audit focused on the onboarding and communication experience. The subsequent first-trade research extended the investigation into customer behaviour, funding activity, order failures and product-level barriers.</P>
            <div className="rounded-lg bg-ink p-8 text-paper">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">The central question</p>
              <p className="mt-4 font-serif text-[22px] leading-snug sm:text-[24px]">Are customers failing to reach their first trade because they are not engaging with the product, because they do not understand the next step, or because the product is preventing them from completing an order?</p>
            </div>
          </EKBlock>

          {/* 02 Problem */}
          <EKBlock k={1}>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
              {[
                ["User problem", "Newly opened customers may not know what to do after completing account opening. Some do not log in or add funds. Others reach the trading platform but encounter unclear requirements, insufficient margin, inactive trading segments or confusing order errors.", "Without relevant guidance at the point of friction, customers may stop before completing their first successful trade."],
                ["Business problem", "Alice Blue acquires and opens customer accounts, but account opening alone does not translate into active trading. The business needs to understand which customers are progressing, where they are dropping off and which barriers are preventing first-trade completion.", "Improving this journey requires more than increasing communication frequency. It requires identifying the actual customer barrier and addressing it through the appropriate product, operational or engagement intervention."],
              ].map(([h, a, b]) => (
                <div key={h} className="space-y-3 bg-white p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{h}</p>
                  <p className="text-[15.5px] leading-relaxed text-ink-2">{a}</p>
                  <p className="text-[15.5px] leading-relaxed text-ink-2">{b}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">How might we</p>
              <blockquote className="mt-3 border-l-2 border-sage pl-6 font-serif text-[22px] leading-snug">How might we identify and resolve the barriers preventing newly opened customers from progressing through login, funding and order placement, so that more eligible customers can complete their first successful trade with a clearer and more reliable experience?</blockquote>
            </div>
          </EKBlock>

          {/* 03 Research */}
          <EKBlock k={2}>
            <P>The investigation was structured across five areas.</P>
            <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-5">
              {["Onboarding & eKYC audit", "Activation & communication audit", "First-trade data analysis", "Rejection analysis", "Feedback & campaigns"].map((t, n) => (
                <li key={t} className="bg-white p-4"><span className="font-mono text-[11px] text-sage">3.{n + 1}</span><p className="mt-2 text-[13.5px] font-medium leading-snug">{t}</p></li>
              ))}
            </ol>

            <H3>3.1 Existing onboarding and eKYC audit</H3>
            <P>I reviewed the onboarding journey to understand how users move from eKYC initiation to account opening and application exploration.</P>
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {EK_AUDIT.map(([h, t], n) => (
                <div key={h} className="grid gap-2 p-5 md:grid-cols-[40px_220px_1fr]"><Num n={n + 1} /><p className="text-[15px] font-medium">{h}</p><p className="text-[15px] leading-relaxed text-ink-2">{t}</p></div>
              ))}
            </div>
            <P>These findings showed that some customers could be interrupted before reaching the trading application itself.</P>

            <H3>3.2 Activation journey and communication audit</H3>
            <P>I reviewed the communication journey across account opening, app installation, login, pay-in and first trade. The audit covered:</P>
            <div className="flex flex-wrap gap-2">
              {["Audience and trigger conditions", "WhatsApp, email, SMS and push availability", "Communication timing and frequency", "CTA relevance and destination", "Deep-link behaviour", "Campaign automation and ownership"].map((t) => <Tag key={t} tone="outline">{t}</Tag>)}
            </div>
            <P>The review highlighted a strong dependence on WhatsApp, partial email coverage, inactive push notifications and limited in-app guidance. It also identified gaps in the coordination of LeadSquared, CleverTap, Netcore and OneLink. Different systems handled different parts of the journey, while some campaign and engagement activities still required manual execution.</P>
            <Note label="Research takeaway">Communication was available across several stages, but the customer experience was not yet a consistently connected, behaviour-based activation journey.</Note>

            <H3>3.3 First-trade data analysis</H3>
            <P>The investigation then moved beyond the onboarding audit to examine customer records and trading behaviour. I worked with the DWH lead-stuck data and organised the source data into a structured Excel workbook, preserving the raw records and creating separate B2B and B2C views for analysis.</P>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {[["42,223", "Unique client IDs"], ["33,880", "B2B clients"], ["8,343", "B2C clients"]].map(([n, l]) => (
                <div key={l} className="bg-white p-6"><p className="text-[36px] font-semibold leading-none tracking-[-.03em]">{n}</p><p className="mt-2 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{l}</p></div>
              ))}
            </div>
            <DataTable
              head={["Dataset view", "Records"]}
              rows={[["Total source data rows", "42,225"], ["Populated, unique CLIENT_IDs", "42,223"], ["B2B clients", "33,880"], ["B2C clients", "8,343"], ["Blank source rows retained", "2"]].map(([a, b]) => [a, <span key={a} className="tabular-nums">{b}</span>])}
            />
            <p className="font-mono text-[11px] leading-relaxed text-ink-3">The B2B and B2C breakdown represents the classification available in the source export. It is a starting point for comparative analysis, not a confirmation that every record is an eligible first-trade target.</p>
            <P>The analysis was structured around fields including:</P>
            <div className="grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              <Bullets list={["Account and UCC response dates.", "First and last trade dates.", "First and last login dates.", "Total login activity.", "First and last pay-in dates."]} />
              <Bullets list={["Number and amount of pay-ins.", "B2B/B2C classification.", "First-trade classification.", "Trade-failure status and rejected-order counts.", "Rejection reasons and account verification fields."]} />
            </div>
            <P>The purpose was to move from a single large lead list towards a clearer understanding of customer status and behaviour.</P>

            <H3>3.4 First-trade rejection analysis</H3>
            <P>A key part of the research was understanding what happens when a customer attempts to place an order but does not successfully execute it. The DWH analysis grouped rejection-related records into the following categories:</P>
            <div className="rounded-lg border border-line bg-white p-6">
              <div className="mb-4 flex justify-between font-mono text-[11px] uppercase tracking-[.12em] text-ink-3"><span>Rejection category</span><span>Records reported</span></div>
              <ul className="space-y-3.5">
                {EK_REJECTIONS.map(([l, v], n) => (
                  <li key={l}>
                    <div className="flex items-baseline justify-between gap-4 text-[14px]"><span className={n === 0 ? "text-ink-3" : "text-ink"}>{l}</span><span className="tabular-nums font-medium">{fmt(v)}</span></div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-paper-2"><div className={`h-full rounded-full ${n === 0 ? "bg-ink-3/30" : "bg-sage"}`} style={{ width: `${Math.max(0.6, (v / maxRej) * 100)}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[15px] font-medium">What this indicated</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Funding and margin clarity", "Customers may have funds in their account but insufficient margin for a particular order, or may not understand the required amount before placing it."],
                ["Trading permissions", "A customer may be ready to trade but unable to proceed because the required exchange or trading segment is not enabled."],
                ["Order execution experience", "Market-session restrictions, AMO handling and order-validation errors can interrupt the first-order journey."],
              ].map(([h, t], n) => (
                <div key={h} className="rounded-lg border border-line bg-white p-6"><Num n={n + 1} /><p className="mt-3 text-[16px] font-medium">{h}</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t}</p></div>
              ))}
            </div>
            <P>The large number of records without a recorded rejection reason also highlighted a data-quality opportunity: improving the completeness and clarity of rejection classification.</P>
            <Note label="Data interpretation">The rejection figures are the categories reported in the DWH presentation. They should not be interpreted as confirmed unique customers who lost their first trade. The final first-trade analysis needs to isolate rejection events before first successful execution, validate the cohort period and distinguish customers from order events.</Note>

            <H3>3.5 Customer feedback and campaign performance</H3>
            <P>To complement the data analysis, I reviewed the WhatsApp account-setup survey and recent activation campaign results.</P>
            <div className="rounded-lg border border-line bg-white p-6">
              <div className="flex items-baseline justify-between"><p className="text-[15px] font-medium">Account-setup survey</p><p className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">75 responses</p></div>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full">
                <div className="bg-sage" style={{ width: `${(46 / 75) * 100}%` }} />
                <div className="bg-sage/45" style={{ width: `${(15 / 75) * 100}%` }} />
                <div className="bg-ink-3/30" style={{ width: `${(14 / 75) * 100}%` }} />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[["46", "Said the steps after account opening were clear", "bg-sage"], ["15", "Said they needed help getting started", "bg-sage/45"], ["14", "Needed clarification", "bg-ink-3/30"]].map(([n, l, dot]) => (
                  <div key={l} className="flex gap-3"><span className={`mt-2 size-2 shrink-0 rounded-full ${dot}`} /><div><p className="text-[24px] font-semibold leading-none tracking-tight">{n}</p><p className="mt-1.5 text-[13.5px] leading-snug text-ink-2">{l}</p></div></div>
                ))}
              </div>
            </div>
            <P>However, a technical issue prevented users from progressing to the second survey question. This limited the feedback available on specific assistance requirements and preferred support channels.</P>
            <P>The November campaign review showed that messages could reach and engage a large audience, but click-through activity remained comparatively low.</P>
            <DataTable
              head={["Campaign", "Sent", "Delivered", "Clicked", "Click rate*"]}
              rows={EK_CAMPAIGNS.map(([n, s, d, cl]) => [n, fmt(s), fmt(d), fmt(cl), <span key={n} className="font-medium text-ink">{((cl / d) * 100).toFixed(1)}%</span>])}
            />
            <p className="font-mono text-[11px] text-ink-3">* Click rate calculated as clicked ÷ delivered.</p>
            <P>The campaign results suggested that communication reach alone was not enough to ensure users progressed towards their first trade. This reinforced the need to connect communication with the actual product journey: a user who has not added funds needs a different intervention from someone who has funded their account but is facing an order rejection.</P>
          </EKBlock>

          {/* 04 Synthesis */}
          <EKBlock k={3}>
            <P>The research brought together the onboarding audit, activation data, customer feedback and order-rejection observations. It highlighted five customer states that require different responses.</P>
            <ol className="relative space-y-3">
              {EK_STATES.map(([h, what, opp], n) => (
                <li key={h} className={`grid gap-4 rounded-lg border p-6 md:grid-cols-[48px_1fr_1fr] ${n === 4 ? "border-sage/30 bg-sage-soft" : "border-line bg-white"}`}>
                  <span className="grid size-9 place-items-center rounded-full border border-line bg-paper font-mono text-[12px] text-sage">{n + 1}</span>
                  <div><p className="text-[16px] font-medium">{h}</p><p className="mt-2 text-[14.5px] leading-relaxed text-ink-2"><span className="font-mono text-[10.5px] uppercase tracking-[.12em] text-ink-3">What may be happening · </span>{what}</p></div>
                  <p className="text-[14.5px] leading-relaxed text-ink-2 md:border-l md:border-line md:pl-6"><span className="mb-1 block font-mono text-[10.5px] uppercase tracking-[.12em] text-sage">Opportunity</span>{opp}</p>
                </li>
              ))}
            </ol>
            <P>These states form the foundation for behaviour-based activation and more relevant product interventions.</P>
          </EKBlock>

          {/* 05 Product thinking */}
          <EKBlock k={4}>
            <P>The research indicated that different customer barriers require different solutions. I translated the findings into three key product opportunities.</P>
            {[
              {
                t: "Pre-trade margin clarity",
                problem: <p>A customer may select an instrument and attempt to place an order without clearly understanding the margin required. A rejection at this point can interrupt the experience and create uncertainty about how much additional funding is needed.</p>,
                improve: <><p>Introduce a pre-trade margin health check that displays:</p><div className="mt-3"><Bullets list={["Required margin.", "Available margin.", "Shortfall amount.", "A contextual Add Funds action.", "An alternative financing route, where the product and customer are eligible."]} /></div></>,
                exp: "Instead of showing a generic insufficient-margin error after an order attempt, explain the shortfall before submission and help the user decide what to do next.",
                measures: ["Margin-related rejection rate", "Pay-in-to-first-trade conversion", "Order completion rate"],
              },
              {
                t: "Smart trading-segment activation",
                problem: <><p>A customer may have funds and trading intent but be unable to place an order because the required exchange or trading segment has not been activated.</p><p className="mt-3">The user may not understand why the order is being rejected or where to enable the missing permission.</p></>,
                improve: <><p>Introduce contextual segment activation within the order journey.</p><ol className="mt-3 space-y-2">{["Detect the instrument and required segment.", "Check whether the customer’s segment is active.", "Explain the missing permission before the order fails.", "Offer an activation action.", "Return the customer to the original instrument or order screen after successful activation."].map((s, n) => <li key={s} className="flex gap-3"><Num n={n + 1} />{s}</li>)}</ol></>,
                exp: "The order should not be submitted automatically after activation; the user must review and confirm it.",
                measures: ["Permission-related rejection rate", "Activation completion rate", "First-order success rate"],
              },
              {
                t: "Better AMO experience",
                problem: <><p>When attempting an order outside regular market hours, the Alice Blue error message, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[12.5px] text-ink">Transaction not allowed in current state END_OF_DAY</code>, does not clearly explain the market-closed condition.</p><p className="mt-3">The user also needs to manually select AMO, creating another decision in the order flow.</p><p className="mt-3"><span className="font-medium text-ink">Competitive observation:</span> during a comparison with Groww, the after-market order experience provided clearer confirmation that the order would be queued for the next trading session.</p></>,
                improve: <Bullets list={["Detect market-closed conditions.", "Make AMO availability clear.", "Preselect AMO where applicable, while requiring the user to review and confirm.", "Preserve the user’s order details where safe.", "Clearly explain that the order is queued for the next eligible session, not guaranteed to execute.", "Provide understandable reasons if the order cannot be accepted."]} />,
                exp: "",
                measures: ["AMO acceptance rate", "After-hours order drop-off", "Market-session-related rejection rate"],
              },
            ].map((o, n) => (
              <div key={o.t} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="flex items-baseline gap-4 border-b border-line px-6 py-5">
                  <span className="font-mono text-[12px] text-sage">Opportunity {String(n + 1).padStart(2, "0")}</span>
                  <p className="text-[20px] font-medium tracking-[-.01em]">{o.t}</p>
                </div>
                <div className="grid gap-px bg-line md:grid-cols-2">
                  <div className="bg-white p-6 text-[15px] leading-relaxed text-ink-2"><p className="mb-3 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">Problem identified</p>{o.problem}</div>
                  <div className="bg-white p-6 text-[15px] leading-relaxed text-ink-2"><p className="mb-3 font-mono text-[11px] uppercase tracking-[.12em] text-sage">Proposed improvement</p>{o.improve}</div>
                </div>
                <div className="space-y-4 border-t border-line bg-paper px-6 py-5">
                  {o.exp && <p className="font-serif text-[18px] italic leading-snug text-ink">{o.exp}</p>}
                  <div className="flex flex-wrap items-center gap-2"><span className="mr-1 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">Success measures</span>{o.measures.map((m) => <Tag key={m}>{m}</Tag>)}</div>
                </div>
              </div>
            ))}
          </EKBlock>

          {/* 06 Activation strategy */}
          <EKBlock k={5}>
            <P>Product improvements alone will not address every customer barrier. The next step is to connect the identified customer segments with appropriate operational and communication actions.</P>
            <ol className="divide-y divide-line rounded-lg border border-line bg-white">
              <li className="grid gap-3 p-6 md:grid-cols-[80px_1fr]"><span className="font-mono text-[12px] text-sage">Step 1</span><div><p className="text-[16px] font-medium">Address product-level barriers</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">Prioritise margin clarity, trading-segment activation and AMO improvements because these directly affect the order-placement experience.</p></div></li>
              <li className="grid gap-3 p-6 md:grid-cols-[80px_1fr]"><span className="font-mono text-[12px] text-sage">Step 2</span><div><p className="text-[16px] font-medium">Contact funded but non-traded customers</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">Prepare an actionable cohort of customers who have completed pay-in but have not completed their first successful trade. Use Sales or Support outreach to:</p><div className="mt-3"><Bullets list={["Understand why they have not traded.", "Identify whether they need platform guidance.", "Clarify margin and segment requirements.", "Record customer objections and recurring blockers.", "Feed the findings back into Product and Design."]} /></div></div></li>
              <li className="grid gap-3 p-6 md:grid-cols-[80px_1fr]"><span className="font-mono text-[12px] text-sage">Step 3</span><div><p className="text-[16px] font-medium">Improve behaviour-based communication</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">Move away from generic first-trade messaging.</p>
                <div className="mt-4 overflow-hidden rounded-md border border-line">
                  {[["No login", "Help the customer access the application."], ["No pay-in", "Explain how to add funds."], ["Pay-in completed, no trade", "Provide first-order guidance."], ["Permission rejection", "Explain the missing segment and activation process."], ["Margin rejection", "Explain the shortfall and available next steps."]].map(([s, a]) => (
                    <div key={s} className="grid gap-1 border-b border-line px-4 py-3 text-[14px] last:border-b-0 sm:grid-cols-[200px_1fr]"><span className="font-medium text-ink">{s}</span><span className="text-ink-2">{a}</span></div>
                  ))}
                </div>
              </div></li>
              <li className="grid gap-3 p-6 md:grid-cols-[80px_1fr]"><span className="font-mono text-[12px] text-sage">Step 4</span><div><p className="text-[16px] font-medium">Track conversion and optimise</p><p className="mt-2 text-[15px] leading-relaxed text-ink-2">Track the journey from account opening through first successful execution. Review campaign engagement alongside actual product events so that message delivery or clicks are not mistaken for successful activation.</p></div></li>
            </ol>
          </EKBlock>

          {/* 07 Prioritisation */}
          <EKBlock k={6}>
            <DataTable
              head={["Priority", "Product / operational action", "Rationale"]}
              first=""
              rows={[
                ["P0", "Fix broken eKYC redirection and misleading status messaging", "Prevent users from getting blocked before account opening"],
                ["P1", "Improve margin and segment-related order guidance", "Address barriers close to the point of order placement"],
                ["P1", "Improve AMO experience and error clarity", "Reduce confusion during market-closed order attempts"],
                ["P1", "Create a funded-but-not-traded customer cohort", "Understand the reasons behind the remaining activation gap"],
                ["P2", "Build behaviour-based activation communication", "Make customer follow-up relevant to their journey stage"],
                ["P2", "Establish a unified measurement and optimisation loop", "Connect product and campaign activity to actual first-trade outcomes"],
              ].map(([p, a, r]) => [<Tag key={a} tone={p === "P0" ? "sage" : p === "P1" ? "neutral" : "outline"}>{p}</Tag>, <span key={a + "a"} className="font-medium text-ink">{a}</span>, r])}
            />
            <Note label="Note">Priorities are proposed based on the observed problem areas and expected customer impact. Final sequencing should be confirmed with Product, Engineering, Business and Data teams after feasibility and dependency review.</Note>
          </EKBlock>

          {/* 08 Measurement */}
          <EKBlock k={7}>
            <div>
              <div className="rounded-t-lg bg-ink p-8 text-paper">
                <p className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">Primary success metric</p>
                <p className="mt-3 text-[26px] font-medium tracking-tight sm:text-[30px]">Account Opened → First Successful Trade Conversion</p>
                <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-paper/65">The percentage of eligible newly opened accounts that complete their first successful trade within an agreed measurement period.</p>
              </div>
              <div className="grid gap-px rounded-b-lg border border-t-0 border-line bg-line md:grid-cols-[1.6fr_1fr]">
                <div className="bg-white p-6">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">Supporting KPIs</p>
                  <ul className="divide-y divide-line">
                    {[["eKYC completion rate", "Progress through identity verification"], ["Account opening completion rate", "Successful account creation"], ["First login rate", "Initial application activation"], ["Pay-in conversion rate", "Progression from login to funding"], ["Order attempt rate", "Trading intent"], ["First-order success rate", "Ability to complete an initial order"], ["First-trade conversion rate", "Conversion into an active trading customer"], ["Median time to first trade", "Time taken to reach first successful execution"]].map(([k, w]) => (
                      <li key={k} className="grid gap-1 py-2.5 text-[14px] sm:grid-cols-[1fr_1.1fr]"><span className="font-medium">{k}</span><span className="text-ink-2">{w}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">Guardrail metrics</p>
                  <Bullets list={["Order rejection rate.", "Payment failure rate.", "Customer support complaints.", "Duplicate or unintended order submissions.", "Communication opt-outs and complaints."]} />
                </div>
              </div>
            </div>
            <Note label="Measurement requirement">Before setting targets, establish a consistent customer cohort, unique customer definition, first successful execution event and measurement window. Compare the results by B2B/B2C segment and activation stage. A controlled experiment should be used wherever possible to distinguish the impact of a product or campaign intervention from normal customer behaviour.</Note>
          </EKBlock>

          {/* 09 Progress */}
          <EKBlock k={8}>
            <P>The work has produced a set of research and planning outputs that can be used by Product, Design, Engineering, Data, CRM and Business teams.</P>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-white p-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[.12em] text-sage">Completed research and analysis</p>
                <ul className="space-y-2.5">
                  {["Audited the new-user onboarding and eKYC journey.", "Documented product, communication and redirection gaps.", "Reviewed activation triggers, communication channels and automation dependencies.", "Organised the DWH source export into a structured workbook with raw data, separate B2B and B2C records, summary and data-quality views.", "Reviewed first-trade rejection categories and identified areas requiring deeper validation.", "Reviewed customer survey responses and campaign performance.", "Compared selected competitor experiences for first-order and AMO journeys.", "Identified product opportunities around margin, trading permissions and order execution."].map((t) => (
                    <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2"><svg viewBox="0 0 16 16" className="mt-1 size-3.5 shrink-0 text-sage" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8.5l3 3 7-7" /></svg>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-dashed border-line bg-paper p-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">Proposed next steps</p>
                <ol className="space-y-2.5">
                  {["Validate the targetable customer population and B2B/B2C behaviour differences.", "Isolate first-trade-related failures from rejections occurring after a customer’s first successful trade.", "Investigate the funded-but-not-traded cohort through customer outreach.", "Validate technical feasibility and prioritise the proposed order-flow improvements.", "Establish baseline KPIs and monitor post-implementation conversion."].map((t, n) => (
                    <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2"><span className="pt-[3px]"><Num n={n + 1} /></span>{t}</li>
                  ))}
                </ol>
              </div>
            </div>
            <Note label="Current status">Research, analysis and product opportunity planning completed to the extent documented in the linked materials. Proposed interventions and their business impact remain subject to validation, prioritisation and implementation.</Note>
          </EKBlock>

          {/* 10 Learnings */}
          <EKBlock k={9}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Account opening is not activation.", "A customer can successfully complete eKYC and still face several barriers before becoming an active trader. The product needs to support the entire journey, not just registration."],
                ["Data needs customer context.", "Login, pay-in and rejection counts help identify patterns, but they do not independently explain why a customer stopped. Combining behavioural data, customer feedback, operational observations and product testing gives a more complete picture."],
                ["The right intervention depends on the user’s stage.", "A generic reminder cannot solve a missing trading permission or an unclear margin requirement. Product experiences and communications need to respond to the actual barrier."],
                ["First-trade conversion is a cross-functional product problem.", "Improving it requires Product, Design, Engineering, Data, CRM and Business teams to work from a shared understanding of the customer journey and measurable outcomes."],
              ].map(([h, t], n) => (
                <div key={h} className="rounded-lg border border-line bg-white p-6">
                  <span className="font-serif text-[32px] leading-none text-sage">{n + 1}.</span>
                  <p className="mt-3 font-serif text-[21px] leading-snug">{h}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t}</p>
                </div>
              ))}
            </div>
          </EKBlock>

          {/* 11 Files */}
          <EKBlock k={10}>
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {[
                ["PPT", "First-Trade Research & Next-Steps Presentation", "Contains the DWH analysis, first-trade rejection observations, SWOT, proposed product interventions, campaign review and execution roadmap.", "https://docs.google.com/presentation/d/19Dx2-FjJsoMmzqaq_s5WGTDAmmqkxfxi/edit?usp=sharing&ouid=104668827253228072421&rtpof=true&sd=true"],
                ["Excel", "First-Trade Analysis Workbook", "Contains the original raw data, separate B2B and B2C records, summary analysis, blank source-row view and data-quality checks.", "https://docs.google.com/spreadsheets/d/1fN-48Ul_kHFvwAm8PPVny7UmQJELk9Hf/edit?usp=sharing&ouid=104668827253228072421&rtpof=true&sd=true"],
                ["PPT", "New User Activation Audit", "Contains the eKYC journey review, communication audit, campaign trigger assessment, product gaps and prioritised onboarding recommendations.", "https://docs.google.com/presentation/d/14FEXHKkkxAOILlanUz6M-I6pBhoZNuBx/edit?usp=sharing&ouid=104668827253228072421&rtpof=true&sd=true"],
              ].map(([kind, title, desc, href], n) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group grid gap-3 p-6 transition-colors hover:bg-sage-soft md:grid-cols-[40px_1fr_auto] md:items-start">
                  <Num n={n + 1} />
                  <div><p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{kind}</p><p className="mt-1 text-[17px] font-medium">{title}</p><p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{desc}</p></div>
                  <span className="inline-flex items-center gap-2 justify-self-start rounded-md border border-line bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.08em] text-ink transition-colors group-hover:border-sage/40 group-hover:text-sage">Open <Arrow className="size-3.5 -rotate-45" /></span>
                </a>
              ))}
            </div>
            <div className="rounded-lg border border-sage/30 bg-sage-soft p-8">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-sage">The objective of this work</p>
              <p className="mt-4 font-serif text-[23px] leading-snug">Move from understanding where customers drop off to identifying why they do not reach their first successful trade, and creating a measurable, product-led plan to help them progress.</p>
            </div>
          </EKBlock>

          <a href={`#/case/${next.slug}`} className="group mt-10 flex items-center justify-between rounded-lg border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(18,22,20,.3)]">
            <div><p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Next case study</p><p className="mt-2 text-[24px] font-semibold tracking-tight">{next.name}</p></div>
            <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:bg-ink group-hover:text-paper"><Arrow /></span>
          </a>
        </article>
      </div>
      <Footer />
      <Lightbox label={lb} src={lb === heroLabel ? ekycHero : undefined} onClose={() => setLb(null)} />
    </div>
  );
}

/* ───────────── Design system ───────────── */

function DSRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 border-t border-line py-10 lg:grid-cols-[200px_1fr]">
      <p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function System() {
  const swatches = [
    ["Ink", "#121614", "Text primary · 17.9:1"], ["Ink 2", "#3C4440", "Text secondary · 9.8:1"], ["Ink 3", "#6B736F", "Labels · 4.8:1"],
    ["Line", "#E3E4DF", "Hairlines"], ["Paper 2", "#F2F2EE", "Muted surface"], ["Paper", "#FAFAF8", "Page ground"],
    ["Sage", "#1F5A4E", "Accent · 7.6:1"], ["Sage 2", "#2F7565", "Accent hover"], ["Sage soft", "#E6EFEB", "Accent surface"],
  ];
  return (
    <div className="page-enter mx-auto max-w-[1240px] px-6 pt-14 pb-24 lg:px-10">
      <Eyebrow n="08">Components & design system</Eyebrow>
      <h1 className="mt-6 text-[44px] font-semibold tracking-[-.035em] sm:text-[60px]">System reference</h1>
      <p className="mt-4 max-w-[560px] text-[17px] text-ink-2">Every component on this site, documented. 4px base unit, three typefaces, one accent.</p>

      <div className="mt-16">
        <DSRow label="Color">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {swatches.map(([n, h, u]) => (
              <div key={n} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="h-20" style={{ background: h }} />
                <div className="p-4"><p className="text-[14px] font-medium">{n}</p><p className="font-mono text-[12px] text-ink-3">{h} · {u}</p></div>
              </div>
            ))}
          </div>
        </DSRow>

        <DSRow label="Typography">
          <div className="space-y-6">
            {[["H1 · 66/1.04 · 500 · −3%", "text-[66px] font-medium leading-[1.04] tracking-[-.03em]"], ["H2 · 44/1.1 · 500 · −2.5%", "text-[44px] font-medium leading-[1.1] tracking-[-.025em]"], ["H3 · 26/1.2 · 600 · −2%", "text-[26px] font-semibold tracking-[-.02em]"], ["H4 · 19/1.3 · 500", "text-[19px] font-medium"]].map(([m, c]) => (
              <div key={m} className="flex flex-col gap-1 border-b border-line pb-5"><span className="font-mono text-[11px] text-ink-3">{m}</span><span className={`${c} truncate`}>Problem before solution</span></div>
            ))}
            <div className="grid gap-6 md:grid-cols-2">
              <div><span className="font-mono text-[11px] text-ink-3">Body · 17/1.7 · Instrument Sans</span><p className="mt-2 text-[17px] leading-[1.7] text-ink-2">Turning complex fintech journeys into simpler, more valuable experiences.</p></div>
              <div><span className="font-mono text-[11px] text-ink-3">Small · 14/1.6</span><p className="mt-2 text-[14px] leading-relaxed text-ink-2">Role, scope and supporting metadata.</p></div>
              <div><span className="font-mono text-[11px] text-ink-3">Accent · Newsreader italic</span><p className="mt-2 font-serif text-[22px] italic text-sage">What is the user really trying to do?</p></div>
              <div><span className="font-mono text-[11px] text-ink-3">Label · Geist Mono 11 · +14%</span><p className="mt-2 font-mono text-[11px] uppercase tracking-[.14em]">04 — Research</p></div>
            </div>
            <div className="flex gap-8 text-[15px]"><a className="underline decoration-line underline-offset-4">Link default</a><a className="text-sage underline underline-offset-4">Link hover</a><a className="text-[#173f37] underline decoration-2 underline-offset-4">Link active</a></div>
          </div>
        </DSRow>

        <DSRow label="Spacing · 4px base">
          <div className="flex flex-wrap items-end gap-5">
            {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((s) => (
              <div key={s} className="text-center"><div className="bg-sage-soft border border-sage/30" style={{ width: Math.min(s, 128), height: Math.min(s, 128) }} /><p className="mt-2 font-mono text-[11px] text-ink-3">{s}</p></div>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-ink-2">Container 1240 · gutters 24 / 40 · section padding 96 / 128 · 12-col grid, 32 gap.</p>
        </DSRow>

        <DSRow label="Buttons">
          <div className="space-y-5">
            {(["primary", "secondary"] as const).map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-24 font-mono text-[11px] text-ink-3">{v}</span>
                <Btn variant={v}>Default</Btn>
                <Btn variant={v} className={v === "primary" ? "!bg-sage" : "!border-ink !bg-white"}>Hover</Btn>
                <Btn variant={v} className={v === "primary" ? "!bg-[#173f37] scale-[.98]" : "!bg-paper-2"}>Active</Btn>
                <Btn variant={v} disabled>Disabled</Btn>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-6">
              <span className="w-24 font-mono text-[11px] text-ink-3">ghost / dl</span>
              <Btn variant="ghost">Let's connect <Arrow /></Btn>
              <Btn variant="secondary"><DownIcon /> Download Resume</Btn>
            </div>
          </div>
        </DSRow>

        <DSRow label="Tags">
          <div className="flex flex-wrap gap-2"><Tag>Fintech</Tag><Tag tone="sage">Product Strategy</Tag><Tag tone="outline">User Research</Tag><Tag tone="status">Shipped</Tag><Tag tone="status">In discovery</Tag></div>
        </DSRow>

        <DSRow label="Cards">
          <div className="grid gap-6 lg:grid-cols-2">
            <CaseCard c={CASES[0]} i={0} />
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-line"><CapabilityCard i={0} t={CAPS[0][0]} d={CAPS[0][1]} /></div>
              <ThinkingCard i={0} t={THINK[0][0]} q={THINK[0][1]} pts={THINK[0][2]} />
              <div className="rounded-lg border border-line bg-ink p-6 text-paper">
                <span className="grid size-[15px] place-items-center rounded-full bg-sage-2"><span className="size-[5px] rounded-full bg-paper" /></span>
                <p className="mt-4 font-mono text-[11px] text-paper/45">04 · NOW</p><p className="mt-1 text-[22px] font-medium">Timeline node</p>
              </div>
            </div>
          </div>
        </DSRow>

        <DSRow label="Case-study parts">
          <div className="space-y-6">
            <div><p className="font-mono text-[12px] text-sage">05 —</p><p className="text-[36px] font-medium tracking-[-.02em]">Section header</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-white p-6"><span className="font-serif text-[44px] leading-none text-sage">1.</span><p className="mt-4 font-medium">[Problem identified]:</p><p className="text-ink-2">[Evidence or observation]</p></div>
              <div className="rounded-lg border border-line bg-white p-6"><p className="font-mono text-[11px] uppercase text-ink-3">KPI row</p><p className="mt-3 text-[20px] font-medium">[Add metric]</p><p className="text-[13px] text-ink-3">Baseline → target</p></div>
            </div>
            <nav className="flex gap-2 font-mono text-[12px] text-ink-3"><span>Home</span>/<span>Work</span>/<span className="text-ink">Breadcrumb</span></nav>
          </div>
        </DSRow>

        <DSRow label="Placeholders">
          <div className="grid gap-4 md:grid-cols-3">
            <Placeholder label="Screenshot container" />
            <Placeholder label="Hero placeholder" ratio="aspect-[21/9]" dense />
            <Placeholder label="Card preview" ratio="aspect-[4/3]" />
          </div>
        </DSRow>

        <DSRow label="Motion">
          <ul className="grid gap-3 text-[14px] text-ink-2 md:grid-cols-2">
            {["Card hover · translateY −4px + shadow · 300ms", "Scroll reveal · fade + 14px rise · 400ms", "Page transition · fade + 8px · 320ms", "Accordion · grid-rows 0fr→1fr · 300ms", "Easing · cubic-bezier(.2,.7,.2,1) — no overshoot", "Progress bar · sticky header, scroll-linked"].map((m) => <li key={m} className="border-b border-line pb-3">{m}</li>)}
          </ul>
        </DSRow>
      </div>
    </div>
  );
}

/* ───────────── App ───────────── */

export default function App() {
  const [route, setRoute] = useState<Route>(parse);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const key = route.name === "case" ? `c${route.i}` : route.name;
  useReveal(key);

  return (
    <div className="min-h-screen">
      <Header route={route} progress={route.name === "case" ? progress : undefined} />
      <main key={key} className="page-enter">
        {route.name === "home" && <Home />}
        {route.name === "case" && (CASES[route.i].slug === "super-app" ? <SuperAppCase i={route.i} onProgress={setProgress} /> : CASES[route.i].slug === "ekyc-activation" ? <EkycCase i={route.i} onProgress={setProgress} /> : <CaseStudy i={route.i} onProgress={setProgress} />)}
        {route.name === "system" && <><System /><Footer /></>}
      </main>
    </div>
  );
}
