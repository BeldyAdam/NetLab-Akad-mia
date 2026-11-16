import type { GlossaryTerm } from '../types/curriculum';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'lan',
    term: 'LAN',
    fullName: 'Local Area Network',
    category: 'Alapok',
    definition:
      'Helyi hálózat, amely egyetlen épületen, irodán vagy otthonon belül köti össze az eszközöket nagy sebességgel és alacsony késleltetéssel.',
    example: 'Egy irodai emelet számítógépei és nyomtatói egy központi Switch-re csatlakoztatva.',
    relatedLessonId: 'module-1',
  },
  {
    id: 'wan',
    term: 'WAN',
    fullName: 'Wide Area Network',
    category: 'Alapok',
    definition:
      'Nagy kiterjedésű hálózat, amely földrajzilag távoli LAN-okat köt össze szolgáltatói (ISP) vonalakon, például optikai bérelt vonalon vagy Frame Relay kapcsolaton keresztül.',
    example: 'A budapesti és a debreceni iroda összekapcsolása Router-ek segítségével.',
    relatedLessonId: 'module-1',
  },
  {
    id: 'bandwidth',
    term: 'Bandwidth',
    fullName: 'Sávszélesség',
    category: 'Alapok',
    definition:
      'A hálózati összeköttetés elméleti maximális adatátviteli kapacitása másodpercenként (bps, Mbps, Gbps). Nem azonos a ténylegesen mért sebességgel (Throughput).',
    example: 'Egy Gigabit Ethernet port Bandwidth értéke 1000 Mbps (1 Gbps).',
    relatedLessonId: 'module-1',
  },
  {
    id: 'topology',
    term: 'Star Topology',
    fullName: 'Csillag topológia',
    category: 'Alapok',
    definition:
      'A modern LAN-ok alapértelmezett fizikai elrendezése, ahol minden végberendezés közvetlenül egy központi Switch-hez csatlakozik.',
    example: 'Ha egy PC kábele elszakad, csak az az egy gép veszíti el a kapcsolatot, a többi tovább működik.',
    relatedLessonId: 'module-1',
  },
  {
    id: 'osi-model',
    term: 'OSI Model',
    fullName: 'Open Systems Interconnection',
    category: 'Alapok',
    definition:
      '7 rétegű elméleti referenciamodell, amely szabványosítja a hálózati kommunikáció lépéseit a fizikai kábeltől (Layer 1) az alkalmazásig (Layer 7).',
    example: 'Hibakeresésnél alulról felfelé haladva először a Layer 1 kábelt, majd a Layer 2 Switch portot, végül a Layer 3 IP címet ellenőrizzük.',
    relatedLessonId: 'module-2',
  },
  {
    id: 'encapsulation',
    term: 'Encapsulation',
    fullName: 'Beágyazás (kapszulázás)',
    category: 'Alapok',
    definition:
      'Az a folyamat, amely során az adatok az OSI/TCP-IP rétegeken lefelé haladva minden rétegen új vezérlőfejlécet (Header) kapnak: Data → Segment → Packet → Frame → Bits.',
    example: 'A Transport réteg TCP fejlécet tesz az adatra (Segment), majd a Network réteg IP címet csatol hozzá (Packet).',
    relatedLessonId: 'module-2',
  },
  {
    id: 'pdu',
    term: 'PDU',
    fullName: 'Protocol Data Unit',
    category: 'Alapok',
    definition:
      'Az egyes hálózati rétegeken mozgó adategység neve: Layer 4 = Segment, Layer 3 = Packet, Layer 2 = Frame, Layer 1 = Bit.',
    example: 'A Cisco Packet Tracer Simulation módban az ICMP PDU színes borítékként jelenik meg.',
    relatedLessonId: 'module-2',
  },
  {
    id: 'switch',
    term: 'Switch',
    fullName: 'Layer 2 hálózati kapcsoló',
    category: 'Switching és VLAN',
    definition:
      'Helyi hálózati eszköz, amely a beérkező Frame-eket a cél MAC address alapján, hardveres MAC Table segítségével továbbítja kizárólag a megfelelő portra.',
    example: 'A Cisco Catalyst 2960 Switch minden portja külön Collision Domain-t képez.',
    relatedLessonId: 'module-3',
  },
  {
    id: 'mac-address',
    term: 'MAC address',
    fullName: 'Media Access Control Address',
    category: 'Switching és VLAN',
    definition:
      '48 bites (6 bájtos), hexadecimálisan felírt egyedi fizikai cím, amely a hálózati kártyába (NIC) van égetve. Csak a helyi hálózati szegmensen (Layer 2) érvényes.',
    example: '00:1A:2B:3C:4D:5E vagy Cisco formátumban 001A.2B3C.4D5E.',
    relatedLessonId: 'module-3',
  },
  {
    id: 'arp',
    term: 'ARP',
    fullName: 'Address Resolution Protocol',
    category: 'Switching és VLAN',
    definition:
      'Protokoll, amely megkeresi egy ismert IPv4 címhez tartozó fizikai MAC address-t a helyi hálózaton Broadcast kérés segítségével.',
    example: 'Amikor PC-A pingeli a Default Gateway-t, először ARP Request-et küld: "Kié a 192.168.1.1?"',
    relatedLessonId: 'module-3',
  },
  {
    id: 'mac-table',
    term: 'MAC Address Table',
    fullName: 'CAM Table',
    category: 'Switching és VLAN',
    definition:
      'A Switch memóriájában tárolt táblázat, amely összerendeli a portokon látott forrás MAC address-eket a fizikai portokkal.',
    example: 'A Cisco IOS-ben a "show mac address-table" paranccsal kérdezhető le.',
    relatedLessonId: 'module-3',
  },
  {
    id: 'collision-domain',
    term: 'Collision Domain',
    fullName: 'Ütközési tartomány',
    category: 'Switching és VLAN',
    definition:
      'Az a hálózati szegmens, ahol az egyszerre küldött jelek ütközhetnek. Egy modern Full-Duplex Switch minden portja saját külön Collision Domain.',
    example: 'A régi Hub egyetlen közös Collision Domain volt, míg a Switch szeparálja ezeket.',
    relatedLessonId: 'module-3',
  },
  {
    id: 'broadcast-domain',
    term: 'Broadcast Domain',
    fullName: 'Szórási tartomány',
    category: 'Switching és VLAN',
    definition:
      'Azoknak az eszközöknek az összessége, amelyek megkapják az FF:FF:FF:FF:FF:FF címre küldött Layer 2 Broadcast Frame-et. A Switch továbbítja, a Router viszont megállítja.',
    example: 'Egyetlen VLAN egyetlen Broadcast Domain-nek felel meg.',
    relatedLessonId: 'module-3',
  },
  {
    id: 'ipv4',
    term: 'IPv4 Address',
    fullName: 'Internet Protocol version 4',
    category: 'IP és Routing',
    definition:
      '32 bites logikai hálózati cím, amelyet négy darab ponttal elválasztott decimális oktettként írunk fel (0–255). Egy hálózati és egy host részből áll.',
    example: '192.168.10.25',
    relatedLessonId: 'module-4',
  },
  {
    id: 'subnet-mask',
    term: 'Subnet Mask',
    fullName: 'Alhálózati maszk',
    category: 'IP és Routing',
    definition:
      '32 bites maszk, amely meghatározza, hogy egy IPv4 cím hány bitje jelöli a hálózatot (1-esek) és hány bitje a végberendezést (0-k).',
    example: '255.255.255.0 (CIDR jelöléssel /24).',
    relatedLessonId: 'module-4',
  },
  {
    id: 'cidr',
    term: 'CIDR',
    fullName: 'Classless Inter-Domain Routing',
    category: 'IP és Routing',
    definition:
      'Rövidített perjeles jelölés az alhálózati maszk hálózati bitjeinek számára (pl. /24, /26), amely rugalmas Subnetting-et tesz lehetővé osztályhatárok nélkül.',
    example: '192.168.1.0/26 esetén 26 bit a hálózat és 6 bit (62 használható cím) a host.',
    relatedLessonId: 'module-4',
  },
  {
    id: 'subnetting',
    term: 'Subnetting',
    fullName: 'Alhálózatosítás',
    category: 'IP és Routing',
    definition:
      'Egy nagyobb IP-tartomány felosztása több kisebb, elkülönített alhálózatra a címek hatékony kihasználása és a Broadcast forgalom csökkentése érdekében.',
    example: 'Egy /24-es hálózat négy darab /26-os alhálózatra bontása.',
    relatedLessonId: 'module-4',
  },
  {
    id: 'router',
    term: 'Router',
    fullName: 'Layer 3 útválasztó',
    category: 'IP és Routing',
    definition:
      'Hálózati eszköz, amely különböző IP alhálózatok (LAN-ok és WAN-ok) között továbbítja a Packet-eket a Routing Table alapján.',
    example: 'A Cisco ISR 1941 vagy 4321 Router összeköti a belső vállalati LAN-t az internettel.',
    relatedLessonId: 'module-5',
  },
  {
    id: 'default-gateway',
    term: 'Default Gateway',
    fullName: 'Alapértelmezett átjáró',
    category: 'IP és Routing',
    definition:
      'A helyi hálózaton lévő Router interfészének IP-címe, amelyhez a kliens minden olyan Packet-et elküld, amelynek célja kívül esik a saját alhálózatán.',
    example: 'Ha PC1 IP-je 192.168.1.10/24, a Default Gateway általában 192.168.1.1.',
    relatedLessonId: 'module-5',
  },
  {
    id: 'routing-table',
    term: 'Routing Table',
    fullName: 'Útválasztási tábla',
    category: 'IP és Routing',
    definition:
      'A Router memóriájában tárolt útvonallista, amely megmutatja, melyik célhálózat melyik interfészen vagy Next-Hop IP-címen keresztül érhető el.',
    example: 'A "show ip route" paranccsal jeleníthető meg Cisco IOS-ben (C = Connected, S = Static, O = OSPF).',
    relatedLessonId: 'module-5',
  },
  {
    id: 'static-route',
    term: 'Static Route',
    fullName: 'Statikus útvonal',
    category: 'IP és Routing',
    definition:
      'A hálózati adminisztrátor által manuálisan megadott útvonal a Router-en egy távoli hálózat eléréséhez.',
    example: 'ip route 10.0.2.0 255.255.255.0 192.168.12.2',
    relatedLessonId: 'module-5',
  },
  {
    id: 'vlan',
    term: 'VLAN',
    fullName: 'Virtual Local Area Network',
    category: 'Switching és VLAN',
    definition:
      'Logikai szegmentálási technológia, amellyel egyetlen fizikai Switch portjai több különálló Broadcast Domain-re oszthatók fel.',
    example: 'A pénzügyi osztály a VLAN 10-be, a vendég Wi-Fi pedig a VLAN 99-be kerül.',
    relatedLessonId: 'module-6',
  },
  {
    id: 'trunk',
    term: 'Trunk',
    fullName: 'Trunk Link (802.1Q)',
    category: 'Switching és VLAN',
    definition:
      'Két Switch vagy egy Switch és Router közötti pont-pont összeköttetés, amely egyszerre több VLAN forgalmát szállítja 4 bájtos IEEE 802.1Q címkével.',
    example: 'Switchport parancs: "switchport mode trunk".',
    relatedLessonId: 'module-6',
  },
  {
    id: 'access-port',
    term: 'Access Port',
    fullName: 'Hozzáférési port',
    category: 'Switching és VLAN',
    definition:
      'Olyan Switch port, amely pontosan egyetlen VLAN-hoz van rendelve, és végberendezés (PC, nyomtató, IP telefon) csatlakozik rá címkézetlen (untagged) Frame-ekkel.',
    example: 'switchport mode access / switchport access vlan 10',
    relatedLessonId: 'module-6',
  },
  {
    id: 'router-on-a-stick',
    term: 'Router-on-a-Stick',
    fullName: 'Inter-VLAN Routing',
    category: 'Switching és VLAN',
    definition:
      'Technika, amelyben egyetlen fizikai Router interfész alinterfészekre (Subinterfaces, pl. G0/0.10, G0/0.20) van osztva a VLAN-ok közötti forgalom továbbításához.',
    example: 'interface g0/0.10 -> encapsulation dot1Q 10 -> ip address 192.168.10.1 255.255.255.0',
    relatedLessonId: 'module-6',
  },
  {
    id: 'dhcp',
    term: 'DHCP',
    fullName: 'Dynamic Host Configuration Protocol',
    category: 'Szolgáltatások',
    definition:
      'Hálózati szolgáltatás, amely automatikusan kiosztja az IP-címet, Subnet Mask-ot, Default Gateway-t és DNS szervert a klienseknek a DORA (Discover, Offer, Request, Ack) folyamattal.',
    example: 'ip dhcp pool LAN_POOL',
    relatedLessonId: 'module-7',
  },
  {
    id: 'dns',
    term: 'DNS',
    fullName: 'Domain Name System',
    category: 'Szolgáltatások',
    definition:
      'Elosztott névfeloldó rendszer, amely az emberek által olvasható domain neveket (pl. www.netlab.hu) lefordítja IP-címekre.',
    example: 'UDP/TCP 53-as porton működik.',
    relatedLessonId: 'module-7',
  },
  {
    id: 'nat-pat',
    term: 'NAT / PAT',
    fullName: 'Network / Port Address Translation',
    category: 'Szolgáltatások',
    definition:
      'Címfordítási mechanizmus, amely a belső hálózati Private IP-címeket (RFC 1918) nyilvános Public IP-címre fordítja az internetes kommunikációhoz. A PAT portszámok segítségével több száz gépet oszt meg egyetlen Public IP-n.',
    example: 'ip nat inside source list 1 interface g0/1 overload',
    relatedLessonId: 'module-7',
  },
  {
    id: 'icmp',
    term: 'ICMP',
    fullName: 'Internet Control Message Protocol',
    category: 'IP és Routing',
    definition:
      'Diagnosztikai és hibajelző protokoll a Layer 3 szintjén. Ezt használja a "ping" (Echo Request / Echo Reply) és a "traceroute" parancs.',
    example: 'ping 192.168.20.10',
    relatedLessonId: 'module-5',
  },
  {
    id: 'cli',
    term: 'CLI',
    fullName: 'Command Line Interface',
    category: 'Alapok',
    definition:
      'Szöveges parancssori felület a Cisco IOS eszközök konfigurálására. Fő módjai: User EXEC (>), Privileged EXEC (#), Global Configuration ((config)#).',
    example: 'enable -> configure terminal -> hostname R1',
    relatedLessonId: 'module-5',
  },
  {
    id: 'frame-relay',
    term: 'Frame Relay',
    fullName: 'WAN Packet-Switched Protocol',
    category: 'IP és Routing',
    definition:
      'Klasszikus Layer 2 WAN technológia, amely virtuális áramkörökön (PVC / DLCI azonosítók) keresztül kapcsolja össze a távoli Router-eket szolgáltatói felhőn át.',
    example: 'A Packet Tracer Cloud-PT eszközében DLCI párosításokkal szimulálható.',
    relatedLessonId: 'module-8',
  },
  {
    id: 'ospf',
    term: 'OSPF',
    fullName: 'Open Shortest Path First',
    category: 'IP és Routing',
    definition:
      'Nyílt szabványú Link-State dinamikus útválasztó protokoll, amely a sávszélesség alapú Cost metrikával és Dijkstra algoritmussal számolja ki a legrövidebb utat.',
    example: 'router ospf 1 -> network 192.168.1.0 0.0.0.255 area 0',
    relatedLessonId: 'module-8',
  },
];
