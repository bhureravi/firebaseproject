// Mock storage utilities for Insti Chain
// TODO: Replace with real API calls when connecting to backend

const STORAGE_KEYS = {
  USERS: 'instichain_users',
  EVENTS: 'instichain_events',
  CURRENT_USER: 'instichain_currentUser'
};

// Sample data initialization
const SAMPLE_CLUBS = [
  {
    id: 'club_webops',
    name: 'WebOps Club IITM',
    logo: '/assets/webops-logo.svg',
    type: 'club'
  },
  {
    id: 'club_blockchain',
    name: 'Blockchain Club IITM',
    logo: '/assets/blockchain-logo.svg', 
    type: 'club'
  }
];

const SAMPLE_USERS = [
  {
    id: 'demo_student',
    name: 'Alex Kumar',
    email: 'alex@student.iitm.ac.in',
    role: 'student',
    phone: '+91 9876543210',
    rollNumber: 'CS21B001',
    tokens: 45,
    avatarUrl: null,
    starredEvents: ['evt_001', 'evt_003'],
    participatedEvents: ['evt_004', 'evt_005']
  },
  {
    id: 'demo_club',
    name: 'WebOps Admin',
    email: 'admin@webops.iitm.ac.in',
    role: 'club',
    clubId: 'club_webops',
    tokens: 0,
    avatarUrl: null
  }
];

const SAMPLE_EVENTS = [
  {
    id: 'evt_001',
    name: 'Blockchain 101 Workshop',
    club: 'Blockchain Club IITM',
    clubId: 'club_blockchain',
    clubLogo: '/assets/blockchain-logo.svg',
    venue: 'Lecture Hall 3',
    date: '2025-01-15',
    startTime: '14:00',
    endTime: '17:00',
    status: 'upcoming',
    tokens: 10,
    description: 'Learn the fundamentals of blockchain technology, smart contracts, and decentralized applications. Perfect for beginners!',
    capacity: 100,
    registered: 45,
    starredBy: ['demo_student'],
    participants: []
  },
  {
    id: 'evt_002',
    name: 'React Masterclass',
    club: 'WebOps Club IITM',
    clubId: 'club_webops',
    clubLogo: '/assets/webops-logo.svg',
    venue: 'Computer Lab 1',
    date: '2025-01-18',
    startTime: '10:00',
    endTime: '16:00',
    status: 'upcoming',
    tokens: 15,
    description: 'Comprehensive React workshop covering hooks, state management, and modern development practices.',
    capacity: 60,
    registered: 35,
    starredBy: [],
    participants: []
  },
  {
    id: 'evt_003',
    name: 'Web3 Hackathon',
    club: 'Blockchain Club IITM',
    clubId: 'club_blockchain',
    clubLogo: '/assets/blockchain-logo.svg',
    venue: 'Innovation Lab',
    date: '2025-01-25',
    startTime: '09:00',
    endTime: '21:00',
    status: 'upcoming',
    tokens: 25,
    description: '24-hour hackathon building decentralized applications. Prizes worth ₹50,000!',
    capacity: 80,
    registered: 72,
    starredBy: ['demo_student'],
    participants: []
  },
  {
    id: 'evt_004',
    name: 'Git & GitHub Workshop',
    club: 'WebOps Club IITM',
    clubId: 'club_webops',
    clubLogo: '/assets/webops-logo.svg',
    venue: 'CS Seminar Hall',
    date: '2024-12-20',
    startTime: '15:00',
    endTime: '18:00',
    status: 'completed',
    tokens: 8,
    description: 'Version control essentials for developers. Learn Git workflows and collaboration.',
    capacity: 50,
    registered: 48,
    starredBy: [],
    participants: ['demo_student']
  },
  {
    id: 'evt_005',
    name: 'Smart Contract Security',
    club: 'Blockchain Club IITM', 
    clubId: 'club_blockchain',
    clubLogo: '/assets/blockchain-logo.svg',
    venue: 'Room 301',
    date: '2024-12-15',
    startTime: '16:00',
    endTime: '19:00',
    status: 'completed',
    tokens: 12,
    description: 'Learn about common vulnerabilities and security best practices in smart contract development.',
    capacity: 40,
    registered: 37,
    starredBy: [],
    participants: ['demo_student']
  }
];

// Initialize sample data if not exists
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SAMPLE_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SAMPLE_EVENTS));
  }
};

// User management
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = () => {
  const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!currentUserId) return null;
  
  const users = getUsers();
  return users.find(user => user.id === currentUserId) || null;
};

// Event management
export const getEvents = () => {
  const events = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return events ? JSON.parse(events) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

// Authentication
export const signInMock = (email, role = 'student') => {
  const users = getUsers();
  let user = users.find(u => u.email === email);
  
  if (!user) {
    // Create new user
    user = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      phone: '',
      rollNumber: role === 'student' ? `CS21B${Math.floor(Math.random() * 999).toString().padStart(3, '0')}` : '',
      tokens: 0,
      avatarUrl: null,
      starredEvents: [],
      participatedEvents: [],
      clubId: role === 'club' ? 'club_webops' : undefined
    };
    users.push(user);
    saveUsers(users);
  }
  
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.id);
  return user;
};

export const signOut = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Demo user login helpers
export const signInDemoStudent = () => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'demo_student');
  return SAMPLE_USERS[0];
};

export const signInDemoClub = () => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'demo_club');
  return SAMPLE_USERS[1];
};

// Event operations
export const toggleStarEvent = (eventId, userId) => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    const starredIndex = event.starredBy.indexOf(userId);
    if (starredIndex > -1) {
      event.starredBy.splice(starredIndex, 1);
    } else {
      event.starredBy.push(userId);
    }
    saveEvents(events);
  }
  
  return event;
};

export const registerForEvent = (eventId, userId) => {
  const events = getEvents();
  const users = getUsers();
  
  const event = events.find(e => e.id === eventId);
  const user = users.find(u => u.id === userId);
  
  if (event && user && !event.participants.includes(userId)) {
    event.participants.push(userId);
    event.registered = event.participants.length;
    saveEvents(events);
    
    // Add to user's participated events if completed
    if (event.status === 'completed' && !user.participatedEvents.includes(eventId)) {
      user.participatedEvents.push(eventId);
      user.tokens += event.tokens;
      saveUsers(users);
    }
  }
  
  return { event, user };
};

export const unregisterFromEvent = (eventId, userId) => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    const participantIndex = event.participants.indexOf(userId);
    if (participantIndex > -1) {
      event.participants.splice(participantIndex, 1);
      event.registered = event.participants.length;
      saveEvents(events);
    }
  }
  
  return event;
};

// Club operations
export const createEvent = (eventData, clubId) => {
  const events = getEvents();
  const newEvent = {
    id: `evt_${Date.now()}`,
    ...eventData,
    clubId,
    starredBy: [],
    participants: [],
    registered: 0,
    status: 'upcoming'
  };
  
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const updateEventStatus = (eventId, status) => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    event.status = status;
    saveEvents(events);
  }
  
  return event;
};

export const issueTokensToParticipants = (eventId, participantIds) => {
  const users = getUsers();
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    participantIds.forEach(userId => {
      const user = users.find(u => u.id === userId);
      if (user && !user.participatedEvents.includes(eventId)) {
        user.participatedEvents.push(eventId);
        user.tokens += event.tokens;
      }
    });
    
    saveUsers(users);
    event.status = 'completed';
    saveEvents(events);
  }
  
  return { event, users };
};