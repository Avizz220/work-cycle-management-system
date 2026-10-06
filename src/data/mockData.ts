import { User, Project, SectionMessage, SharedFile, PhaseDeliverableItem, PMNotification, DisciplineType } from '@/types';

export const INITIAL_USERS: User[] = [
  // PM
  {
    id: 'usr-pm-1',
    name: 'Arch. Samantha Reed',
    email: 'pm@dg5.com',
    role: 'pm',
    discipline: 'Management',
    title: 'Associate Director & Chief Project Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4810'
  },
  // Electrical Division
  {
    id: 'usr-elec-1',
    name: 'Eng. Kevin Fernando',
    email: 'electrical@dg5.com',
    role: 'hod',
    discipline: 'Electrical',
    title: 'Head of Electrical Engineering & Lead Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4814'
  },
  {
    id: 'usr-elec-2',
    name: 'Eng. Dinesh Jayawardena',
    email: 'dinesh.j@dg5.com',
    role: 'employee',
    discipline: 'Electrical',
    title: 'Senior Substation & Grid Specialist',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4817'
  },
  {
    id: 'usr-elec-3',
    name: 'Eng. Tharaka Silva',
    email: 'tharaka.s@dg5.com',
    role: 'employee',
    discipline: 'Electrical',
    title: 'ELV & Smart Building Automation Engineer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4818'
  },
  // Civil Division
  {
    id: 'usr-civil-1',
    name: 'Eng. Dilshan Perera',
    email: 'civil@dg5.com',
    role: 'hod',
    discipline: 'Civil',
    title: 'Head of Civil & Structural Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4812'
  },
  {
    id: 'usr-civil-2',
    name: 'Eng. Ruwan Silva',
    email: 'ruwan.s@dg5.com',
    role: 'employee',
    discipline: 'Civil',
    title: 'Geotechnical & Piling Foundation Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4821'
  },
  {
    id: 'usr-civil-3',
    name: 'Eng. Chaminda De Silva',
    email: 'chaminda.d@dg5.com',
    role: 'employee',
    discipline: 'Civil',
    title: 'Bridge, Viaduct & Superstructure Engineer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4822'
  },
  // Plumbing Division
  {
    id: 'usr-plumb-1',
    name: 'Eng. Kasun Silva',
    email: 'plumbing@dg5.com',
    role: 'hod',
    discipline: 'Plumbing',
    title: 'Head of MEP, Plumbing & Fire Hydrant Systems',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4815'
  },
  {
    id: 'usr-plumb-2',
    name: 'Eng. Nimal Senanayake',
    email: 'nimal.s@dg5.com',
    role: 'employee',
    discipline: 'Plumbing',
    title: 'Hydraulic & Stormwater Drainage Engineer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4825'
  },
  {
    id: 'usr-plumb-3',
    name: 'Eng. Tharindu Alwis',
    email: 'tharindu.a@dg5.com',
    role: 'employee',
    discipline: 'Plumbing',
    title: 'HVAC Piping & Clean Room Gas Drafter',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4826'
  },
  // Architectural Division
  {
    id: 'usr-arch-1',
    name: 'Arch. Nimmi Wickramasinghe',
    email: 'architect@dg5.com',
    role: 'hod',
    discipline: 'Architectural',
    title: 'Head of Architectural Design & Spatial Planning',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4813'
  },
  {
    id: 'usr-arch-2',
    name: 'Arch. Shanuka Bandara',
    email: 'shanuka.b@dg5.com',
    role: 'employee',
    discipline: 'Architectural',
    title: 'Curtain Wall Façade & Envelope Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4829'
  },
  {
    id: 'usr-arch-3',
    name: 'Arch. Sanduni Fernando',
    email: 'sanduni.f@dg5.com',
    role: 'employee',
    discipline: 'Architectural',
    title: 'BIM Architectural 3D Modeling Coordinator',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed277150?w=150&auto=format&fit=crop&q=80',
    phone: '+94 11 258 4830'
  }
];

export function buildPhaseDeliverables(
  projectCode: string,
  phaseNumber: number,
  phaseName: string,
  completed = false
): PhaseDeliverableItem[] {
  const shortCode = projectCode.replace('DG5-', '').replace('-2026', '');

  return [
    {
      id: `del-${shortCode}-p${phaseNumber}-elec`,
      name: `${phaseName} - Power Distribution & Single Line Diagram`,
      discipline: 'Electrical',
      fileName: `${shortCode}-P${phaseNumber}-ELEC-SLD-Rev3.dwg`,
      fileSize: '14.8 MB',
      fileType: 'dwg',
      version: completed ? 'Rev 3.0 (Approved)' : 'Rev 2.4 (Pending Review)',
      uploadedBy: {
        id: 'usr-elec-1',
        name: 'Eng. Kevin Fernando',
        title: 'Lead Electrical & Power Systems Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        discipline: 'Electrical'
      },
      uploadDate: '2026-10-04',
      status: completed ? 'Approved' : 'Pending Review',
      comments: [
        {
          id: `c-el-1`,
          authorId: 'usr-pm-1',
          authorName: 'Arch. Samantha Reed',
          authorRole: 'Project Manager',
          recipientName: 'Eng. Kevin Fernando',
          content: 'Verified substation sizing. Clearance to CEB utility entrance approved.',
          timestamp: 'Yesterday at 04:30 PM',
          isNotice: true
        }
      ]
    },
    {
      id: `del-${shortCode}-p${phaseNumber}-civil`,
      name: `${phaseName} - Structural Load & Foundation Rebar Drawing`,
      discipline: 'Civil',
      fileName: `${shortCode}-P${phaseNumber}-CIVIL-Rebar_Detail.pdf`,
      fileSize: '18.2 MB',
      fileType: 'pdf',
      version: completed ? 'Rev 2.0 (Approved)' : 'Rev 1.8 (Under Review)',
      uploadedBy: {
        id: 'usr-civil-1',
        name: 'Eng. Dilshan Perera',
        title: 'Senior Civil & Structural Engineer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        discipline: 'Civil'
      },
      uploadDate: '2026-10-03',
      status: completed ? 'Approved' : 'Pending Review',
      comments: [
        {
          id: `c-cv-1`,
          authorId: 'usr-pm-1',
          authorName: 'Arch. Samantha Reed',
          authorRole: 'Project Manager',
          recipientName: 'Eng. Dilshan Perera',
          content: 'Piling capacity matrix verified with geotechnical bore hole samples.',
          timestamp: '2 days ago',
          isNotice: true
        }
      ]
    },
    {
      id: `del-${shortCode}-p${phaseNumber}-plumb`,
      name: `${phaseName} - MEP Hydro-Pneumatic Riser & Fire Drainage`,
      discipline: 'Plumbing',
      fileName: `${shortCode}-P${phaseNumber}-MEP-Riser-Hydraulics.pdf`,
      fileSize: '9.4 MB',
      fileType: 'pdf',
      version: completed ? 'Rev 2.2 (Approved)' : 'Rev 2.0 (Under Review)',
      uploadedBy: {
        id: 'usr-plumb-1',
        name: 'Eng. Kasun Silva',
        title: 'Lead MEP & Fire Hydrant Specialist',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        discipline: 'Plumbing'
      },
      uploadDate: '2026-10-02',
      status: completed ? 'Approved' : 'Pending Review',
      comments: []
    },
    {
      id: `del-${shortCode}-p${phaseNumber}-arch`,
      name: `${phaseName} - Architectural Envelope & Spatial Elevations`,
      discipline: 'Architectural',
      fileName: `${shortCode}-P${phaseNumber}-ARCH-Facade-Envelope.dwg`,
      fileSize: '22.1 MB',
      fileType: 'dwg',
      version: completed ? 'Rev 3.1 (Approved)' : 'Rev 2.0 (Under Review)',
      uploadedBy: {
        id: 'usr-arch-1',
        name: 'Arch. Nimmi Wickramasinghe',
        title: 'Senior Project Architect & Spatial Designer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        discipline: 'Architectural'
      },
      uploadDate: '2026-10-01',
      status: completed ? 'Approved' : 'Pending Review',
      comments: []
    }
  ];
}

export const INITIAL_PM_NOTIFICATIONS: PMNotification[] = [
  {
    id: 'notif-1',
    type: 'phase_completed',
    title: 'Phase 2 Completed Successfully',
    message: 'Deep Foundation & Basement Civil Calculations has reached 100% and been marked Completed in Marina Bay Commercial Hub.',
    timestamp: '2 hours ago',
    projectId: 'prj-dg5-01',
    projectCode: 'DG5-PRJ-2026-01',
    phaseId: 'ph-01-2',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'phase_completed',
    title: 'Phase 1 Completed & Signed Off',
    message: 'Topographic Survey & Coastal Buffer Clearance signed off by all 4 divisions in Araliya Grand Luxury Eco-Resort.',
    timestamp: 'Yesterday at 05:40 PM',
    projectId: 'prj-dg5-02',
    projectCode: 'DG5-PRJ-2026-02',
    phaseId: 'ph-02-1',
    read: false,
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-dg5-01',
    code: 'DG5-PRJ-2026-01',
    title: 'Marina Bay Commercial Hub & Tower',
    client: 'Apex Horizon Capital Group',
    location: 'Port City Financial Precinct, Colombo 01',
    category: 'Commercial',
    budget: '$48,500,000 USD',
    startDate: '2026-01-15',
    targetCompletion: '2027-08-30',
    overallProgress: 68,
    status: 'Active',
    projectManager: 'Arch. Samantha Reed',
    description: '38-storey mixed-use commercial tower featuring sustainable LEED Platinum design, smart building automation, and high-load civil podium structures.',
    keyDisciplines: ['Civil', 'Electrical', 'Plumbing', 'Architectural'],
    assignedMemberIds: ['usr-elec-1', 'usr-elec-2', 'usr-civil-1', 'usr-plumb-1', 'usr-arch-1'],
    phases: [
      {
        id: 'ph-01-1',
        phaseNumber: 1,
        name: 'Concept Architecture & Feasibility',
        assignedSection: 'Architectural',
        leadPerson: 'Arch. Nimmi Wickramasinghe',
        startDate: '2026-01-15',
        deadline: '2026-03-01',
        status: 'Completed',
        progress: 100,
        deliverables: ['3D Massing Models', 'Traffic Impact Assessment', 'Client Concept Approval'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 1, 'Concept Architecture & Feasibility', true),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: true },
        assignedMemberIds: ['usr-arch-1', 'usr-civil-1'],
        critical: false
      },
      {
        id: 'ph-01-2',
        phaseNumber: 2,
        name: 'Deep Foundation & Basement Civil Calculations',
        assignedSection: 'Civil',
        leadPerson: 'Eng. Dilshan Perera',
        startDate: '2026-03-02',
        deadline: '2026-05-15',
        status: 'Completed',
        progress: 100,
        deliverables: ['Piling Load Capacity Schedules', 'Diaphragm Wall Reinforcement Details', 'Soil Investigation Reports'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 2, 'Deep Foundation & Basement Civil Calculations', true),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: true },
        assignedMemberIds: ['usr-civil-1', 'usr-civil-2'],
        critical: true
      },
      {
        id: 'ph-01-3',
        phaseNumber: 3,
        name: 'Main Substation & HV/LV Distribution Schematics',
        assignedSection: 'Electrical',
        leadPerson: 'Eng. Kevin Fernando',
        startDate: '2026-05-16',
        deadline: '2026-10-14',
        status: 'In Progress',
        progress: 75,
        deliverables: ['11kV Transformer Riser Schematics', 'Emergency Generator Load Balancing', 'LEED Lighting Control Plan'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 3, 'Main Substation & HV/LV Distribution Schematics', false),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: false },
        assignedMemberIds: ['usr-elec-1', 'usr-elec-2', 'usr-elec-3'],
        critical: true
      },
      {
        id: 'ph-01-4',
        phaseNumber: 4,
        name: 'High-Rise Hydro-Pneumatic Water & Drainage Design',
        assignedSection: 'Plumbing',
        leadPerson: 'Eng. Kasun Silva',
        startDate: '2026-06-01',
        deadline: '2026-10-20',
        status: 'In Progress',
        progress: 50,
        deliverables: ['Dual Flush Water Supply Riser Diagrams', 'Stormwater Retention Calculations', 'Fire Sprinkler Grid Level 10-25'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 4, 'High-Rise Hydro-Pneumatic Water & Drainage Design', false),
        sectionCompletion: { Electrical: false, Civil: true, Plumbing: true, Architectural: false },
        assignedMemberIds: ['usr-plumb-1', 'usr-plumb-2'],
        critical: true
      },
      {
        id: 'ph-01-5',
        phaseNumber: 5,
        name: 'Curtain Wall Facade & Fire Engineering Coordination',
        assignedSection: 'Architectural',
        leadPerson: 'Arch. Nimmi Wickramasinghe',
        startDate: '2026-09-01',
        deadline: '2026-11-30',
        status: 'Pending',
        progress: 25,
        deliverables: ['Acoustic & Thermal Glazing Specification', 'Civil Anchor Bracket Integration', 'Municipal Building Dept Submission'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 5, 'Curtain Wall Facade & Fire Engineering Coordination', false),
        sectionCompletion: { Electrical: false, Civil: false, Plumbing: false, Architectural: true },
        assignedMemberIds: ['usr-arch-1', 'usr-arch-2'],
        critical: false
      },
      {
        id: 'ph-01-6',
        phaseNumber: 6,
        name: 'Comprehensive Tender BOQ & Contractor Prequalification',
        assignedSection: 'All',
        leadPerson: 'Arch. Samantha Reed',
        startDate: '2026-11-01',
        deadline: '2027-01-15',
        status: 'Pending',
        progress: 0,
        deliverables: ['Master Bill of Quantities', 'Contractor Conditions of Tender', 'MEP Performance Guarantees'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-01', 6, 'Comprehensive Tender BOQ & Contractor Prequalification', false),
        sectionCompletion: { Electrical: false, Civil: false, Plumbing: false, Architectural: false },
        assignedMemberIds: ['usr-pm-1'],
        critical: false
      }
    ]
  },
  {
    id: 'prj-dg5-02',
    code: 'DG5-PRJ-2026-02',
    title: 'Araliya Grand Luxury Eco-Resort',
    client: 'Serendib Heritage Leisure Ltd',
    location: 'Bentota Coastal Strip, Southern Province',
    category: 'Residential',
    budget: '$22,000,000 USD',
    startDate: '2026-02-10',
    targetCompletion: '2027-03-20',
    overallProgress: 45,
    status: 'Active',
    projectManager: 'Arch. Samantha Reed',
    description: 'Eco-sustainable 120-villa coastal sanctuary with low-carbon structural timber frames, solar microgrid, and wastewater recycling infrastructure.',
    keyDisciplines: ['Civil', 'Electrical', 'Plumbing', 'Architectural'],
    assignedMemberIds: ['usr-civil-1', 'usr-plumb-1', 'usr-elec-1', 'usr-arch-1'],
    phases: [
      {
        id: 'ph-02-1',
        phaseNumber: 1,
        name: 'Topographic Survey & Coastal Buffer Clearance',
        assignedSection: 'Civil',
        leadPerson: 'Eng. Dilshan Perera',
        startDate: '2026-02-10',
        deadline: '2026-04-10',
        status: 'Completed',
        progress: 100,
        deliverables: ['Coast Conservation Dept Clearance', 'Ground Water Salinity Profiling'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-02', 1, 'Topographic Survey & Coastal Buffer Clearance', true),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: true },
        assignedMemberIds: ['usr-civil-1'],
        critical: false
      },
      {
        id: 'ph-02-2',
        phaseNumber: 2,
        name: 'Blackwater & Greywater Reed-Bed Filtration System',
        assignedSection: 'Plumbing',
        leadPerson: 'Eng. Kasun Silva',
        startDate: '2026-04-15',
        deadline: '2026-10-10',
        status: 'In Progress',
        progress: 75,
        deliverables: ['Bio-digester Tank Details', 'Effluent Quality Monitoring Station Schematics'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-02', 2, 'Blackwater & Greywater Reed-Bed Filtration System', false),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: false },
        assignedMemberIds: ['usr-plumb-1'],
        critical: true
      },
      {
        id: 'ph-02-3',
        phaseNumber: 3,
        name: 'Off-Grid 1.2MW Solar Microgrid & Battery Storage',
        assignedSection: 'Electrical',
        leadPerson: 'Eng. Kevin Fernando',
        startDate: '2026-05-01',
        deadline: '2026-10-25',
        status: 'In Progress',
        progress: 50,
        deliverables: ['Inverter Sizing Calculations', 'Underground Ducting Reticulation Plan'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-02', 3, 'Off-Grid 1.2MW Solar Microgrid & Battery Storage', false),
        sectionCompletion: { Electrical: true, Civil: false, Plumbing: false, Architectural: true },
        assignedMemberIds: ['usr-elec-1'],
        critical: false
      },
      {
        id: 'ph-02-4',
        phaseNumber: 4,
        name: 'Glulam Timber Villa Architectural Detailing',
        assignedSection: 'Architectural',
        leadPerson: 'Arch. Nimmi Wickramasinghe',
        startDate: '2026-07-01',
        deadline: '2026-11-15',
        status: 'Pending',
        progress: 25,
        deliverables: ['Joinery Schedules', 'Roof Louver Natural Ventilation Models'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-02', 4, 'Glulam Timber Villa Architectural Detailing', false),
        sectionCompletion: { Electrical: false, Civil: false, Plumbing: false, Architectural: true },
        assignedMemberIds: ['usr-arch-1'],
        critical: false
      }
    ]
  },
  {
    id: 'prj-dg5-03',
    code: 'DG5-PRJ-2026-03',
    title: 'High-Tech Surgical Center & Hospital Wing',
    client: 'Ministry of Health & CareFirst Global',
    location: 'Peradeniya Road, Kandy',
    category: 'Healthcare',
    budget: '$34,200,000 USD',
    startDate: '2026-03-01',
    targetCompletion: '2027-06-30',
    overallProgress: 35,
    status: 'Active',
    projectManager: 'Arch. Samantha Reed',
    description: 'Specialized 200-bed surgical complex requiring ultra-reliable medical gas plumbing, isolated clinical electrical grounding, and HEPA HVAC airflows.',
    keyDisciplines: ['Plumbing', 'Electrical', 'Civil'],
    assignedMemberIds: ['usr-plumb-1', 'usr-elec-1', 'usr-civil-1'],
    phases: [
      {
        id: 'ph-03-1',
        phaseNumber: 1,
        name: 'Clean Room HVAC & Medical Gas Piping System',
        assignedSection: 'Plumbing',
        leadPerson: 'Eng. Kasun Silva',
        startDate: '2026-03-01',
        deadline: '2026-10-12',
        status: 'In Progress',
        progress: 75,
        deliverables: ['Oxygen/Nitrous Manifold Room Layout', 'Vacuum Pressure Loss Calculations'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-03', 1, 'Clean Room HVAC & Medical Gas Piping System', false),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: true, Architectural: false },
        assignedMemberIds: ['usr-plumb-1', 'usr-plumb-3'],
        critical: true
      },
      {
        id: 'ph-03-2',
        phaseNumber: 2,
        name: 'Isolated Power System (IPS) for Operating Theatres',
        assignedSection: 'Electrical',
        leadPerson: 'Eng. Kevin Fernando',
        startDate: '2026-04-10',
        deadline: '2026-10-18',
        status: 'In Progress',
        progress: 50,
        deliverables: ['Equipotential Earth Busbar Details', 'Dual Online UPS Redundancy Wiring'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-03', 2, 'Isolated Power System (IPS) for Operating Theatres', false),
        sectionCompletion: { Electrical: true, Civil: false, Plumbing: false, Architectural: true },
        assignedMemberIds: ['usr-elec-1', 'usr-elec-2'],
        critical: true
      },
      {
        id: 'ph-03-3',
        phaseNumber: 3,
        name: 'Seismic Shock Absorbing Structural Pylons',
        assignedSection: 'Civil',
        leadPerson: 'Eng. Dilshan Perera',
        startDate: '2026-05-15',
        deadline: '2026-11-20',
        status: 'Pending',
        progress: 25,
        deliverables: ['Vibration Isolation Pad Specifications', 'Foundation Pier Structural Calculations'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-03', 3, 'Seismic Shock Absorbing Structural Pylons', false),
        sectionCompletion: { Electrical: false, Civil: true, Plumbing: false, Architectural: false },
        assignedMemberIds: ['usr-civil-1'],
        critical: false
      }
    ]
  },
  {
    id: 'prj-dg5-04',
    code: 'DG5-PRJ-2026-04',
    title: 'Central Highway Express Flyover & Drainage',
    client: 'Road Development Authority (RDA)',
    location: 'Kadawatha to Mirigama Corridor',
    category: 'Infrastructure',
    budget: '$62,000,000 USD',
    startDate: '2026-04-01',
    targetCompletion: '2028-02-15',
    overallProgress: 20,
    status: 'Active',
    projectManager: 'Arch. Samantha Reed',
    description: 'Elevated multi-span viaduct bridge deck with high-throughput retention culverts, smart tolling electrical feeds, and geotechnical soil reinforcement.',
    keyDisciplines: ['Civil', 'Electrical', 'Plumbing'],
    assignedMemberIds: ['usr-civil-1', 'usr-civil-3', 'usr-plumb-2', 'usr-elec-3'],
    phases: [
      {
        id: 'ph-04-1',
        phaseNumber: 1,
        name: 'Pre-stressed Concrete Girder Deck Engineering',
        assignedSection: 'Civil',
        leadPerson: 'Eng. Dilshan Perera',
        startDate: '2026-04-01',
        deadline: '2026-10-09',
        status: 'In Progress',
        progress: 75,
        deliverables: ['Tendon Post-tensioning Stresses', 'Bridge Pier Bent Cap Reinforcement'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-04', 1, 'Pre-stressed Concrete Girder Deck Engineering', false),
        sectionCompletion: { Electrical: true, Civil: true, Plumbing: false, Architectural: true },
        assignedMemberIds: ['usr-civil-1', 'usr-civil-3'],
        critical: true
      },
      {
        id: 'ph-04-2',
        phaseNumber: 2,
        name: 'Hydraulic Flash Flood Culvert Stormwater Routing',
        assignedSection: 'Plumbing',
        leadPerson: 'Eng. Kasun Silva',
        startDate: '2026-05-20',
        deadline: '2026-10-30',
        status: 'In Progress',
        progress: 25,
        deliverables: ['50-Year Flood Basin Runoff Analysis', 'Precast Box Culvert Structural Joint Seals'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-04', 2, 'Hydraulic Flash Flood Culvert Stormwater Routing', false),
        sectionCompletion: { Electrical: false, Civil: false, Plumbing: true, Architectural: false },
        assignedMemberIds: ['usr-plumb-2'],
        critical: false
      },
      {
        id: 'ph-04-3',
        phaseNumber: 3,
        name: 'Intelligent Transportation Systems (ITS) & High-Mast Lighting',
        assignedSection: 'Electrical',
        leadPerson: 'Eng. Kevin Fernando',
        startDate: '2026-06-15',
        deadline: '2026-12-10',
        status: 'Pending',
        progress: 0,
        deliverables: ['Fiber Optic Duct Highway Layout', 'Solar Powered Emergency Roadside Telephone Nodes'],
        deliverableItems: buildPhaseDeliverables('DG5-PRJ-2026-04', 3, 'Intelligent Transportation Systems (ITS) & High-Mast Lighting', false),
        sectionCompletion: { Electrical: false, Civil: false, Plumbing: false, Architectural: false },
        assignedMemberIds: ['usr-elec-3'],
        critical: false
      }
    ]
  }
];

export const INITIAL_MESSAGES: SectionMessage[] = [
  // Electrical
  {
    id: 'msg-elec-1',
    discipline: 'Electrical',
    senderId: 'usr-pm-1',
    senderName: 'Arch. Samantha Reed',
    senderRole: 'Project Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Today at 09:15 AM',
    content: 'Team Electrical: The client for Marina Bay requested a review on the 11kV transformer footprint in Basement Level 2. Please make sure clearance complies with CEB safety guidelines.',
    urgent: true
  },
  {
    id: 'msg-elec-2',
    discipline: 'Electrical',
    senderId: 'usr-elec-1',
    senderName: 'Eng. Kevin Fernando',
    senderRole: 'Electrical Lead',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Today at 09:42 AM',
    content: 'Understood Samantha. Dilshan and I coordinated the structural trenching yesterday. I will upload Rev 3.1 of the Substation Single Line Diagram shortly for council submission.',
    urgent: false,
    attachmentName: 'DG5-MB-ELEC-SLD-Rev3.1.dwg'
  },
  // Civil
  {
    id: 'msg-civil-1',
    discipline: 'Civil',
    senderId: 'usr-civil-1',
    senderName: 'Eng. Dilshan Perera',
    senderRole: 'Civil Lead',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday at 04:30 PM',
    content: 'Highway Viaduct Phase 1: Pier 14 core boring results are verified. Safe bearing capacity is at 380 kPa. Girder deflection calculations are completed and attached in the vault.',
    urgent: false,
    attachmentName: 'Viaduct_Pier14_Geotechnical_Calculations.pdf'
  },
  {
    id: 'msg-civil-2',
    discipline: 'Civil',
    senderId: 'usr-pm-1',
    senderName: 'Arch. Samantha Reed',
    senderRole: 'Project Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday at 05:10 PM',
    content: 'Excellent Dilshan. Please ensure the municipal road authority signs off on the lane deflection plan before Friday.',
    urgent: true
  },
  // Plumbing
  {
    id: 'msg-plumb-1',
    discipline: 'Plumbing',
    senderId: 'usr-plumb-1',
    senderName: 'Eng. Kasun Silva',
    senderRole: 'Plumbing Lead',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Today at 08:30 AM',
    content: 'Hospital Surgical Wing: The oxygen manifold room requires 150mm separation from electrical ducting as per British Standard 7671. Kevin, please cross-verify with your risers.',
    urgent: true,
    attachmentName: 'MedGas_Separation_Standard_BS7671.pdf'
  },
  {
    id: 'msg-plumb-2',
    discipline: 'Plumbing',
    senderId: 'usr-elec-1',
    senderName: 'Eng. Kevin Fernando',
    senderRole: 'Electrical Lead',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Today at 08:50 AM',
    content: 'Copy that Kasun. Moving the low-voltage tray 250mm north along Corridor 3. Updated drawing uploaded in the BIM shared repository.',
    urgent: false
  },
  // Architectural
  {
    id: 'msg-arch-1',
    discipline: 'Architectural',
    senderId: 'usr-arch-1',
    senderName: 'Arch. Nimmi Wickramasinghe',
    senderRole: 'Senior Architect',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    timestamp: '2 days ago',
    content: 'Araliya Eco-Resort: Roof pitch adjustments completed to optimize rainwater harvesting catchments. Shared timber bracket details with Dilshan for stress review.',
    urgent: false,
    attachmentName: 'Araliya_Villa_RoofProfile_R02.dwg'
  }
];

export const INITIAL_FILES: SharedFile[] = [
  {
    id: 'file-01',
    title: 'Marina Bay - Substation Single Line & Earthing Grid',
    fileName: 'DG5-MB-ELEC-SLD-Rev3.1.dwg',
    fileSize: '14.8 MB',
    fileType: 'dwg',
    discipline: 'Electrical',
    version: 'Rev 3.1 - Final Approved',
    uploadedBy: 'Eng. Kevin Fernando',
    uploadDate: '2026-10-05',
    projectId: 'prj-dg5-01',
    projectTitle: 'Marina Bay Commercial Hub',
    notes: 'Certified for municipal statutory approval submission with CEB transformer rating specs.',
    downloadsCount: 19
  },
  {
    id: 'file-02',
    title: 'High-Rise Hydro-Pneumatic Booster Riser Diagrams',
    fileName: 'MB_Plumbing_Riser_Schematic_v2.pdf',
    fileSize: '8.4 MB',
    fileType: 'pdf',
    discipline: 'Plumbing',
    version: 'Rev 2.0',
    uploadedBy: 'Eng. Kasun Silva',
    uploadDate: '2026-10-04',
    projectId: 'prj-dg5-01',
    projectTitle: 'Marina Bay Commercial Hub',
    notes: 'Calculations for PRV pressure reducing valve stations from Floor 20 to 38.',
    downloadsCount: 14
  },
  {
    id: 'file-03',
    title: 'Highway Viaduct - Pier 14 Geotechnical & Girder Deflection Model',
    fileName: 'Viaduct_Pier14_Geotechnical_Calculations.pdf',
    fileSize: '18.2 MB',
    fileType: 'pdf',
    discipline: 'Civil',
    version: 'Rev 1.4',
    uploadedBy: 'Eng. Dilshan Perera',
    uploadDate: '2026-10-04',
    projectId: 'prj-dg5-04',
    projectTitle: 'Central Highway Express Flyover',
    notes: 'Load testing results and shear reinforcement schedules for post-tensioned bridge deck.',
    downloadsCount: 22
  },
  {
    id: 'file-04',
    title: 'Hospital Surgical Wing - Medical Gas & Cryogenic Pipe Plan',
    fileName: 'KandyHospital_MedGas_Layout_BIM.bim',
    fileSize: '42.5 MB',
    fileType: 'bim',
    discipline: 'Plumbing',
    version: 'Rev 2.8',
    uploadedBy: 'Eng. Kasun Silva',
    uploadDate: '2026-10-03',
    projectId: 'prj-dg5-03',
    projectTitle: 'High-Tech Surgical Center & Hospital Wing',
    notes: 'Includes vacuum, nitrous oxide, oxygen 3D routing avoiding clean room HVAC ducts.',
    downloadsCount: 31
  },
  {
    id: 'file-05',
    title: 'Araliya Eco-Resort - Glulam Timber Villa Framing & Roof Profiles',
    fileName: 'Araliya_Villa_RoofProfile_R02.dwg',
    fileSize: '11.6 MB',
    fileType: 'dwg',
    discipline: 'Architectural',
    version: 'Rev 2.0',
    uploadedBy: 'Arch. Nimmi Wickramasinghe',
    uploadDate: '2026-10-02',
    projectId: 'prj-dg5-02',
    projectTitle: 'Araliya Grand Luxury Eco-Resort',
    notes: 'Full elevations and section cuts with natural ventilation airflow paths.',
    downloadsCount: 9
  },
  {
    id: 'file-06',
    title: 'Marina Bay - Master Bill of Quantities (BOQ) Prelim Sheet',
    fileName: 'MarinaBay_Master_BOQ_Draft.xlsx',
    fileSize: '3.7 MB',
    fileType: 'xlsx',
    discipline: 'Management',
    version: 'Draft 0.9',
    uploadedBy: 'Arch. Samantha Reed',
    uploadDate: '2026-10-01',
    projectId: 'prj-dg5-01',
    projectTitle: 'Marina Bay Commercial Hub',
    notes: 'Itemized MEP, Civil earthworks and superstructure cost estimations.',
    downloadsCount: 45
  }
];
