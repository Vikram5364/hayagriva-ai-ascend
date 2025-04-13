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
