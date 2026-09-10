import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { getCalendarEntryById, getTodayCalendarEntry, MASTER_CALENDAR } from './src/data/calendarData.ts';
import { generateMetaDayPack } from './src/data/metaRemixEngine.ts';

const SUCCESSLABS_SYSTEM_PROMPT = `You are Niladri Bihari Nayak, Lead Enterprise Architect, Strategist, and Founder of SuccessLabs Academy.
Your mission is to architect enterprise business transformation combining Business Architecture, Enterprise Architecture (TOGAF, capability modeling), SAP Platforms (S/4HANA, Clean Core, BTP, Joule), and Agentic AI.
You write authoritative, structured, and pragmatic architecture blueprints and social distribution packs across the Meta Suite (Instagram, Facebook, WhatsApp, Threads).`;

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    calendarTotalDays: MASTER_CALENDAR.length
  });
});

// Meta Suite Day Pack endpoint (Instant curated generation for all 365 days)
app.get('/api/meta/day/:id', (req, res) => {
  try {
    const dayId = Number(req.params.id);
    const entry = getCalendarEntryById(dayId) || MASTER_CALENDAR[0];
    const pack = generateMetaDayPack(entry);
    res.json(pack);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to generate Meta Day Pack' });
  }
});

// Copilot endpoint
app.post('/api/copilot/generate', async (req, res) => {
  try {
    const { command, dayId, userPrompt, analyticsData } = req.body;
    const targetDay = dayId ? getCalendarEntryById(Number(dayId)) : getTodayCalendarEntry();
    const entry = targetDay || MASTER_CALENDAR[0];

    const client = getGemini();

    // Construct prompt based on command
    let promptInstruction = '';
    const dateContext = `
TARGET DAY DETAILS:
- Day #: ${entry.id} of 365
- Date: ${entry.date} (${entry.dayOfWeek})
- Domain: ${entry.domain}
- Content Intent: ${entry.intent}
- Master Video Topic: "${entry.title}"
- Strategic Angle: ${entry.angle}
- GICS Sector Context: ${entry.gicsSector}
- 2027 Evolution Phase: ${entry.phase}
`;

    switch (command) {
      case 'META_REMIX':
        promptInstruction = `Generate a master cross-platform META SUITE REMIX for Day #${entry.id}: "${entry.title}".
Remix this topic specifically for:
1. **Instagram**: Reel script (hooks, audio vibe, 4-shot visual list), 10-slide Carousel outline, 4-frame Stories (Poll/Quiz), and Feed caption with ManyChat DM trigger.
2. **Facebook**: High-authority long-form executive post, Facebook Reel script, Community group debate starter, and Facebook Live event announcement.
3. **WhatsApp**: Broadcast Channel morning brief formatted in WhatsApp markdown (*bold*, _italic_), 60s Voice Note audio memo script for channel admin, Interactive 4-option Poll, and Forwardable Executive Cheat-Sheet.
4. **Threads**: 7-post viral thread cascade (🧵 1/7 to 7/7), contrarian sub-240 char hot take, and provocative reply-debate prompt.`;
        break;

      case 'INSTAGRAM_REEL':
        promptInstruction = `Write a high-converting Instagram Reel blueprint for Day #${entry.id}: "${entry.title}".
Format:
- 3-second visual & spoken hook
- Recommended audio vibe & BPM
- 4-part visual shot breakdown
- Exact word-for-word voiceover script (45-60s)
- Kinetic on-screen text overlays
- Feed caption with clean line breaks & ManyChat comment trigger keyword
- Targeted 3-tier hashtag cluster`;
        break;

      case 'INSTAGRAM_CAROUSEL':
        promptInstruction = `Design a 10-slide Instagram Carousel blueprint for Day #${entry.id}: "${entry.title}".
Provide Slide 1 (Hook Cover) through Slide 10 (Save & Share CTA).
For each slide provide: Slide Number, Tag, Headline, 3 Bullet Points, and Visual Diagram Description.
Include complete carousel caption.`;
        break;

      case 'WHATSAPP_BRIEF':
        promptInstruction = `Write the WhatsApp Broadcast Channel Daily Brief and Voice Note Script for Day #${entry.id}: "${entry.title}".
Use WhatsApp native markdown (*bold*, _italics_, • bullet lists).
Include:
1. Executive Morning Brief (readable in 60s)
2. 60-second voice note script for Niladri Bihari Nayak
3. Interactive WhatsApp Channel Poll
4. Forwardable 1-page ASCII cheat-sheet card`;
        break;

      case 'THREADS_CASCADE':
        promptInstruction = `Write a viral 7-post Threads cascade for Day #${entry.id}: "${entry.title}".
Each post must be under 300 characters.
Post 1: Contrarian hook (🧵 1/7)
Post 2: The enterprise friction (2/7)
Post 3: The 3-pillar blueprint (3/7)
Post 4: SAP Clean Core context (4/7)
Post 5: Agentic AI execution (5/7)
Post 6: The Architect's golden rule (6/7)
Post 7: CTA & community debate (7/7)
Also provide a 1-line contrarian hot take.`;
        break;

      case 'FACEBOOK_POST':
        promptInstruction = `Write a comprehensive, high-authority Facebook long-form thought leadership post for Day #${entry.id}: "${entry.title}".
Format with:
- Contrarian opening hook
- Enterprise challenge in ${entry.gicsSector}
- 3-Layer Solution (Business Architecture, SAP Clean Core, Agentic AI)
- 3 Actionable Executive Takeaways
- Community discussion question for enterprise architects & CIOs
- SuccessLabs Academy invitation`;
        break;

      case 'MOODBOARD':
        promptInstruction = `Generate 3 distinct, professional Visual Design Themes and Mood Board Concepts for Day #${entry.id}: "${entry.title}" (${entry.domain}, Sector: ${entry.gicsSector}).
The concept must directly reflect the day's specific content focus (e.g. Enterprise Architecture, SAP transformation, Clean Core, Agentic AI).

For EACH theme provide:
1. **Theme Name & Archetype**: (e.g., "SAP Clean Core Technical Minimalist", "Executive Slate & Titanium", "Swiss Technical Grid")
2. **Visual Metaphor**: Exactly how the visual geometry, lines, and layers communicate the technical topic (e.g. clean separation of S/4HANA core vs BTP extensions, no spaghetti code).
3. **Color Palette**: Hex codes & roles (Background, Surface, Primary Accent, Secondary Accent, Text Primary, Text Secondary, Border).
4. **Typography Pairing**: Display font, Body font, Monospace code font, and hierarchy rules.
5. **Geometry & Grid**: Corner radius, background grid texture (e.g. dot matrix, isometric mesh), framing.
6. **Iconography & Diagram Style**: Line weight, glyph types, node structure (NO AI slop or generic glowing blobs).
7. **AI Image Generator Prompt**: Ready-to-copy prompt for Imagen/Midjourney to generate social carousels, hero graphics, or slide backgrounds.
${userPrompt ? `\nUser Custom Style Request: "${userPrompt}"` : ''}`;
        break;

      case 'YOUTUBE_POST':
        promptInstruction = `Write a high-engagement YouTube Community Tab Post (Text & Poll Post - NOT A VIDEO) for Day #${entry.id}: "${entry.title}" (${entry.domain}).
Format with:
1. **Community Text Post**: Compelling contrarian hook, 3 digestible paragraphs, 3 bulleted key architectural takeaways, and a discussion question for YouTube subscribers.
2. **Community Interactive Poll**: Provocative architecture poll question with 4 realistic options.
3. **Infographic / Diagram Caption**: Descriptive text for static architectural cheat-sheet.
4. **Pinned Architect Comment**: Insightful pinned comment from Niladri Bihari Nayak.`;
        break;
      case 'TODAY':
      case 'SESSION_PACK':
        promptInstruction = `Generate the complete, authoritative LIVE SESSION PACK for Day #${entry.id}: "${entry.title}".
Format with clear markdown sections:
# LIVE SESSION PACK — DAY #${entry.id}: ${entry.date}
## 1. Primary Title & 3 Alternatives
- **Primary Title**: (Authority & curiosity balanced)
- **Search-focused**:
- **Curiosity-focused**:
- **Executive/Authority-focused**:

## 2. Live Session Promise
"By the end of this session, you will understand..."

## 3. High-CTR Thumbnail Direction
- **Main Visual Concept**:
- **3-6 Word Thumbnail Badge**:
- **Emotional Trigger**:
- **Layout & Contrast Palette**:

## 4. 12-Stage Live Stream Architecture
1. **Hook (0-60s)**: High-stakes business problem & contrarian question
2. **Why This Matters Now (2026/2027 context)**:
3. **Business Architecture**: Capabilities, value streams, operating model
4. **Enterprise Architecture**: Strategy, data, apps, tech & governance layers
5. **SAP Architecture**: Specific SAP landscape (S/4HANA, BTP, Clean Core, SuccessFactors/Ariba/CX/IBP)
6. **AI Architecture**: Assistant -> Copilot -> Agent -> Autonomous Process progression
7. **Human + AI**: Decision accountability & human-in-the-loop governance
8. **Industry Case Study (${entry.gicsSector})**: Problem -> Current State -> Architecture -> SAP -> AI -> Target State -> Outcome
9. **Architect's Takeaways (3-5 concrete action items)**:
10. **Audience Interaction (Opening poll, mid-session prompt, architecture challenge, closing question)**:
11. **Natural CTA**: SuccessLabs Academy invitation
12. **Next Video Bridge**: "Tomorrow we move from ${entry.domain} to..."

## 5. YouTube Metadata (SEO Description, Suggested Chapters & Tags)
`;
        break;

      case 'SCRIPT':
        promptInstruction = `Create the FULL PRESENTER TELEPROMPTER SCRIPT for Day #${entry.id}: "${entry.title}".
Use the voice of Niladri Bihari Nayak (SuccessLabs Academy).
Style: Authoritative, conversational, visionary, architecture-led.
Include exact opening hook words, slide cue markers, whiteboarding diagram instructions, pause cues, audience questions, and closing words.`;
        break;

      case 'SLIDES':
        promptInstruction = `Create an 8-to-10 slide presentation outline for Day #${entry.id}: "${entry.title}".
For each slide provide:
- Slide Number & Title
- Visual Diagram Blueprint (what enterprise architecture or SAP/AI diagram to display)
- Key Speaking Points (3 bullet points)
- Audience Checkpoint Question`;
        break;

      case 'DEMO':
        promptInstruction = `Design a live architectural demonstration for Day #${entry.id}: "${entry.title}".
Include:
1. Scenario Setup (${entry.gicsSector} sector)
2. Live Architecture Flow (Before vs. After)
3. SAP Context & BTP / Joule / Clean Core touchpoints
4. AI Agent Orchestration demonstration step-by-step
5. Live Architecture Walkthrough instructions for the presenter`;
        break;

      case 'THUMBNAIL':
        promptInstruction = `Generate 3 distinct high-converting YouTube Thumbnail Concepts for Day #${entry.id}: "${entry.title}".
Include visual elements, text badge (max 5 words), color scheme, facial expression guidance, and layout grid.`;
        break;

      case 'DESCRIPTION':
        promptInstruction = `Generate complete YouTube metadata for Day #${entry.id}: "${entry.title}".
Include:
- Compelling hook paragraph
- Key learning outcomes
- SAP, AI, and Enterprise Architecture relevance
- Suggested Chapters
- CTA & Subscribe links
- 10 targeted tags / hashtags`;
        break;

      case 'REPURPOSE':
        promptInstruction = `Create a multi-platform repurposing asset pack for Day #${entry.id}: "${entry.title}":
1. **LinkedIn Post**: High-value carousel-ready text post with contrarian architectural insight.
2. **YouTube Short Script (60s)**: High-tempo script with text-on-screen cues.
3. **Instagram Reel Concept**: Visual hook and script.
4. **Community Tab Poll**: Thought-provoking architectural debate question with 4 options.
5. **Executive Newsletter Snippet**: 250-word synthesis for business leaders.
6. **Future Video Spark**: 1 follow-up deep-dive topic generated from this session.`;
        break;

      case 'ANALYZE':
        promptInstruction = `You are in ANALYTICS COACH MODE.
Analyze the following YouTube Live session performance metrics for Day #${entry.id}: "${entry.title}".
Metrics:
- CTR: ${analyticsData?.ctr || '6.2'}%
- Average View Duration: ${analyticsData?.avgViewDuration || '11m 40s'}
- Average Percentage Viewed: ${analyticsData?.avgPercentageViewed || '48'}%
- Peak Concurrent Viewers: ${analyticsData?.peakConcurrentViewers || '142'}
- Returning Viewers: ${analyticsData?.returningViewersPct || '65'}%
- Top Audience Questions / Feedback: ${analyticsData?.topAudienceQuestions?.join('; ') || 'How does Clean Core affect custom AI agents?'}
- Presenter Notes: ${analyticsData?.notes || 'Audience loved the SAP BTP diagram; dropped off during data schema deep-dive'}

Provide a structured strategic diagnosis:
1. **What Worked**
2. **What Needs Adjustment**
3. **Retention & Hook Diagnosis**
4. **Specific Recommendations for Tomorrow's Session**
5. **Long-term Topic Strategy**`;
        break;

      case 'IMPROVE':
        promptInstruction = `Provide 5 actionable strategic improvements for upcoming sessions based on SuccessLabs Academy's master principles (EA + AI + SAP) and the current 2027 trend evolution (${entry.phase}).`;
        break;

      case 'NEXT':
        const nextDay = getCalendarEntryById(entry.id + 1) || MASTER_CALENDAR[0];
        promptInstruction = `Create a seamless narrative bridge connecting Day #${entry.id} ("${entry.title}" - ${entry.domain}) to Day #${nextDay.id} ("${nextDay.title}" - ${nextDay.domain}).
Explain how the business problem moves from ${entry.domain} into ${nextDay.domain} and how the enterprise architecture connects them.`;
        break;

      case 'WEEK':
        promptInstruction = `Provide a 7-day strategic briefing starting from Day #${entry.id}. Show the weekday domain rhythm (HR -> CRM -> Finance -> Procurement -> Supply Chain -> Enterprise Business -> Leadership), how the topics interconnect as one transformation journey, and the core outcome for the week.`;
        break;

      case 'CUSTOM':
      default:
        promptInstruction = userPrompt || `Prepare a comprehensive architectural brief for Day #${entry.id}: "${entry.title}".`;
        break;
    }

    if (client) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${dateContext}\n\n${promptInstruction}`,
          config: {
            systemInstruction: SUCCESSLABS_SYSTEM_PROMPT,
            temperature: 0.7
          }
        });
        return res.json({
          content: response.text,
          dayId: entry.id,
          command,
          source: 'gemini-api'
        });
      } catch (geminiError: any) {
        console.warn('Gemini API temporary issue, falling back to Architect Engine:', geminiError?.message || geminiError);
        const fallbackResponse = generateLocalArchitectResponse(command, entry, analyticsData, userPrompt);
        return res.json({
          content: fallbackResponse,
          dayId: entry.id,
          command,
          source: 'local-architect-engine-fallback'
        });
      }
    }

    // Fallback if GEMINI_API_KEY is not configured
    const fallbackResponse = generateLocalArchitectResponse(command, entry, analyticsData, userPrompt);
    return res.json({
      content: fallbackResponse,
      dayId: entry.id,
      command,
      source: 'local-architect-engine'
    });
  } catch (error: any) {
    console.error('Copilot Generation Error:', error);
    res.status(500).json({
      error: error.message || 'Error generating copilot response',
      details: String(error)
    });
  }
});

// Helper for offline / default responses
function generateLocalArchitectResponse(command: string, entry: any, analyticsData: any, customPrompt?: string): string {
  const nextEntry = getCalendarEntryById(entry.id + 1) || MASTER_CALENDAR[0];
  const metaPack = generateMetaDayPack(entry);

  if (command === 'MOODBOARD') {
    return `# AI VISUAL DESIGN THEMES & MOOD BOARD CONCEPTS — DAY #${entry.id}
**Topic:** "${entry.title}" (${entry.domain} | ${entry.gicsSector})

${metaPack.visualThemes.map((vt, i) => `### Concept ${i + 1}: ${vt.themeName}
- **Archetype:** ${vt.archetype}
- **Visual Metaphor:** ${vt.visualMetaphor}
- **Color Palette (${vt.colorPalette.name}):**
  • Background: \`${vt.colorPalette.background}\`
  • Surface: \`${vt.colorPalette.surface}\`
  • Primary Accent: \`${vt.colorPalette.primaryAccent}\`
  • Secondary Accent: \`${vt.colorPalette.secondaryAccent}\`
  • Text: \`${vt.colorPalette.textPrimary}\` / \`${vt.colorPalette.textSecondary}\`
  • Border: \`${vt.colorPalette.border}\`
- **Typography Pairing:**
  • Display: ${vt.typography.displayFont}
  • Body: ${vt.typography.bodyFont}
  • Code/Metrics: ${vt.typography.codeFont}
  • Rule: ${vt.typography.hierarchyRule}
- **Geometry & Grid:** ${vt.geometryAndGrid.cardRadius} | ${vt.geometryAndGrid.gridPattern} | ${vt.geometryAndGrid.composition}
- **Iconography Style:** ${vt.iconographyStyle}
- **AI Image Prompt (Midjourney / Imagen / Nano Banana):**
> \`${vt.aiImagePrompt}\`
- **Recommended For:** ${vt.recommendedForFormats.join(', ')}
`).join('\n---\n\n')}`;
  }

  if (command === 'YOUTUBE_POST') {
    return `# YOUTUBE COMMUNITY POST (NO VIDEO) — DAY #${entry.id}
**Topic:** ${entry.title} (${entry.domain})

---

### 1. Community Text Post
${metaPack.youtubePost.communityTextPost.hook}

${metaPack.youtubePost.communityTextPost.body}

**Key Strategic Takeaways:**
${metaPack.youtubePost.communityTextPost.keyTakeaways.map(t => `• ${t}`).join('\n')}

${metaPack.youtubePost.communityTextPost.callToAction}

---

### 2. Interactive Community Tab Poll
**Question:** ${metaPack.youtubePost.communityPoll.question}

**Options:**
${metaPack.youtubePost.communityPoll.options.map((opt, i) => `[Option ${i + 1}] ${opt}`).join('\n')}

*Prompt:* ${metaPack.youtubePost.communityPoll.discussionPrompt}

---

### 3. Infographic Diagram Caption
**Headline:** ${metaPack.youtubePost.infographicCaption.headline}

${metaPack.youtubePost.infographicCaption.caption}

${metaPack.youtubePost.infographicCaption.hashtags.join(' ')}

---

### 4. Pinned Community Comment
${metaPack.youtubePost.pinnedComment}`;
  }

  if (command === 'META_REMIX') {
    return `# META SUITE 365 REMIX PACK — DAY #${entry.id}: ${entry.title}
**Date:** ${entry.date} (${entry.dayOfWeek}) | **Domain:** ${entry.domain} | **Sector:** ${entry.gicsSector}

---

## 📸 1. INSTAGRAM BLUEPRINT
### A. Reel (9:16 Video - ${metaPack.instagram.reel.duration})
- **3-Second Hook:** ${metaPack.instagram.reel.hook3s}
- **Audio Vibe:** ${metaPack.instagram.reel.audioVibe}
- **ManyChat DM Trigger:** Comment "${metaPack.instagram.reel.manyChatKeyword}" to receive the full PDF blueprint
- **Voiceover Script:**
${metaPack.instagram.reel.voiceoverScript}

### B. 10-Slide Carousel Outline
${metaPack.instagram.carousel.slides.map(s => `Slide ${s.slideNum} [${s.tag}]: **${s.header}**\n- ${s.bulletPoints.join('\n- ')}\n*(Visual: ${s.visualDiagramDescription})*`).join('\n\n')}

---

## 📘 2. FACEBOOK EXECUTIVE POST
${metaPack.facebook.longFormPost.hook}

${metaPack.facebook.longFormPost.body}

**Key Strategic Takeaways:**
${metaPack.facebook.longFormPost.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

**Discussion Question:**
${metaPack.facebook.longFormPost.discussionQuestion}

---

## 💬 3. WHATSAPP BROADCAST CHANNEL BRIEF
${metaPack.whatsapp.broadcastBrief.headline}

${metaPack.whatsapp.broadcastBrief.formattedBody}

### 60-Second Audio Voice Note Script (Niladri Bihari Nayak)
${metaPack.whatsapp.voiceNoteScript.script}

---

## 🧵 4. THREADS VIRAL CASCADE (7-Part Thread)
${metaPack.threads.viralThread.map(p => `**Post ${p.postNumber}/${p.totalPosts}** (${p.characterCount} chars):\n${p.text}`).join('\n\n')}

**Contrarian Hot-Take:**
> ${metaPack.threads.contrarianTake.text}`;
  }

  if (command === 'INSTAGRAM_REEL') {
    return `# INSTAGRAM REEL BLUEPRINT — DAY #${entry.id}
**Topic:** ${entry.title} (${entry.domain})

- **Duration:** ${metaPack.instagram.reel.duration}
- **Audio Recommendation:** ${metaPack.instagram.reel.audioVibe}
- **Primary CTA / DM Automation:** Comment "${metaPack.instagram.reel.manyChatKeyword}"

---

### Shot-by-Shot Visual Breakdown:
${metaPack.instagram.reel.visualShots.map(s => `**[${s.time}]**
• Visual: ${s.visual}
• Spoken: ${s.spokenWord}
• On-Screen Text: \`${s.onScreenText}\``).join('\n\n')}

---

### Full Teleprompter Voiceover Script:
${metaPack.instagram.reel.voiceoverScript}

---

### Instagram Feed Caption:
${metaPack.instagram.reel.caption}`;
  }

  if (command === 'INSTAGRAM_CAROUSEL') {
    return `# 10-SLIDE INSTAGRAM CAROUSEL — DAY #${entry.id}
**Title:** ${entry.title}

${metaPack.instagram.carousel.slides.map(s => `### Slide ${s.slideNum} — ${s.tag}: ${s.header}
- **Graphic Concept:** ${s.visualDiagramDescription}
- **Key Points:**
${s.bulletPoints.map(p => `  • ${p}`).join('\n')}`).join('\n\n')}

---

### Carousel Caption:
${metaPack.instagram.carousel.caption}`;
  }

  if (command === 'WHATSAPP_BRIEF') {
    return `# WHATSAPP BROADCAST SUITE — DAY #${entry.id}

### 1. Broadcast Channel Daily Brief (WhatsApp Markdown)
${metaPack.whatsapp.broadcastBrief.formattedBody}

---

### 2. 60-Second Voice Memo Script (Niladri Bihari Nayak)
**Duration:** ${metaPack.whatsapp.voiceNoteScript.duration}
**Tone:** ${metaPack.whatsapp.voiceNoteScript.toneGuide}

${metaPack.whatsapp.voiceNoteScript.script}

---

### 3. Interactive Channel Poll
**Question:** ${metaPack.whatsapp.interactivePoll.question}
${metaPack.whatsapp.interactivePoll.options.join('\n')}

---

### 4. Forwardable Executive Cheat-Sheet Card
\`\`\`
${metaPack.whatsapp.forwardableCheatSheet.formattedCard}
\`\`\``;
  }

  if (command === 'THREADS_CASCADE') {
    return `# THREADS 7-PART VIRAL CASCADE — DAY #${entry.id}
**Topic:** ${entry.title}

${metaPack.threads.viralThread.map(p => `### Post ${p.postNumber}/7 (${p.characterCount} chars)
${p.text}
*(Visual Cue: ${p.visualCue})*`).join('\n\n')}

---

### Contrarian One-Liner / Quote Post:
"${metaPack.threads.contrarianTake.text}"

---

### Community Debate Question:
${metaPack.threads.communityDebate.question}`;
  }

  if (command === 'FACEBOOK_POST') {
    return `# FACEBOOK LONG-FORM THOUGHT LEADERSHIP — DAY #${entry.id}
**Topic:** ${entry.title}

${metaPack.facebook.longFormPost.hook}

${metaPack.facebook.longFormPost.body}

**Key Strategic Takeaways:**
${metaPack.facebook.longFormPost.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

**Discussion Question:**
${metaPack.facebook.longFormPost.discussionQuestion}

${metaPack.facebook.longFormPost.cta}`;
  }

  if (command === 'SCRIPT') {
    return `# PRESENTER SCRIPT — DAY #${entry.id}
**Topic:** ${entry.title}
**Domain:** ${entry.domain} | **Angle:** ${entry.angle} | **Sector:** ${entry.gicsSector}

---

### [00:00 - 01:00] THE HOOK
*(Look directly at lens. Confident, unhurried posture. No standard pleasantries.)*

"Welcome back to SuccessLabs Academy. I'm Niladri Bihari Nayak, and today we ask one non-negotiable question:

*When your organization deploys AI into ${entry.domain.toLowerCase()}, are you architecting for autonomous enterprise outcomes—or are you simply automating technical debt?*

Here is the reality most leaders are ignoring in 2026: AI without enterprise context creates expensive experiments. Enterprise Architecture is what turns those experiments into measurable business value.

Let's architect this."

---

### [01:00 - 05:00] WHY THIS MATTERS NOW
"Look at where we are in ${entry.phase}.
Organizations are moving past disconnected chatbots. In the ${entry.gicsSector} sector, operating models cannot afford hallucinated data or unaligned processes.

Today, we take our master chain:
**Business Problem → Business Architecture → Enterprise Architecture → SAP Context → AI Agents → Governance → Measurable Outcome.**"

---

### [05:00 - 15:00] THE ARCHITECTURAL BLUEPRINT
*(Draw on screen: 3-tier architecture: Foundation Layer, Context & Data Layer, Agentic Orchestration Layer)*

"Notice what happens when we anchor ${entry.domain} to SAP S/4HANA with Clean Core principles.
We keep the core clean, while SAP BTP and Joule act as the contextual intelligence fabric.

1. **Business Architecture**: Map the capability model before writing a single line of code.
2. **Data Context**: AI requires structured enterprise semantics.
3. **Agent Orchestration**: Autonomous agents execute within strict architectural boundaries."

---

### [15:00 - 20:00] AUDIENCE CHALLENGE & CLOSING
*(Address live chat comments)*
"Let me ask you: In your current landscape, where is the biggest bottleneck between your ${entry.domain} strategy and actual technology execution? Drop it in the chat right now.

Remember: Technology is not the architecture. Technology is one layer of the architecture.

Tomorrow, we move from **${entry.domain}** to **${nextEntry.domain}** as we tackle: *${nextEntry.title}*.

Subscribe to SuccessLabs Academy, join me tomorrow, and let's keep architecting for a better world."`;
  }

  if (command === 'SLIDES') {
    return `# SLIDE DECK OUTLINE — DAY #${entry.id}
**Title:** ${entry.title}
**Presenter:** Niladri Bihari Nayak | SuccessLabs Academy

---

### Slide 1: Title & The Core Problem
- **Headline**: ${entry.title}
- **Subtitle**: Architecting Measurable Business Value with EA, AI, and SAP
- **Visual Diagram**: The SuccessLabs 3-Pillar Triangle (Enterprise Architecture + AI + SAP)
- **Presenter Point**: Establish immediate authority; state the central business challenge.

### Slide 2: Why This Matters Now (2026–2027 Context)
- **Headline**: From Disconnected Experimentation to Autonomous Enterprise
- **Visual Diagram**: Trend curve showing Phase Evolution (${entry.phase})
- **Presenter Point**: Highlight why traditional automation falls short in ${entry.domain}.

### Slide 3: Business Architecture & Capability Mapping
- **Headline**: What Business Problem Are We Actually Solving?
- **Visual Diagram**: Level-1 & Level-2 Business Capability Map for ${entry.domain}
- **Presenter Point**: Frame capabilities, value streams, and executive stakeholders.

### Slide 4: Target Enterprise Architecture Blueprint
- **Headline**: The Architectural Layers of Transformation
- **Visual Diagram**: 5-layer stack (Business, Application, Data, AI, Governance)
- **Presenter Point**: Detail where agents reside and how integration operates.

### Slide 5: The SAP Platform Foundation
- **Headline**: SAP as the Enterprise Context Engine
- **Visual Diagram**: SAP Landscape (S/4HANA Clean Core + BTP + Joule + Domain Suite)
- **Presenter Point**: Explain Clean Core discipline and contextual data access.

### Slide 6: Agentic AI & Human-in-the-Loop Governance
- **Headline**: Assistant → Copilot → Agent → Autonomous Workflow
- **Visual Diagram**: Decision Governance Flowchart (Human-in-the-loop triggers)
- **Presenter Point**: Emphasize accountability, ethical guardrails, and audit trails.

### Slide 7: Industry Case Study (${entry.gicsSector})
- **Headline**: Real-World Architectural Application
- **Visual Diagram**: Before vs. After Transformation Architecture
- **Presenter Point**: Walk through Problem → Current State → Architecture → Target Outcome.

### Slide 8: The Architect's Takeaways & Action Plan
- **Headline**: What Should You Architect Tomorrow?
- **Visual Diagram**: 3-step immediate action roadmap
- **Presenter Point**: Provide concrete, non-fluff next steps for enterprise leaders.

### Slide 9: Bridge to Tomorrow
- **Headline**: Connecting the Journey
- **Visual Diagram**: Weekly Domain Flow Map (${entry.domain} → ${nextEntry.domain})
- **Presenter Point**: Tease tomorrow's session: *"${nextEntry.title}"*.`;
  }

  if (command === 'REPURPOSE') {
    return `# 6-IN-1 CONTENT REPURPOSING PACK — DAY #${entry.id}
**Topic:** ${entry.title}

---

### 1. LinkedIn Authority Post (Carousel-Ready)
Most enterprises are deploying AI backwards.

They buy AI tools, then search for business problems.
Then they discover their data is fragmented across legacy systems.

Here is the truth every CIO and Enterprise Architect must understand:

AI is not the architecture.
AI is an accelerator.
Enterprise Architecture is the foundation.
SAP is the enterprise context.
Measurable business outcomes are the destination.

In today's SuccessLabs Academy Live on "${entry.title}", we mapped out how to architect ${entry.domain.toLowerCase()} for the autonomous era.

Here are the 3 non-negotiable architectural principles:
1. Clean Core is prerequisite for trusted AI agents.
2. Business capability mapping must precede model selection.
3. Human-on-the-loop governance is non-optional.

Are you building AI experiments, or architecting enterprise value?

#EnterpriseArchitecture #SAP #AI #DigitalTransformation #SuccessLabsAcademy

---

### 2. YouTube Short / TikTok Script (60s)
[00:00 - 00:05] (Text on screen: "Will AI replace Enterprise Architects?")
"Stop asking if AI will replace architects. Ask if your enterprise is even architected to use AI safely!"

[00:05 - 00:25]
"Here is the problem: In ${entry.domain}, companies are plugging AI into 15-year-old custom code. When the AI hallucinates, who takes responsibility?"

[00:25 - 00:45]
"The solution is what we call the SAP Clean Core + AI Agent Architecture. You keep your core clean, use SAP BTP as your integration spine, and anchor every AI agent to verified enterprise business data."

[00:45 - 00:60]
"Watch today's full live session on SuccessLabs Academy. Link in bio!"

---

### 3. Instagram Reel Concept
- **Visual**: Quick whiteboarding demonstration showing a tangled mess labeled "AI without EA" versus a clean, layered stack labeled "Architecture-led AI".
- **Audio Hook**: "Let's architect this in 30 seconds."
- **Caption**: The difference between a $2M AI experiment and a $20M business transformation is Enterprise Architecture.

---

### 4. YouTube Community Tab Poll
**Question**: When deploying AI into your ${entry.domain} processes, what is currently your biggest hurdle?
- A) Fragmented data across legacy SAP/non-SAP systems
- B) Lack of clear Business Architecture & capability maps
- C) Security, bias & human oversight governance
- D) Culture and executive alignment

---

### 5. Executive Newsletter Synthesis (The 2-Minute Architect)
**Subject**: Why ${entry.domain} AI Transformations Fail (And How to Architect Them)
Leaders often view AI as an IT upgrade. But as we demonstrated in today's session on *${entry.title}*, successful transformation requires treating AI as an operating model evolution.

By establishing a robust business capability baseline and leveraging SAP's contextual data layer, architects can transform routine workflows into autonomous, governed value streams.

---

### 6. Tomorrow's Video Bridge
"Today we solved the ${entry.domain} architecture dilemma. Tomorrow, we transition to **${nextEntry.domain}** with: *${nextEntry.title}*."`;
  }

  // Default Session Pack
  return `# SUCCESSLABS ACADEMY — LIVE SESSION PACK
## Day #${entry.id}: ${entry.date} (${entry.dayOfWeek})
**Domain:** ${entry.domain} | **Intent:** ${entry.intent.toUpperCase()} | **Context:** ${entry.gicsSector}

---

### A. RECOMMENDED YOUTUBE TITLES
1. **Primary Title (Authority & Search)**: ${entry.title}
2. **Curiosity Alternative**: Why 80% of ${entry.domain} AI Projects Fail (And the Architecture That Fixes Them)
3. **Executive Alternative**: The 2027 ${entry.domain} Architecture Playbook: AI, SAP, and Autonomous Operations

---

### B. LIVE SESSION PROMISE
> "By the end of this session, you will understand how to architect an AI-ready ${entry.domain.toLowerCase()} operating model using SAP context and enterprise architecture governance."

---

### C. HIGH-CTR THUMBNAIL DIRECTION
- **Visual Concept**: Split screen — Left side: complex legacy ${entry.domain} spaghetti architecture; Right side: clean autonomous agent flow centered on SAP Clean Core.
- **Badge Text (3-5 words)**: **${entry.domain.toUpperCase()} AI BLUEPRINT**
- **Emotional Trigger**: High-contrast curiosity + executive clarity.
- **Palette**: Deep SAP Slate (#0F172A), Enterprise Sapphire (#1E3A8A), and Warning Amber accent (#F59E0B).

---

### D. 12-STAGE LIVE STREAM RUN OF SHOW
1. **Hook (00:00 - 01:30)**: "${entry.hook}"
2. **Why This Matters Now (01:30 - 05:00)**: 2026/2027 landscape in ${entry.phase} and why disconnected AI tools fail without enterprise context.
3. **Business Architecture (05:00 - 12:00)**: Capability mapping, value streams, and stakeholder accountability in ${entry.domain}.
4. **Enterprise Architecture (12:00 - 20:00)**: The 5-layer target architecture blueprint (Strategy, Data, Application, AI, Governance).
5. **SAP Architecture (20:00 - 28:00)**: S/4HANA Clean Core, BTP integration, and SAP Business AI context.
6. **AI Architecture (28:00 - 36:00)**: Moving from Assistants to Autonomous Multi-Agent Workflows.
7. **Human + AI (36:00 - 42:00)**: Human-on-the-loop decision boundaries and auditability.
8. **Industry Case Study (42:00 - 50:00)**: ${entry.gicsSector} Sector Case Study: Problem → Architecture → Outcome.
9. **Architect's Takeaways (50:00 - 55:00)**: 3 actionable steps every enterprise leader can execute this week.
10. **Audience Interaction (55:00 - 58:00)**: Live Q&A and architecture debate.
11. **Natural CTA (58:00 - 59:30)**: "${entry.cta}"
12. **Next Video Bridge (59:30 - 60:00)**: "Tomorrow we move from ${entry.domain} to ${nextEntry.domain}: *${nextEntry.title}*."

---

### E. SUGGESTED CHAPTERS
${entry.suggestedChapters.join('\n')}

---

### F. SEO DESCRIPTION & HASHTAGS
In this live session of SuccessLabs Academy, Enterprise Architecture strategist Niladri Bihari Nayak breaks down "${entry.title}". Learn how enterprise architects combine AI, SAP platforms, and business architecture to unlock sustainable transformation.

#EnterpriseArchitecture #SAP #AI #SuccessLabsAcademy #${entry.domain.replace(/[^a-zA-Z]/g, '')}`;
}

// Vite middleware in dev or static files in production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SuccessLabs Academy Meta Suite Live Architect server running on http://0.0.0.0:${PORT}`);
  });
}

start();
