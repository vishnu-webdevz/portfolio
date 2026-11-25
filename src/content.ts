// All site copy lives here. Edit this file to update the portfolio.

export const site = {
  name: "Vishnu",
  url: "https://vishnuvardhan.net",
  tagline: ["Senior SDE · Web", "UI Builder", "Problem Solver"],
  role: "Senior SDE – Web",
  company: "SaaS Labs",
  location: "Bengaluru",
  subline: "Fast, clean websites — built with care.",
  // What bursts out of the planet in the hero (the skills list lives in Toolbox).
  strengths: ["Pixel-perfect UI", "Accessible by default", "AI-accelerated", "Easy-to-edit CMS", "Reusable sections"],
  intro:
    "7+ years of building for the web — from WordPress sites to Next.js products. I turn rough ideas into fast, accessible websites people enjoy using, and I use AI tools like Claude and Cursor to ship them faster.",
  email: "vishnumaruthi21@gmail.com",
  resumeUrl: "/vishnu-resume.pdf",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vishnu-vardhan-5322b91a5/" },
    { label: "GitHub", href: "https://github.com/vishnu-webdevz" },
  ],
};

// From LinkedIn (partial): add the rest from "Show all skills".
export const skills: { group: string; items: string[] }[] = [
  { group: "Front-end", items: ["Next.js", "Tailwind CSS", "JavaScript", "jQuery", "Bootstrap", "HTML5", "CSS3"] },
  { group: "CMS & WordPress", items: ["WordPress", "Headless CMS", "HubSpot", "PSD to WordPress", "Theme development"] },
  { group: "Tooling", items: ["Git & GitHub", "Vercel", "Figma"] },
  { group: "Practices", items: ["Responsive design", "Accessibility", "Performance", "SEO"] },
];

// How AI tools fit into the way I build.
export const aiWorkflow: { tool: string; what: string }[] = [
  { tool: "AI page building", what: "From a design brief to a responsive, deployed page in hours, not days." },
  { tool: "AI code review", what: "Every pull request gets an automated review for bugs and edge cases before a human one." },
  { tool: "AI project management", what: "Specs, tickets, changelogs and status updates drafted and kept in sync automatically." },
  { tool: "Claude Code", what: "Pair-programs features end to end: plans, writes code and tests, refactors safely." },
  { tool: "Cursor", what: "Fast in-editor changes, codebase-aware edits and quick UI iterations." },
  { tool: "Agents & MCP", what: "Agents wired to GitHub, Vercel and docs to automate deploys, checks and routine chores." },
];

export type Job = {
  period: string;
  role: string;
  company: string;
  location?: string;
  summary: string;
  highlights?: string[];
};

// Fill from LinkedIn (newest last, so the walk goes forward in time).
// The Journey section stays hidden while this is empty.
export const experience: Job[] = [
  {
    period: "Sep 2019 — Apr 2021",
    role: "Frontend Web Developer",
    company: "iOSYS Software",
    location: "Bengaluru · On-site",
    summary: "Where the road started: building responsive front-end interfaces with HTML, CSS, JavaScript and Bootstrap, plus WordPress and HubSpot pages.",
    highlights: ["HTML5", "CSS3", "WordPress", "HubSpot", "JavaScript", "jQuery", "Bootstrap 3 & 4"],
  },
  {
    period: "Apr 2021 — Apr 2023",
    role: "WordPress Developer",
    company: "Uplers",
    location: "Bengaluru · Remote",
    summary: "Full-stack WordPress developer: turned PSD designs into responsive, pixel-accurate WordPress themes and websites.",
    highlights: ["PSD to WordPress", "HTML5"],
  },
  {
    period: "Apr 2023 — Jun 2024",
    role: "SDE – Web",
    company: "SaaS Labs",
    location: "Bengaluru · Hybrid",
    summary: "Joined the SaaS Labs web team as an SDE-1, building and maintaining company websites with WordPress, PHP and JavaScript.",
    highlights: ["HTML5", "CSS3", "WordPress", "PHP", "JavaScript", "jQuery"],
  },
  {
    period: "Jun 2024 — Apr 2026",
    role: "SDE 2 – Web",
    company: "SaaS Labs",
    location: "Bengaluru · Hybrid",
    summary: "Promoted to SDE-2: took ownership of larger parts of the web stack and moved page building to Tailwind CSS.",
    highlights: ["HTML5", "Tailwind CSS"],
  },
  {
    period: "Apr 2026 — Present",
    role: "Senior SDE – Web",
    company: "SaaS Labs",
    location: "Bengaluru · Hybrid",
    summary:
      "Building the web with Next.js — and building it faster: AI-assisted development with Claude and Cursor, automated workflows, and a library of reusable templates and sections that turns new pages around quickly.",
    highlights: ["Next.js", "Tailwind CSS", "Claude", "Cursor", "Automation", "Reusable templates"],
  },
];

export const about = {
  paragraphs: [
    "I started building websites because I wanted to see an idea on screen the same day I had it. That's still my favourite part: turning a rough plan into something people can click on.",
    "These days I work mostly with Next.js and Tailwind, and I sweat the small stuff — spacing, load time, keyboard navigation — as much as the features.",
  ],
  outside: ["Following tech & web news", "Badminton, swimming, trekking"],
};
