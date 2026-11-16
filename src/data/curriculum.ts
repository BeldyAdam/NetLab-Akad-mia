import type { Lesson } from '../types/curriculum';

export const CURRICULUM_LESSONS: Lesson[] = [
  {
    id: 'module-1',
    number: '01',
    title: 'Hálózati alapok és topológiák',
    subtitle: 'LAN, WAN, fizikai topológiák és az első lépések Cisco Packet Tracerben',
    estimatedMinutes: 15,
    difficulty: 'Kezdő',
    simulationType: 'topology',
    simulationTitle: 'Interaktív Topológia Hibatűrő Szimulátor',
    simulationDescription:
      'Válts a Star és Full Mesh topológia között, majd kattints egy kábelre vagy a központi Switch-re a kapcsolat megszakításához. Figyeld meg, hogyan változik a hálózat elérhetősége!',
    keyTerms: ['LAN', 'WAN', 'Star Topology', 'Switch', 'Bandwidth'],
    theorySections: [
      {
        id: 'm1-s1',
        title: 'Mi az a számítógépes hálózat?',
        content:
          'A számítógépes hálózat két vagy több eszköz összekapcsolása adatcsere és erőforrás-megosztás céljából. Méret és földrajzi kiterjedés alapján megkülönböztetünk LAN (Local Area Network — egy épületen belüli gyors helyi hálózat) és WAN (Wide Area Network — városokat vagy országokat összekötő hálózat) rendszereket.',
        keyPoints: [
          'A LAN általában saját tulajdonú kábeleken és Switch eszközökön fut (pl. 1 Gbps vagy 10 Gbps Bandwidth).',
          'A WAN összeköttetést jellemzően távközlési szolgáltatók (ISP) biztosítják Router-ek között.',
          'A Bandwidth (sávszélesség) az elméleti maximum, míg a Throughput a ténylegesen átvitt adatmennyiség.',
        ],
      },
      {
        id: 'm1-s2',
        title: 'Fizikai és logikai topológiák',
        content:
          'A topológia megmutatja, hogyan helyezkednek el és kapcsolódnak egymáshoz az eszközök. A mai modern irodai hálózatokban szinte kizárólag a Star (csillag) topológiát használjuk, ahol minden végberendezés egy központi Switch-hez csatlakozik. Nagyobb megbízhatóságú gerinchálózatoknál Partial Mesh vagy Full Mesh redundáns kapcsolatokat alkalmazunk.',
        keyPoints: [
          'Star topológia előnye: egyetlen kábel hibája csak egy PC-t érint, könnyen bővíthető.',
          'Star topológia kockázata: ha a központi Switch meghibásodik, az alatta lévő szegmens leáll (Single Point of Failure).',
          'Mesh topológia előnye: több alternatív útvonal áll rendelkezésre, így egy kábel szakadása nem bontja meg a forgalmat.',
        ],
        cliTip: 'Cisco Packet Tracer kábelezési alapszabály: Különböző rétegű eszközök (PC ↔ Switch, Switch ↔ Router) közé Copper Straight-Through kábel kell!',
      },
    ],
    packetTracerLab: {
      title: '1. Labor: Első Star topológia megépítése',
      scenario:
        'Nyisd meg a Cisco Packet Tracer alkalmazást a számítógépeden, és építs fel egy alapvető 3 gépes irodai LAN hálózatot!',
      devicesNeeded: ['1× 2960-24TT Switch', '3× PC-PT (PC0, PC1, PC2)', '3× Copper Straight-Through kábel'],
      steps: [
        {
          id: 'm1-lab-1',
          instruction:
            'Az alsó eszköztárról válaszd a Network Devices → Switches kategóriát, és húzz a munkaterületre egy 2960-as Switch-et.',
        },
        {
          id: 'm1-lab-2',
          instruction:
            'Az End Devices → End Devices menüből helyezz el három PC-t (PC0, PC1, PC2) a Switch köré Star topológiában.',
        },
        {
          id: 'm1-lab-3',
          instruction:
            'A Connections (villám ikon) közül válaszd a Copper Straight-Through (folytonos fekete vonal) kábelt, és kösd össze mindhárom PC FastEthernet0 portját a Switch FastEthernet0/1, 0/2, 0/3 portjaival.',
          verificationHint: 'Várj ~30 másodpercet (vagy kattints a Fast Forward Time gombra), amíg a narancssárga port LED-ek zöldre váltanak.',
        },
        {
          id: 'm1-lab-4',
          instruction:
            'Állíts be ideiglenes IP címet a PC-ken (Desktop → IP Configuration): PC0 = 192.168.1.10, PC1 = 192.168.1.11, PC2 = 192.168.1.12 (Subnet Mask: 255.255.255.0), majd teszteld a kapcsolatot Command Prompt-ból.',
          commandSnippet: 'ping 192.168.1.11',
          verificationHint: 'Sikeres esetben 4× "Reply from 192.168.1.11" választ kapsz.',
        },
      ],
      expectedOutcome:
        'Mindhárom PC zöld link jelzéssel kapcsolódik a Switch-hez, és a ping parancs 0% packet loss eredménnyel fut le.',
    },
    quiz: [
      {
        id: 'm1-q1',
        question: 'Melyik topológiát használják leggyakrabban a modern irodai LAN hálózatokban?',
        options: ['Bus topológia koaxiális kábellel', 'Star topológia központi Switch-csel', 'Token Ring gyűrű'],
        correctIndex: 1,
        explanation:
          'A modern Ethernet LAN-ok szinte kivétel nélkül Star (vagy hierarchikus Extended Star) topológiát használnak központi Switch segítségével.',
      },
      {
        id: 'm1-q2',
        question: 'Milyen kábelt kell választani Cisco Packet Tracerben egy PC és egy Switch összekötéséhez?',
        options: ['Copper Straight-Through', 'Copper Cross-Over', 'Serial DCE'],
        correctIndex: 0,
        explanation:
          'Különböző típusú eszközök (PC és Switch) összekapcsolásához egyenes (Straight-Through) UTP kábelt használunk.',
      },
      {
        id: 'm1-q3',
        question: 'Mi a különbség a Bandwidth és a Throughput között?',
        options: [
          'A Bandwidth az elméleti maximális kapacitás, a Throughput pedig a ténylegesen mért adatátvitel.',
          'A Throughput mindig nagyobb, mint a Bandwidth.',
          'Nincs különbség, ugyanazt jelentik.',
        ],
        correctIndex: 0,
        explanation:
          'A protokollfejlécek, torlódások és késleltetések miatt a valós Throughput mindig alacsonyabb vagy legfeljebb egyenlő a névleges Bandwidth-szel.',
      },
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'Az OSI és a TCP/IP modell',
    subtitle: 'A 7 rétegű kommunikációs lánc, Encapsulation és PDU egységek',
    estimatedMinutes: 20,
    difficulty: 'Kezdő',
    simulationType: 'osi-encapsulation',
    simulationTitle: 'OSI Encapsulation & PDU Folyamatszimulátor',
    simulationDescription:
      'Léptesd végig egy HTTP kérés útját az OSI modell 7 rétegén lefelé (Encapsulation), majd a fogadó oldalon felfelé (Decapsulation). Figyeld meg a fejléc-bővülést!',
    keyTerms: ['OSI Model', 'Encapsulation', 'PDU', 'Segment', 'Packet', 'Frame'],
    theorySections: [
      {
        id: 'm2-s1',
        title: 'Miért van szükség rétegzett modellre?',
        content:
          'A hálózati kommunikáció rendkívül összetett feladat: a böngészőben begépelt webcímtől a rézkábelen utazó elektromos impulzusokig rengeteg folyamat zajlik. Az OSI (Open Systems Interconnection) modell ezt 7 jól elkülöníthető rétegre bontja, hogy a különböző gyártók eszközei és szoftverei zökkenőmentesen együttműködhessenek.',
        keyPoints: [
          '7. Application · 6. Presentation · 5. Session (alkalmazási funkciók, TCP/IP-ben együttesen Application réteg).',
          '4. Transport: megbízható szállítás (TCP) vagy gyors szállítás (UDP), portszámok (pl. 80, 443) — PDU: Segment.',
          '3. Network: logikai IP címzés és útválasztás (Router) — PDU: Packet.',
          '2. Data Link: fizikai MAC címzés és hibadetektálás (Switch) — PDU: Frame.',
          '1. Physical: bitek átvitele kábelen, optikán vagy rádión — PDU: Bit.',
        ],
      },
      {
        id: 'm2-s2',
        title: 'Encapsulation (Beágyazás)',
        content:
          'Amikor adatot küldünk, az információ fentről lefelé halad a rétegeken. Minden réteg hozzácsatolja a saját vezérlőinformációit tartalmazó fejlécét (Header) az előző réteg adatához. A Data Link réteg egy záró Trailer-t (FCS hibajavító kódot) is hozzátesz.',
        keyPoints: [
          'Küldő oldalon: Encapsulation (fejlécek hozzáadása fentről lefelé).',
          'Vevő oldalon: Decapsulation (fejlécek lefejtése alulról felfelé).',
          'Jegyezd meg a PDU sorrendet: Data → Segment → Packet → Frame → Bits!',
        ],
      },
    ],
    packetTracerLab: {
      title: '2. Labor: PDU-k megfigyelése Simulation módban',
      scenario:
        'Vizsgáld meg az előző hálózatodon vagy egy Web Serverrel bővített topológián, hogyan épülnek fel a rétegek a Packet Tracer Simulation nézetében!',
      devicesNeeded: ['1× 2960 Switch', '1× PC0', '1× Server-PT (HTTP/Web Server)'],
      steps: [
        {
          id: 'm2-lab-1',
          instruction:
            'Adj hozzá a Switch-hez egy Server-PT eszközt (IP: 192.168.1.100 / 255.255.255.0). Ellenőrizd a Services → HTTP fülön, hogy a HTTP szolgáltatás ON állapotban van.',
        },
        {
          id: 'm2-lab-2',
          instruction:
            'A jobb alsó sarokban válts át Realtime módból Simulation módba, majd az Event List Filters-nél kapcsold be a HTTP és TCP megjelenítését.',
        },
        {
          id: 'm2-lab-3',
          instruction:
            'Nyisd meg PC0 → Desktop → Web Browser alkalmazását, írd be a címsorba a 192.168.1.100 címet, és nyomd meg a Go gombot.',
        },
        {
          id: 'm2-lab-4',
          instruction:
            'Kattints a színes borítékra (PDU) az Event List-ben vagy a munkaterületen, és nézd meg az OSI Model fülön a Layer 7-től Layer 1-ig tartó rétegfelépítést!',
          verificationHint: 'Látni fogod a Layer 4 TCP portot (Dest Port: 80), a Layer 3 IP címet és a Layer 2 MAC címeket.',
        },
      ],
      expectedOutcome:
        'Megértetted az Outbound és Inbound PDU rétegek szerkezetét a Packet Tracer valós idejű szimulátorában.',
    },
    quiz: [
      {
        id: 'm2-q1',
        question: 'Mi a neve a Layer 3 (Network) rétegen továbbított adategységnek (PDU)?',
        options: ['Segment', 'Packet', 'Frame'],
        correctIndex: 1,
        explanation: 'A Network (Layer 3) réteg adategysége a Packet, amely már tartalmazza a forrás és cél IP-címet.',
      },
      {
        id: 'm2-q2',
        question: 'Melyik OSI rétegen történik a MAC address alapú címzés és az FCS hibakeresés?',
        options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
        correctIndex: 0,
        explanation: 'A Layer 2 (Data Link) felel a MAC címzésért és a Frame összeállításáért.',
      },
      {
        id: 'm2-q3',
        question: 'Melyik protokoll biztosít megbízható, nyugtázott szállítást a Layer 4 rétegen?',
        options: ['ARP', 'TCP', 'IP'],
        correctIndex: 1,
        explanation: 'A TCP (Transmission Control Protocol) háromutas kézfogással és nyugtázással garantálja az adatok célba érését.',
      },
    ],
  },
  {
    id: 'module-3',
    number: '03',
    title: 'Ethernet, MAC address és Switching',
    subtitle: 'Hogyan tanulja meg a Switch a hálózati gépeket, és hogyan működik az ARP?',
    estimatedMinutes: 25,
    difficulty: 'Alapozó',
    simulationType: 'switch-mac-table',
    simulationTitle: 'Switch MAC Table Tanulási Szimulátor',
    simulationDescription:
      'Küldj Frame-et PC-A-ról PC-C-re egy üres Switch-en keresztül! Figyeld meg az első körös Flooding jelenséget, a MAC Table feltöltődését, majd a második körös célzott Unicast továbbítást.',
    keyTerms: ['Switch', 'MAC address', 'MAC Address Table', 'ARP', 'Collision Domain', 'Broadcast Domain'],
    theorySections: [
      {
        id: 'm3-s1',
        title: 'A 48 bites MAC address felépítése',
        content:
          'Minden Ethernet hálózati kártya rendelkezik egy egyedi, gyárilag beégetett fizikai címmel, a MAC address-szel. Ez 48 bit hosszú, amit 12 hexadecimális karakterrel írunk le (pl. 00:1A:2B:3C:4D:5E). Az első 24 bit (OUI) a gyártót azonosítja, a második 24 bit pedig az adott kártya egyedi sorszáma.',
        keyPoints: [
          'A Broadcast MAC address minden bitje 1-es: FF:FF:FF:FF:FF:FF.',
          'A Switch kizárólag a Layer 2 Ethernet Frame fejlécét (Source és Destination MAC) olvassa.',
          'A MAC address csak ugyanabban a Broadcast Domain-ben (LAN-ban) érvényes.',
        ],
      },
      {
        id: 'm3-s2',
        title: 'A Switch működési elve: Learn, Flood, Forward',
        content:
          'Bekapcsoláskor a Switch MAC Address Table-je teljesen üres. Amikor egy Frame érkezik egy porton, a Switch két lépést hajt végre: először megtanulja (Learn) a forrás MAC address-t a beérkező porthoz rendelve. Ezután megnézi a cél MAC-et: ha még nem ismeri, vagy az Broadcast, kiküldi minden más aktív porton (Flood). Ha már ismeri a célportot, csak oda továbbítja (Forward).',
        keyPoints: [
          'Unknown Unicast Flooding: az első kommunikációnál a Switch mindenhová továbbít (kivéve a forrás portot).',
          'A megtanult bejegyzések alapértelmezetten 300 másodpercig (5 percig) maradnak a táblában inaktivitás esetén.',
          'Mielőtt a PC elküldi az IP csomagot, az ARP protokoll Broadcast kéréssel kideríti a cél IP-hez tartozó MAC címet.',
        ],
        cliTip: 'Switch# show mac address-table   |   PC> arp -a',
      },
    ],
    packetTracerLab: {
      title: '3. Labor: Switch MAC Table és ARP vizsgálat',
      scenario:
        'Vizsgáld meg Cisco IOS CLI segítségével, hogyan töltődik fel a 2960-as Switch MAC táblája valós forgalom hatására.',
      devicesNeeded: ['1× 2960 Switch', '3× PC-PT (192.168.1.10, .11, .12)'],
      steps: [
        {
          id: 'm3-lab-1',
          instruction:
            'Kattints a Switch-re → CLI fülre, lépj be Privileged EXEC módba, és ellenőrizd, hogy a MAC tábla üres vagy minimális.',
          commandSnippet: 'enable\nshow mac address-table',
        },
        {
          id: 'm3-lab-2',
          instruction:
            'PC0 Command Prompt-jából indíts egy pinget PC2 (192.168.1.12) felé, majd nézd meg PC0 lokális ARP tábláját.',
          commandSnippet: 'ping 192.168.1.12\narp -a',
          verificationHint: 'Az "arp -a" kimenetében meg kell jelennie a 192.168.1.12 IP mellett PC2 dinamikusan megtanult MAC address-ének.',
        },
        {
          id: 'm3-lab-3',
          instruction:
            'Futtasd újra a Switch CLI-ben a tábla lekérdezést, és azonosítsd, melyik porton melyik PC MAC címe jelent meg.',
          commandSnippet: 'show mac address-table dynamic',
        },
      ],
      expectedOutcome:
        'Látod a DYNAMIC típusú bejegyzéseket a Fa0/1 és Fa0/3 portokhoz rendelve, valamint a PC0 ARP cache bejegyzését.',
    },
    quiz: [
      {
        id: 'm3-q1',
        question: 'Melyik mező alapján dönti el a Switch, hogyan tanulja meg a bejegyzést a MAC táblába?',
        options: ['Destination MAC address', 'Source MAC address', 'Destination IP address'],
        correctIndex: 1,
        explanation:
          'A Switch mindig a bejövő Frame Source MAC address mezőjét köti össze azzal a fizikai porttal, amelyen a Frame megérkezett.',
      },
      {
        id: 'm3-q2',
        question: 'Mit tesz a Switch, ha egy olyan Unicast cél MAC-re kap Frame-et, amely még nem szerepel a MAC Table-ben?',
        options: [
          'Eldobja a Frame-et (Drop)',
          'Kiküldi minden porton, kivéve azon, amelyiken érkezett (Flood)',
          'Visszaküldi a forrásnak',
        ],
        correctIndex: 1,
        explanation:
          'Ismeretlen Unicast (Unknown Unicast) esetén a Switch Flooding segítségével minden többi aktív portra kiküldi a Frame-et.',
      },
      {
        id: 'm3-q3',
        question: 'Mire szolgál az ARP protokoll?',
        options: [
          'Ismert IPv4 címhez tartozó fizikai MAC address kiderítésére',
          'Két Router közötti sebesség tesztelésére',
          'Automatikus IP cím kiosztására',
        ],
        correctIndex: 0,
        explanation:
          'Az Address Resolution Protocol (ARP) feloldja a Layer 3 IPv4 címet Layer 2 MAC address-szé a helyi hálózaton.',
      },
    ],
  },
  {
    id: 'module-4',
    number: '04',
    title: 'IPv4 címzés és Subnetting',
    subtitle: 'Bináris alapok, Subnet Mask, CIDR jelölés és alhálózatok számítása',
    estimatedMinutes: 35,
    difficulty: 'Középhaladó',
    simulationType: 'subnet-calculator',
    simulationTitle: 'Interaktív IPv4 Bináris & Subnetting Szimulátor',
    simulationDescription:
      'Adj meg bármilyen IPv4 címet és húzd a CIDR csúszkát (/8-tól /30-ig)! Azonnal láthatod a 32 bites bináris bontást, a Network Address-t, Broadcast-ot és a használható host tartományt.',
    keyTerms: ['IPv4 Address', 'Subnet Mask', 'CIDR', 'Subnetting'],
    theorySections: [
      {
        id: 'm4-s1',
        title: 'Hálózati és Host rész szétválasztása',
        content:
          'Egy 32 bites IPv4 cím önmagában nem mondja meg, hol ér véget a hálózat azonosítója és hol kezdődik a gép azonosítója. Ehhez mindig kell egy Subnet Mask (pl. 255.255.255.0 vagy röviden /24). Ahol a maszk binárisan 1-es, ott a hálózati rész (Network ID) van; ahol 0-s, ott a végberendezések (Host ID) kapnak helyet.',
        keyPoints: [
          'A legelső cím az alhálózatban a Network Address (nem adható ki PC-nek!).',
          'A legutolsó cím a Broadcast Address (szintén nem adható ki PC-nek!).',
          'Használható hostok száma = 2^h - 2, ahol h a host bitek száma (pl. /24-nél 2^8 - 2 = 254 gép).',
        ],
      },
      {
        id: 'm4-s2',
        title: 'Private (RFC 1918) vs Public IP címek',
        content:
          'Az interneten közvetlenül útválasztható Public IP címek száma véges, ezért belső vállalati és otthoni hálózatokban ingyenesen használható Private IP tartományokat alkalmazunk. Ezek nem jutnak ki közvetlenül az internetre NAT nélkül.',
        keyPoints: [
          '10.0.0.0 /8 (10.0.0.0 – 10.255.255.255) — nagyvállalati belső tartomány.',
          '172.16.0.0 /12 (172.16.0.0 – 172.31.255.255) — közepes hálózatok.',
          '192.168.0.0 /16 (192.168.0.0 – 192.168.255.255) — irodai és otthoni LAN-ok.',
          'Subnetting példa: a 192.168.1.0/26 maszkja 255.255.255.192, blokkmérete 64 (0, 64, 128, 192), egy alhálózatban 62 használható IP van.',
        ],
      },
    ],
    packetTracerLab: {
      title: '4. Labor: Két /26-os alhálózat szétválasztása',
      scenario:
        'A 192.168.10.0/24 tartományt bontsd fel /26-os alhálózatokra! Helyezz két PC-t az első alhálózatba (192.168.10.0/26) és egy harmadik PC-t a második alhálózatba (192.168.10.64/26), majd ellenőrizd, mi történik Router nélkül.',
      devicesNeeded: ['1× 2960 Switch', '3× PC-PT'],
      steps: [
        {
          id: 'm4-lab-1',
          instruction:
            'PC0 IP címe legyen 192.168.10.10, Subnet Mask: 255.255.255.192 (/26). PC1 IP címe: 192.168.10.20, Subnet Mask: 255.255.255.192.',
        },
        {
          id: 'm4-lab-2',
          instruction:
            'PC2 kerüljön a második alhálózatba: IP = 192.168.10.70, Subnet Mask: 255.255.255.192.',
        },
        {
          id: 'm4-lab-3',
          instruction:
            'PC0-ról pingeld meg PC1-et (192.168.10.20), majd próbáld megpingelni PC2-t (192.168.10.70)!',
          commandSnippet: 'ping 192.168.10.20\nping 192.168.10.70',
          verificationHint: 'PC1 válaszol, mert azonos /26-os alhálózatban van. PC2-nél "Request timed out", mert Router nélkül a két külön alhálózat nem kommunikál!',
        },
      ],
      expectedOutcome:
        'Gyakorlatban is bizonyítottad, hogy a Subnet Mask szabja meg az alhálózati határokat — külön alhálózatok között Layer 3 Router kell.',
    },
    quiz: [
      {
        id: 'm4-q1',
        question: 'Mennyi használható host IP cím van egy /26-os (255.255.255.192) alhálózatban?',
        options: ['64', '62', '30'],
        correctIndex: 1,
        explanation: '32 - 26 = 6 host bit. 2^6 - 2 = 64 - 2 = 62 használható cím (a Network és a Broadcast cím levonása után).',
      },
      {
        id: 'm4-q2',
        question: 'Melyik a 192.168.5.130/25 cím hálózati címe (Network Address)?',
        options: ['192.168.5.0', '192.168.5.128', '192.168.5.129'],
        correctIndex: 1,
        explanation: 'A /25-ös alhálózatok blokkmérete 128 (0–127 és 128–255). A .130 a második blokkba esik, tehát a Network Address 192.168.5.128.',
      },
      {
        id: 'm4-q3',
        question: 'Az alábbiak közül melyik számít Private (RFC 1918) IP címnek?',
        options: ['172.20.14.5', '172.35.10.1', '192.169.1.10'],
        correctIndex: 0,
        explanation: 'A Private B-osztályú tartomány 172.16.0.0-tól 172.31.255.255-ig tart, így a 172.20.14.5 privát cím.',
      },
    ],
  },
  {
    id: 'module-5',
    number: '05',
    title: 'Routing és a Default Gateway',
    subtitle: 'Layer 3 útválasztás, Packet utazása Router-en át és Static Routing',
    estimatedMinutes: 30,
    difficulty: 'Középhaladó',
    simulationType: 'router-forwarding',
    simulationTitle: 'Packet Útja a Router-en Keresztül Szimulátor',
    simulationDescription:
      'Indíts el egy Packet-et PC1-ről (192.168.1.10) a távoli Szerverre (10.0.2.50)! Figyeld meg a kulisszatitkot: az IP címek végig változatlanok maradnak, míg a Layer 2 MAC címek minden ugrásnál (Hop) kicserélődnek!',
    keyTerms: ['Router', 'Default Gateway', 'Routing Table', 'Static Route', 'ICMP', 'CLI'],
    theorySections: [
      {
        id: 'm5-s1',
        title: 'Hogyan dönt a PC és a Router?',
        content:
          'Amikor PC1 adatot akar küldeni egy másik gépre, először a saját Subnet Mask-jával ellenőrzi, hogy a cél IP ugyanabban az alhálózatban van-e. Ha igen, közvetlenül ARP-pal lekéri a cél MAC-jét. Ha más alhálózatban van, a Frame-et a Default Gateway (a helyi Router interfésze) MAC címére küldi el.',
        keyPoints: [
          'A Router minden interfésze külön Broadcast Domain és külön IP alhálózat.',
          'Továbbításkor a Router lefejti a régi Layer 2 Frame-et, megkeresi a célhálózatot a Routing Table-ben, majd új Layer 2 Frame-be csomagolja.',
          'Aranyszabály: Hop-ról hop-ra a Source/Dest MAC változik, a Source/Dest IP viszont végig változatlan marad (NAT nélkül)!',
        ],
      },
      {
        id: 'm5-s2',
        title: 'Cisco IOS CLI és Static Routing alapok',
        content:
          'A Cisco Router-ek konfigurációja a CLI-ben történik. Egy interfész alapértelmezetten adminisztratívan le van tiltva ("administratively down"), ezért a "no shutdown" paranccsal kell életre kelteni. Távoli, nem közvetlenül kapcsolódó hálózatok eléréséhez Static Route-ot adhatunk meg.',
        keyPoints: [
          'Connected (C) útvonal automatikusan létrejön, amint az interfész IP-t kap és "no shutdown" állapotba kerül.',
          'Static Route (S) szintaxisa: ip route <cél_hálózat> <cél_maszk> <next_hop_IP>.',
          'Ne felejtsük el a visszairányú útvonalat (Return Route) sem a másik Router-en!',
        ],
        cliTip: 'R1(config)# interface g0/0\nR1(config-if)# ip address 192.168.1.1 255.255.255.0\nR1(config-if)# no shutdown',
      },
    ],
    packetTracerLab: {
      title: '5. Labor: Két külön hálózat összekapcsolása Router-rel',
      scenario:
        'Köss össze két külön LAN alhálózatot (192.168.1.0/24 és 192.168.2.0/24) egy Cisco 1941 Router segítségével, és állítsd be a Default Gateway címeket!',
      devicesNeeded: ['1× 1941 Router (R1)', '2× 2960 Switch', '2× PC-PT (PC1, PC2)'],
      steps: [
        {
          id: 'm5-lab-1',
          instruction:
            'Kösd össze Switch1-et R1 GigabitEthernet0/0 portjával, Switch2-t pedig R1 GigabitEthernet0/1 portjával. Csatlakoztasd PC1-et Switch1-re és PC2-t Switch2-re.',
        },
        {
          id: 'm5-lab-2',
          instruction:
            'Konfiguráld be a Router két interfészét a CLI-ben, és ne felejtsd el a "no shutdown" parancsot!',
          commandSnippet:
            'enable\nconfigure terminal\nhostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\nexit\ninterface g0/1\n ip address 192.168.2.1 255.255.255.0\n no shutdown\nend\nwrite memory',
        },
        {
          id: 'm5-lab-3',
          instruction:
            'PC1-en állítsd be: IP 192.168.1.10 /24, Default Gateway: 192.168.1.1. PC2-n: IP 192.168.2.10 /24, Default Gateway: 192.168.2.1.',
        },
        {
          id: 'm5-lab-4',
          instruction:
            'Ellenőrizd a Routing Table-t R1-en, majd pingeld meg PC1-ről PC2-t!',
          commandSnippet: 'show ip route\n! PC1 Command Prompt:\nping 192.168.2.10',
          verificationHint: 'Az első ping ARP miatt gyakran "Request timed out", a következő 3 (majd újrafuttatáskor mind a 4) sikeres lesz.',
        },
      ],
      expectedOutcome:
        'A két elkülönített alhálózat PC-i sikeresen pingelik egymást a Router-en keresztül.',
    },
    quiz: [
      {
        id: 'm5-q1',
        question: 'Mi történik a Packet fejlécével, amikor egy Router továbbítja két alhálózat között?',
        options: [
          'Az IP címek változatlanok maradnak, a Layer 2 MAC címek viszont kicserélődnek.',
          'A MAC címek maradnak ugyanazok, csak az IP cím cserélődik.',
          'Semmi nem változik rajta.',
        ],
        correctIndex: 0,
        explanation:
          'A Router minden hop-nál új Layer 2 Frame-be ágyazza a Packet-et (új forrás és cél MAC), de a végpontok közötti IP címzés érintetlen marad.',
      },
      {
        id: 'm5-q2',
        question: 'Mi történik, ha elfelejted beállítani a Default Gateway-t a PC-n?',
        options: [
          'A saját alhálózatán belüli gépeket eléri, de más alhálózatokat és az internetet nem.',
          'Egyáltalán nem kap zöld link LED-et a Switch porton.',
          'A Switch automatikusan kitalálja helyette.',
        ],
        correctIndex: 0,
        explanation:
          'A Default Gateway csak a saját alhálózaton kívüli forgalomhoz szükséges; a helyi LAN-on belül enélkül is működik a kommunikáció.',
      },
      {
        id: 'm5-q3',
        question: 'Melyik Cisco IOS parancs aktivál egy leállított Router interfészt?',
        options: ['interface up', 'no shutdown', 'enable port'],
        correctIndex: 1,
        explanation: 'A Cisco IOS interfészek alapból "shutdown" állapotban vannak, a "no shutdown" kapcsolja be őket.',
      },
    ],
  },
  {
    id: 'module-6',
    number: '06',
    title: 'VLAN és Trunk konfiguráció',
    subtitle: 'Logikai szegmentálás, IEEE 802.1Q Trunking és Router-on-a-Stick',
    estimatedMinutes: 35,
    difficulty: 'Haladó',
    simulationType: 'vlan-trunk',
    simulationTitle: 'VLAN Izoláció és 802.1Q Trunk Szimulátor',
    simulationDescription:
      'Küldj Broadcast vagy Unicast forgalmat a Sales (VLAN 10) és az IT (VLAN 20) gépei között két Switch-en át! Kapcsold ki/be a Trunk linken az engedélyezett VLAN-okat, és nézd meg a 802.1Q tag hatását.',
    keyTerms: ['VLAN', 'Trunk', 'Access Port', 'Router-on-a-Stick'],
    theorySections: [
      {
        id: 'm6-s1',
        title: 'Miért hozunk létre VLAN-okat?',
        content:
          'Alapértelmezésben egy Switch minden portja a VLAN 1-ben van, vagyis egyetlen hatalmas Broadcast Domain-t alkot. A VLAN (Virtual LAN) lehetővé teszi, hogy egy fizikai Switch-en belül logikailag elkülönítsük a részlegeket (pl. VLAN 10 Sales, VLAN 20 IT) — növelve a biztonságot és csökkentve a felesleges Broadcast forgalmat.',
        keyPoints: [
          'Access Port: végberendezéseknek (PC, nyomtató), pontosan egy VLAN-hoz tartozik.',
          'Trunk Port: Switch–Switch vagy Switch–Router között, több VLAN forgalmát viszi át egyetlen kábelen.',
          'IEEE 802.1Q szabvány: a Trunk kábelen a Switch egy 4 bájtos VLAN Tag-et illeszt az Ethernet Frame-be.',
        ],
      },
      {
        id: 'm6-s2',
        title: 'Inter-VLAN Routing (Router-on-a-Stick)',
        content:
          'Mivel a két VLAN két külön Broadcast Domain és külön IP alhálózat, alapból nem tudnak kommunikálni egymással. A Router-on-a-Stick megoldással a Router egyetlen fizikai gigabites portját logikai alinterfészekre (Subinterfaces: g0/0.10, g0/0.20) osztjuk, és mindegyikhez hozzárendeljük a megfelelő 802.1Q VLAN azonosítót.',
        keyPoints: [
          'A Switch Router felé menő portját mindig Trunk módba kell állítani!',
          'A Router fizikai portján (g0/0) nem adunk meg IP-t, csak "no shutdown" kell rá.',
          'Az alinterfészeken (g0/0.10) az "encapsulation dot1Q 10" után adjuk meg a VLAN 10 Gateway IP-jét.',
        ],
        cliTip: 'S1(config)# vlan 10\nS1(config-vlan)# name SALES\nS1(config-if)# switchport mode access\nS1(config-if)# switchport access vlan 10',
      },
    ],
    packetTracerLab: {
      title: '6. Labor: VLAN 10 és VLAN 20 + Router-on-a-Stick',
      scenario:
        'Hozz létre két VLAN-t egy 2960 Switch-en (VLAN 10: 192.168.10.0/24, VLAN 20: 192.168.20.0/24), majd tedd lehetővé a köztük lévő kommunikációt egy 1941 Router alinterfészeivel!',
      devicesNeeded: ['1× 1941 Router (R1)', '1× 2960 Switch (S1)', '2× PC-PT'],
      steps: [
        {
          id: 'm6-lab-1',
          instruction:
            'Csatlakoztasd PC1-et a Switch Fa0/1 portjára, PC2-t a Fa0/2 portra, és a Switch G0/1 portját kösd össze a Router G0/0 portjával.',
        },
        {
          id: 'm6-lab-2',
          instruction:
            'Konfiguráld a VLAN-okat, az Access portokat és a Trunk portot a Switch CLI-ben:',
          commandSnippet:
            'enable\nconfigure terminal\nvlan 10\n name SALES\nvlan 20\n name IT\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\ninterface fa0/2\n switchport mode access\n switchport access vlan 20\ninterface g0/1\n switchport mode trunk\nend',
        },
        {
          id: 'm6-lab-3',
          instruction:
            'Állítsd be a Router-on-a-Stick alinterfészeket a Router CLI-ben:',
          commandSnippet:
            'enable\nconfigure terminal\ninterface g0/0\n no shutdown\ninterface g0/0.10\n encapsulation dot1Q 10\n ip address 192.168.10.1 255.255.255.0\ninterface g0/0.20\n encapsulation dot1Q 20\n ip address 192.168.20.1 255.255.255.0\nend',
        },
        {
          id: 'm6-lab-4',
          instruction:
            'Állítsd be PC1-et (192.168.10.10, GW 192.168.10.1) és PC2-t (192.168.20.10, GW 192.168.20.1), majd ellenőrizd a Trunk-ot és a pinget!',
          commandSnippet: 'show interfaces trunk\n! PC1-ről:\nping 192.168.20.10',
          verificationHint: 'A ping sikeres lesz, mert a forgalom felmegy a Trunk-on R1-hez, aki átirányítja VLAN 10-ből VLAN 20-ba.',
        },
      ],
      expectedOutcome:
        'A VLAN-ok szeparáltak Layer 2 szinten, de a Router-on-a-Stick segítségével szabályozottan képesek kommunikálni.',
    },
    quiz: [
      {
        id: 'm6-q1',
        question: 'Melyik szabvány felelős a VLAN-címkézésért egy Trunk porton?',
        options: ['IEEE 802.1Q', 'IEEE 802.3u', 'IEEE 802.11ax'],
        correctIndex: 0,
        explanation: 'Az IEEE 802.1Q illeszti be a 4 bájtos VLAN azonosító címkét a Trunk linken áthaladó Frame-ekbe.',
      },
      {
        id: 'm6-q2',
        question: 'Hány VLAN-hoz tartozhat egyetlen Access Port?',
        options: ['Pontoson egy (adat) VLAN-hoz', 'Legfeljebb 4 VLAN-hoz', 'Az összes létező VLAN-hoz'],
        correctIndex: 0,
        explanation: 'Az Access Port egyetlen végberendezési VLAN-t szolgál ki címkézetlen Frame-ekkel.',
      },
      {
        id: 'm6-q3',
        question: 'Mi szükséges a Switch G0/1 portján, ha Router-on-a-Stick alinterfészekhez csatlakozik?',
        options: ['switchport mode trunk', 'switchport mode access', 'no ip address'],
        correctIndex: 0,
        explanation: 'Mivel több VLAN forgalma halad át ezen az egyetlen kábelen a Router felé, Trunk módra kell állítani.',
      },
    ],
  },
  {
    id: 'module-7',
    number: '07',
    title: 'DHCP, DNS és NAT/PAT szolgáltatások',
    subtitle: 'Automatikus IP kiosztás (DORA), névfeloldás és internetelérés fordítása',
    estimatedMinutes: 30,
    difficulty: 'Haladó',
    simulationType: 'dhcp-nat',
    simulationTitle: 'DHCP DORA & NAT/PAT Fordítási Szimulátor',
    simulationDescription:
      'Indítsd el egy új kliens DHCP kérését (Discover → Offer → Request → Ack), majd küldj ki egy Web kérést az internetre, és kövesd nyomon a Router NAT/PAT fordítási tábláját!',
    keyTerms: ['DHCP', 'DNS', 'NAT / PAT'],
    theorySections: [
      {
        id: 'm7-s1',
        title: 'DHCP és a DORA folyamat',
        content:
          'Nagy hálózatokban lehetetlen minden számítógépen kézzel beírni az IP címet. A DHCP (Dynamic Host Configuration Protocol) automatikusan kiosztja az IP-t, Subnet Mask-ot, Default Gateway-t és DNS szervert négy lépésben: Discover (Broadcast keresés), Offer (szerver ajánlat), Request (kliens elfogadása), Acknowledge (végleges visszaigazolás).',
        keyPoints: [
          'A DHCP szerver futhat dedikált szerveren vagy közvetlenül a Cisco Router-en is.',
          'Az "ip dhcp excluded-address" paranccsal védjük meg a Router és szerverek statikus IP címeit a kiosztástól!',
          'A DNS (Domain Name System) fordítja le a neveket (pl. www.cisco.com) IPv4 címekre.',
        ],
      },
      {
        id: 'm7-s2',
        title: 'NAT és PAT (NAT Overload)',
        content:
          'Mivel a belső LAN gépek Private IP címeket (pl. 192.168.1.x) használnak, az internetes Router-ek ezeket eldobnák. A határrouteren konfigurált PAT (Port Address Translation — Cisco nyelven NAT Overload) egyetlen külső Public IP cím mögé rejti az összes belső gépet úgy, hogy minden kapcsolathoz egyedi forrás portszámot rendel.',
        keyPoints: [
          'Inside interfész: a belső LAN felé néző Router port (ip nat inside).',
          'Outside interfész: az ISP / internet felé néző Router port (ip nat outside).',
          'Access-List (ACL) határozza meg, mely belső címek fordíthatók le.',
        ],
        cliTip: 'R1(config)# ip nat inside source list 1 interface g0/1 overload',
      },
    ],
    packetTracerLab: {
      title: '7. Labor: Router DHCP szerver és PAT Overload',
      scenario:
        'Konfigurálj automatikus DHCP IP-kiosztást egy belső LAN-nak, valamint állíts be PAT (NAT Overload) címfordítást egy szimulált ISP Router felé!',
      devicesNeeded: ['2× 1941 Router (R1-Edge, ISP)', '1× 2960 Switch', '2× PC-PT', '1× Server-PT (Web + DNS)'],
      steps: [
        {
          id: 'm7-lab-1',
          instruction:
            'Köss össze 2 PC-t egy Switch-csel R1 G0/0 (192.168.1.1/24) portjára. R1 G0/1 (203.0.113.1/30) csatlakozzon ISP G0/0 (203.0.113.2/30) portjára.',
        },
        {
          id: 'm7-lab-2',
          instruction:
            'Konfiguráld be a DHCP Pool-t R1-en, kizárva az első 10 címet:',
          commandSnippet:
            'ip dhcp excluded-address 192.168.1.1 192.168.1.10\nip dhcp pool IRODA_LAN\n network 192.168.1.0 255.255.255.0\n default-router 192.168.1.1\n dns-server 8.8.8.8',
        },
        {
          id: 'm7-lab-3',
          instruction:
            'Állítsd be a NAT Overload-ot (PAT) R1-en a belső és külső interfészek megjelölésével:',
          commandSnippet:
            'access-list 1 permit 192.168.1.0 0.0.0.255\ninterface g0/0\n ip nat inside\ninterface g0/1\n ip nat outside\nexit\nip nat inside source list 1 interface g0/1 overload',
        },
        {
          id: 'm7-lab-4',
          instruction:
            'A PC-ken állítsd az IP Configuration-t "DHCP"-re, ellenőrizd a kapott 192.168.1.11+ címet, majd pingeld az ISP címet (203.0.113.2) és nézd meg a NAT táblát!',
          commandSnippet: 'show ip nat translations',
          verificationHint: 'A táblázatban látnod kell, ahogy az Inside Local (192.168.1.11) átfordul Inside Global (203.0.113.1) címre.',
        },
      ],
      expectedOutcome:
        'A kliensek automatikusan megkapják az IP beállításokat DHCP-n, és sikeresen kommunikálnak a külső hálózattal PAT fordításon át.',
    },
    quiz: [
      {
        id: 'm7-q1',
        question: 'Mi a helyes sorrendje a DHCP kliens IP-igénylési folyamatának (DORA)?',
        options: [
          'Discover → Offer → Request → Acknowledge',
          'Request → Discover → Acknowledge → Offer',
          'Offer → Discover → Request → Acknowledge',
        ],
        correctIndex: 0,
        explanation: 'Először a kliens keres (Discover), a szerver ajánl (Offer), a kliens kéri (Request), végül a szerver jóváhagyja (Acknowledge).',
      },
      {
        id: 'm7-q2',
        question: 'Miért van szükség az "ip dhcp excluded-address" parancsra?',
        options: [
          'Hogy a DHCP szerver ne ossza ki a Router Gateway vagy a nyomtatók statikus IP címeit a PC-knek.',
          'Hogy letiltsuk az internetet a vendégeknek.',
          'Hogy gyorsabb legyen a DNS.',
        ],
        correctIndex: 0,
        explanation: 'Ha a DHCP kiosztaná a Gateway címét egy PC-nek, súlyos IP-cím ütközés (IP Conflict) lépne fel.',
      },
      {
        id: 'm7-q3',
        question: 'Hogyan teszi lehetővé a PAT (NAT Overload), hogy 100 belső PC egyszerre használjon 1 db Public IP címet?',
        options: [
          'Egyedi forrás portszámokkal különbözteti meg a munkameneteket a fordítási táblában.',
          'Minden PC-nek ad egy saját Public IP-t.',
          'Felváltva kapcsolja le a PC-ket.',
        ],
        correctIndex: 0,
        explanation: 'A PAT a Layer 4 TCP/UDP portszámokat használja a párhuzamos kapcsolatok azonosítására.',
      },
    ],
  },
  {
    id: 'module-8',
    number: '08',
    title: 'Záró projekt: Teljes vállalati hálózat építése',
    subtitle: 'Önálló kéttelephelyes hálózat tervezése, VLAN-ok, Routing és végpont-végpont teszt',
    estimatedMinutes: 45,
    difficulty: 'Záróprojekt',
    simulationType: 'capstone-verify',
    simulationTitle: 'Záróprojekt Ellenőrző és Hibakereső Szimulátor',
    simulationDescription:
      'Ellenőrizd lépésről lépésre egy kéttelephelyes (Központ + Fiókiroda) hálózat konfigurációs rétegeit (VLAN, Trunk, Gateway, Static/OSPF Routing, DHCP), javítsd az elrejtett hibát, és futtasd le a végpont-végpont Ping tesztet!',
    keyTerms: ['VLAN', 'Trunk', 'Router-on-a-Stick', 'OSPF', 'DHCP', 'Default Gateway'],
    theorySections: [
      {
        id: 'm8-s1',
        title: 'A hálózattervezés 5 arany lépése',
        content:
          'Gratulálunk, eljutottál a kurzus csúcsára! Ebben a modulban minden eddig tanult tudást (topológia, IPv4 Subnetting, Switching, VLAN, Trunk, Routing, DHCP) egyesítesz egy önálló vállalati hálózat felépítéséhez.',
        keyPoints: [
          '1. Címzési terv (IP Addressing Plan): készítsd el előre a VLAN-ok és WAN linkek alhálózatait ütközésmentesen.',
          '2. Fizikai kábelezés: Straight-Through, Cross-Over vagy Serial/Fiber linkek pontos portokra kötése.',
          '3. Layer 2 réteg: Switch hostname, VLAN-ok létrehozása, Access és Trunk portok beállítása.',
          '4. Layer 3 réteg: Router alinterfészek (Router-on-a-Stick), WAN IP-k és Static vagy OSPF Routing.',
          '5. Szolgáltatások és verifikáció: DHCP Pool-ok és végpont-végpont Ping tesztek.',
        ],
      },
      {
        id: 'm8-s2',
        title: 'Rendszerszintű hibakeresés (Troubleshooting)',
        content:
          'Ha a záró projektben valami nem pingel elsőre, ne találomra állítgass — használd az OSI rétegek szerinti alulról felfelé építkező módszert!',
        keyPoints: [
          'Layer 1: Zöldek-e a port LED-ek? ("show ip interface brief" → up / up)',
          'Layer 2: Jó VLAN-ban van a PC? Átengedi-e a Trunk a VLAN-t? ("show vlan brief", "show interfaces trunk")',
          'Layer 3: Van-e helyes Default Gateway a PC-n? Szerepel-e a célhálózat mindkét Router táblájában? ("show ip route")',
        ],
        cliTip: 'R1# show ip route   |   S1# show vlan brief   |   PC> ipconfig /all',
      },
    ],
    packetTracerLab: {
      title: 'Záró Labor: Kéttelephelyes vállalati hálózat nulláról',
      scenario:
        'Építs fel önállóan egy működő kéttelephelyes hálózatot Packet Tracerben! A Budapesti Központban (R1 + S1) két VLAN működik (VLAN 10 Sales: 192.168.10.0/24, VLAN 20 IT: 192.168.20.0/24) DHCP-vel. A Győri Fiókirodában (R2 + S2) egy Szerverpark található (10.10.10.0/24). R1 és R2 a 172.16.0.0/30 WAN linken kapcsolódik.',
      devicesNeeded: [
        '2× 1941 Router (R1-HQ, R2-Branch)',
        '2× 2960 Switch (S1-HQ, S2-Branch)',
        '2× PC-PT (Sales-PC, IT-PC)',
        '1× Server-PT (Intranet Web Server)',
      ],
      steps: [
        {
          id: 'm8-lab-1',
          instruction:
            'Kábelezd fel a topológiát: Sales-PC (Fa0/1) és IT-PC (Fa0/2) → S1-HQ (G0/1) → R1-HQ (G0/0). R1-HQ (G0/1) ↔ R2-Branch (G0/1) [Cross-Over vagy Fiber]. R2-Branch (G0/0) → S2-Branch → Intranet Server.',
        },
        {
          id: 'm8-lab-2',
          instruction:
            'S1-HQ Switch-en hozd létre a VLAN 10 és 20-at, állítsd be az Access portokat és a G0/1 Trunk portot.',
          commandSnippet:
            'vlan 10\n name SALES\nvlan 20\n name IT\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\ninterface fa0/2\n switchport mode access\n switchport access vlan 20\ninterface g0/1\n switchport mode trunk',
        },
        {
          id: 'm8-lab-3',
          instruction:
            'R1-HQ Router-en állítsd be a Router-on-a-Stick alinterfészeket (192.168.10.1 és 192.168.20.1), a két DHCP Pool-t, valamint a WAN interfészt (G0/1: 172.16.0.1 /30).',
          commandSnippet:
            'interface g0/0\n no shutdown\ninterface g0/0.10\n encapsulation dot1Q 10\n ip address 192.168.10.1 255.255.255.0\ninterface g0/0.20\n encapsulation dot1Q 20\n ip address 192.168.20.1 255.255.255.0\ninterface g0/1\n ip address 172.16.0.1 255.255.255.252\n no shutdown',
        },
        {
          id: 'm8-lab-4',
          instruction:
            'R2-Branch Router-en állítsd be a LAN-t (G0/0: 10.10.10.1 /24) és a WAN-t (G0/1: 172.16.0.2 /30), majd kapcsold be OSPF (vagy Static Route) útválasztást mindkét Router-en!',
          commandSnippet:
            '! R1-HQ:\nrouter ospf 1\n network 192.168.10.0 0.0.0.255 area 0\n network 192.168.20.0 0.0.0.255 area 0\n network 172.16.0.0 0.0.0.3 area 0\n! R2-Branch:\nrouter ospf 1\n network 10.10.10.0 0.0.0.255 area 0\n network 172.16.0.0 0.0.0.3 area 0',
        },
        {
          id: 'm8-lab-5',
          instruction:
            'Állítsd az Intranet Servert 10.10.10.50 /24 (GW: 10.10.10.1) címre, a két központi PC-t DHCP-re, majd teszteld a teljes kommunikációt a Sales-PC-ről!',
          commandSnippet: 'ping 192.168.20.10\nping 10.10.10.50',
          verificationHint: 'Mind az Inter-VLAN ping, mind a távoli telephely Intranet szerverének elérése sikeres!',
        },
      ],
      expectedOutcome:
        'Önállóan felépítettél egy komplett, dinamikus útválasztással és VLAN szegmentálással működő vállalati hálózatot!',
    },
    quiz: [
      {
        id: 'm8-q1',
        question: 'Milyen Subnet Mask tartozik egy két Router közötti /30-as pont-pont WAN linkhez?',
        options: ['255.255.255.252', '255.255.255.0', '255.255.255.248'],
        correctIndex: 0,
        explanation: 'A /30 pontosan 2 használható IP címet biztosít (255.255.255.252), ami ideális két Router összekapcsolására pazarlás nélkül.',
      },
      {
        id: 'm8-q2',
        question: 'Ha a Sales-PC nem kap IP címet DHCP-vel a Router-től, mi az egyik leggyakoribb Layer 2 hiba?',
        options: [
          'A Switch és a Router közötti kábel portja nincs Trunk módban.',
          'A Server-PT Web szolgáltatása ki van kapcsolva.',
          'Túl kicsi a Default Gateway TTL értéke.',
        ],
        correctIndex: 0,
        explanation:
          'Ha a Switch G0/1 portja Access módban maradt Trunk helyett, a VLAN 10 DHCP Discover kérései sosem érnek el a Router g0/0.10 alinterfészére.',
      },
      {
        id: 'm8-q3',
        question: 'Melyik paranccsal ellenőrizheted a Router-en, hogy az OSPF sikeresen megtanulta-e a távoli iroda hálózatát?',
        options: ['show ip route', 'show mac address-table', 'show interfaces trunk'],
        correctIndex: 0,
        explanation: 'A "show ip route" parancsban "O" jelzéssel jelennek meg az OSPF-fel dinamikusan megtanult távoli útvonalak.',
      },
    ],
  },
];
