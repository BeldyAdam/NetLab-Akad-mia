export type SimulationType =
  | 'topology'
  | 'osi-encapsulation'
  | 'switch-mac-table'
  | 'subnet-calculator'
  | 'router-forwarding'
  | 'vlan-trunk'
  | 'dhcp-nat'
  | 'capstone-verify';

export type GlossaryCategory =
  | 'Alapok'
  | 'Switching és VLAN'
  | 'IP és Routing'
  | 'Szolgáltatások';

export interface GlossaryTerm {
  id: string;
  term: string;
  fullName?: string;
  category: GlossaryCategory;
  definition: string;
  example: string;
  relatedLessonId?: string;
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  cliTip?: string;
}

export interface LabStep {
  id: string;
  instruction: string;
  commandSnippet?: string;
  verificationHint?: string;
}

export interface PacketTracerLab {
  title: string;
  scenario: string;
  devicesNeeded: string[];
  steps: LabStep[];
  expectedOutcome: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: 'Kezdő' | 'Alapozó' | 'Középhaladó' | 'Haladó' | 'Záróprojekt';
  simulationType: SimulationType;
  simulationTitle: string;
  simulationDescription: string;
  theorySections: TheorySection[];
  keyTerms: string[];
  packetTracerLab: PacketTracerLab;
  quiz: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  selectedAnswers: Record<string, number>;
  completedAt: string;
}

export interface LessonNote {
  content: string;
  updatedAt: string;
}

export interface ProgressStats {
  completedLessonsCount: number;
  totalLessonsCount: number;
  passedQuizzesCount: number;
  completedLabStepsCount: number;
  totalLabStepsCount: number;
  overallPercent: number;
  levelNumber: number;
  levelTitle: string;
  nextLevelTitle: string | null;
}

export interface SearchResultItem {
  id: string;
  type: 'lesson' | 'glossary' | 'lab';
  title: string;
  subtitle: string;
  matchSnippet: string;
  targetLessonId?: string;
  targetGlossaryId?: string;
  score: number;
}
