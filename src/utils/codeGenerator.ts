
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
    const botName = this.name || 'Hayagriva';
    
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
    const messagesDiv = this.containerElement.querySelector('.hayagriva-messages');
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
