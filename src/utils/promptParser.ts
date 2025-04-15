
/**
 * Utility to parse user prompts and extract key information for code generation
 */

export interface AppRequirements {
  appType: string;
  appName: string;
  features: string[];
  design: {
    darkMode: boolean;
    responsive: boolean;
    colorTheme?: string;
  };
  components: string[];
  pages: string[];
  dataModel?: Record<string, any>[];
}

/**
 * Analyzes a prompt to identify app requirements
 * @param prompt User input describing the app they want
 */
export const parseAppRequirements = (prompt: string): AppRequirements => {
  const requirements: AppRequirements = {
    appType: "generic",
    appName: "HayagrivaApp",
    features: [],
    design: {
      darkMode: false,
      responsive: true,
    },
    components: [],
    pages: ["Home"],
  };

  // Extract app type
  if (prompt.match(/dashboard|analytics|chart|graph|data visualization/i)) {
    requirements.appType = "dashboard";
    requirements.components.push("Chart", "DataTable", "StatCard");
    requirements.pages.push("Dashboard", "Analytics");
  } else if (prompt.match(/e-?commerce|shop|store|product|cart/i)) {
    requirements.appType = "ecommerce";
    requirements.components.push("ProductCard", "CartItem", "Checkout");
    requirements.pages.push("Products", "Cart", "Checkout");
  } else if (prompt.match(/blog|content|article|post/i)) {
    requirements.appType = "blog";
    requirements.components.push("ArticleCard", "PostContent", "Comment");
    requirements.pages.push("Blog", "Article");
  } else if (prompt.match(/portfolio|showcase|gallery/i)) {
    requirements.appType = "portfolio";
    requirements.components.push("ProjectCard", "Gallery", "ContactForm");
    requirements.pages.push("Projects", "About", "Contact");
  } else if (prompt.match(/social|network|friend|post|share/i)) {
    requirements.appType = "social";
    requirements.components.push("UserProfile", "Post", "Comment");
    requirements.pages.push("Feed", "Profile", "Discover");
  } else if (prompt.match(/task|todo|project management/i)) {
    requirements.appType = "taskmanager";
    requirements.components.push("TaskCard", "TaskList", "TaskForm");
    requirements.pages.push("Tasks", "Calendar", "Reports");
  }

  // Extract app name
  const nameMatch = prompt.match(/(?:create|build|make|develop|generate)\s+(?:an?|the)\s+(\w+(?:\s+\w+){0,3})/i);
  if (nameMatch) {
    requirements.appName = nameMatch[1].replace(/\b\w/g, l => l.toUpperCase()).replace(/\s+/g, '');
  }

  // Extract design preferences
  if (prompt.match(/dark mode|night mode|dark theme/i)) {
    requirements.design.darkMode = true;
  }

  if (prompt.match(/color theme|color scheme|color palette/i)) {
    const colorMatch = prompt.match(/(?:color theme|color scheme|color palette)(?:\s+of|\s+with)?\s+(\w+)/i);
    if (colorMatch) {
      requirements.design.colorTheme = colorMatch[1].toLowerCase();
    }
  }

  // Extract features
  const featureMatches = [
    { regex: /authentication|login|register|signup|sign up|sign in/i, feature: "Authentication" },
    { regex: /search|filter|sort/i, feature: "Search & Filtering" },
    { regex: /notification|alert/i, feature: "Notifications" },
    { regex: /payment|checkout|stripe|paypal/i, feature: "Payments" },
    { regex: /chat|message/i, feature: "Messaging" },
    { regex: /upload|file|image/i, feature: "File Uploads" },
    { regex: /theme|customize|personalize/i, feature: "Theming" },
    { regex: /analytics|tracking|stats/i, feature: "Analytics" },
    { regex: /pdf|document|report/i, feature: "Document Generation" },
    { regex: /map|location|gps/i, feature: "Maps & Location" },
    { regex: /responsive|mobile|tablet|desktop/i, feature: "Responsive Design" },
    { regex: /accessibility|a11y/i, feature: "Accessibility" },
  ];

  featureMatches.forEach(({ regex, feature }) => {
    if (prompt.match(regex)) {
      requirements.features.push(feature);
    }
  });

  // Make sure we have at least some features
  if (requirements.features.length === 0) {
    requirements.features.push("Basic UI", "Responsive Design");
  }

  return requirements;
};
