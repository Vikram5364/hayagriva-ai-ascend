
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Download, FileCode, Copy, Eye, FileEdit, Play, Send, MessageSquare, Bot } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import HayagrivaPowerLogo from '@/components/HayagrivaPowerLogo';

const WebAppCreatorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showPreview, setShowPreview] = useState(false);
  const [technology, setTechnology] = useState('react');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    {role: 'assistant', content: 'Hello! I\'m your web app creation assistant. How can I help you build your application today?'}
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Available technologies
  const technologies = [
    { value: 'vanilla', label: 'HTML/CSS/JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'gatsby', label: 'Gatsby' },
    { value: 'tailwind', label: 'Tailwind CSS' },
  ];

  // Generate preview HTML
  useEffect(() => {
    if (showPreview && Object.keys(generatedCode).length > 0) {
      const previewDoc = generatePreviewDocument();
      if (previewIframeRef.current) {
        try {
          const iframeDoc = previewIframeRef.current.contentDocument || 
                            previewIframeRef.current.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(previewDoc);
            iframeDoc.close();
          }
        } catch (error) {
          console.error("Error updating preview:", error);
          toast({
            title: "Preview error",
            description: "There was an issue displaying the preview. Try a different browser or check console for details.",
            variant: "destructive"
          });
        }
      }
    }
  }, [showPreview, generatedCode, activeTab]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const generatePreviewDocument = () => {
    // Create a complete HTML document for preview
    const htmlContent = generatedCode['index.html'] || '';
    const cssContent = generatedCode['styles.css'] || '';
    const jsContent = generatedCode['app.js'] || generatedCode['script.js'] || '';
    
    let techImports = '';
    
    switch (technology) {
      case 'react':
        techImports = '<script src="https://unpkg.com/react@17/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>';
        break;
      case 'vue':
        techImports = '<script src="https://unpkg.com/vue@next"></script>';
        break;
      case 'angular':
        techImports = '<script src="https://unpkg.com/@angular/core@12"></script><script src="https://unpkg.com/@angular/common@12"></script><script src="https://unpkg.com/@angular/platform-browser@12"></script><script src="https://unpkg.com/@angular/platform-browser-dynamic@12"></script><script src="https://unpkg.com/zone.js"></script>';
        break;
      case 'svelte':
        techImports = '<script src="https://unpkg.com/svelte/compiler.js"></script>';
        break;
      case 'tailwind':
        techImports = '<script src="https://unpkg.com/tailwindcss@2/dist/tailwind.min.css"></script>';
        break;
      default:
        techImports = '';
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${cssContent}</style>
        ${techImports}
      </head>
      <body>
        ${htmlContent}
        ${technology === 'react' ? '<script type="text/babel">' + jsContent + '</script>' : '<script>' + jsContent + '</script>'}
      </body>
      </html>
    `;
  };

  const handleGenerate = () => {
    if (prompt.trim() === '') {
      toast({
        title: "Empty prompt",
        description: "Please describe the web app you want to create",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate code generation with delay (in a real app, this would call an API)
    setTimeout(() => {
      let generatedFiles = {};
      
      // Generate different code based on selected technology
      switch (technology) {
        case 'react':
          generatedFiles = generateReactCode(prompt);
          break;
        case 'vue':
          generatedFiles = generateVueCode(prompt);
          break;
        case 'angular':
          generatedFiles = generateAngularCode(prompt);
          break;
        case 'svelte':
          generatedFiles = generateSvelteCode(prompt);
          break;
        case 'nextjs':
          generatedFiles = generateNextJSCode(prompt);
          break;
        case 'gatsby':
          generatedFiles = generateGatsbyCode(prompt);
          break;
        case 'tailwind':
          generatedFiles = generateTailwindCode(prompt);
          break;
        default:
          generatedFiles = generateVanillaCode(prompt);
      }

      setGeneratedCode(generatedFiles);
      setActiveTab('index.html');
      setIsGenerating(false);
      
      toast({
        title: "Code generated!",
        description: "Your web app code has been created successfully."
      });
    }, 2000);
  };

  // Handle chat submission
  const handleChatSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (chatInput.trim() === '') return;
    
    // Add user message
    const updatedMessages = [
      ...chatMessages,
      { role: 'user', content: chatInput }
    ];
    
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      // Generate AI response based on user's query
      let response = '';
      
      if (chatInput.toLowerCase().includes('react') || chatInput.toLowerCase().includes('jsx')) {
        response = "React is a popular JavaScript library for building user interfaces. To create a React app, you'll need to set up a project with components, props, and state management. Would you like me to help you create a specific React component or explain React concepts?";
      } else if (chatInput.toLowerCase().includes('css') || chatInput.toLowerCase().includes('style')) {
        response = "CSS is used to style web pages. You can use vanilla CSS, preprocessors like SASS, or utility frameworks like Tailwind CSS. What specific styling aspects are you interested in?";
      } else if (chatInput.toLowerCase().includes('database') || chatInput.toLowerCase().includes('backend')) {
        response = "For backend functionality, you might want to consider technologies like Node.js, Express, Firebase, or Supabase. What kind of data persistence are you looking to implement?";
      } else {
        response = `I'd be happy to help you with your '${chatInput}' request. To get started, could you provide more specific details about what you're trying to build? For example, what functionality do you need, and which technologies are you most comfortable with?`;
      }
      
      setChatMessages([
        ...updatedMessages,
        { role: 'assistant', content: response }
      ]);
      setIsChatLoading(false);
    }, 1000);
  };

  // Generate code for different technologies
  const generateVanillaCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Web App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <header>
      <h1>Your Web App</h1>
      <nav>
        <ul>
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="hero">
        <h2>Welcome to Your New Web Application</h2>
        <p>This app was created based on: "${promptText}"</p>
        <button class="cta-button">Get Started</button>
      </section>
      
      <section class="features">
        <h2>Key Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>Responsive Design</h3>
            <p>Works on all devices and screen sizes</p>
          </div>
          <div class="feature-card">
            <h3>Modern Interface</h3>
            <p>Clean, intuitive user experience</p>
          </div>
          <div class="feature-card">
            <h3>Fast & Efficient</h3>
            <p>Optimized for performance</p>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 Your Web App. All rights reserved.</p>
    </footer>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #3b82f6;
  --secondary-color: #1d4ed8;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

header h1 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover, nav a.active {
  color: var(--primary-color);
}

main {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`,
      'app.js': `// Main application JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Web app initialized');
  
  // Add event listeners to interactive elements
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('Getting started with your new web application!');
    });
  }
  
  // Navigation active state
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
    });
  });
  
  // Example of dynamic content loading
  const featuresSection = document.querySelector('.features');
  if (featuresSection) {
    // Simulating data that could come from an API
    const additionalFeatures = [
      { title: 'Customizable', description: 'Tailor the app to your needs' },
      { title: 'Scalable', description: 'Grows with your requirements' }
    ];
    
    // This would normally happen based on user interaction
    setTimeout(() => {
      const featureGrid = featuresSection.querySelector('.feature-grid');
      
      if (featureGrid) {
        additionalFeatures.forEach(feature => {
          const featureCard = document.createElement('div');
          featureCard.className = 'feature-card';
          featureCard.innerHTML = \`
            <h3>\${feature.title}</h3>
            <p>\${feature.description}</p>
          \`;
          
          featureGrid.appendChild(featureCard);
        });
      }
    }, 3000);
  }
});`
    };
  };

  const generateReactCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #3b82f6;
  --secondary-color: #1d4ed8;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.header h1 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`,
      'app.js': `// React application
function App() {
  const [activeNavItem, setActiveNavItem] = React.useState('home');
  const [features, setFeatures] = React.useState([
    { id: 1, title: "Responsive Design", description: "Works on all devices and screen sizes" },
    { id: 2, title: "Modern Interface", description: "Clean, intuitive user experience" },
    { id: 3, title: "Fast & Efficient", description: "Optimized for performance" }
  ]);

  // Simulate loading additional features
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFeatures(prevFeatures => [
        ...prevFeatures,
        { id: 4, title: "Customizable", description: "Tailor the app to your needs" },
        { id: 5, title: "Scalable", description: "Grows with your requirements" }
      ]);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (navItem) => {
    setActiveNavItem(navItem);
  };

  const handleGetStarted = () => {
    alert('Getting started with your new React application!');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Your React App</h1>
        <nav>
          <ul className="nav-list">
            <li>
              <a 
                href="#" 
                className={\`nav-link \${activeNavItem === 'home' ? 'active' : ''}\`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={\`nav-link \${activeNavItem === 'about' ? 'active' : ''}\`}
                onClick={() => handleNavClick('about')}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={\`nav-link \${activeNavItem === 'services' ? 'active' : ''}\`}
                onClick={() => handleNavClick('services')}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={\`nav-link \${activeNavItem === 'contact' ? 'active' : ''}\`}
                onClick={() => handleNavClick('contact')}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="hero">
          <h2>Welcome to Your New React Application</h2>
          <p>This app was created based on: "${promptText}"</p>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </section>
        
        <section className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            {features.map(feature => (
              <div className="feature-card" key={feature.id}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 Your React App. All rights reserved.</p>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`
    };
  };

  const generateVueCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
      'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.header h1 {
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.footer {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`,
      'app.js': `// Vue 3 application
const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const activeNavItem = ref('home');
    const features = ref([
      { id: 1, title: "Responsive Design", description: "Works on all devices and screen sizes" },
      { id: 2, title: "Modern Interface", description: "Clean, intuitive user experience" },
      { id: 3, title: "Fast & Efficient", description: "Optimized for performance" }
    ]);

    // Simulate loading additional features
    onMounted(() => {
      setTimeout(() => {
        features.value.push(
          { id: 4, title: "Customizable", description: "Tailor the app to your needs" },
          { id: 5, title: "Scalable", description: "Grows with your requirements" }
        );
      }, 3000);
    });

    const handleNavClick = (navItem) => {
      activeNavItem.value = navItem;
    };

    const handleGetStarted = () => {
      alert('Getting started with your new Vue application!');
    };

    return {
      activeNavItem,
      features,
      handleNavClick,
      handleGetStarted,
      promptText: "${promptText}"
    };
  },
  template: \`
    <div class="app">
      <header class="header">
        <h1>Your Vue App</h1>
        <nav>
          <ul class="nav-list">
            <li>
              <a 
                href="#" 
                :class="['nav-link', activeNavItem === 'home' ? 'active' : '']"
                @click.prevent="handleNavClick('home')"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                :class="['nav-link', activeNavItem === 'about' ? 'active' : '']"
                @click.prevent="handleNavClick('about')"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                :class="['nav-link', activeNavItem === 'services' ? 'active' : '']"
                @click.prevent="handleNavClick('services')"
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#" 
                :class="['nav-link', activeNavItem === 'contact' ? 'active' : '']"
                @click.prevent="handleNavClick('contact')"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <main class="main-content">
        <section class="hero">
          <h2>Welcome to Your New Vue Application</h2>
          <p>This app was created based on: "{{ promptText }}"</p>
          <button class="cta-button" @click="handleGetStarted">
            Get Started
          </button>
        </section>
        
        <section class="features">
          <h2>Key Features</h2>
          <div class="feature-grid">
            <div 
              v-for="feature in features" 
              :key="feature.id" 
              class="feature-card"
            >
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer class="footer">
        <p>&copy; 2025 Your Vue App. All rights reserved.</p>
      </footer>
    </div>
  \`
});

app.mount('#app');`
    };
  };

  // New code generation functions for additional technologies
  const generateAngularCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular App</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>`,
      'styles.css': `/* Angular app styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #dd0031;
  --secondary-color: #c3002f;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.header h1 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`,
      'app.js': `// Angular app structure (simplified for preview)
// This would typically be spread across multiple files

// AppComponent
class AppComponent {
  title = 'Angular App';
  activeNavItem = 'home';
  features = [
    { id: 1, title: "Responsive Design", description: "Works on all devices and screen sizes" },
    { id: 2, title: "Modern Interface", description: "Clean, intuitive user experience" },
    { id: 3, title: "Fast & Efficient", description: "Optimized for performance" }
  ];
  promptText = "${promptText}";

  constructor() {
    // Load additional features after delay
    setTimeout(() => {
      this.features = [
        ...this.features,
        { id: 4, title: "Customizable", description: "Tailor the app to your needs" },
        { id: 5, title: "Scalable", description: "Grows with your requirements" }
      ];
    }, 3000);
  }

  handleNavClick(navItem) {
    this.activeNavItem = navItem;
  }

  handleGetStarted() {
    alert('Getting started with your new Angular application!');
  }
}

// Configure the Angular app
const AppModule = {
  declarations: [AppComponent],
  bootstrap: [AppComponent]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // This is a minimal simulation of Angular - in a real app we'd use proper Angular bootstrapping
  const appRoot = document.querySelector('app-root');
  
  if (appRoot) {
    const app = new AppComponent();
    
    appRoot.innerHTML = \`
      <div class="app">
        <header class="header">
          <h1>\${app.title}</h1>
          <nav>
            <ul class="nav-list">
              <li><a href="#" class="nav-link \${app.activeNavItem === 'home' ? 'active' : ''}" onclick="handleNavClick('home')">Home</a></li>
              <li><a href="#" class="nav-link \${app.activeNavItem === 'about' ? 'active' : ''}" onclick="handleNavClick('about')">About</a></li>
              <li><a href="#" class="nav-link \${app.activeNavItem === 'services' ? 'active' : ''}" onclick="handleNavClick('services')">Services</a></li>
              <li><a href="#" class="nav-link \${app.activeNavItem === 'contact' ? 'active' : ''}" onclick="handleNavClick('contact')">Contact</a></li>
            </ul>
          </nav>
        </header>
        
        <main class="main-content">
          <section class="hero">
            <h2>Welcome to Your New Angular Application</h2>
            <p>This app was created based on: "\${app.promptText}"</p>
            <button class="cta-button" onclick="handleGetStarted()">Get Started</button>
          </section>
          
          <section class="features">
            <h2>Key Features</h2>
            <div class="feature-grid">
              \${app.features.map(feature => \`
                <div class="feature-card">
                  <h3>\${feature.title}</h3>
                  <p>\${feature.description}</p>
                </div>
              \`).join('')}
            </div>
          </section>
        </main>
        
        <footer class="footer">
          <p>&copy; 2025 Your Angular App. All rights reserved.</p>
        </footer>
      </div>
    \`;
    
    // Add minimal event handling
    window.handleNavClick = function(navItem) {
      app.handleNavClick(navItem);
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      document.querySelectorAll(`.nav-link`).forEach(link => {
        if (link.textContent === navItem) {
          link.classList.add('active');
        }
      });
    };
    
    window.handleGetStarted = function() {
      app.handleGetStarted();
    };
  }
});`
    };
  };

  const generateSvelteCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Svelte App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
      'styles.css': `/* Svelte app styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #ff3e00;
  --secondary-color: #676778;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.header h1 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #d03700;
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`,
      'app.js': `// Simple Svelte-like implementation for demo purposes
// This is a minimal version just for the preview

// Initialize app state
let state = {
  activeNavItem: 'home',
  features: [
    { id: 1, title: "Responsive Design", description: "Works on all devices and screen sizes" },
    { id: 2, title: "Modern Interface", description: "Clean, intuitive user experience" },
    { id: 3, title: "Fast & Efficient", description: "Optimized for performance" }
  ],
  promptText: "${promptText}"
};

// Function to render the app UI
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = \`
    <div class="app">
      <header class="header">
        <h1>Your Svelte App</h1>
        <nav>
          <ul class="nav-list">
            <li>
              <a href="#" class="nav-link \${state.activeNavItem === 'home' ? 'active' : ''}" data-nav="home">
                Home
              </a>
            </li>
            <li>
              <a href="#" class="nav-link \${state.activeNavItem === 'about' ? 'active' : ''}" data-nav="about">
                About
              </a>
            </li>
            <li>
              <a href="#" class="nav-link \${state.activeNavItem === 'services' ? 'active' : ''}" data-nav="services">
                Services
              </a>
            </li>
            <li>
              <a href="#" class="nav-link \${state.activeNavItem === 'contact' ? 'active' : ''}" data-nav="contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <main class="main-content">
        <section class="hero">
          <h2>Welcome to Your New Svelte Application</h2>
          <p>This app was created based on: "\${state.promptText}"</p>
          <button class="cta-button" id="get-started-btn">
            Get Started
          </button>
        </section>
        
        <section class="features">
          <h2>Key Features</h2>
          <div class="feature-grid">
            \${state.features.map(feature => \`
              <div class="feature-card" key="\${feature.id}">
                <h3>\${feature.title}</h3>
                <p>\${feature.description}</p>
              </div>
            \`).join('')}
          </div>
        </section>
      </main>
      
      <footer class="footer">
        <p>&copy; 2025 Your Svelte App. All rights reserved.</p>
      </footer>
    </div>
  \`;
  
  // Add event handlers after rendering
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navItem = e.target.dataset.nav;
      state.activeNavItem = navItem;
      renderApp(); // Re-render with updated state
    });
  });
  
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      alert('Getting started with your new Svelte application!');
    });
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  
  // Simulate dynamic content loading
  setTimeout(() => {
    state.features = [
      ...state.features,
      { id: 4, title: "Customizable", description: "Tailor the app to your needs" },
      { id: 5, title: "Scalable", description: "Grows with your requirements" }
    ];
    renderApp();
  }, 3000);
});`
    };
  };

  const generateNextJSCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Next.js App</title>
</head>
<body>
  <div id="__next"></div>
</body>
</html>`,
      'styles.css': `/* Next.js app styles */
:root {
  --primary-color: #0070f3;
  --secondary-color: #1a202c;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main {
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0060df;
}

.features {
  padding: 2rem 0;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
  color: var(--secondary-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-title {
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-list {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}`,
      'app.js': `// Next.js app simulation
// This is a simplified version for preview purposes

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const nextRoot = document.getElementById('__next');
  
  if (!nextRoot) return;
  
  // App state
  let state = {
    activeNavItem: 'home',
    features: [
      { id: 1, title: "Server-Side Rendering", description: "Faster page loads and better SEO" },
      { id: 2, title: "API Routes", description: "Build API endpoints as part of your Next.js app" },
      { id: 3, title: "Static Generation", description: "Pre-render pages at build time for better performance" }
    ],
    promptText: "${promptText}"
  };
  
  // Render function
  function render() {
    nextRoot.innerHTML = \`
      <div class="app">
        <header class="header">
          <div class="container header-content">
            <div class="logo">NextApp</div>
            <nav>
              <ul class="nav-list">
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'home' ? 'active' : ''}" data-page="home">Home</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'about' ? 'active' : ''}" data-page="about">About</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'features' ? 'active' : ''}" data-page="features">Features</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'contact' ? 'active' : ''}" data-page="contact">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main class="main">
          <div class="container">
            <section class="hero">
              <h1>Welcome to Your Next.js Application</h1>
              <p>This app was created based on: "\${state.promptText}"</p>
              <button class="button" id="get-started-btn">Get Started</button>
            </section>
            
            <section class="features">
              <h2 class="section-title">Key Features</h2>
              <div class="feature-grid">
                \${state.features.map(feature => \`
                  <div class="feature-card" key="\${feature.id}">
                    <h3 class="feature-title">\${feature.title}</h3>
                    <p>\${feature.description}</p>
                  </div>
                \`).join('')}
              </div>
            </section>
          </div>
        </main>
        
        <footer class="footer">
          <div class="container">
            <p>&copy; 2025 Your Next.js App. All rights reserved.</p>
          </div>
        </footer>
      </div>
    \`;
    
    // Add event handlers
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        state.activeNavItem = page;
        render();
      });
    });
    
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        alert('Getting started with your new Next.js application!');
      });
    }
  }
  
  // Initial render
  render();
  
  // Simulate data loading
  setTimeout(() => {
    state.features = [
      ...state.features,
      { id: 4, title: "Incremental Static Regeneration", description: "Update static content after deployment" },
      { id: 5, title: "Image Optimization", description: "Automatic image optimization for best performance" }
    ];
    render();
  }, 2000);
});`
    };
  };

  const generateGatsbyCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gatsby App</title>
</head>
<body>
  <div id="gatsby-app"></div>
</body>
</html>`,
      'styles.css': `/* Gatsby app styles */
:root {
  --primary-color: #663399;
  --secondary-color: #542c85;
  --text-color: #333;
  --light-bg: #f8fafc;
  --dark-bg: #1e293b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-bg);
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.25rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.main {
  flex: 1;
  padding: 3rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--primary-color), #b17acc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: var(--secondary-color);
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.25rem;
  color: var(--primary-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-top: 4px solid var(--primary-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.feature-title {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.footer {
  background-color: var(--dark-bg);
  color: white;
  text-align: center;
  padding: 2.5rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-list {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2.25rem;
  }
}`,
      'app.js': `// Gatsby app simulation
// This is a simplified version for preview purposes

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const gatsbyApp = document.getElementById('gatsby-app');
  
  if (!gatsbyApp) return;
  
  // App state
  let state = {
    activeNavItem: 'home',
    features: [
      { id: 1, title: "Static Site Generator", description: "Build blazing fast websites with Gatsby's static generation" },
      { id: 2, title: "GraphQL Integration", description: "Query data from multiple sources with built-in GraphQL" },
      { id: 3, title: "Plugin Ecosystem", description: "Extend functionality easily with Gatsby's vast plugin library" }
    ],
    promptText: "${promptText}"
  };
  
  // Render function
  function render() {
    gatsbyApp.innerHTML = \`
      <div class="layout">
        <header class="header">
          <div class="header-content">
            <div class="logo">GatsbyApp</div>
            <nav class="nav">
              <ul class="nav-list">
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'home' ? 'active' : ''}" data-page="home">Home</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'about' ? 'active' : ''}" data-page="about">About</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'blog' ? 'active' : ''}" data-page="blog">Blog</a>
                </li>
                <li>
                  <a href="#" class="nav-link \${state.activeNavItem === 'contact' ? 'active' : ''}" data-page="contact">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main class="main">
          <section class="hero">
            <h1>Welcome to Your Gatsby Application</h1>
            <p>This app was created based on: "\${state.promptText}"</p>
            <button class="button" id="get-started-btn">Get Started</button>
          </section>
          
          <section>
            <h2 class="section-title">Key Features</h2>
            <div class="feature-grid">
              \${state.features.map(feature => \`
                <div class="feature-card" key="\${feature.id}">
                  <h3 class="feature-title">\${feature.title}</h3>
                  <p>\${feature.description}</p>
                </div>
              \`).join('')}
            </div>
          </section>
        </main>
        
        <footer class="footer">
          <div class="footer-content">
            <p>&copy; 2025 Your Gatsby App. All rights reserved.</p>
            <p>Built with Gatsby and modern web technologies</p>
          </div>
        </footer>
      </div>
    \`;
    
    // Add event handlers
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        state.activeNavItem = page;
        render();
      });
    });
    
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        alert('Getting started with your new Gatsby application!');
      });
    }
  }
  
  // Initial render
  render();
  
  // Simulate data loading
  setTimeout(() => {
    state.features = [
      ...state.features,
      { id: 4, title: "Image Processing", description: "Automatic image optimization and responsive images" },
      { id: 5, title: "PWA Features", description: "Progressive Web App features out of the box" }
    ];
    render();
  }, 2000);
});`
    };
  };

  const generateTailwindCode = (promptText: string) => {
    return {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS App</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
  <div id="app" class="min-h-screen flex flex-col"></div>
</body>
</html>`,
      'styles.css': `/* Additional custom styles beyond Tailwind */
:root {
  --primary-color: #8B5CF6;
  --secondary-color: #4C1D95;
}

/* These styles just complement Tailwind, most styling is done with utility classes */
.gradient-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, var(--primary-color), #EC4899);
}

.shadow-custom {
  box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1);
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-in forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
      'app.js': `// Tailwind CSS App

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  if (!app) return;
  
  // App state
  const state = {
    activeNavItem: 'home',
    features: [
      { 
        id: 1, 
        title: "Utility-First", 
        description: "Build custom designs without writing CSS with utility classes",
        icon: "🧩"
      },
      { 
        id: 2, 
        title: "Responsive", 
        description: "Fully responsive interface that works on any device",
        icon: "📱"
      },
      { 
        id: 3, 
        title: "Component-Driven", 
        description: "Create reusable components with Tailwind's utility classes",
        icon: "🧱"
      }
    ],
    promptText: "${promptText}"
  };
  
  // Render the application
  function render() {
    app.innerHTML = \`
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div class="flex items-center mb-4 sm:mb-0">
            <div class="text-xl font-bold text-purple-600">TailwindApp</div>
          </div>
          
          <nav>
            <ul class="flex space-x-1 sm:space-x-8">
              <li><a href="#" class="px-3 py-2 rounded-md \${state.activeNavItem === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'}" data-nav="home">Home</a></li>
              <li><a href="#" class="px-3 py-2 rounded-md \${state.activeNavItem === 'features' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'}" data-nav="features">Features</a></li>
              <li><a href="#" class="px-3 py-2 rounded-md \${state.activeNavItem === 'pricing' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'}" data-nav="pricing">Pricing</a></li>
              <li><a href="#" class="px-3 py-2 rounded-md \${state.activeNavItem === 'contact' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'}" data-nav="contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="py-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Tailwind CSS Application
          </h1>
          <p class="text-xl max-w-3xl mx-auto mb-8 opacity-90 animate-fade-in">
            This app was created based on: "\${state.promptText}"
          </p>
          <button id="get-started-btn" class="bg-white text-purple-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 animate-fade-in">
            Get Started
          </button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">
            <span class="gradient-text">Key Features</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            \${state.features.map((feature, index) => \`
              <div class="bg-white rounded-xl shadow-custom p-8 transition duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500" style="animation-delay: \${index * 0.2}s">
                <div class="text-3xl mb-4">\${feature.icon}</div>
                <h3 class="text-xl font-bold text-purple-600 mb-3">\${feature.title}</h3>
                <p class="text-gray-600">\${feature.description}</p>
              </div>
            \`).join('')}
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-purple-900 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p class="max-w-2xl mx-auto mb-8 text-purple-200">
            Join thousands of users who are already building amazing interfaces with our Tailwind application.
          </p>
          <button class="bg-white text-purple-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300">
            Start Building Now
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between">
            <div class="mb-8 md:mb-0">
              <div class="text-2xl font-bold text-purple-400 mb-4">TailwindApp</div>
              <p class="text-gray-400 max-w-xs">
                A modern web application built with Tailwind CSS and JavaScript.
              </p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">Product</h3>
                <ul class="space-y-2 text-gray-400">
                  <li><a href="#" class="hover:text-white">Features</a></li>
                  <li><a href="#" class="hover:text-white">Pricing</a></li>
                  <li><a href="#" class="hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold mb-4">Company</h3>
                <ul class="space-y-2 text-gray-400">
                  <li><a href="#" class="hover:text-white">About</a></li>
                  <li><a href="#" class="hover:text-white">Blog</a></li>
                  <li><a href="#" class="hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold mb-4">Connect</h3>
                <ul class="space-y-2 text-gray-400">
                  <li><a href="#" class="hover:text-white">Twitter</a></li>
                  <li><a href="#" class="hover:text-white">GitHub</a></li>
                  <li><a href="#" class="hover:text-white">Discord</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm text-center">
            &copy; 2025 TailwindApp. All rights reserved.
          </div>
        </div>
      </footer>
    \`;
    
    // Add event listeners
    document.querySelectorAll('[data-nav]').forEach(navLink => {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        state.activeNavItem = e.target.dataset.nav;
        render();
      });
    });
    
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        alert('Getting started with your new Tailwind CSS application!');
      });
    }
  }
  
  // Initial render
  render();
  
  // Simulate new features being loaded
  setTimeout(() => {
    state.features.push(
      { 
        id: 4, 
        title: "Dark Mode", 
        description: "Easy implementation of dark mode with Tailwind's dark variant",
        icon: "🌙"
      },
      { 
        id: 5, 
        title: "Customizable", 
        description: "Extend and customize the design system to match your brand",
        icon: "🎨"
      }
    );
    render();
  }, 2000);
});`
    };
  };

  // Update the UI to show the chat when toggling
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // Component UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <HayagrivaPowerLogo className="h-12 w-12 mr-3" />
          <h1 className="text-3xl font-bold">Web App Creator</h1>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleChat}
          className={chatOpen ? "bg-primary/10" : ""}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Input and options */}
        <div className={`lg:col-span-${chatOpen ? '1' : '2'} flex flex-col gap-4`}>
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Web App</CardTitle>
              <CardDescription>Tell us what kind of web app you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Textarea 
                  placeholder="Describe the web app you want to create..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Technology</label>
                    <Select value={technology} onValueChange={setTechnology}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technology" />
                      </SelectTrigger>
                      <SelectContent>
                        {technologies.map((tech) => (
                          <SelectItem key={tech.value} value={tech.value}>
                            {tech.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/2 flex items-end">
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full"
                      disabled={isGenerating || prompt.trim() === ''}
                    >
                      {isGenerating ? 'Generating...' : 'Generate Web App'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code display */}
          {Object.keys(generatedCode).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Generated Code</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        try {
                          const blob = new Blob(
                            [Object.entries(generatedCode).map(([filename, content]) => 
                              `/* File: ${filename} */\n\n${content}\n\n`
                            ).join('\n')], 
                            {type: 'text/plain'}
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'web-app-code.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          
                          toast({
                            title: "Code downloaded",
                            description: "Your generated code has been downloaded"
                          });
                        } catch (error) {
                          toast({
                            title: "Download failed",
                            description: "There was an error downloading your code",
                            variant: "destructive"
                          });
                        }
                      }}
                      title="Download code"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPreview(!showPreview)}
                      className={showPreview ? "bg-primary/10" : ""}
                      title="Toggle preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex flex-wrap">
                    {Object.keys(generatedCode).map((filename) => (
                      <TabsTrigger key={filename} value={filename} className="flex items-center gap-1 mb-1">
                        <FileCode className="h-3.5 w-3.5" />
                        {filename}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(generatedCode).map(([filename, content]) => (
                    <TabsContent key={filename} value={filename}>
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(content);
                                toast({
                                  title: "Copied to clipboard",
                                  description: `${filename} code copied to clipboard`
                                });
                              } catch (error) {
                                toast({
                                  title: "Copy failed",
                                  description: "Browser denied clipboard access",
                                  variant: "destructive"
                                });
                              }
                            }}
                            title="Copy code"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <ScrollArea className="h-96 rounded-md border p-4 bg-secondary/10 font-mono text-sm">
                          <pre>{content}</pre>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right side - Chat OR Preview */}
        <div className="lg:col-span-2">
          {chatOpen ? (
            // AI Chat Interface
            <Card className="h-[650px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    Web App Assistant
                  </CardTitle>
                  <Badge variant="outline">AI Powered</Badge>
                </div>
                <CardDescription>Ask questions about web development and app creation</CardDescription>
                <Separator />
              </CardHeader>
              
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[450px] px-4" ref={chatScrollRef}>
                  {chatMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-muted rounded-lg px-4 py-2 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              <CardFooter className="border-t pt-4">
                <form onSubmit={handleChatSubmit} className="flex w-full gap-2">
                  <Input 
                    placeholder="Ask about web development..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={chatInput.trim() === '' || isChatLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : showPreview && Object.keys(generatedCode).length > 0 ? (
            // Web App Preview
            <Card className="h-[650px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <Badge variant="outline">
                    {technologies.find(t => t.value === technology)?.label || 'Preview'}
                  </Badge>
                </div>
                <CardDescription>Real-time preview of your generated web app</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="relative w-full h-full border-t">
                  <iframe
                    ref={previewIframeRef}
                    className="w-full h-full"
                    title="Web App Preview"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Empty state when neither chat nor preview is shown
            <Card className="h-[650px] flex flex-col justify-center items-center">
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center gap-4 p-8">
                  <FileEdit className="h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">Create Your Web App</h3>
                  <p className="text-muted-foreground">
                    Describe your web app idea, select a technology, and click "Generate Web App".
                  </p>
                  <p className="text-muted-foreground">
                    Or open the chat to ask questions about web development.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebAppCreatorPage;

