// src/js/modules/dataService.js

/**
 * ConnectHub Intranet - Data Service Module
 *
 * Provides functions to fetch various types of data for the intranet.
 * In a real application, these would be actual API calls.
 * Here, we simulate API calls using Promises and setTimeout to mimic network delays
 * and provide mock data.
 */

// Simulate a network delay
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const BASE_DELAY = 500; // Base delay for API calls in milliseconds

/**
 * Generic function to simulate fetching data from an "API endpoint".
 * @param {string} endpoint - The simulated API endpoint (e.g., 'briefing', 'news').
 * @param {any} mockData - The data to return for this endpoint.
 * @returns {Promise<any>} - A promise that resolves with the mock data or rejects on error.
 */
async function fetchData(endpoint, mockData) {
  try {
    console.log(`[DataService] Fetching data for: ${endpoint}...`);
    await simulateDelay(BASE_DELAY + Math.random() * 200); // Add some random variance
    // Simulate a random error 5% of the time
    if (Math.random() < 0.05) {
      throw new Error(`[DataService] Simulated network error for ${endpoint}.`);
    }
    console.log(`[DataService] Data fetched successfully for: ${endpoint}`);
    return mockData;
  } catch (error) {
    console.error(`[DataService] Error fetching ${endpoint}:`, error.message);
    throw error; // Re-throw to allow calling components to handle it
  }
}

/**
 * Fetches personal briefing data.
 * Includes tasks, unread emails, upcoming meetings, and weather.
 */
export async function fetchPersonalBriefingData() {
  const mockBriefingData = {
    tasksCount: 7,
    unreadEmailsCount: 12,
    upcomingMeetings: [
      { title: "Project Alpha Sync", time: "10:00 AM", location: "Conference Room A" },
      { title: "Marketing Review", time: "02:30 PM", location: "Online (Teams)" },
      { title: "One-on-One with Manager", time: "04:00 PM", location: "Office 301" },
    ],
    weather: {
      city: "Victorias City",
      temperature: "28°C",
      condition: "Partly Cloudy",
      icon: "wi-day-cloudy-gusts" // Example: Font Awesome or custom weather icon class
    }
  };
  return fetchData('personal-briefing', mockBriefingData);
}

/**
 * Fetches news feed articles.
 * @param {string} [category='all'] - Filter news by category.
 * @param {string} [query=''] - Search query for news.
 */
export async function fetchNewsFeed(category = 'all', query = '') {
  const allNews = [
    {
      id: 'news1',
      title: 'Company Picnic Rescheduled to August 15th',
      date: 'July 24, 2025',
      imageUrl: './assets/images/news-picnic.jpg',
      previewText: 'Due to unforeseen weather conditions, the annual company picnic has been moved to a new date.',
      category: 'Announcements'
    },
    {
      id: 'news2',
      title: 'New Employee Onboarding Program Launched',
      date: 'July 22, 2025',
      imageUrl: './assets/images/news-onboarding.jpg',
      previewText: 'Our HR team has rolled out an enhanced onboarding program for all new hires.',
      category: 'HR'
    },
    {
      id: 'news3',
      title: 'Q2 Financial Results Exceed Expectations',
      date: 'July 20, 2025',
      imageUrl: './assets/images/news-finance.jpg',
      previewText: 'ConnectHub reports strong financial performance for the second quarter.',
      category: 'Finance'
    },
    {
      id: 'news4',
      title: 'IT Security Awareness Training Mandatory',
      date: 'July 18, 2025',
      imageUrl: './assets/images/news-security.jpg',
      previewText: 'All employees must complete the updated cybersecurity training by month-end.',
      category: 'IT'
    },
    {
      id: 'news5',
      title: 'Innovation Challenge: Submit Your Ideas!',
      date: 'July 15, 2025',
      imageUrl: './assets/images/news-innovation.jpg',
      previewText: 'Got a brilliant idea to improve our operations? Participate in this year\'s challenge.',
      category: 'Company Culture'
    }
  ];

  let filteredNews = allNews;

  if (category !== 'all') {
    filteredNews = filteredNews.filter(news => news.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredNews = filteredNews.filter(news =>
      news.title.toLowerCase().includes(lowerCaseQuery) ||
      news.previewText.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return fetchData('news-feed', filteredNews);
}

/**
 * Fetches quick links data.
 */
export async function fetchQuickLinks() {
  const mockQuickLinks = [
    { id: 'ql1', icon: 'fas fa-calendar-alt', title: 'Leave Request', url: '#leave-request' },
    { id: 'ql2', icon: 'fas fa-chart-line', title: 'Company Reports', url: '#company-reports' },
    { id: 'ql3', icon: 'fas fa-headset', title: 'IT Helpdesk', url: '#it-helpdesk' },
    { id: 'ql4', icon: 'fas fa-user-friends', title: 'Employee Directory', url: '#employee-directory' },
    { id: 'ql5', icon: 'fas fa-hand-holding-usd', title: 'Expense Forms', url: '#expense-forms' },
    { id: 'ql6', icon: 'fas fa-book', title: 'Policy Handbook', url: '#policy-handbook' },
  ];
  return fetchData('quick-links', mockQuickLinks);
}

/**
 * Fetches team updates/shout-outs.
 */
export async function fetchTeamUpdates() {
  const mockTeamUpdates = [
    { id: 'tu1', author: 'HR Team', updateText: 'Big shout-out to the **Sales Department** for exceeding their Q2 targets!', date: 'July 25, 2025' },
    { id: 'tu2', author: 'Mark Johnson', updateText: 'Congratulations to **Sarah Lee** on her promotion to Senior Developer!', date: 'July 24, 2025' },
    { id: 'tu3', author: 'CEO', updateText: 'A warm welcome to all our **new hires** this month! Excited to have you join ConnectHub.', date: 'July 23, 2025' },
    { id: 'tu4', author: 'IT Department', updateText: 'Our **system upgrade** is complete. Please report any issues to the helpdesk.', date: 'July 22, 2025' },
  ];
  return fetchData('team-updates', mockTeamUpdates);
}

/**
 * Fetches upcoming events data.
 */
export async function fetchUpcomingEvents() {
  const mockUpcomingEvents = [
    { id: 'e1', title: 'All-Hands Meeting', date: { month: 'Aug', day: 5 }, time: '10:00 AM - 11:30 AM', location: 'Main Auditorium', link: '#event-all-hands' },
    { id: 'e2', title: 'Monthly Innovation Workshop', date: { month: 'Aug', day: 12 }, time: '01:00 PM - 03:00 PM', location: 'Online (Zoom)', link: '#event-innovation' },
    { id: 'e3', title: 'Company Health Fair', date: { month: 'Aug', day: 20 }, time: '09:00 AM - 04:00 PM', location: 'Gymnasium', link: '#event-health-fair' },
    { id: 'e4', title: 'Leadership Training Session', date: { month: 'Sep', day: 2 }, time: '09:00 AM - 05:00 PM', location: 'Training Room B', link: '#event-leadership' },
  ];
  return fetchData('upcoming-events', mockUpcomingEvents);
}

/**
 * Fetches employee spotlight data.
 */
export async function fetchEmployeeSpotlight() {
  const mockSpotlight = {
    name: "Maria Santos",
    position: "Senior Marketing Specialist",
    imageUrl: './assets/images/employee-maria.jpg',
    bio: "Maria joined ConnectHub 5 years ago and has been instrumental in developing our digital marketing strategies. She's a passionate advocate for sustainable practices and enjoys hiking in her free time. Her creativity and dedication make her an invaluable part of our team.",
    profileUrl: "#maria-santos-profile"
  };
  return fetchData('employee-spotlight', mockSpotlight);
}

// You might consider a separate weather API call if you want real data.
// For now, it's integrated into fetchPersonalBriefingData for simplicity.
/*
export async function fetchWeather(city = 'Victorias City') {
  // In a real app, this would call a weather API like OpenWeatherMap
  // For now, it's just a mock.
  const mockWeatherData = {
    city: city,
    temperature: "28°C",
    condition: "Partly Cloudy",
    icon: "wi-day-cloudy-gusts" // Example: Font Awesome or custom weather icon class
  };
  return fetchData('weather', mockWeatherData);
}
*/
