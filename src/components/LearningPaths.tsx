import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  Book, 
  Bookmark, 
  Code, 
  Lightbulb, 
  Music, 
  Palette, 
  Beaker,
  Calculator,
  Binary,
  Database,
  Server,
  Globe,
  Microscope,
  Atom,
  TestTube,
  BarChart2,
  Dna,
  Network,
  Layers,
  Brain,
  Smartphone,
  Shield,
  CircuitBoard,
  Waves,
  Orbit,
  Map,
  Mountain,
  Droplets,
  Scale,
  BookOpen,
  Compass,
  Landmark,
  PlusCircle,
  Bot
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  modules: {
    title: string;
    completed: boolean;
  }[];
  icon: React.ElementType;
}

const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Computer Science Fundamentals',
    description: 'Master the core concepts of computer science, from algorithms to data structures.',
    category: 'Technology',
    level: 'Beginner',
    icon: Code,
    modules: [
      { title: 'Introduction to Computing', completed: false },
      { title: 'Basic Algorithms', completed: false },
      { title: 'Data Structures', completed: false },
      { title: 'Object-Oriented Programming', completed: false },
    ]
  },
  {
    id: '6',
    title: 'Web Development',
    description: 'Build modern, responsive websites using the latest web technologies.',
    category: 'Technology',
    level: 'Intermediate',
    icon: Globe,
    modules: [
      { title: 'HTML & CSS Fundamentals', completed: false },
      { title: 'JavaScript Programming', completed: false },
      { title: 'Frontend Frameworks', completed: false },
      { title: 'Backend Development', completed: false },
    ]
  },
  {
    id: '7',
    title: 'Database Systems',
    description: 'Learn how to design, implement and manage database systems effectively.',
    category: 'Technology',
    level: 'Intermediate',
    icon: Database,
    modules: [
      { title: 'Relational Database Concepts', completed: false },
      { title: 'SQL Query Language', completed: false },
      { title: 'NoSQL Databases', completed: false },
      { title: 'Database Administration', completed: false },
    ]
  },
  {
    id: '8',
    title: 'Artificial Intelligence',
    description: 'Dive into the fascinating world of AI and machine learning algorithms.',
    category: 'Technology',
    level: 'Advanced',
    icon: Binary,
    modules: [
      { title: 'Machine Learning Fundamentals', completed: false },
      { title: 'Neural Networks', completed: false },
      { title: 'Natural Language Processing', completed: false },
      { title: 'Computer Vision', completed: false },
    ]
  },
  {
    id: '9',
    title: 'Cloud Computing',
    description: 'Master cloud platforms and learn to design scalable, resilient systems.',
    category: 'Technology',
    level: 'Advanced',
    icon: Server,
    modules: [
      { title: 'Cloud Infrastructure', completed: false },
      { title: 'Deployment Strategies', completed: false },
      { title: 'Containerization & Orchestration', completed: false },
      { title: 'Cloud Security', completed: false },
    ]
  },
  {
    id: '18',
    title: 'Cybersecurity',
    description: 'Learn to protect systems, networks, and programs from digital attacks.',
    category: 'Technology',
    level: 'Advanced',
    icon: Shield,
    modules: [
      { title: 'Network Security', completed: false },
      { title: 'Cryptography', completed: false },
      { title: 'Ethical Hacking', completed: false },
      { title: 'Security Governance', completed: false },
    ]
  },
  {
    id: '19',
    title: 'Mobile App Development',
    description: 'Create native and cross-platform mobile applications for iOS and Android.',
    category: 'Technology',
    level: 'Intermediate',
    icon: Smartphone,
    modules: [
      { title: 'Mobile UI/UX Design', completed: false },
      { title: 'Native Development', completed: false },
      { title: 'Cross-platform Frameworks', completed: false },
      { title: 'App Deployment & Analytics', completed: false },
    ]
  },
  {
    id: '20',
    title: 'Blockchain Technology',
    description: 'Understand distributed ledger technology and its applications.',
    category: 'Technology',
    level: 'Advanced',
    icon: Network,
    modules: [
      { title: 'Blockchain Fundamentals', completed: false },
      { title: 'Smart Contracts', completed: false },
      { title: 'Decentralized Applications', completed: false },
      { title: 'Cryptocurrency Systems', completed: false },
    ]
  },
  {
    id: '21',
    title: 'DevOps Practices',
    description: 'Bridge development and operations with automation and collaboration.',
    category: 'Technology',
    level: 'Intermediate',
    icon: Layers,
    modules: [
      { title: 'Continuous Integration', completed: false },
      { title: 'Continuous Deployment', completed: false },
      { title: 'Infrastructure as Code', completed: false },
      { title: 'Monitoring & Observability', completed: false },
    ]
  },
  {
    id: '22',
    title: 'Embedded Systems',
    description: 'Design and program computer systems embedded in other machines.',
    category: 'Technology',
    level: 'Intermediate',
    icon: CircuitBoard,
    modules: [
      { title: 'Microcontroller Programming', completed: false },
      { title: 'Real-time Operating Systems', completed: false },
      { title: 'IoT Device Development', completed: false },
      { title: 'Hardware Interfaces', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Classical Physics',
    description: 'Understand the foundational principles of physics that govern our universe.',
    category: 'Science',
    level: 'Intermediate',
    icon: Beaker,
    modules: [
      { title: 'Mechanics', completed: false },
      { title: 'Thermodynamics', completed: false },
      { title: 'Electricity & Magnetism', completed: false },
      { title: 'Optics', completed: false },
    ]
  },
  {
    id: '10',
    title: 'Molecular Biology',
    description: 'Explore the molecular basis of biological activity between biomolecules.',
    category: 'Science',
    level: 'Advanced',
    icon: Microscope,
    modules: [
      { title: 'DNA and RNA Structure', completed: false },
      { title: 'Protein Synthesis', completed: false },
      { title: 'Gene Expression', completed: false },
      { title: 'Genetic Engineering', completed: false },
    ]
  },
  {
    id: '11',
    title: 'Quantum Physics',
    description: 'Understand the peculiar world of quantum mechanics and its applications.',
    category: 'Science',
    level: 'Advanced',
    icon: Atom,
    modules: [
      { title: 'Wave-Particle Duality', completed: false },
      { title: 'Quantum States & Measurement', completed: false },
      { title: 'Quantum Entanglement', completed: false },
      { title: 'Quantum Computing', completed: false },
    ]
  },
  {
    id: '12',
    title: 'Chemistry Fundamentals',
    description: 'Learn the core principles of chemical reactions and molecular properties.',
    category: 'Science',
    level: 'Beginner',
    icon: TestTube,
    modules: [
      { title: 'Atomic Structure', completed: false },
      { title: 'Chemical Bonding', completed: false },
      { title: 'Stoichiometry', completed: false },
      { title: 'Acids, Bases & Solutions', completed: false },
    ]
  },
  {
    id: '23',
    title: 'Organic Chemistry',
    description: 'Study the structure, properties, and reactions of organic compounds.',
    category: 'Science',
    level: 'Intermediate',
    icon: Beaker,
    modules: [
      { title: 'Hydrocarbons', completed: false },
      { title: 'Functional Groups', completed: false },
      { title: 'Reaction Mechanisms', completed: false },
      { title: 'Spectroscopy', completed: false },
    ]
  },
  {
    id: '24',
    title: 'Genetics',
    description: 'Explore heredity, variation, and the function of genes in living organisms.',
    category: 'Science',
    level: 'Intermediate',
    icon: Dna,
    modules: [
      { title: 'Mendelian Genetics', completed: false },
      { title: 'Population Genetics', completed: false },
      { title: 'Genomics', completed: false },
      { title: 'Epigenetics', completed: false },
    ]
  },
  {
    id: '25',
    title: 'Neuroscience',
    description: 'Study the structure and function of the nervous system and brain.',
    category: 'Science',
    level: 'Advanced',
    icon: Brain,
    modules: [
      { title: 'Neuroanatomy', completed: false },
      { title: 'Neurophysiology', completed: false },
      { title: 'Cognitive Neuroscience', completed: false },
      { title: 'Neuroimaging', completed: false },
    ]
  },
  {
    id: '26',
    title: 'Astrophysics',
    description: 'Understand the physics of celestial objects and the universe.',
    category: 'Science',
    level: 'Advanced',
    icon: Orbit,
    modules: [
      { title: 'Stellar Evolution', completed: false },
      { title: 'Galactic Structure', completed: false },
      { title: 'Cosmology', completed: false },
      { title: 'Black Holes & Neutron Stars', completed: false },
    ]
  },
  {
    id: '27',
    title: 'Earth Sciences',
    description: 'Study the Earth\'s physical structure, atmosphere, and environment.',
    category: 'Science',
    level: 'Intermediate',
    icon: Globe,
    modules: [
      { title: 'Geology', completed: false },
      { title: 'Meteorology', completed: false },
      { title: 'Oceanography', completed: false },
      { title: 'Climate Science', completed: false },
    ]
  },
  {
    id: '28',
    title: 'Ecology',
    description: 'Explore the relationships between organisms and their environment.',
    category: 'Science',
    level: 'Intermediate',
    icon: Mountain,
    modules: [
      { title: 'Ecosystem Dynamics', completed: false },
      { title: 'Population Ecology', completed: false },
      { title: 'Conservation Biology', completed: false },
      { title: 'Biodiversity', completed: false },
    ]
  },
  {
    id: '29',
    title: 'Biochemistry',
    description: 'Study the chemical processes and substances in living organisms.',
    category: 'Science',
    level: 'Advanced',
    icon: Droplets,
    modules: [
      { title: 'Enzymology', completed: false },
      { title: 'Metabolism', completed: false },
      { title: 'Molecular Cell Biology', completed: false },
      { title: 'Structural Biochemistry', completed: false },
    ]
  },
  {
    id: '30',
    title: 'Biophysics',
    description: 'Apply principles of physics to understand biological systems.',
    category: 'Science',
    level: 'Advanced',
    icon: Waves,
    modules: [
      { title: 'Biomechanics', completed: false },
      { title: 'Medical Physics', completed: false },
      { title: 'Molecular Biophysics', completed: false },
      { title: 'Biological Imaging', completed: false },
    ]
  },
  {
    id: '13',
    title: 'Calculus',
    description: 'Master the mathematics of continuous change and its applications.',
    category: 'Mathematics',
    level: 'Intermediate',
    icon: Calculator,
    modules: [
      { title: 'Limits and Continuity', completed: false },
      { title: 'Differentiation', completed: false },
      { title: 'Integration', completed: false },
      { title: 'Multivariable Calculus', completed: false },
    ]
  },
  {
    id: '14',
    title: 'Linear Algebra',
    description: 'Study vector spaces, linear transformations, and matrices.',
    category: 'Mathematics',
    level: 'Intermediate',
    icon: Calculator,
    modules: [
      { title: 'Vectors and Spaces', completed: false },
      { title: 'Matrix Operations', completed: false },
      { title: 'Eigenvalues and Eigenvectors', completed: false },
      { title: 'Applications of Linear Algebra', completed: false },
    ]
  },
  {
    id: '15',
    title: 'Discrete Mathematics',
    description: 'Explore the mathematical structures that are fundamentally discrete.',
    category: 'Mathematics',
    level: 'Intermediate',
    icon: Calculator,
    modules: [
      { title: 'Set Theory', completed: false },
      { title: 'Number Theory', completed: false },
      { title: 'Graph Theory', completed: false },
      { title: 'Combinatorics', completed: false },
    ]
  },
  {
    id: '16',
    title: 'Statistics and Probability',
    description: 'Learn to analyze data and make predictions using statistical methods.',
    category: 'Mathematics',
    level: 'Beginner',
    icon: BarChart2,
    modules: [
      { title: 'Descriptive Statistics', completed: false },
      { title: 'Probability Theory', completed: false },
      { title: 'Statistical Inference', completed: false },
      { title: 'Regression Analysis', completed: false },
    ]
  },
  {
    id: '31',
    title: 'Differential Equations',
    description: 'Study equations involving derivatives and their applications.',
    category: 'Mathematics',
    level: 'Advanced',
    icon: Calculator,
    modules: [
      { title: 'First-Order Equations', completed: false },
      { title: 'Second-Order Equations', completed: false },
      { title: 'Systems of Differential Equations', completed: false },
      { title: 'Partial Differential Equations', completed: false },
    ]
  },
  {
    id: '32',
    title: 'Abstract Algebra',
    description: 'Explore algebraic structures like groups, rings, and fields.',
    category: 'Mathematics',
    level: 'Advanced',
    icon: Calculator,
    modules: [
      { title: 'Group Theory', completed: false },
      { title: 'Ring Theory', completed: false },
      { title: 'Field Theory', completed: false },
      { title: 'Galois Theory', completed: false },
    ]
  },
  {
    id: '33',
    title: 'Real Analysis',
    description: 'Study the rigorous theory of calculus and mathematical analysis.',
    category: 'Mathematics',
    level: 'Advanced',
    icon: Calculator,
    modules: [
      { title: 'Sequences and Series', completed: false },
      { title: 'Continuity & Differentiability', completed: false },
      { title: 'Measure Theory', completed: false },
      { title: 'Lebesgue Integration', completed: false },
    ]
  },
  {
    id: '34',
    title: 'Topology',
    description: 'Investigate properties of space preserved under continuous deformations.',
    category: 'Mathematics',
    level: 'Advanced',
    icon: Layers,
    modules: [
      { title: 'Point-Set Topology', completed: false },
      { title: 'Algebraic Topology', completed: false },
      { title: 'Differential Topology', completed: false },
      { title: 'Manifold Theory', completed: false },
    ]
  },
  {
    id: '35',
    title: 'Numerical Methods',
    description: 'Learn computational techniques for solving mathematical problems.',
    category: 'Mathematics',
    level: 'Intermediate',
    icon: Binary,
    modules: [
      { title: 'Root Finding', completed: false },
      { title: 'Numerical Integration', completed: false },
      { title: 'Differential Equation Methods', completed: false },
      { title: 'Linear Systems', completed: false },
    ]
  },
  {
    id: '36',
    title: 'Mathematical Logic',
    description: 'Study the principles of valid reasoning and formal proof systems.',
    category: 'Mathematics',
    level: 'Advanced',
    icon: Scale,
    modules: [
      { title: 'Propositional Logic', completed: false },
      { title: 'Predicate Logic', completed: false },
      { title: 'Model Theory', completed: false },
      { title: 'Computability Theory', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Indian Classical Music',
    description: 'Explore the rich traditions and techniques of Indian classical music.',
    category: 'Arts',
    level: 'Beginner',
    icon: Music,
    modules: [
      { title: 'Introduction to Ragas', completed: false },
      { title: 'Taals and Rhythm', completed: false },
      { title: 'Vocal Techniques', completed: false },
      { title: 'Instrumental Traditions', completed: false },
    ]
  },
  {
    id: '4',
    title: 'Indian Philosophy',
    description: 'Discover the profound philosophical traditions of India.',
    category: 'Humanities',
    level: 'Advanced',
    icon: Lightbulb,
    modules: [
      { title: 'Vedic Philosophy', completed: false },
      { title: 'Buddhism and Jainism', completed: false },
      { title: 'Advaita Vedanta', completed: false },
      { title: 'Modern Indian Thought', completed: false },
    ]
  },
  {
    id: '5',
    title: 'Digital Painting',
    description: 'Learn the techniques and principles of digital art and illustration.',
    category: 'Arts',
    level: 'Intermediate',
    icon: Palette,
    modules: [
      { title: 'Digital Tools Introduction', completed: false },
      { title: 'Color Theory', completed: false },
      { title: 'Composition', completed: false },
      { title: 'Advanced Techniques', completed: false },
    ]
  },
  {
    id: '37',
    title: 'World Literature',
    description: 'Explore great literary works from different cultures and time periods.',
    category: 'Humanities',
    level: 'Intermediate',
    icon: BookOpen,
    modules: [
      { title: 'Ancient Literature', completed: false },
      { title: 'Renaissance & Enlightenment', completed: false },
      { title: 'Modernist Literature', completed: false },
      { title: 'Postcolonial Literature', completed: false },
    ]
  },
  {
    id: '38',
    title: 'World History',
    description: 'Study major historical events and their impact on human civilization.',
    category: 'Humanities',
    level: 'Beginner',
    icon: Landmark,
    modules: [
      { title: 'Ancient Civilizations', completed: false },
      { title: 'Medieval Period', completed: false },
      { title: 'Modern Era', completed: false },
      { title: 'Contemporary History', completed: false },
    ]
  },
  {
    id: '39',
    title: 'Ethical Systems',
    description: 'Explore different frameworks for moral reasoning and decision-making.',
    category: 'Humanities',
    level: 'Intermediate',
    icon: Compass,
    modules: [
      { title: 'Virtue Ethics', completed: false },
      { title: 'Deontology', completed: false },
      { title: 'Consequentialism', completed: false },
      { title: 'Applied Ethics', completed: false },
    ]
  }
];

const categories = ['All', 'Technology', 'Science', 'Mathematics', 'Arts', 'Humanities'];

const LearningPaths = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarkedPaths, setBookmarkedPaths] = useState<string[]>([]);
  const [showNewChatbotForm, setShowNewChatbotForm] = useState(false);
  const [customPaths, setCustomPaths] = useState<LearningPath[]>([]);
  
  const [newChatbot, setNewChatbot] = useState({
    title: '',
    description: '',
    category: 'Technology',
    level: 'Beginner',
    module1: '',
    module2: '',
    module3: '',
    module4: '',
  });
  
  // Combine predefined paths with custom user-created ones
  const allPaths = [...learningPaths, ...customPaths];
  
  const filteredPaths = activeCategory === 'All' 
    ? allPaths 
    : allPaths.filter(path => path.category === activeCategory);
  
  const toggleBookmark = (id: string) => {
    setBookmarkedPaths(prev => 
      prev.includes(id) ? prev.filter(pathId => pathId !== id) : [...prev, id]
    );
  };
  
  const handleAddNewChatbot = () => {
    if (newChatbot.title && newChatbot.description) {
      const newPath: LearningPath = {
        id: `custom-${Date.now()}`,
        title: newChatbot.title,
        description: newChatbot.description,
        category: newChatbot.category,
        level: newChatbot.level,
        icon: Bot,
        modules: [
          { title: newChatbot.module1 || 'Module 1', completed: false },
          { title: newChatbot.module2 || 'Module 2', completed: false },
          { title: newChatbot.module3 || 'Module 3', completed: false },
          { title: newChatbot.module4 || 'Module 4', completed: false },
        ]
      };
      
      setCustomPaths([...customPaths, newPath]);
      setNewChatbot({
        title: '',
        description: '',
        category: 'Technology',
        level: 'Beginner',
        module1: '',
        module2: '',
        module3: '',
        module4: '',
      });
      setShowNewChatbotForm(false);
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">AI Chatbots</h2>
        <Button 
          onClick={() => setShowNewChatbotForm(!showNewChatbotForm)} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Chatbot
        </Button>
      </div>
      
      {showNewChatbotForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New AI Chatbot</CardTitle>
            <CardDescription>Define your custom learning track AI chatbot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input 
                  value={newChatbot.title}
                  onChange={(e) => setNewChatbot({...newChatbot, title: e.target.value})}
                  placeholder="Organic Chemistry Assistant"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select 
                  value={newChatbot.category}
                  onChange={(e) => setNewChatbot({...newChatbot, category: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Level</label>
                <select 
                  value={newChatbot.level}
                  onChange={(e) => setNewChatbot({...newChatbot, level: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea 
                value={newChatbot.description}
                onChange={(e) => setNewChatbot({...newChatbot, description: e.target.value})}
                placeholder="Describe what this AI chatbot will help with..."
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Learning Modules (optional)</label>
              <div className="space-y-2">
                <Input 
                  value={newChatbot.module1}
                  onChange={(e) => setNewChatbot({...newChatbot, module1: e.target.value})}
                  placeholder="Module 1 (e.g., Basic Concepts)"
                  className="mb-2"
                />
                <Input 
                  value={newChatbot.module2}
                  onChange={(e) => setNewChatbot({...newChatbot, module2: e.target.value})}
                  placeholder="Module 2 (e.g., Advanced Topics)"
                  className="mb-2"
                />
                <Input 
                  value={newChatbot.module3}
                  onChange={(e) => setNewChatbot({...newChatbot, module3: e.target.value})}
                  placeholder="Module 3 (e.g., Practical Applications)"
                  className="mb-2"
                />
                <Input 
                  value={newChatbot.module4}
                  onChange={(e) => setNewChatbot({...newChatbot, module4: e.target.value})}
                  placeholder="Module 4 (e.g., Case Studies)"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewChatbotForm(false)}>Cancel</Button>
            <Button onClick={handleAddNewChatbot}>Create Chatbot</Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Chatbots</TabsTrigger>
          <TabsTrigger value="my-paths">My Chatbots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaths.map(path => (
              <Card key={path.id} className="overflow-hidden">
                <CardHeader className="relative pb-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => toggleBookmark(path.id)}
                  >
                    <Bookmark 
                      className={`h-5 w-5 ${bookmarkedPaths.includes(path.id) ? 'fill-primary text-primary' : ''}`} 
                    />
                  </Button>
                  <div className="p-2 bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <path.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{path.title}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{path.category}</Badge>
                    <Badge variant="secondary">{path.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{path.description}</p>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">MODULES</p>
                    <ul className="space-y-1">
                      {path.modules.map((module, idx) => (
                        <li key={idx} className="text-sm flex items-center">
                          <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2">
                            {idx + 1}
                          </span>
                          {module.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="sm">
                    Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-paths">
          {bookmarkedPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPaths
                .filter(path => bookmarkedPaths.includes(path.id))
                .map(path => (
                  <Card key={path.id}>
                    <CardHeader className="pb-2">
                      <div className="p-2 bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                        <path.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{path.title}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{path.category}</Badge>
                        <Badge variant="secondary">{path.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">PROGRESS</p>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[0%]"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">0% Complete</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" size="sm">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bot className="h-16 w-16 mb-4" />
              <p>No AI chatbots bookmarked yet.</p>
              <p className="text-sm">Browse and bookmark chatbots to start learning.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPaths;
