import type {
  GlossaryTerm,
  Lesson,
  ProgressStats,
  QuizQuestion,
  QuizResult,
  SearchResultItem,
} from '../types/curriculum';

export interface SubnetInfo {
  valid: boolean;
  ip: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipBinaryOctets: string[];
  maskBinaryOctets: string[];
  ipClass: 'A' | 'B' | 'C' | 'D' | 'E';
  isPrivate: boolean;
}

const LEVELS = [
  { minPercent: 0, levelNumber: 1, title: '1. szint: Hálózati felfedező' },
  { minPercent: 20, levelNumber: 2, title: '2. szint: Kábel- és Switch-technikus' },
  { minPercent: 45, levelNumber: 3, title: '3. szint: IP-címzés specialista' },
  { minPercent: 70, levelNumber: 4, title: '4. szint: Routing és VLAN adminisztrátor' },
  { minPercent: 95, levelNumber: 5, title: '5. szint: Önálló hálózattervező mérnök' },
];

export function calculateProgressStats(
  lessons: Lesson[],
  completedLessons: string[],
  quizScores: Record<string, QuizResult>,
  completedLabSteps: Record<string, string[]>
): ProgressStats {
  const totalLessonsCount = lessons.length;
  const completedSet = new Set(completedLessons);
  const completedLessonsCount = lessons.filter((l) => completedSet.has(l.id)).length;

  let passedQuizzesCount = 0;
  let totalLabStepsCount = 0;
  let completedLabStepsCount = 0;

  for (const lesson of lessons) {
    if (quizScores[lesson.id]?.passed) {
      passedQuizzesCount += 1;
    }
    const stepIds = new Set(lesson.packetTracerLab.steps.map((s) => s.id));
    totalLabStepsCount += stepIds.size;
    const doneSteps = completedLabSteps[lesson.id] ?? [];
    for (const stepId of doneSteps) {
      if (stepIds.has(stepId)) {
        completedLabStepsCount += 1;
      }
    }
  }

  // Weighted completion: 45% lessons marked complete, 35% quizzes passed, 20% Packet Tracer lab steps
  const lessonRatio = totalLessonsCount > 0 ? completedLessonsCount / totalLessonsCount : 0;
  const quizRatio = totalLessonsCount > 0 ? passedQuizzesCount / totalLessonsCount : 0;
  const labRatio = totalLabStepsCount > 0 ? completedLabStepsCount / totalLabStepsCount : 0;

  const overallPercent = Math.min(
    100,
    Math.round((lessonRatio * 0.45 + quizRatio * 0.35 + labRatio * 0.2) * 100)
  );

  let currentIdx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (overallPercent >= LEVELS[i].minPercent) {
      currentIdx = i;
    }
  }

  return {
    completedLessonsCount,
    totalLessonsCount,
    passedQuizzesCount,
    completedLabStepsCount,
    totalLabStepsCount,
    overallPercent,
    levelNumber: LEVELS[currentIdx].levelNumber,
    levelTitle: LEVELS[currentIdx].title,
    nextLevelTitle: currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1].title : null,
  };
}

export function evaluateQuiz(
  questions: QuizQuestion[],
  selectedAnswers: Record<string, number>,
  completedAt: string = new Date().toISOString()
): QuizResult {
  const total = questions.length;
  let score = 0;

  for (const q of questions) {
    if (selectedAnswers[q.id] === q.correctIndex) {
      score += 1;
    }
  }

  const ratio = total > 0 ? score / total : 0;
  const passed = ratio >= 0.66;

  return {
    score,
    total,
    passed,
    selectedAnswers: { ...selectedAnswers },
    completedAt,
  };
}

export function searchCurriculum(
  query: string,
  lessons: Lesson[],
  glossary: GlossaryTerm[]
): SearchResultItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const results: SearchResultItem[] = [];

  for (const lesson of lessons) {
    let score = 0;
    const titleLower = lesson.title.toLowerCase();
    const subtitleLower = lesson.subtitle.toLowerCase();
    const termsLower = lesson.keyTerms.join(' ').toLowerCase();
    const theoryText = lesson.theorySections
      .map((s) => `${s.title} ${s.content} ${s.keyPoints.join(' ')} ${s.cliTip ?? ''}`)
      .join(' ')
      .toLowerCase();

    for (const token of tokens) {
      if (titleLower.includes(token)) score += 10;
      if (termsLower.includes(token)) score += 7;
      if (subtitleLower.includes(token)) score += 5;
      if (theoryText.includes(token)) score += 2;
    }

    if (score > 0) {
      results.push({
        id: `lesson-${lesson.id}`,
        type: 'lesson',
        title: `${lesson.number}. ${lesson.title}`,
        subtitle: `Lecke · ${lesson.difficulty}`,
        matchSnippet: lesson.subtitle,
        targetLessonId: lesson.id,
        score,
      });
    }

    const labText = `${lesson.packetTracerLab.title} ${lesson.packetTracerLab.scenario} ${lesson.packetTracerLab.steps
      .map((s) => `${s.instruction} ${s.commandSnippet ?? ''}`)
      .join(' ')}`.toLowerCase();

    let labScore = 0;
    for (const token of tokens) {
      if (lesson.packetTracerLab.title.toLowerCase().includes(token)) labScore += 8;
      else if (labText.includes(token)) labScore += 3;
    }

    if (labScore > 0) {
      results.push({
        id: `lab-${lesson.id}`,
        type: 'lab',
        title: lesson.packetTracerLab.title,
        subtitle: `Packet Tracer labor · ${lesson.number}. lecke`,
        matchSnippet: lesson.packetTracerLab.scenario,
        targetLessonId: lesson.id,
        score: labScore,
      });
    }
  }

  for (const entry of glossary) {
    let score = 0;
    const termLower = entry.term.toLowerCase();
    const fullLower = (entry.fullName ?? '').toLowerCase();
    const defLower = entry.definition.toLowerCase();

    for (const token of tokens) {
      if (termLower === token) score += 20;
      else if (termLower.includes(token)) score += 12;
      if (fullLower.includes(token)) score += 6;
      if (defLower.includes(token)) score += 3;
    }

    if (score > 0) {
      results.push({
        id: `glossary-${entry.id}`,
        type: 'glossary',
        title: entry.term,
        subtitle: `Szótár · ${entry.category}`,
        matchSnippet: entry.definition,
        targetGlossaryId: entry.id,
        targetLessonId: entry.relatedLessonId,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 18);
}

export function parseIpv4(ip: string): number[] | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return null;
    const num = Number(p);
    if (num < 0 || num > 255) return null;
    octets.push(num);
  }
  return octets;
}

export function octetsToUint32(octets: number[]): number {
  return (
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  );
}

export function uint32ToIp(val: number): string {
  return [
    (val >>> 24) & 255,
    (val >>> 16) & 255,
    (val >>> 8) & 255,
    val & 255,
  ].join('.');
}

export function toBinaryOctets(val: number): string[] {
  return [
    ((val >>> 24) & 255).toString(2).padStart(8, '0'),
    ((val >>> 16) & 255).toString(2).padStart(8, '0'),
    ((val >>> 8) & 255).toString(2).padStart(8, '0'),
    (val & 255).toString(2).padStart(8, '0'),
  ];
}

export function calculateSubnetInfo(ip: string, cidr: number): SubnetInfo {
  const octets = parseIpv4(ip);
  const clampedCidr = Math.max(1, Math.min(32, Math.floor(cidr)));

  if (!octets) {
    return {
      valid: false,
      ip,
      cidr: clampedCidr,
      subnetMask: '0.0.0.0',
      wildcardMask: '255.255.255.255',
      networkAddress: '0.0.0.0',
      broadcastAddress: '0.0.0.0',
      firstUsableHost: '0.0.0.0',
      lastUsableHost: '0.0.0.0',
      totalAddresses: 0,
      usableHosts: 0,
      ipBinaryOctets: ['00000000', '00000000', '00000000', '00000000'],
      maskBinaryOctets: ['00000000', '00000000', '00000000', '00000000'],
      ipClass: 'C',
      isPrivate: false,
    };
  }

  const ipInt = octetsToUint32(octets);
  const maskInt = clampedCidr === 0 ? 0 : (0xffffffff << (32 - clampedCidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const totalAddresses = Math.pow(2, 32 - clampedCidr);
  const usableHosts =
    clampedCidr === 32 ? 1 : clampedCidr === 31 ? 2 : Math.max(0, totalAddresses - 2);

  const firstHostInt =
    clampedCidr >= 31 ? networkInt : (networkInt + 1) >>> 0;
  const lastHostInt =
    clampedCidr >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;

  const firstOctet = octets[0];
  const secondOctet = octets[1];

  let ipClass: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  if (firstOctet >= 240) ipClass = 'E';
  else if (firstOctet >= 224) ipClass = 'D';
  else if (firstOctet >= 192) ipClass = 'C';
  else if (firstOctet >= 128) ipClass = 'B';

  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ||
    (firstOctet === 192 && secondOctet === 168);

  return {
    valid: true,
    ip: octets.join('.'),
    cidr: clampedCidr,
    subnetMask: uint32ToIp(maskInt),
    wildcardMask: uint32ToIp(wildcardInt),
    networkAddress: uint32ToIp(networkInt),
    broadcastAddress: uint32ToIp(broadcastInt),
    firstUsableHost: uint32ToIp(firstHostInt),
    lastUsableHost: uint32ToIp(lastHostInt),
    totalAddresses,
    usableHosts,
    ipBinaryOctets: toBinaryOctets(ipInt),
    maskBinaryOctets: toBinaryOctets(maskInt),
    ipClass,
    isPrivate,
  };
}
