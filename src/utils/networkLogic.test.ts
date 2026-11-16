import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgressStats,
  calculateSubnetInfo,
  evaluateQuiz,
  parseIpv4,
  searchCurriculum,
} from './networkLogic';
import type { GlossaryTerm, Lesson } from '../types/curriculum';

const sampleLessons: Lesson[] = [
  {
    id: 'm1',
    number: '01',
    title: 'Hálózati alapok',
    subtitle: 'LAN, WAN és topológiák',
    estimatedMinutes: 15,
    difficulty: 'Kezdő',
    simulationType: 'topology',
    simulationTitle: 'Topológia szimulátor',
    simulationDescription: 'Star és Mesh összehasonlítás',
    theorySections: [
      {
        id: 't1',
        title: 'Switch és Router alapok',
        content: 'A Switch a helyi hálózaton belüli MAC address alapú továbbítást végzi.',
        keyPoints: ['Star topológia'],
      },
    ],
    keyTerms: ['LAN', 'Switch'],
    packetTracerLab: {
      title: 'Első Switch topológia',
      scenario: 'Köss össze két PC-t egy Switch segítségével.',
      devicesNeeded: ['1x 2960 Switch', '2x PC'],
      steps: [
        { id: 's1', instruction: 'Helyezd el a Switch-et' },
        { id: 's2', instruction: 'Kábelezd össze a PC-ket' },
      ],
      expectedOutcome: 'Zöld link LED-ek',
    },
    quiz: [
      {
        id: 'q1',
        question: 'Melyik eszköz köti össze a PC-ket egy LAN-ban?',
        options: ['Switch', 'Monitor'],
        correctIndex: 0,
        explanation: 'A Switch Layer 2 kapcsolást biztosít.',
      },
      {
        id: 'q2',
        question: 'Mi a LAN rövidítése?',
        options: ['Local Area Network', 'Large Array Node'],
        correctIndex: 0,
        explanation: 'Local Area Network.',
      },
    ],
  },
  {
    id: 'm2',
    number: '02',
    title: 'VLAN és Trunk',
    subtitle: '802.1Q szegmentálás',
    estimatedMinutes: 25,
    difficulty: 'Középhaladó',
    simulationType: 'vlan-trunk',
    simulationTitle: 'VLAN szimulátor',
    simulationDescription: 'Broadcast Domain szétválasztás',
    theorySections: [
      {
        id: 't2',
        title: 'Trunk portok',
        content: 'A Trunk link több VLAN forgalmát szállítja egyszerre 802.1Q címkével.',
        keyPoints: ['Access vs Trunk'],
        cliTip: 'switchport mode trunk',
      },
    ],
    keyTerms: ['VLAN', 'Trunk'],
    packetTracerLab: {
      title: 'VLAN 10 konfiguráció',
      scenario: 'Hozz létre VLAN 10-et.',
      devicesNeeded: ['1x 2960 Switch'],
      steps: [{ id: 's3', instruction: 'vlan 10 parancs' }],
      expectedOutcome: 'VLAN 10 aktív',
    },
    quiz: [
      {
        id: 'q3',
        question: 'Melyik szabvány írja le a VLAN Trunk címkézést?',
        options: ['IEEE 802.1Q', 'IEEE 802.11'],
        correctIndex: 0,
        explanation: 'Az IEEE 802.1Q illeszti be a 4 bájtos VLAN tag-et.',
      },
    ],
  },
];

const sampleGlossary: GlossaryTerm[] = [
  {
    id: 'g-vlan',
    term: 'VLAN',
    fullName: 'Virtual Local Area Network',
    category: 'Switching és VLAN',
    definition: 'Logikai hálózati szegmentálás egy fizikai Switch-en belül.',
    example: 'VLAN 10 (Sales) és VLAN 20 (IT) elkülönítése.',
    relatedLessonId: 'm2',
  },
  {
    id: 'g-mac',
    term: 'MAC address',
    fullName: 'Media Access Control address',
    category: 'Alapok',
    definition: '48 bites fizikai hardvercím a hálózati kártyán.',
    example: '00:1A:2B:3C:4D:5E',
    relatedLessonId: 'm1',
  },
];

test('parseIpv4 validates standard IPv4 addresses and rejects invalid ones', () => {
  assert.deepEqual(parseIpv4('192.168.1.10'), [192, 168, 1, 10]);
  assert.equal(parseIpv4('256.1.1.1'), null);
  assert.equal(parseIpv4('192.168.1'), null);
  assert.equal(parseIpv4('abc.1.1.1'), null);
});

test('calculateSubnetInfo computes /24 and /26 subnets accurately', () => {
  const s24 = calculateSubnetInfo('192.168.10.45', 24);
  assert.equal(s24.valid, true);
  assert.equal(s24.subnetMask, '255.255.255.0');
  assert.equal(s24.networkAddress, '192.168.10.0');
  assert.equal(s24.broadcastAddress, '192.168.10.255');
  assert.equal(s24.firstUsableHost, '192.168.10.1');
  assert.equal(s24.lastUsableHost, '192.168.10.254');
  assert.equal(s24.usableHosts, 254);
  assert.equal(s24.isPrivate, true);
  assert.equal(s24.ipClass, 'C');

  const s26 = calculateSubnetInfo('10.0.5.130', 26);
  assert.equal(s26.subnetMask, '255.255.255.192');
  assert.equal(s26.networkAddress, '10.0.5.128');
  assert.equal(s26.broadcastAddress, '10.0.5.191');
  assert.equal(s26.firstUsableHost, '10.0.5.129');
  assert.equal(s26.lastUsableHost, '10.0.5.190');
  assert.equal(s26.usableHosts, 62);
  assert.equal(s26.isPrivate, true);
  assert.equal(s26.ipClass, 'A');
});

test('evaluateQuiz scores answers and determines pass status', () => {
  const passResult = evaluateQuiz(sampleLessons[0].quiz, { q1: 0, q2: 0 }, '2026-01-01T00:00:00Z');
  assert.equal(passResult.score, 2);
  assert.equal(passResult.total, 2);
  assert.equal(passResult.passed, true);

  const failResult = evaluateQuiz(sampleLessons[0].quiz, { q1: 0, q2: 1 }, '2026-01-01T00:00:00Z');
  assert.equal(failResult.score, 1);
  assert.equal(failResult.passed, false);
});

test('calculateProgressStats aggregates lessons, quizzes, and lab steps into level and percentage', () => {
  const emptyStats = calculateProgressStats(sampleLessons, [], {}, {});
  assert.equal(emptyStats.overallPercent, 0);
  assert.equal(emptyStats.levelNumber, 1);

  const partialStats = calculateProgressStats(
    sampleLessons,
    ['m1'],
    {
      m1: { score: 2, total: 2, passed: true, selectedAnswers: {}, completedAt: '' },
    },
    {
      m1: ['s1', 's2'],
    }
  );
  // 1/2 lessons (22.5%) + 1/2 quizzes (17.5%) + 2/3 labs (13.33%) = ~53%
  assert.equal(partialStats.completedLessonsCount, 1);
  assert.equal(partialStats.passedQuizzesCount, 1);
  assert.equal(partialStats.completedLabStepsCount, 2);
  assert.equal(partialStats.overallPercent, 53);
  assert.equal(partialStats.levelNumber, 3);
});

test('searchCurriculum ranks exact glossary and lesson matches first', () => {
  const results = searchCurriculum('VLAN', sampleLessons, sampleGlossary);
  assert.ok(results.length >= 2);
  assert.equal(results[0].type, 'glossary');
  assert.equal(results[0].title, 'VLAN');
  assert.ok(results.some((r) => r.type === 'lesson' && r.targetLessonId === 'm2'));
});
