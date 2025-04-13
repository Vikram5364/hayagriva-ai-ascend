
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Download, FileCode, Copy, Eye, FileEdit, Play } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WebAppCreatorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showPreview, setShowPreview] = useState(false);
  const [technology, setTechnology] = useState('react');
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Generate preview HTML
  useEffect(() => {
    if (showPreview && Object.keys(generatedCode).length > 0) {
      const previewDoc = generatePreviewDocument();
      if (previewIframeRef.current) {
        const iframeDoc = previewIframeRef.current.contentDocument || 
                          previewIframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(previewDoc);
          iframeDoc.close();
        }
      }
    }
  }, [showPreview, generatedCode, activeTab]);

  const generatePreviewDocument = () => {
    // Create a complete HTML document for preview
    const htmlContent = generatedCode['index.html'] || '';
    const cssContent = generatedCode['styles.css'] || '';
    const jsContent = generatedCode['app.js'] || generatedCode['script.js'] || '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${cssContent}</style>
        ${technology === 'react' ? '<script src="https://unpkg.com/react@17/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>' : ''}
        ${technology === 'vue' ? '<script src="https://unpkg.com/vue@next"></script>' : ''}
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
      if (technology === 'react') {
        generatedFiles = generateReactCode(prompt);
      } else if (technology === 'vue') {
        generatedFiles = generateVueCode(prompt);
      } else {
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

  const handleCopyCode = (code: string, filename: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${filename} code copied successfully.`
    });
  };

  const handleUpdateCode = (newCode: string) => {
    if (activeTab !== 'description' && activeTab !== 'preview') {
      setGeneratedCode({
        ...generatedCode,
        [activeTab]: newCode
      });

      // If in preview mode, update the preview
      if (showPreview) {
        const previewDoc = generatePreviewDocument();
        if (previewIframeRef.current) {
          const iframeDoc = previewIframeRef.current.contentDocument || 
                            previewIframeRef.current.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(previewDoc);
            iframeDoc.close();
          }
        }
      }
    }
  };

  const handleDownloadAll = () => {
    // Create a zip file (in a real implementation)
    // For now, just show a toast
    toast({
      title: "Download initiated",
      description: "In a production environment, this would download a zip with all files."
    });
  };

  const fileTabItems = Object.keys(generatedCode).map(filename => (
    <TabsTrigger key={filename} value={filename}>
      {filename}
    </TabsTrigger>
  ));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Web App Creator</h1>
          <p className="text-muted-foreground mb-6">
            Describe the web application you want to create, and our AI will generate the code for you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Describe Your Web App</CardTitle>
            <CardDescription>
              Provide details about the functionality, design, and purpose of your web application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Technology</label>
                <Select value={technology} onValueChange={setTechnology}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vanilla">HTML/CSS/JavaScript</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="E.g., I want a responsive landing page for a fitness app with a hero section, features section, and contact form..."
                className="h-32 mb-4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex gap-2"
                >
                  <Code className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Code"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(generatedCode).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Code</span>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={showPreview ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-3 w-3 mr-1" /> Preview
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Review, edit, and download the code for your web application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {fileTabItems}
                  {showPreview && <TabsTrigger value="preview">Live Preview</TabsTrigger>}
                </TabsList>
                <TabsContent value="description">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Web App Details</h3>
                    <p>This is a web application generated based on your description:</p>
                    <p className="mt-2 italic">"{prompt}"</p>
                    <div className="mt-4">
                      <h4 className="font-medium">Technology: {technology === 'vanilla' ? 'HTML/CSS/JavaScript' : technology === 'react' ? 'React' : 'Vue'}</h4>
                      <h4 className="font-medium mt-2">Files Generated:</h4>
                      <ul className="list-disc list-inside mt-2">
                        {Object.keys(generatedCode).map(filename => (
                          <li key={filename}>{filename}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                {Object.entries(generatedCode).map(([filename, code]) => (
                  <TabsContent key={filename} value={filename}>
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopyCode(code, filename)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        {showPreview && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPreview(false)}
                          >
                            <FileEdit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[400px] font-mono text-sm"
                        value={code}
                        onChange={(e) => handleUpdateCode(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                ))}
                
                {showPreview && (
                  <TabsContent value="preview" className="h-[500px]">
                    <div className="bg-muted rounded-md h-full relative overflow-hidden">
                      <div className="absolute top-2 right-2 z-10">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowPreview(false)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" /> Edit Code
                        </Button>
                      </div>
                      <iframe 
                        ref={previewIframeRef}
                        className="w-full h-full border-0" 
                        title="Web App Preview"
                      />
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('description')}>
                View Details
              </Button>
              <Button 
                onClick={handleDownloadAll} 
                variant="outline"
                className="flex gap-2"
              >
                <Download className="h-4 w-4" />
                Download All Files
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WebAppCreatorPage;
