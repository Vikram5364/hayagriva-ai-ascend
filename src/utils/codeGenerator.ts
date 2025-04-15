/**
 * Generates a standalone JavaScript file based on the chat conversation
 * that can be used to implement the Hayagriva chatbot functionality.
 * 
 * @param messages Array of chat messages
 * @returns String containing the JavaScript code
 */
export const generateChatbotCode = (messages: Array<{ role: string; content: string }>) => {
  // Extract training data from the conversation
  const trainingData = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // Format the code with proper indentation
  const code = `/**
 * Hayagriva Chatbot
 * Generated on: ${new Date().toLocaleString()}
 * 
 * This file contains the code for a standalone Hayagriva chatbot that
 * can be integrated into any web application.
 */

class HayagrivaBot {
  constructor(options = {}) {
    this.name = options.name || 'Hayagriva';
    this.trainingData = ${JSON.stringify(trainingData, null, 2)};
    this.voiceEnabled = options.voiceEnabled !== false;
    this.containerElement = null;
    this.onReady = options.onReady || (() => {});
    this.onMessageSent = options.onMessageSent || (() => {});
    this.onMessageReceived = options.onMessageReceived || (() => {});
  }

  /**
   * Initialize the chatbot and mount it to a DOM element
   * @param {HTMLElement|string} container - DOM element or CSS selector
   * @returns {HayagrivaBot} - The chatbot instance
   */
  mount(container) {
    if (typeof container === 'string') {
      this.containerElement = document.querySelector(container);
    } else {
      this.containerElement = container;
    }
    
    if (!this.containerElement) {
      console.error('Could not find container element');
      return this;
    }
    
    this._createChatInterface();
    this.onReady(this);
    
    return this;
  }
  
  /**
   * Send a message to the chatbot
   * @param {string} message - The message to send
   * @returns {Promise} - Resolves when the response is received
   */
  sendMessage(message) {
    return new Promise((resolve) => {
      this._addMessageToChat('user', message);
      this.onMessageSent(message);
      
      // Simulate AI thinking
      setTimeout(() => {
        const response = this._generateResponse(message);
        this._addMessageToChat('assistant', response);
        this.onMessageReceived(response);
        resolve(response);
        
        if (this.voiceEnabled) {
          this._speakText(response);
        }
      }, 1000);
    });
  }
  
  /**
   * Start voice recognition
   * @returns {Promise} - Resolves when voice recognition ends
   */
  startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser');
      return Promise.reject('Speech recognition not supported');
    }
    
    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        this.sendMessage(speechResult);
        resolve(speechResult);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        resolve('');
      };
      
      recognition.start();
    });
  }
  
  /**
   * Enable or disable voice features
   * @param {boolean} enabled - Whether voice features should be enabled
   */
  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
  }
  
  /**
   * Private: Create the chat interface elements
   */
  _createChatInterface() {
    // Make sure 'name' property is safely accessed with a default value
    const botName = this.name || 'Hayagriva';
    
    if (!this.containerElement) {
      console.error('Container element is not defined');
      return;
    }
    
    this.containerElement.innerHTML = \`
      <div class="hayagriva-chat">
        <div class="hayagriva-header">
          <h3>\${botName} Assistant</h3>
          <button class="hayagriva-close-btn">&times;</button>
        </div>
        <div class="hayagriva-messages"></div>
        <div class="hayagriva-input-area">
          <input type="text" class="hayagriva-input" placeholder="Type a message...">
          <button class="hayagriva-send-btn">Send</button>
          <button class="hayagriva-voice-btn">🎤</button>
        </div>
      </div>
      <style>
        .hayagriva-chat {
          display: flex;
          flex-direction: column;
          height: 400px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        }
        .hayagriva-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .hayagriva-header h3 {
          margin: 0;
          font-size: 16px;
        }
        .hayagriva-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
        .hayagriva-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hayagriva-message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          line-height: 1.4;
        }
        .hayagriva-user-message {
          align-self: flex-end;
          background-color: #3b82f6;
          color: white;
        }
        .hayagriva-assistant-message {
          align-self: flex-start;
          background-color: #f1f5f9;
          color: #475569;
        }
        .hayagriva-input-area {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #e2e8f0;
        }
        .hayagriva-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          outline: none;
        }
        .hayagriva-send-btn, .hayagriva-voice-btn {
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      </style>
    \`;
    
    const messagesDiv = this.containerElement.querySelector('.hayagriva-messages');
    const inputField = this.containerElement.querySelector('.hayagriva-input');
    const sendButton = this.containerElement.querySelector('.hayagriva-send-btn');
    const voiceButton = this.containerElement.querySelector('.hayagriva-voice-btn');
    const closeButton = this.containerElement.querySelector('.hayagriva-close-btn');
    
    // Add initial message
    if (this.trainingData.length > 0) {
      const firstAssistantMessage = this.trainingData.find(msg => msg.role === 'assistant');
      if (firstAssistantMessage) {
        this._addMessageToChat('assistant', firstAssistantMessage.content);
      }
    } else {
      this._addMessageToChat('assistant', 'Hello! I am Hayagriva, your AI assistant. How can I help you today?');
    }
    
    // Add event listeners
    sendButton.addEventListener('click', () => {
      if (inputField.value.trim()) {
        this.sendMessage(inputField.value);
        inputField.value = '';
      }
    });
    
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && inputField.value.trim()) {
        this.sendMessage(inputField.value);
        inputField.value = '';
      }
    });
    
    voiceButton.addEventListener('click', () => {
      this.startVoiceRecognition();
    });
    
    closeButton.addEventListener('click', () => {
      this.containerElement.innerHTML = '';
    });
  }
  
  /**
   * Private: Add a message to the chat interface
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - The message content
   */
  _addMessageToChat(role, content) {
    if (!this.containerElement) {
      console.error('Container element is not defined');
      return;
    }
    
    const messagesDiv = this.containerElement.querySelector('.hayagriva-messages');
    if (!messagesDiv) {
      console.error('Messages container not found');
      return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('hayagriva-message');
    messageDiv.classList.add(role === 'user' ? 'hayagriva-user-message' : 'hayagriva-assistant-message');
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  
  /**
   * Private: Generate a response based on the input message
   * @param {string} message - The input message
   * @returns {string} - The generated response
   */
  _generateResponse(message) {
    // Simple response generation based on keywords in the message
    // In a real implementation, you might want to use a more sophisticated approach
    // or integrate with a backend API
    
    const lowerMessage = message.toLowerCase();
    
    // Check for direct matches in training data
    for (const data of this.trainingData) {
      if (data.role === 'user' && 
          data.content.toLowerCase().includes(lowerMessage) &&
          this.trainingData[this.trainingData.indexOf(data) + 1]?.role === 'assistant') {
        return this.trainingData[this.trainingData.indexOf(data) + 1].content;
      }
    }
    
    // Basic keyword matching
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Namaste! How can I assist you today?";
    } else if (lowerMessage.includes('thank')) {
      return "You're very welcome! Is there anything else I can help you with?";
    } else if (lowerMessage.includes('name')) {
      return "I am Hayagriva, your AI assistant with an Indian perspective!";
    } else if (lowerMessage.includes('how are you')) {
      return "I'm functioning well, thank you for asking! How may I help you?";
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Namaste! It was a pleasure helping you. Have a wonderful day!";
    } else {
      return "That's an interesting question. Would you like to explore this topic further?";
    }
  }
  
  /**
   * Private: Speak text using the Web Speech API
   * @param {string} text - The text to speak
   */
  _speakText(text) {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find an Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => 
      voice.lang === 'en-IN' || 
      voice.name.includes('Indian') || 
      voice.name.includes('Hindi')
    );
    
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = HayagrivaBot;
} else {
  window.HayagrivaBot = HayagrivaBot;
}

/**
 * Usage example:
 * 
 * const bot = new HayagrivaBot({
 *   name: 'Hayagriva',
 *   voiceEnabled: true,
 *   onReady: (bot) => console.log('Bot is ready'),
 *   onMessageSent: (msg) => console.log('Message sent:', msg),
 *   onMessageReceived: (msg) => console.log('Message received:', msg)
 * });
 * 
 * bot.mount('#chat-container');
 * 
 * // Send a message programmatically
 * bot.sendMessage('Hello Hayagriva!');
 * 
 * // Start voice recognition
 * document.querySelector('#voice-button').addEventListener('click', () => {
 *   bot.startVoiceRecognition();
 * });
 */
`;

  return code;
};

/**
 * Generates a complete web application based on a text prompt
 * 
 * @param prompt User's description of the desired web app
 * @param options Configuration options for the generated app
 * @returns String containing the web application code
 */
export const generateAppCode = (prompt: string, options: {
  framework?: string;
  cssFramework?: string;
  responsive?: boolean;
  accessibility?: boolean;
} = {}) => {
  // Extract potential app type from the prompt
  let appType = "generic";
  let appName = "HayagrivaApp";
  let features = [];
  
  // Try to identify app type from prompt
  if (prompt.match(/dashboard|analytics|chart|graph|data visualization/i)) {
    appType = "dashboard";
    features.push("Charts & Graphs", "Data Tables", "Analytics");
  } else if (prompt.match(/e-?commerce|shop|store|product|cart/i)) {
    appType = "ecommerce";
    features.push("Product Listings", "Shopping Cart", "Checkout");
  } else if (prompt.match(/blog|content|article|post/i)) {
    appType = "blog";
    features.push("Articles", "Categories", "Comments");
  } else if (prompt.match(/portfolio|showcase|gallery/i)) {
    appType = "portfolio";
    features.push("Projects", "About Me", "Contact");
  } else if (prompt.match(/social|network|friend|post|share/i)) {
    appType = "social";
    features.push("User Profiles", "Posts", "Interactions");
  } else if (prompt.match(/task|todo|project management/i)) {
    appType = "taskmanager";
    features.push("Tasks", "Categories", "Progress Tracking");
  }
  
  // Extract app name from prompt
  const nameMatch = prompt.match(/(?:create|build|make|develop|generate)\s+(?:an?|the)\s+(\w+(?:\s+\w+){0,3})/i);
  if (nameMatch) {
    appName = nameMatch[1].replace(/\b\w/g, l => l.toUpperCase()).replace(/\s+/g, '');
  }
  
  // Extract additional features
  if (prompt.match(/dark mode|night mode|dark theme/i)) {
    features.push("Dark Mode");
  }
  if (prompt.match(/responsive|mobile|tablet|desktop/i)) {
    features.push("Responsive Design");
  }
  if (prompt.match(/authentication|login|register|signup|sign up|sign in/i)) {
    features.push("Authentication");
  }
  if (prompt.match(/search|filter|sort/i)) {
    features.push("Search & Filtering");
  }
  
  // Generate the appropriate template based on app type
  let template = '';
  
  switch (appType) {
    case "dashboard":
      template = generateDashboardTemplate(appName, features, options);
      break;
    case "ecommerce":
      template = generateEcommerceTemplate(appName, features, options);
      break;
    case "blog":
      template = generateBlogTemplate(appName, features, options);
      break;
    case "portfolio":
      template = generatePortfolioTemplate(appName, features, options);
      break;
    case "social":
      template = generateSocialTemplate(appName, features, options);
      break;
    case "taskmanager":
      template = generateTaskManagerTemplate(appName, features, options);
      break;
    default:
      template = generateGenericTemplate(appName, features, options);
  }
  
  return `/**
 * ${appName}
 * Generated by Hayagriva Web App Creator
 * Date: ${new Date().toLocaleString()}
 * Prompt: ${prompt}
 */

${template}`;
};

/**
 * Generate code for a dashboard application
 */
const generateDashboardTemplate = (appName: string, features: string[], options: any) => {
  return `import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const sampleData = [
  { name: 'Jan', value: 400, visits: 2400, revenue: 2400 },
  { name: 'Feb', value: 300, visits: 1398, revenue: 2210 },
  { name: 'Mar', value: 200, visits: 9800, revenue: 2290 },
  { name: 'Apr', value: 278, visits: 3908, revenue: 2000 },
  { name: 'May', value: 189, visits: 4800, revenue: 2181 },
  { name: 'Jun', value: 239, visits: 3800, revenue: 2500 },
  { name: 'Jul', value: 349, visits: 4300, revenue: 2100 },
];

const ${appName} = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={\`app \${darkMode ? 'dark' : 'light'}\`}>
      <header className="app-header">
        <div className="logo-area">
          <h1>${appName}</h1>
        </div>
        <div className="header-controls">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div className="user-profile">
            <span>Admin User</span>
            <img src="https://i.pravatar.cc/32" alt="User" className="avatar" />
          </div>
        </div>
      </header>

      <div className="app-container">
        <nav className="sidebar">
          <ul className="nav-list">
            <li className={\`nav-item \${activeTab === 'overview' ? 'active' : ''}\`}>
              <button onClick={() => setActiveTab('overview')}>📊 Overview</button>
            </li>
            <li className={\`nav-item \${activeTab === 'analytics' ? 'active' : ''}\`}>
              <button onClick={() => setActiveTab('analytics')}>📈 Analytics</button>
            </li>
            <li className={\`nav-item \${activeTab === 'reports' ? 'active' : ''}\`}>
              <button onClick={() => setActiveTab('reports')}>📄 Reports</button>
            </li>
            <li className={\`nav-item \${activeTab === 'settings' ? 'active' : ''}\`}>
              <button onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
            </li>
          </ul>
        </nav>

        <main className="content-area">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <>
              <div className="dashboard-header">
                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                <div className="dashboard-actions">
                  <button className="btn">Export</button>
                  <button className="btn primary">Refresh</button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-value">12,345</p>
                  <span className="trend positive">+12% ↑</span>
                </div>
                <div className="stat-card">
                  <h3>Revenue</h3>
                  <p className="stat-value">$48,294</p>
                  <span className="trend positive">+8% ↑</span>
                </div>
                <div className="stat-card">
                  <h3>Conversion</h3>
                  <p className="stat-value">3.2%</p>
                  <span className="trend negative">-1% ↓</span>
                </div>
                <div className="stat-card">
                  <h3>Avg. Session</h3>
                  <p className="stat-value">4:25</p>
                  <span className="trend positive">+6% ↑</span>
                </div>
              </div>

              <div className="chart-grid">
                <div className="chart-card wide">
                  <h3>Monthly Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={sampleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <h3>Traffic Sources</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Organic', value: 400 },
                        { name: 'Social', value: 300 },
                        { name: 'Direct', value: 300 },
                        { name: 'Referral', value: 200 },
                      ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <h3>Channel Performance</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'Email', value: 400 },
                      { name: 'Social', value: 300 },
                      { name: 'Search', value: 200 },
                      { name: 'Direct', value: 278 },
                      { name: 'Other', value: 189 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="table-container">
                <h3>Recent Activity</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Event</th>
                      <th>User</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1234</td>
                      <td>Page View</td>
                      <td>user@example.com</td>
                      <td>2 min ago</td>
                      <td><span className="badge success">Success</span></td>
                    </tr>
                    <tr>
                      <td>#1233</td>
                      <td>Purchase</td>
                      <td>customer@example.com</td>
                      <td>10 min ago</td>
                      <td><span className="badge success">Success</span></td>
                    </tr>
                    <tr>
                      <td>#1232</td>
                      <td>Login</td>
                      <td>admin@example.com</td>
                      <td>25 min ago</td>
                      <td><span className="badge warning">Warning</span></td>
                    </tr>
                    <tr>
                      <td>#1231</td>
                      <td>API Request</td>
                      <td>system</td>
                      <td>2 hours ago</td>
                      <td><span className="badge error">Failed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ${appName};

/* CSS Styles */

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

body.dark-mode {
  background-color: #1a1a1a;
  color: #f0f0f0;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app.dark {
  background-color: #121212;
  color: #e0e0e0;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app.dark .app-header {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.app-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  padding: 1rem 0;
}

.app.dark .sidebar {
  background-color: #252525;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item button {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.nav-item button:hover {
  background-color: #e9ecef;
}

.app.dark .nav-item button:hover {
  background-color: #333333;
}

.nav-item.active button {
  background-color: #e9ecef;
  font-weight: 600;
}

.app.dark .nav-item.active button {
  background-color: #333333;
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.app.dark .btn {
  background-color: #333;
  border-color: #555;
  color: #e0e0e0;
}

.btn:hover {
  background-color: #f8f9fa;
}

.app.dark .btn:hover {
  background-color: #444;
}

.btn.primary {
  background-color: #4361ee;
  color: white;
  border-color: #4361ee;
}

.btn.primary:hover {
  background-color: #3a56d4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app.dark .stat-card {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.trend {
  font-size: 0.875rem;
}

.trend.positive {
  color: #38b000;
}

.trend.negative {
  color: #d90429;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app.dark .chart-card {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.chart-card.wide {
  grid-column: span 2;
}

.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app.dark .table-container {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.app.dark .data-table th,
.app.dark .data-table td {
  border-bottom: 1px solid #444;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}

.badge.success {
  background-color: #d4edda;
  color: #155724;
}

.app.dark .badge.success {
  background-color: #155724;
  color: #d4edda;
}

.badge.warning {
  background-color: #fff3cd;
  color: #856404;
}

.app.dark .badge.warning {
  background-color: #856404;
  color: #fff3cd;
}

.badge.error {
  background-color: #f8d7da;
  color: #721c24;
}

.app.dark .badge.error {
  background-color: #721c24;
  color: #f8d7da;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.app.dark .loader {
  border-color: #444;
  border-top-color: #3498db;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 992px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.wide {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 0.5rem;
  }
  
  .nav-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .nav-item {
    flex: 1;
    min-width: 120px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
`;
};

/**
 * Generate code for a generic application
 */
const generateGenericTemplate = (appName: string, features: string[], options: any) => {
  return `import React, { useState } from 'react';

const ${appName} = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={\`app \${darkMode ? 'dark' : 'light'}\`}>
      <header className="app-header">
        <h1>${appName}</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
      
      <main className="content">
        <section className="hero">
          <h2>Welcome to ${appName}</h2>
          <p>Your new web application is ready to use!</p>
          <button className="btn primary">Get Started</button>
        </section>
        
        <section className="features">
          <h2>Features</h2>
          <div className="feature-grid">
            ${features.map((feature, index) => `
            <div className="feature-card" key={${index}}>
              <h3>${feature}</h3>
              <p>Description of ${feature} functionality...</p>
            </div>
            `).join('')}
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ${appName};

/* CSS Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app.light {
  background-color: #ffffff;
  color: #333333;
}

.app.dark {
  background-color: #121212;
  color: #f0f0f0;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app.dark .app-header {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.theme-toggle {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.content {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ced4da;
  background-color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.app.dark .btn {
  background-color: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.btn.primary {
  background-color: #4361ee;
  color: white;
  border-color: #4361ee;
}

.btn.primary:hover {
  background-color: #3a56d4;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.app.dark .feature-card {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.app-footer {
  padding: 1.5rem;
  text-align: center;
  background-color: #f8f9fa;
  margin-top: auto;
}

.app.dark .app-footer {
  background-color: #1e1e1e;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero h2 {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
`;
};

// Other template generator functions would go here
// For brevity, just implementing placeholders for now:

const generateEcommerceTemplate = (appName: string, features: string[], options: any) => {
  return generateGenericTemplate(appName, features, options); // Placeholder
};

const generateBlogTemplate = (appName: string, features: string[], options: any) => {
  return generateGenericTemplate(appName, features, options); // Placeholder
};

const generatePortfolioTemplate = (appName: string, features: string[], options: any) => {
  return generateGenericTemplate(appName, features, options); // Placeholder
};

const generateSocialTemplate = (appName: string, features: string[], options: any) => {
  return generateGenericTemplate(appName, features, options); // Placeholder
};

const generateTaskManagerTemplate = (appName: string, features: string[], options: any) => {
  return generateGenericTemplate(appName, features, options); // Placeholder
};
