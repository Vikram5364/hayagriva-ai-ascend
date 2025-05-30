
import { AppRequirements } from "./promptParser";

/**
 * Generates the structure of a React application based on user requirements
 */
export const generateAppStructure = (requirements: AppRequirements): string => {
  const { appName, appType, features, design, components } = requirements;
  
  const imports = generateImports(appType, features);
  const componentDefinitions = generateComponentDefinitions(appName, appType, features, design);
  const styles = generateStyles(appType, design);
  
  return `/**
 * ${appName}
 * Generated by Hayagriva Web App Creator
 * Date: ${new Date().toLocaleString()}
 * Type: ${appType}
 * Features: ${features.join(', ')}
 */

${imports}

const ${appName} = () => {
  ${componentDefinitions}
};

export default ${appName};

/* CSS Styles */
${styles}`;
};

/**
 * Generates import statements based on app requirements
 */
const generateImports = (appType: string, features: string[]): string => {
  let imports = `import React, { useState, useEffect } from 'react';\n`;
  
  // Add common imports
  imports += `import { Button } from "@/components/ui/button";\n`;
  imports += `import { Input } from "@/components/ui/input";\n`;
  
  // Add specific imports based on app type
  if (appType === 'dashboard') {
    imports += `import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';\n`;
  }
  
  if (features.includes('Authentication')) {
    imports += `import { useToast } from "@/components/ui/use-toast";\n`;
  }
  
  return imports;
};

/**
 * Generates the component definition including state and JSX
 */
const generateComponentDefinitions = (
  appName: string, 
  appType: string, 
  features: string[], 
  design: { darkMode: boolean, responsive: boolean, colorTheme?: string }
): string => {
  let code = '';
  
  // Add state variables
  code += `const [loading, setLoading] = useState(true);\n`;
  
  if (design.darkMode) {
    code += `  const [darkMode, setDarkMode] = useState(false);\n`;
  }
  
  if (features.includes('Authentication')) {
    code += `  const [user, setUser] = useState(null);\n`;
    code += `  const { toast } = useToast();\n`;
  }
  
  // Add useEffect for initial loading
  code += `
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);\n`;
  
  // Add dark mode toggle if needed
  if (design.darkMode) {
    code += `
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };\n`;
  }
  
  // Generate the JSX based on app type
  code += `
  return (
    <div className={\`app \${${design.darkMode ? 'darkMode ? "dark" : "light"' : '""'}\}\`}>
      <header className="app-header">
        <div className="logo-area">
          <h1>${appName}</h1>
        </div>
        ${design.darkMode ? `<button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>` : ''}
      </header>

      <main className="content-area">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading your ${appType}...</p>
          </div>
        ) : (
          ${generateMainContent(appType, features)}
        )}
      </main>
      
      <footer className="app-footer">
        <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </footer>
    </div>
  )`;
  
  return code;
};

/**
 * Generates the main content based on app type
 */
const generateMainContent = (appType: string, features: string[]): string => {
  switch (appType) {
    case 'dashboard':
      return `<>
            <div className="dashboard-header">
              <h2>Dashboard Overview</h2>
              <div className="dashboard-actions">
                <Button>Export</Button>
                <Button variant="outline">Refresh</Button>
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
            </div>
            
            <div className="chart-container">
              <h3>Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { name: 'Jan', value: 400 },
                    { name: 'Feb', value: 300 },
                    { name: 'Mar', value: 200 },
                    { name: 'Apr', value: 278 },
                    { name: 'May', value: 189 },
                    { name: 'Jun', value: 239 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>`;
    
    case 'ecommerce':
      return `<>
            <div className="store-header">
              <h2>Featured Products</h2>
              <div className="store-actions">
                <Input placeholder="Search products..." />
                <Button>Search</Button>
              </div>
            </div>
            
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="product-card">
                  <div className="product-image"></div>
                  <h3>Product {item}</h3>
                  <p className="product-price">$99.99</p>
                  <Button className="add-to-cart">Add to Cart</Button>
                </div>
              ))}
            </div>
          </>`;
    
    default:
      return `<>
            <div className="welcome-section">
              <h2>Welcome to ${appType.charAt(0).toUpperCase() + appType.slice(1)}</h2>
              <p>Your application is ready. Start by adding components and features.</p>
            </div>
            
            <div className="features-section">
              <h2>Features</h2>
              <div className="features-grid">
                ${features.map((feature, index) => `<div key={${index}} className="feature-card">
                  <h3>${feature}</h3>
                  <p>Implement your ${feature} functionality here.</p>
                </div>`).join('\n                ')}
              </div>
            </div>
          </>`;
  }
};

/**
 * Generates CSS styles based on app type and design preferences
 */
const generateStyles = (appType: string, design: { darkMode: boolean, responsive: boolean, colorTheme?: string }): string => {
  let colorPrimary = '#4361ee';
  let colorSecondary = '#3a0ca3';
  let colorBackground = '#ffffff';
  let colorText = '#333333';
  let colorDarkBackground = '#121212';
  let colorDarkText = '#f0f0f0';
  
  // Adjust colors based on theme preference
  if (design.colorTheme) {
    switch (design.colorTheme) {
      case 'blue':
        colorPrimary = '#1e88e5';
        colorSecondary = '#0d47a1';
        break;
      case 'green':
        colorPrimary = '#43a047';
        colorSecondary = '#1b5e20';
        break;
      case 'purple':
        colorPrimary = '#8e24aa';
        colorSecondary = '#4a148c';
        break;
      case 'orange':
        colorPrimary = '#fb8c00';
        colorSecondary = '#e65100';
        break;
      case 'red':
        colorPrimary = '#e53935';
        colorSecondary = '#b71c1c';
        break;
    }
  }
  
  let styles = `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ${design.darkMode ? 'transition: background-color 0.3s, color 0.3s;' : ''}
}

${design.darkMode ? `
body.dark-mode {
  background-color: ${colorDarkBackground};
  color: ${colorDarkText};
}
` : ''}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

${design.darkMode ? `
.app.dark {
  background-color: ${colorDarkBackground};
  color: ${colorDarkText};
}
` : ''}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${colorBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

${design.darkMode ? `
.app.dark .app-header {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
` : ''}

.content-area {
  flex: 1;
  padding: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 50vh;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${colorPrimary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-footer {
  padding: 1.5rem;
  text-align: center;
  background-color: #f8f9fa;
  margin-top: auto;
}

${design.darkMode ? `
.app.dark .app-footer {
  background-color: #1e1e1e;
}
` : ''}
`;

  // Add specific styles based on app type
  if (appType === 'dashboard') {
    styles += `
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: ${colorBackground};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

${design.darkMode ? `
.app.dark .stat-card {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
` : ''}

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

.chart-container {
  background-color: ${colorBackground};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

${design.darkMode ? `
.app.dark .chart-container {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
` : ''}
`;
  }

  if (appType === 'ecommerce') {
    styles += `
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: ${colorBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

${design.darkMode ? `
.app.dark .product-card {
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
` : ''}

.product-image {
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.product-price {
  font-weight: 600;
  color: ${colorPrimary};
  margin: 0.5rem 0 1rem;
}

.add-to-cart {
  margin-top: auto;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.store-actions {
  display: flex;
  gap: 8px;
}
`;
  }

  // Add responsive styles if requested
  if (design.responsive) {
    styles += `
/* Responsive Styles */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .stats-grid, .product-grid {
    grid-template-columns: 1fr;
  }
}
`;
  }

  return styles;
};
