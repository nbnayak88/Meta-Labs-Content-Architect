export type DomainType =
  | 'HR'
  | 'CRM / Customer Experience'
  | 'Finance'
  | 'Procurement'
  | 'Supply Chain'
  | 'Enterprise Business'
  | 'Leadership / Mixed';

export type IntentType = 'authority' | 'help' | 'search';

export type PhaseType =
  | 'Phase 1: Foundation (Sep-Dec 2026)'
  | 'Phase 2: Agentic Transformation (Jan-Mar 2027)'
  | 'Phase 3: Autonomous Enterprise (Apr-Jun 2027)'
  | 'Phase 4: 2028 Horizon (Jul-Sep 2027)';

export type GICSSector =
  | 'Energy'
  | 'Materials'
  | 'Industrials'
  | 'Consumer Discretionary'
  | 'Consumer Staples'
  | 'Health Care'
  | 'Financials'
  | 'Information Technology'
  | 'Communication Services'
  | 'Utilities'
  | 'Real Estate'
  | 'As applicable';

export interface MinuteSpeakerNote {
  minuteRange: string; // e.g. "00:00 - 02:00"
  stage: string; // e.g. "Stage 1: Hook & Big Promise"
  speakerScript: string; // Spoken words for Niladri
  slideVisual: string; // What slide / architectural diagram to present
  keyQuestionOrCta: string; // Chat prompt or architecture challenge
  architectureFocus: string; // EA / SAP / AI focus
}

export interface CalendarEntry {
  id: number;
  date: string; // e.g. "11 Sep 2026"
  isoDate: string; // "2026-09-11"
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  domain: DomainType;
  intent: IntentType;
  title: string;
  angle: string;
  gicsSector: GICSSector;
  phase: PhaseType;
  hook?: string;
  suggestedChapters?: string[];
  cta?: string;
  minuteByMinuteNotes?: MinuteSpeakerNote[];
  gammaPresentationUrl?: string;
}

export interface LiveSessionPack {
  dayId: number;
  primaryTitle: string;
  titleAlternatives: {
    search: string;
    curiosity: string;
    authority: string;
  };
  promise: string;
  thumbnail: {
    visualConcept: string;
    badgeText: string;
    emotionalTrigger: string;
    layout: string;
    colorPalette: string[];
  };
  liveStructure: {
    hook: string;
    whyThisMattersNow: string;
    businessArchitecture: string;
    enterpriseArchitecture: string;
    sapArchitecture: string;
    aiArchitecture: string;
    humanPlusAi: string;
    industryCaseStudy: string;
    architectsTakeaway: string[];
    audienceInteraction: {
      openingPoll: string;
      midSessionQuestion: string;
      architectureChallenge: string;
      closingQuestion: string;
    };
    cta: string;
    nextVideoBridge: string;
  };
  runOfShow: Array<{
    timing: string;
    section: string;
    presenterNotes: string;
    visualAction: string;
  }>;
  youtubeMetadata: {
    description: string;
    suggestedChapters: string;
    hashtags: string[];
  };
  repurposingPlan: {
    linkedInPost: string;
    youtubeShortScript: string;
    instagramReelConcept: string;
    communityPost: string;
    newsletterInsight: string;
    futureVideoFollowUp: string;
  };
  slideOutline: Array<{
    slideNumber: number;
    title: string;
    bulletPoints: string[];
    visualDiagramPrompt: string;
  }>;
}

export interface AnalyticsEntry {
  dayId: number;
  date: string;
  ctr: number; // e.g. 7.4%
  avgViewDuration: string; // e.g. "9m 42s"
  avgPercentageViewed: number; // e.g. 52%
  watchTimeHours: number;
  peakConcurrentViewers: number;
  returningViewersPct: number;
  subscribersGained: number;
  topAudienceQuestions: string[];
  notes: string;
  aiStrategicInsights?: string;
}

export type CopilotCommand =
  | 'TODAY'
  | 'TOMORROW'
  | 'WEEK'
  | 'MONTH'
  | 'DEEP DIVE'
  | 'SCRIPT'
  | 'SLIDES'
  | 'DEMO'
  | 'THUMBNAIL'
  | 'DESCRIPTION'
  | 'REPURPOSE'
  | 'ANALYZE'
  | 'IMPROVE'
  | 'NEXT'
  | 'META_REMIX'
  | 'MOODBOARD'
  | 'YOUTUBE_POST'
  | 'INSTAGRAM_REEL'
  | 'INSTAGRAM_CAROUSEL'
  | 'WHATSAPP_BRIEF'
  | 'THREADS_CASCADE'
  | 'FACEBOOK_POST';

export type MetaPlatform = 'all' | 'facebook' | 'instagram' | 'whatsapp' | 'threads' | 'youtube';

export interface MoodBoardConcept {
  id: string;
  themeName: string;
  archetype: string;
  visualMetaphor: string;
  colorPalette: {
    name: string;
    background: string;
    surface: string;
    primaryAccent: string;
    secondaryAccent: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    codeFont: string;
    hierarchyRule: string;
  };
  geometryAndGrid: {
    cardRadius: string;
    gridPattern: string;
    composition: string;
  };
  iconographyStyle: string;
  aiImagePrompt: string;
  recommendedForFormats: string[];
}

export interface MetaReelShot {
  time: string;
  visual: string;
  spokenWord: string;
  onScreenText: string;
}

export interface MetaCarouselSlide {
  slideNum: number;
  type: string;
  header: string;
  bulletPoints: string[];
  visualDiagramDescription: string;
  tag: string;
}

export interface MetaStoryFrame {
  frameNum: number;
  stickerType: 'poll' | 'quiz' | 'question' | 'link';
  questionOrTitle: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  visualBg: string;
  ctaText: string;
}

export interface MetaThreadPost {
  postNumber: number;
  totalPosts: number;
  text: string;
  visualCue?: string;
  characterCount: number;
}

export interface MetaDayPack {
  dayId: number;
  date: string;
  title: string;
  domain: DomainType;
  phase: PhaseType;
  gicsSector: GICSSector;
  instagram: {
    reel: {
      duration: string;
      hook3s: string;
      audioVibe: string;
      visualShots: MetaReelShot[];
      voiceoverScript: string;
      caption: string;
      hashtags: string[];
      manyChatKeyword: string;
    };
    carousel: {
      title: string;
      slides: MetaCarouselSlide[];
      caption: string;
      hashtags: string[];
    };
    stories: MetaStoryFrame[];
    feedPost: {
      headline: string;
      quoteCardText: string;
      caption: string;
    };
  };
  facebook: {
    longFormPost: {
      hook: string;
      body: string;
      keyTakeaways: string[];
      discussionQuestion: string;
      cta: string;
    };
    reel: {
      script: string;
      visualHook: string;
      caption: string;
    };
    story: {
      interactiveQuestion: string;
      pollOptions: [string, string];
      visualCues: string;
    };
    groupDiscussion: {
      promptTitle: string;
      coreDebate: string;
      starterQuestions: string[];
    };
    eventAnnouncement: {
      eventTitle: string;
      hook: string;
      agenda: string[];
      liveTime: string;
    };
  };
  whatsapp: {
    broadcastBrief: {
      headline: string;
      formattedBody: string;
      keyBulletPoints: string[];
      forwardPrompt: string;
    };
    voiceNoteScript: {
      duration: string;
      toneGuide: string;
      script: string;
      closingCta: string;
    };
    interactivePoll: {
      question: string;
      options: string[];
      contextNote: string;
    };
    forwardableCheatSheet: {
      cardTitle: string;
      formattedCard: string;
    };
  };
  threads: {
    viralThread: MetaThreadPost[];
    contrarianTake: {
      text: string;
      characterCount: number;
    };
    communityDebate: {
      question: string;
      context: string;
    };
  };
  youtubePost: {
    communityTextPost: {
      hook: string;
      body: string;
      keyTakeaways: string[];
      callToAction: string;
    };
    communityPoll: {
      question: string;
      options: string[];
      discussionPrompt: string;
    };
    infographicCaption: {
      headline: string;
      caption: string;
      hashtags: string[];
    };
    pinnedComment: string;
  };
  visualThemes: MoodBoardConcept[];
  dailyRolloutSchedule: Array<{
    time: string;
    platform: 'WhatsApp' | 'Instagram' | 'Threads' | 'Facebook' | 'YouTube';
    format: string;
    objective: string;
  }>;
}

