
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Book, Bookmark, Code, Flask, Lightbulb, MusicNote, Palette } from 'lucide-react';

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
    id: '2',
    title: 'Classical Physics',
    description: 'Understand the foundational principles of physics that govern our universe.',
    category: 'Science',
    level: 'Intermediate',
    icon: Flask,
    modules: [
      { title: 'Mechanics', completed: false },
      { title: 'Thermodynamics', completed: false },
      { title: 'Electricity & Magnetism', completed: false },
      { title: 'Optics', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Indian Classical Music',
    description: 'Explore the rich traditions and techniques of Indian classical music.',
    category: 'Arts',
    level: 'Beginner',
    icon: MusicNote,
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
];

const categories = ['All', 'Technology', 'Science', 'Arts', 'Humanities'];

const LearningPaths = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarkedPaths, setBookmarkedPaths] = useState<string[]>([]);
  
  const filteredPaths = activeCategory === 'All' 
    ? learningPaths 
    : learningPaths.filter(path => path.category === activeCategory);
  
  const toggleBookmark = (id: string) => {
    setBookmarkedPaths(prev => 
      prev.includes(id) ? prev.filter(pathId => pathId !== id) : [...prev, id]
    );
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Learning Paths</h2>
      </div>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Paths</TabsTrigger>
          <TabsTrigger value="my-paths">My Paths</TabsTrigger>
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
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-paths">
          {bookmarkedPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learningPaths
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
              <Book className="h-16 w-16 mb-4" />
              <p>No learning paths bookmarked yet.</p>
              <p className="text-sm">Browse and bookmark paths to start learning.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPaths;
