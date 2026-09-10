import {
  CalendarEntry,
  MetaDayPack,
  MetaCarouselSlide,
  MetaReelShot,
  MetaStoryFrame,
  MetaThreadPost,
  MoodBoardConcept
} from '../types.ts';

// Domain-specific architectural insights helper
function getDomainContext(domain: string) {
  switch (domain) {
    case 'HR':
      return {
        coreProblem: 'disjointed employee journeys, skills gap, and unaligned talent pipelines',
        sapContext: 'SAP SuccessFactors & Workzone with Clean Core talent data',
        agentRole: 'autonomous skills-matching, onboarding agents, and workforce intelligence',
        keyword: 'HR_BLUEPRINT',
        metric: '40% reduction in time-to-competency'
      };
    case 'CRM / Customer Experience':
      return {
        coreProblem: 'fragmented omnichannel customer touchpoints and delayed service response',
        sapContext: 'SAP Customer Experience (CX), Sales Cloud, and BTP integration',
        agentRole: 'autonomous customer sentiment triage and real-time quote generation agents',
        keyword: 'CX_BLUEPRINT',
        metric: '3.2x faster customer resolution time'
      };
    case 'Finance':
      return {
        coreProblem: 'delayed month-end closing, reconciliation friction, and manual audit compliance',
        sapContext: 'SAP S/4HANA Finance, Group Reporting, and Universal Journal (ACDOCA)',
        agentRole: 'continuous accounting agents, automated variance analysis, and cash flow forecasting',
        keyword: 'FINANCE_AI',
        metric: '70% compression in closing cycles'
      };
    case 'Procurement':
      return {
        coreProblem: 'maverick spend, opaque supplier risk, and manual contract review bottlenecks',
        sapContext: 'SAP Ariba, Business Network, and S/4HANA Central Procurement',
        agentRole: 'autonomous sourcing agents, risk surveillance bots, and contract parsing agents',
        keyword: 'SOURCING_EA',
        metric: '18% hard-cost procurement savings'
      };
    case 'Supply Chain':
      return {
        coreProblem: 'inventory bullwhip effects, volatile lead times, and siloed factory logistics',
        sapContext: 'SAP Integrated Business Planning (IBP), Extended Warehouse Management (EWM)',
        agentRole: 'multi-tier demand sensing agents and real-time logistics rerouting bots',
        keyword: 'SUPPLY_CHAIN',
        metric: '35% reduction in carrying inventory costs'
      };
    case 'Enterprise Business':
      return {
        coreProblem: 'architectural debt, fragmented tech stacks, and ungoverned shadow AI silos',
        sapContext: 'SAP S/4HANA Cloud, SAP BTP, and Joule contextual intelligence fabric',
        agentRole: 'cross-functional enterprise workflow agents with human-on-the-loop oversight',
        keyword: 'ENTERPRISE_AI',
        metric: '60% faster enterprise capability rollouts'
      };
    default:
      return {
        coreProblem: 'siloed decision-making, executive misalignment, and slow transformation cadence',
        sapContext: 'SAP Signavio process intelligence and enterprise architecture governance',
        agentRole: 'strategic decision simulation and governance validation agents',
        keyword: 'LEADERSHIP_EA',
        metric: '2.5x transformation success rate'
      };
  }
}

/**
 * Generates the complete, curated 365-day Meta Suite content pack for ANY calendar entry
 * (Facebook, Instagram, WhatsApp, Threads)
 */
export function generateMetaDayPack(entry: CalendarEntry): MetaDayPack {
  const ctx = getDomainContext(entry.domain);
  const sectorContext = entry.gicsSector !== 'As applicable' ? entry.gicsSector : 'Enterprise Ecosystem';

  // --- 1. INSTAGRAM ---
  const igReelShots: MetaReelShot[] = [
    {
      time: '00:00 - 00:03',
      visual: 'Close-up on Niladri looking directly at camera with high-contrast text badge overlay',
      spokenWord: `"Stop building AI into ${entry.domain} without Enterprise Architecture!"`,
      onScreenText: '🚨 THE $10M MISTAKE IN 2027'
    },
    {
      time: '00:03 - 00:15',
      visual: 'Cut to screen recording zooming into complex tangled architecture vs clean SAP Clean Core stack',
      spokenWord: `"Here is why 80% of enterprise AI pilots fail in the ${sectorContext} sector: they connect LLMs to 15-year-old custom code."`,
      onScreenText: 'Custom Code = AI Hallucinations ❌'
    },
    {
      time: '00:15 - 00:35',
      visual: 'Whiteboard or digital canvas sketching the 3 layers: Business Architecture -> Clean Core -> AI Agents',
      spokenWord: `"When you anchor ${entry.domain} to ${ctx.sapContext}, your AI agents inherit enterprise business semantics. You get ${ctx.metric} without hallucination."`,
      onScreenText: 'Clean Core + Joule Agents = Governed Value ✅'
    },
    {
      time: '00:35 - 00:55',
      visual: 'Cut back to presenter with blueprint graphic graphic on the right half of the frame',
      spokenWord: `"This is Day #${entry.id} of our 365-Day Transformation series at SuccessLabs Academy. Comment "${ctx.keyword}" below and I will DM you this exact architecture map."`,
      onScreenText: `Comment "${ctx.keyword}" for the Free PDF Blueprint 📲`
    }
  ];

  const igReelVoiceover = `Stop building AI into ${entry.domain.toLowerCase()} without Enterprise Architecture!

Here is the brutal truth in 2026/2027: If your enterprise connects AI agents to legacy custom code, you're not innovating—you're accelerating technical debt.

In the ${sectorContext} sector, ${ctx.coreProblem} cannot be solved by standalone chatbots.

Here is the architectural blueprint:
1. Map the business capability first.
2. Anchor your data to ${ctx.sapContext}.
3. Deploy ${ctx.agentRole} with strict human-on-the-loop governance.

That is how you achieve ${ctx.metric}.

I'm Niladri Bihari Nayak from SuccessLabs Academy. We are architecting 365 consecutive days of enterprise transformation.

Drop a comment with "${ctx.keyword}" and I'll send the full high-res architecture slide deck straight to your DMs!`;

  const igReelCaption = `🚨 Are you building AI experiments, or architecting enterprise value in ${entry.domain}?

In Day #${entry.id} of the SuccessLabs Academy 365-Day Transformation series, we map out the exact target state for "${entry.title}".

When leaders skip Enterprise Architecture and plug AI directly into fragmented systems, three things happen:
1. Models hallucinate on dirty transactional data.
2. Security & compliance audits reject the deployment.
3. Millions in software licenses yield zero bottom-line ROI.

👉 The Fix:
• Business Capability Mapping first
• ${ctx.sapContext}
• ${ctx.agentRole}
• Result: ${ctx.metric}

📲 COMMENT "${ctx.keyword}" below and I will instantly DM you the high-resolution architecture blueprint & slide deck!

Save this Reel for your next architecture review session. 📌

#EnterpriseArchitecture #SAP #DigitalTransformation #BusinessArchitecture #AIStrategy #${entry.domain.replace(/[^a-zA-Z]/g, '')} #SuccessLabsAcademy #TechLeadership #CleanCore`;

  // 10-Slide Instagram Carousel
  const igCarouselSlides: MetaCarouselSlide[] = [
    {
      slideNum: 1,
      type: 'hook_cover',
      header: `${entry.title}`,
      bulletPoints: [
        `Day #${entry.id} / 365 • SuccessLabs Academy`,
        `The 2027 Enterprise Architecture Blueprint`,
        `Swipe to unlock the full framework ➡️`
      ],
      visualDiagramDescription: 'Bold dark slate card (#0F172A), amber & sapphire accents, 3-pillar badge (EA + AI + SAP)',
      tag: 'COVER HOOK'
    },
    {
      slideNum: 2,
      type: 'problem',
      header: `The Core Friction in ${entry.domain}`,
      bulletPoints: [
        `Symptoms: ${ctx.coreProblem}`,
        `Legacy Dilemma: 10+ years of custom extensions prevent clean AI integration`,
        `The Cost: Escalating maintenance & fragmented operational data`
      ],
      visualDiagramDescription: 'Split visual: Legacy spaghetti architecture on the left with red warning icons',
      tag: 'THE REALITY'
    },
    {
      slideNum: 3,
      type: 'framework',
      header: 'The SuccessLabs 3-Pillar Triangle',
      bulletPoints: [
        '1. Business Architecture: Capability & value stream mapping',
        '2. SAP Clean Core: Contextual enterprise truth without technical debt',
        '3. Agentic AI: Autonomous task execution governed by human accountability'
      ],
      visualDiagramDescription: 'Equilateral triangle with EA, SAP, and AI at vertices; Business Value at the center',
      tag: 'FOUNDATION'
    },
    {
      slideNum: 4,
      type: 'deepdive',
      header: `Business Architecture for ${entry.domain}`,
      bulletPoints: [
        'Define Level-1 & Level-2 capability blocks before technology selection',
        'Identify high-impact decision friction points',
        'Establish single-source-of-truth ownership for every data attribute'
      ],
      visualDiagramDescription: 'Horizontal capability map with value streams flowing from strategy to customer',
      tag: 'LAYER 1'
    },
    {
      slideNum: 5,
      type: 'deepdive',
      header: 'The SAP Context Spine',
      bulletPoints: [
        `Anchored by ${ctx.sapContext}`,
        'BTP extension layer isolates custom logic from core ERP',
        'Joule / Business AI gains instant semantic understanding without fine-tuning'
      ],
      visualDiagramDescription: '3-tier stack showing S/4HANA core, BTP integration spine, and Clean Core boundary',
      tag: 'LAYER 2'
    },
    {
      slideNum: 6,
      type: 'deepdive',
      header: 'Autonomous Agent Orchestration',
      bulletPoints: [
        `Role: ${ctx.agentRole}`,
        'Trigger: Real-time business event or sensor anomaly',
        'Execution: Evaluates constraints, checks policy, requests human sign-off if variance > 5%'
      ],
      visualDiagramDescription: 'Workflow sequence from event trigger -> agent evaluation -> human approval gate -> ERP update',
      tag: 'LAYER 3'
    },
    {
      slideNum: 7,
      type: 'case_study',
      header: `Real-World Case: ${sectorContext} Sector`,
      bulletPoints: [
        'Before: 14 disconnected tools, 3-day manual reconciliations',
        'Target Architecture: Clean Core + Autonomous agentic workflows',
        `Measurable Outcome: ${ctx.metric} within 6 months`
      ],
      visualDiagramDescription: 'Before vs. After transformation comparison card with quantifiable metrics',
      tag: 'INDUSTRY CASE'
    },
    {
      slideNum: 8,
      type: 'comparison',
      header: '3 Anti-Patterns to Avoid in 2027',
      bulletPoints: [
        '❌ Anti-Pattern 1: Point-solution AI bots with no ERP connection',
        '❌ Anti-Pattern 2: Writing custom AI models directly on legacy tables',
        '❌ Anti-Pattern 3: Removing human review before agent auditability is mature'
      ],
      visualDiagramDescription: 'Warning matrix comparing short-term shortcut vs sustainable architecture',
      tag: 'WATCH OUT'
    },
    {
      slideNum: 9,
      type: 'takeaway',
      header: "The Architect's Monday Morning Checklist",
      bulletPoints: [
        `1. Audit your ${entry.domain} capability map against current tech debt`,
        '2. Verify Clean Core compliance for all upcoming extensions',
        '3. Define your Human-on-the-Loop decision thresholds'
      ],
      visualDiagramDescription: 'Checklist card with checkmarks and actionable enterprise next steps',
      tag: 'ACTION PLAN'
    },
    {
      slideNum: 10,
      type: 'cta',
      header: 'Architecting Experiences for a Better World',
      bulletPoints: [
        `Enjoyed Day #${entry.id}? We publish daily for 365 consecutive days.`,
        '📌 Save this post for your next steering committee meeting',
        `💬 Comment "${ctx.keyword}" for the complete architecture deck`,
        'Follow @successlabs.academy for tomorrow’s session'
      ],
      visualDiagramDescription: 'Presenter photo/badge, SuccessLabs Academy seal, and save bookmark arrow',
      tag: 'SAVE & SHARE'
    }
  ];

  // Instagram Stories (4 Frames)
  const igStories: MetaStoryFrame[] = [
    {
      frameNum: 1,
      stickerType: 'poll',
      questionOrTitle: `Are your ${entry.domain} AI initiatives anchored to Clean Core?`,
      options: ['Yes, Clean Core ✅', 'No, Legacy Custom ⚠️'],
      visualBg: 'Gradient slate & red glow with bold title text',
      ctaText: 'Tap to vote in the poll!'
    },
    {
      frameNum: 2,
      stickerType: 'question',
      questionOrTitle: `Day #${entry.id}: "${entry.title}" is live! What is your biggest hurdle right now?`,
      visualBg: 'Behind-the-scenes architecture slide preview with whiteboard sketch overlay',
      ctaText: 'Drop your answer in the question box'
    },
    {
      frameNum: 3,
      stickerType: 'quiz',
      questionOrTitle: `In ${entry.domain}, what is the prerequisite for deploying trusted AI agents?`,
      options: [
        'A) Fine-tuning an open-source LLM',
        'B) Clean Core data semantics & capability mapping',
        'C) Buying more GPU clusters',
        'D) Building custom SQL scripts'
      ],
      correctAnswerIndex: 1,
      explanation: 'Without clean data semantics and enterprise capability maps, AI models simply hallucinate on legacy technical debt.',
      visualBg: 'Dark mode card with quiz widget and glowing option highlights',
      ctaText: 'Test your architecture IQ!'
    },
    {
      frameNum: 4,
      stickerType: 'link',
      questionOrTitle: `Get the Day #${entry.id} Slide Deck & Architecture Blueprint`,
      visualBg: 'High-res mockup of the 10-slide deck with swipe-up sticker',
      ctaText: `Send DM with "${ctx.keyword}"`
    }
  ];

  // --- 2. FACEBOOK ---
  const fbLongFormPost = {
    hook: `Most enterprise leaders are currently deploying AI backwards in ${entry.domain.toLowerCase()}.`,
    body: `They purchase generative AI licenses, hand them to business units, and then wonder why 80% of initiatives stall before producing measurable value.

The reason isn’t model capability. The reason is architectural debt.

In today's Day #${entry.id} session at SuccessLabs Academy—"${entry.title}"—we dissected why enterprise transformation in the ${sectorContext} sector requires a fundamental shift from tool adoption to architectural discipline.

Here is the 3-layer architecture that separates multi-million dollar transformations from expensive experiments:

1️⃣ LAYER 1: BUSINESS ARCHITECTURE (The Blueprint)
Before a single line of code or agent prompt is written, you must map the business capability and value stream. Where does decisions friction actually occur? What is the enterprise outcome?

2️⃣ LAYER 2: THE SAP CONTEXT SPINE (The Truth)
Anchoring ${entry.domain} to ${ctx.sapContext} guarantees Clean Core principles. Your ERP remains upgradable, while your operational data maintains strict enterprise semantics.

3️⃣ LAYER 3: AGENTIC AI & GOVERNANCE (The Execution)
Deploying ${ctx.agentRole} under a strict "Human-on-the-Loop" governance framework. Agents execute routine workflows autonomously; humans handle exceptions and retain final accountability.

The Measurable Result?
Organizations applying this architecture achieve ${ctx.metric} while reducing technical debt.`,
    keyTakeaways: [
      'Clean Core is the non-negotiable prerequisite for enterprise AI',
      'Business capability mapping must precede technology procurement',
      'Human-on-the-loop governance protects regulatory compliance and brand trust'
    ],
    discussionQuestion: `How is your organization balancing rapid AI experimentation with long-term Enterprise Architecture and Clean Core discipline in ${entry.domain}? Let's discuss in the comments below.`,
    cta: `Join the daily transformation journey at SuccessLabs Academy: Architecting experiences for a better world.`
  };

  const fbGroupDiscussion = {
    promptTitle: `[EA & SAP Debate] Day #${entry.id}: Is custom legacy code killing your ${entry.domain} AI roadmap?`,
    coreDebate: `In many ${sectorContext} enterprises, 60%+ of business logic in ${entry.domain} resides in custom modifications written over the last 15 years.
When attempting to deploy modern AI agents, these customizations create data silos and hallucinations.

Do you advocate for:
Option A: Aggressive Clean Core refactoring to standard before introducing AI agents?
Option B: Wrapping legacy custom code in API adapters and letting agents interact through middleware?`,
    starterQuestions: [
      'What has been your experience refactoring custom Z-tables to SAP Clean Core?',
      'How do you convince finance and executive sponsors that architecture refactoring is essential for AI ROI?'
    ]
  };

  // --- 3. WHATSAPP ---
  const waBroadcastBrief = {
    headline: `*SuccessLabs Daily Brief #Day ${entry.id}* 🚀\n*Topic:* ${entry.title}`,
    formattedBody: `Good morning Architects & Leaders! ☕

Today on SuccessLabs Academy Day #${entry.id}, we break down how to architect *${entry.domain}* for the 2027 autonomous enterprise.

*The Core Problem:*
${ctx.coreProblem} in the ${sectorContext} sector.

*The 3-Step Architectural Solution:*
1. *Business Architecture:* Map capabilities before selecting models.
2. *SAP Clean Core Spine:* Anchor data to ${ctx.sapContext}.
3. *Agentic AI:* Deploy ${ctx.agentRole} with human-in-the-loop gates.

*The Measurable Outcome:*
Organizations applying this stack see *${ctx.metric}*.

_Tip of the Day:_ "Technology is not the architecture. Technology is one layer of the architecture."

📲 *Action:* Forward this to your Enterprise Architecture & SAP transformation teams.`,
    keyBulletPoints: [
      `Domain: *${entry.domain}* | Angle: *${entry.angle}*`,
      `Sector Focus: *${sectorContext}*`,
      `Key Enabler: *Clean Core + Joule / Agentic Workflows*`
    ],
    forwardPrompt: 'Forwarded from SuccessLabs Academy — Architecting experiences for a better world (Niladri Bihari Nayak).'
  };

  const waVoiceNoteScript = {
    duration: '60 - 75 seconds',
    toneGuide: 'Warm, authoritative, conversational, speaking directly to an enterprise colleague.',
    script: `[Spoken voice note from Niladri Bihari Nayak]

"Hey everyone, Niladri here from SuccessLabs Academy. Happy ${entry.dayOfWeek}!

I'm stepping out of our Day #${entry.id} broadcast studio, and I wanted to leave you with one critical thought on *${entry.domain}*.

A lot of leaders ask me: _'Niladri, how do we get our AI agents to stop hallucinating on enterprise data?'_

Here's the honest answer: AI models don't hallucinate because the algorithm is broken; they hallucinate because your enterprise data lacks semantic context.

If you plug modern AI into 15-year-old custom spaghetti code, you get expensive chaos.

That's why our Day #${entry.id} architecture focuses on three pillars:
First, map your business capability.
Second, keep your SAP core clean using BTP as your integration spine.
And third, let autonomous agents handle execution while humans maintain decision governance.

That's how our case study in the ${sectorContext} sector drove ${ctx.metric}.

Check the channel for the full slide deck and drop your questions right here. Let's keep architecting for a better world!"`,
    closingCta: 'Tap and hold to forward this voice note to your transformation leadership team.'
  };

  const waInteractivePoll = {
    question: `📊 *SuccessLabs Day #${entry.id} Architecture Poll:*\nWhat is your biggest barrier to deploying AI agents in *${entry.domain}*?`,
    options: [
      '1️⃣ Legacy custom code & un-clean ERP core',
      '2️⃣ Lack of documented Business Capability maps',
      '3️⃣ Security, compliance & governance fears',
      '4️⃣ Budget & executive sponsorship alignment'
    ],
    contextNote: 'Vote above! We will break down the poll results in tomorrow morning’s broadcast briefing.'
  };

  const waForwardableCheatSheet = {
    cardTitle: `📋 EXECUTIVE CHEAT-SHEET: DAY #${entry.id} — ${entry.title.toUpperCase()}`,
    formattedCard: `=========================================
SUCCESSLABS ACADEMY — 365 ARCHITECTURE OS
DAY #${entry.id} | ${entry.date} | ${entry.domain}
=========================================

🎯 THE MANDATE:
"${entry.title}"

⚠️ THE FRICTION:
${ctx.coreProblem} in ${sectorContext} organizations.

🏗️ THE 3-LAYER ARCHITECTURE:
• Layer 1 (Strategy): Business Capability & Value Stream Mapping
• Layer 2 (Data Spine): ${ctx.sapContext}
• Layer 3 (Intelligence): ${ctx.agentRole}

📊 EXPECTED BUSINESS OUTCOME:
${ctx.metric}

💡 ARCHITECT'S GOLDEN RULE:
"Never automate technical debt with AI. Keep the core clean, structure the semantics, and govern the agents."

👨‍💼 Niladri Bihari Nayak | SuccessLabs Academy
Architecting experiences for a better world
=========================================`
  };

  // --- 4. THREADS ---
  const threadsViral: MetaThreadPost[] = [
    {
      postNumber: 1,
      totalPosts: 7,
      text: `Most enterprise AI projects in ${entry.domain.toLowerCase()} will quietly fail by 2027.

Not because the models aren't smart enough.
Because the enterprise isn't architected to use them.

Here is the exact blueprint to fix this 🧵 (1/7)`,
      visualCue: 'Opening contrarian statement designed to stop the scroll on Threads feed',
      characterCount: 228
    },
    {
      postNumber: 2,
      totalPosts: 7,
      text: `The problem in ${sectorContext} enterprises:

Leaders buy generative AI tools, but their core ${entry.domain.toLowerCase()} data is trapped across 15-year-old custom legacy systems.

Connecting modern AI to dirty data doesn't create agility.
It creates high-velocity hallucinations. (2/7)`,
      visualCue: 'Clear pain point diagnosis',
      characterCount: 260
    },
    {
      postNumber: 3,
      totalPosts: 7,
      text: `The solution is the 3-Pillar Enterprise Architecture:

1. Business Architecture (Map capabilities before models)
2. Clean Core Context (${ctx.sapContext})
3. Autonomous Agentic Workflows (with human governance)

Let’s break down how this works: (3/7)`,
      visualCue: 'The foundational 3-part framework',
      characterCount: 254
    },
    {
      postNumber: 4,
      totalPosts: 7,
      text: `Why Clean Core is non-negotiable:

When you isolate custom extensions on SAP BTP and keep the ERP core standard, your AI agents gain instant semantic understanding.

They don't need fine-tuning on dirty schemas.
They execute directly on verified business events. (4/7)`,
      visualCue: 'Technical explanation of Clean Core value',
      characterCount: 271
    },
    {
      postNumber: 5,
      totalPosts: 7,
      text: `How agents operate in practice:

Instead of generic chat bots, you deploy ${ctx.agentRole}.

Key rule: Human-on-the-loop.
Agents propose, evaluate constraints, and execute routine actions.
High-variance exceptions escalate to human architects. (5/7)`,
      visualCue: 'Agentic operational workflow description',
      characterCount: 268
    },
    {
      postNumber: 6,
      totalPosts: 7,
      text: `The Measurable Payoff:

In our ${sectorContext} case study, applying this architecture delivered:
• ${ctx.metric}
• Zero compliance violations
• Scalable agent orchestration across global units.

Architecture is the difference between an experiment and an enterprise asset. (6/7)`,
      visualCue: 'Quantifiable case study proof',
      characterCount: 279
    },
    {
      postNumber: 7,
      totalPosts: 7,
      text: `This is Day #${entry.id} of our 365-day journey at SuccessLabs Academy: "Architecting experiences for a better world."

Repost the first post if this helped.
Drop a follow @niladri.nayak for Day #${Math.min(365, entry.id + 1)} tomorrow.

What's your biggest ${entry.domain} bottleneck right now? (7/7)`,
      visualCue: 'CTA with community engagement question',
      characterCount: 273
    }
  ];

  const threadsContrarianTake = {
    text: `Unpopular opinion: If you need to fine-tune an LLM on your ${entry.domain.toLowerCase()} data, your enterprise architecture is probably broken. Fix your Clean Core semantics first. (Day #${entry.id})`,
    characterCount: 204
  };

  const threadsDebate = {
    question: `Architects of Threads: What causes more enterprise friction in 2026?
A) 15-year-old custom code in your ERP
B) Ungoverned shadow AI tools adopted by departments

Drop your rationale below 👇`,
    context: `Day #${entry.id} SuccessLabs Architecture Debate on "${entry.title}"`
  };

  // AI-Driven Visual Themes & Mood Board Concepts tailored to day's specific domain
  const isSAP = entry.title.toLowerCase().includes('sap') || entry.domain === 'Finance' || entry.domain === 'Procurement' || entry.domain === 'Supply Chain';
  const isAI = entry.title.toLowerCase().includes('agent') || entry.title.toLowerCase().includes('ai') || entry.title.toLowerCase().includes('llm');

  const visualThemes: MoodBoardConcept[] = [
    {
      id: 'theme-core-domain',
      themeName: isSAP
        ? 'SAP Clean Core Architectural Blueprint'
        : isAI
        ? 'Autonomous Agentic Mesh & Kinetic Vectors'
        : 'Enterprise TOGAF Layered Strata',
      archetype: isSAP ? 'SAP Clean Core Technical Minimalist' : isAI ? 'Neural High-Tech Vector' : 'Enterprise Swiss Modernism',
      visualMetaphor: isSAP
        ? `Strict architectural separation: The pristine S/4HANA digital core remains unpolluted in deep navy, while side-by-side BTP extension tiers float in lucid emerald and cobalt, visually demonstrating zero-custom-code discipline.`
        : isAI
        ? `Agentic orchestration loops: High-contrast circuit paths showing human-in-the-loop validation checkpoints linked to autonomous AI worker nodes with zero visual clutter.`
        : `Structural enterprise strata: Clean orthogonal grid separating Business Capabilities from Data Foundations and Technology Services.`,
      colorPalette: isSAP
        ? {
            name: 'SAP Clean Core Cobalt & Emerald',
            background: '#0B1120',
            surface: '#131D33',
            primaryAccent: '#0284C7',
            secondaryAccent: '#10B981',
            textPrimary: '#F8FAFC',
            textSecondary: '#94A3B8',
            border: '#1E293B'
          }
        : isAI
        ? {
            name: 'Agentic Cyber Graphite & Cyan',
            background: '#090D16',
            surface: '#111827',
            primaryAccent: '#06B6D4',
            secondaryAccent: '#8B5CF6',
            textPrimary: '#F9FAFB',
            textSecondary: '#9CA3AF',
            border: '#1F2937'
          }
        : {
            name: 'TOGAF Enterprise Navy & Indigo',
            background: '#0A0F1D',
            surface: '#151D30',
            primaryAccent: '#6366F1',
            secondaryAccent: '#38BDF8',
            textPrimary: '#F8FAFC',
            textSecondary: '#A5B4FC',
            border: '#242F4D'
          },
      typography: {
        displayFont: 'Space Grotesk (700 Bold, -0.03em tracking)',
        bodyFont: 'Plus Jakarta Sans (Medium, 1.55 line height)',
        codeFont: 'JetBrains Mono (for API endpoints & table schemas)',
        hierarchyRule: 'Display heading 32px/1.2, Subheaders 18px uppercase tracking-wider, Body 16px high contrast'
      },
      geometryAndGrid: {
        cardRadius: '12px outer container, 8px inner modular blocks',
        gridPattern: 'Subtle 24px isometric technical dot-matrix with 5% opacity',
        composition: 'Orthogonal 3-column bento architecture with focal metric callouts'
      },
      iconographyStyle: '1.5px monoline vector icons, schematic bus connectors, zero decorative glow',
      aiImagePrompt: `Technical enterprise architecture diagram for ${entry.title}, clean isometric perspective, high-tech modular blocks in deep navy (#0B1120) and cobalt blue with emerald accents, subtle dot grid overlay, crisp technical typography, blueprint schematic style, 8k resolution, minimalist studio lighting, no chaotic gradient slop, professional corporate technology aesthetic`,
      recommendedForFormats: ['10-Slide Carousel Cover', 'Infographic Post', 'Feed Quote Card', 'YouTube Community Graphic']
    },
    {
      id: 'theme-executive-slate',
      themeName: 'Executive Boardroom Slate & Titanium',
      archetype: 'High-Authority C-Suite Briefing',
      visualMetaphor: `Engineered for CIOs and Board-level stakeholders: Subdued dark carbon foundation with warm amber metrics highlighting business ROI and strategic value realization over implementation noise.`,
      colorPalette: {
        name: 'Dark Slate & Strategic Amber',
        background: '#0F172A',
        surface: '#1E293B',
        primaryAccent: '#F59E0B',
        secondaryAccent: '#38BDF8',
        textPrimary: '#FFFFFF',
        textSecondary: '#94A3B8',
        border: '#334155'
      },
      typography: {
        displayFont: 'Outfit / Cinzel (SemiBold, crisp executive weight)',
        bodyFont: 'Inter (Regular & Medium, high legibility)',
        codeFont: 'Fira Code (for KPI percentages & architectural formulas)',
        hierarchyRule: 'Large statement metric (48px) paired with concise 14px executive caption'
      },
      geometryAndGrid: {
        cardRadius: '16px rounded prestige cards with 1px border highlights',
        gridPattern: 'Clean linear divider rules, 32px generous negative whitespace margins',
        composition: 'Single-column narrative hierarchy with side-by-side metric pillars'
      },
      iconographyStyle: 'Solid geometric shields, architectural pillar glyphs, refined stroke icons',
      aiImagePrompt: `Executive boardroom technology concept for ${entry.domain} transformation, premium dark slate (#0F172A) background with brushed titanium and warm amber lighting accents, elegant data visualization pillars, sharp crisp focal point, cinematic corporate photography style, understated luxury technology, hyper-realistic, 8k`,
      recommendedForFormats: ['Facebook Executive Post', 'Threads Viral Lead Card', 'YouTube Community Update']
    },
    {
      id: 'theme-swiss-minimalist',
      themeName: 'Swiss International Technical Grid',
      archetype: 'Ultra-Legible Editorial Technical Poster',
      visualMetaphor: `The purity of European modernist graphic design: Rigorous 8-column layout, uncompromised readability, stark contrast, and objective data hierarchy making complex system designs immediately scannable.`,
      colorPalette: {
        name: 'Stark Charcoal & Signal Crimson',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        primaryAccent: '#0F172A',
        secondaryAccent: '#EF4444',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        border: '#E2E8F0'
      },
      typography: {
        displayFont: 'Helvetica Neue / Neue Haas Grotesk (Heavy, 800)',
        bodyFont: 'Plus Jakarta Sans (Regular, 1.6 line height)',
        codeFont: 'IBM Plex Mono (tabular numerals for architecture costs)',
        hierarchyRule: 'Dramatic scale step ratio 1.33: Giant primary title, bold signal accents'
      },
      geometryAndGrid: {
        cardRadius: '0px sharp architectural borders with 2px solid framing',
        gridPattern: 'Visible light hairline crosshairs and metric index numbers',
        composition: 'Strict asymmetric grid with 60% negative space'
      },
      iconographyStyle: 'Solid black glyphs, crosshair targets, technical index tags (#01, #02)',
      aiImagePrompt: `Swiss modernist graphic design poster for enterprise architecture ${entry.title}, stark off-white background with pure black typography, bold international red accent line, technical coordinate markers, Bauhaus inspired layout, perfect negative space, editorial typography, museum exhibition quality, 8k`,
      recommendedForFormats: ['Instagram 4:5 Quote Card', 'Stories IQ Quiz', 'YouTube Community Text Banner']
    },
    {
      id: 'theme-neural-matrix',
      themeName: 'Deep Cyber Resiliency & Sentinel Pulse',
      archetype: 'Zero-Trust Cybernetic Infrastructure',
      visualMetaphor: `Continuous architectural surveillance: Dark obsidian void energized by neon telemetry lines representing real-time event-driven mesh, zero-trust perimeter defenses, and resilient enterprise data pipelines.`,
      colorPalette: {
        name: 'Obsidian Void & Sentinel Violet',
        background: '#05070D',
        surface: '#0B1020',
        primaryAccent: '#A855F7',
        secondaryAccent: '#14B8A6',
        textPrimary: '#F3F4F6',
        textSecondary: '#9CA3AF',
        border: '#1E2640'
      },
      typography: {
        displayFont: 'Syne (ExtraBold) / Orbitron',
        bodyFont: 'Sora / Inter (Crisp contrast)',
        codeFont: 'Cascadia Code (monospace telemetry logs)',
        hierarchyRule: 'Monospace status bar above, punchy display title, glowing telemetry bullets'
      },
      geometryAndGrid: {
        cardRadius: '8px chamfered or angular corner aesthetic',
        gridPattern: 'Hexagonal or isometric network graph connections',
        composition: 'Full-bleed HUD console aesthetic with telemetry badges'
      },
      iconographyStyle: 'Shield nodes, pulse vectors, encrypted lock indicators, wireframe polygons',
      aiImagePrompt: `Cyber resilient enterprise architecture HUD interface for ${entry.title}, deep obsidian black canvas with violet and turquoise holographic data streams, encrypted network nodes, clean vector geometry, zero noise, high contrast digital command center, cinematic depth of field, 8k`,
      recommendedForFormats: ['Instagram Reel On-Screen Graphics', 'YouTube Community Poll', 'Threads Debate Asset']
    }
  ];

  // YouTube Community Tab Post (Text & Poll Only - No Video)
  const youtubeCommunityPost = {
    communityTextPost: {
      hook: `🚨 ENTERPRISE ARCHITECTS: The biggest mistake companies make with ${entry.domain} in ${entry.gicsSector} isn't lack of budget—it's building on top of technical quicksand.`,
      body: `Today's Day #${entry.id} masterclass tackles: "${entry.title}".

Here is the reality our industry refuses to acknowledge:

1️⃣ The Legacy Trap: When you wrap legacy custom code with an AI wrapper, you don't get transformation—you get high-speed chaos.
2️⃣ The Clean Core Mandate: In ${ctx.sapContext}, business processes must be decoupled from the core database. Upgrades become non-events, and agentic workflows can execute with deterministic reliability.
3️⃣ Measured Value: By implementing this architectural pattern, leading organizations achieve ${ctx.metric}.

We've broken down the full end-to-end capability map, integration diagrams, and 2027 evolution roadmaps.`,
      keyTakeaways: [
        `Decouple ${entry.domain} custom logic into cloud-native side-by-side extension tiers`,
        `Deploy ${ctx.agentRole} with human-in-the-loop validation checkpoints`,
        `Target ${ctx.metric} while preserving audit-ready governance`
      ],
      callToAction: `💬 COMMUNITY QUESTION: Is your team currently refactoring your core ERP for Clean Core, or are you still maintaining custom legacy Z-tables? Drop your vote and perspective below!`
    },
    communityPoll: {
      question: `📊 [Day #${entry.id} Community Poll] What is your organization's primary hurdle when modernizing ${entry.domain} architecture?`,
      options: [
        'Decades of legacy custom code & technical debt',
        'Lack of executive alignment & business case',
        'Data fragmentation & siloed system APIs',
        'Skills gap in Agentic AI & Clean Core governance'
      ],
      discussionPrompt: 'Vote above, and reply with your battle scars from real-world transformations. Niladri Bihari Nayak is reading and discussing all replies today!'
    },
    infographicCaption: {
      headline: `ARCHITECTURE BLUEPRINT: ${entry.title} (Day #${entry.id}/365)`,
      caption: `Inspect today's architectural schema for ${entry.domain} in ${entry.gicsSector}.

Key System Components:
• Layer 1: Business Capability & Value Stream
• Layer 2: ${ctx.sapContext}
• Layer 3: Autonomous Agent Orchestration Fabric

Save this cheat sheet for your next architecture review board!`,
      hashtags: ['#EnterpriseArchitecture', '#YouTubeCommunity', '#SuccessLabsAcademy', '#SoftwareArchitecture', '#CleanCore']
    },
    pinnedComment: `📌 ARCHITECT NOTE FROM NILADRI: "Architecture isn't about drawing pretty boxes; it's about making irrevocable decisions reversible." Check the master 365-day curriculum in our channel links or comment your hardest bottleneck with ${entry.domain} below!`
  };

  // Daily Rollout Schedule across platforms
  const dailyRolloutSchedule = [
    {
      time: '08:00 AM',
      platform: 'WhatsApp' as const,
      format: 'Broadcast Channel Daily Brief & Voice Note',
      objective: 'Prime enterprise executives and channel subscribers while they commute or start their day.'
    },
    {
      time: '10:30 AM',
      platform: 'Instagram' as const,
      format: '10-Slide Carousel & Reel (9:16)',
      objective: 'High-visual engagement on explore feed, driving saves and ManyChat DM blueprint downloads.'
    },
    {
      time: '01:00 PM',
      platform: 'Threads' as const,
      format: '7-Post Viral Architecture Thread & Quote Take',
      objective: 'Spark peer-to-peer technical debate and viral reposts during midday tech breaks.'
    },
    {
      time: '02:30 PM',
      platform: 'YouTube' as const,
      format: 'YouTube Community Text Post & Poll (No Video)',
      objective: 'Engage YouTube channel subscribers with technical text insights, architecture polls, and subscriber debates.'
    },
    {
      time: '04:00 PM',
      platform: 'Facebook' as const,
      format: 'Long-Form Authority Post & Group Discussion',
      objective: 'Engage senior IT leaders, SAP communities, and enterprise consultants with in-depth analysis.'
    },
    {
      time: '07:30 PM',
      platform: 'Instagram' as const,
      format: '4-Frame Interactive Story Sequence (Poll + Quiz)',
      objective: 'Drive interactive community feedback, test audience architecture IQ, and capture evening viewers.'
    }
  ];

  return {
    dayId: entry.id,
    date: entry.date,
    title: entry.title,
    domain: entry.domain,
    phase: entry.phase,
    gicsSector: entry.gicsSector,
    instagram: {
      reel: {
        duration: '45 - 60s',
        hook3s: igReelShots[0].spokenWord,
        audioVibe: 'Minimalist tech synth / Deep house ambient, 118 BPM',
        visualShots: igReelShots,
        voiceoverScript: igReelVoiceover,
        caption: igReelCaption,
        hashtags: [
          '#EnterpriseArchitecture',
          '#SAPCleanCore',
          '#AgenticAI',
          `#${entry.domain.replace(/[^a-zA-Z]/g, '')}`,
          '#SuccessLabsAcademy',
          '#DigitalTransformation',
          '#EnterpriseAI',
          '#TechLeadership'
        ],
        manyChatKeyword: ctx.keyword
      },
      carousel: {
        title: entry.title,
        slides: igCarouselSlides,
        caption: igReelCaption,
        hashtags: [
          '#EnterpriseArchitecture',
          '#SAPCleanCore',
          '#BusinessArchitecture',
          '#SuccessLabsAcademy'
        ]
      },
      stories: igStories,
      feedPost: {
        headline: entry.title,
        quoteCardText: `“AI is not the architecture. AI is an accelerator. Clean Core is the context. Measurable business value is the destination.” — Niladri Bihari Nayak (Day #${entry.id})`,
        caption: igReelCaption
      }
    },
    facebook: {
      longFormPost: fbLongFormPost,
      reel: {
        script: igReelVoiceover,
        visualHook: igReelShots[0].visual,
        caption: fbLongFormPost.hook + '\n\n' + fbLongFormPost.discussionQuestion
      },
      story: {
        interactiveQuestion: `Day #${entry.id}: Are your ${entry.domain} processes ready for autonomous AI agents?`,
        pollOptions: ['Ready with Clean Core', 'Blocked by Technical Debt'],
        visualCues: 'Dark navy executive gradient with SuccessLabs Academy seal'
      },
      groupDiscussion: fbGroupDiscussion,
      eventAnnouncement: {
        eventTitle: `[Live Stream & Masterclass] Day #${entry.id}: ${entry.title}`,
        hook: fbLongFormPost.hook,
        agenda: [
          `00:00 - 05:00: The ${entry.domain} Crisis in ${sectorContext}`,
          '05:00 - 15:00: Business Architecture & Capability Mapping',
          `15:00 - 25:00: ${ctx.sapContext}`,
          `25:00 - 35:00: Agentic Orchestration & Human-in-the-Loop`,
          '35:00 - 45:00: Live Architecture Q&A with Niladri Bihari Nayak'
        ],
        liveTime: 'Daily at 18:00 UTC / 11:30 AM IST / 07:00 AM CET'
      }
    },
    whatsapp: {
      broadcastBrief: waBroadcastBrief,
      voiceNoteScript: waVoiceNoteScript,
      interactivePoll: waInteractivePoll,
      forwardableCheatSheet: waForwardableCheatSheet
    },
    threads: {
      viralThread: threadsViral,
      contrarianTake: threadsContrarianTake,
      communityDebate: threadsDebate
    },
    youtubePost: youtubeCommunityPost,
    visualThemes,
    dailyRolloutSchedule
  };
}
