/* ==========================================================================
   PORTFOLIO DATA
   All site content lives here. Edit this file to update the portfolio —
   the page renders careers, skills, projects, achievements and quests from it.
   ========================================================================== */

window.PORTFOLIO = {
  profile: {
    name: 'Monika K',
    role: 'Flutter Developer',
    email: 'monikaksee0911@gmail.com',
    location: 'Trichy, Tamil Nadu, India',
    // TODO: replace with your real profile URLs
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    // Set to an image path (e.g. 'assets/avatar.jpg') to replace the initials avatar
    avatar: null,
  },

  career: [
    {
      level: '01',
      title: 'Processing Executive',
      company: 'Trayee Business Solutions',
      period: 'Nov 2023 – Nov 2024',
      description:
        'Worked with data processing, documentation and accuracy-focused business operations.',
      tags: ['Data Processing', 'Documentation', 'Accuracy'],
      current: false,
    },
    {
      level: '02',
      title: 'Flutter Developer',
      company: 'Azotos Software Technology Pvt. Ltd.',
      period: 'Nov 2024 – Present',
      description:
        'Developing Flutter applications with responsive UI, REST API integration, Provider state management, JSON parsing, local storage and modern mobile application workflows.',
      tags: ['Flutter', 'Dart', 'REST API', 'Provider', 'JSON', 'Local Storage'],
      current: true,
    },
  ],

  // level: 3 = PRIMARY, 2 = WORKING KNOWLEDGE, 1 = FAMILIAR
  skills: [
    {
      slot: '01',
      category: 'Mobile Engineering',
      size: 'lg',
      items: [
        { name: 'Flutter', level: 3 },
        { name: 'Dart', level: 3 },
        { name: 'Provider', level: 3 },
      ],
    },
    {
      slot: '02',
      category: 'API & Backend',
      size: 'lg',
      items: [
        { name: 'REST APIs', level: 3 },
        { name: 'JSON', level: 3 },
        { name: 'Firebase', level: 2 },
        { name: 'Firestore', level: 2 },
      ],
    },
    {
      slot: '03',
      category: 'Web',
      size: 'sm',
      items: [
        { name: 'HTML', level: 2 },
        { name: 'CSS', level: 2 },
      ],
    },
    {
      slot: '04',
      category: 'Data & Storage',
      size: 'sm',
      items: [
        { name: 'SQLite', level: 2 },
        { name: 'SharedPreferences', level: 2 },
      ],
    },
    {
      slot: '05',
      category: 'Tools',
      size: 'wide',
      items: [
        { name: 'Git', level: 2 },
        { name: 'GitHub', level: 2 },
        { name: 'Postman', level: 2 },
        { name: 'VS Code', level: 2 },
        { name: 'Android Studio', level: 2 },
        { name: 'Figma', level: 1 },
      ],
    },
  ],

  projects: [
    {
      id: 'af-venturez',
      name: 'A & F Venturez',
      category: 'Business / CRM',
      hue: 222,
      role: 'Flutter Developer',
      description:
        'Developed a Flutter mobile application with responsive UI, REST API integration, JSON parsing, Provider state management and smooth navigation.',
      tech: ['Flutter', 'Dart', 'Provider', 'REST API', 'JSON'],
      features: [
        'Responsive UI across screen sizes',
        'REST API integration',
        'JSON parsing and data handling',
        'Provider state management',
        'Smooth in-app navigation',
      ],
    },
    {
      id: 'landmarket',
      name: 'LandMarket',
      category: 'Property / Services',
      hue: 160,
      role: 'Flutter Developer',
      description:
        'Developed a mobile application for exploring land and property information. Implemented responsive UI, REST API integration, Google Maps features, location visualization and property data handling.',
      tech: ['Flutter', 'Dart', 'Provider', 'REST API', 'Google Maps'],
      features: [
        'Land and property information browsing',
        'Google Maps features',
        'Location visualization',
        'Property data handling',
        'REST API integration with responsive UI',
      ],
    },
    {
      id: 'team-pilot',
      name: 'Team Pilot',
      category: 'Team Management',
      hue: 262,
      role: 'Flutter Developer',
      description:
        'Developed a team management application for tracking activities, tasks and team workflows. Implemented Provider state management, REST APIs and push notifications.',
      tech: ['Flutter', 'Dart', 'Provider', 'REST API', 'Notifications'],
      features: [
        'Activity and task tracking',
        'Team workflow management',
        'Push notifications',
        'Provider state management',
        'REST API integration',
      ],
    },
    {
      id: 'schapp',
      name: 'SchApp',
      category: 'Education',
      hue: 38,
      role: 'Flutter Developer',
      description:
        'Developed a school-related mobile application with job searching and application features. Implemented responsive Flutter UI, REST API integration and Provider state management.',
      tech: ['Flutter', 'Dart', 'Provider', 'REST API'],
      features: [
        'Job searching',
        'Job application flow',
        'Responsive Flutter UI',
        'REST API integration',
        'Provider state management',
      ],
    },
    {
      id: 'bharatnet',
      name: 'BharatNet / BSNL Survey App',
      category: 'Field Survey',
      hue: 196,
      role: 'Flutter Developer',
      description:
        'Worked on a survey-based mobile application for collecting and managing field survey data related to network infrastructure. Implemented mobile data collection workflows, responsive UI, location-related functionality and API integration.',
      tech: ['Flutter', 'Dart', 'REST API', 'Location'],
      features: [
        'Field survey data collection workflows',
        'Survey data management for network infrastructure',
        'Location-related functionality',
        'API integration',
        'Responsive UI',
      ],
    },
    {
      id: 'trauell',
      name: 'Trauell',
      category: 'AR / VR / Tourism',
      hue: 300,
      role: 'Flutter Developer',
      description:
        'Worked on Trauell, an augmented reality (AR) and virtual reality (VR) deep-tech tourism application based in Tiruchirappalli, India. The application focuses on transforming tourism and destination discovery through immersive AR and VR experiences.',
      details:
        'Worked on Flutter UI development, navigation, API integration, interactive screens and AR/VR-related application flows. Worked with 3D/GLB content and immersive experiences including AR model viewing and VR-related screens.',
      tech: ['Flutter', 'Dart', 'AR', 'VR', '3D', 'GLB', 'REST APIs', 'Provider'],
      features: [
        'Flutter UI development and navigation',
        'Interactive screens',
        'AR/VR-related application flows',
        'AR model viewing with 3D/GLB content',
        'VR-related screens',
        'API integration',
      ],
      link: { label: 'Explore Trauell', url: 'https://www.trauell.com/' },
    },
  ],

  exploring: [
    'AR / VR',
    '3D Experiences',
    'Advanced Flutter Architecture',
    'Web Development',
    'Modern UI Design',
  ],

  achievements: [
    { title: 'Flutter Developer', icon: 'flutter', tip: 'Building production mobile apps with Flutter and Dart since Nov 2024.' },
    { title: 'REST API Integration', icon: 'api', tip: 'Connected apps to REST APIs with JSON parsing across all six featured projects.' },
    { title: 'Firebase Integration', icon: 'flame', tip: 'Working with Firebase and Firestore for backend services and data.' },
    { title: 'Provider State Management', icon: 'layers', tip: 'Structured app state with Provider for maintainable, reactive UIs.' },
    { title: 'Google Maps Integration', icon: 'map', tip: 'Added maps and location visualization in the LandMarket app.' },
    { title: 'AR / VR Exploration', icon: 'cube', tip: 'Worked on AR model viewing, VR screens and GLB content in Trauell.' },
    { title: 'HTML & CSS', icon: 'code', tip: 'Structuring and styling responsive web interfaces.' },
    { title: 'Git & GitHub', icon: 'branch', tip: 'Version control and collaboration workflows with Git and GitHub.' },
  ],

  quest: [
    { text: 'Build Flutter applications', done: true },
    { text: 'Work with REST APIs', done: true },
    { text: 'Build responsive UI', done: true },
    { text: 'Explore AR / VR', done: true },
    { text: 'Improve advanced Flutter architecture', done: false },
    { text: 'Build more web experiences', done: false },
  ],
};
