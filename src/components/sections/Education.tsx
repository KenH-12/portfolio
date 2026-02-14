import { useState } from 'react';
import { BookOpenText, GraduationCap } from 'lucide-react';
import { RetroScrollbar } from '@/components/ui/RetroScrollbar';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { ContentSection } from './ContentSection';
import { planets } from './Hero';

export interface EducationCardProps {
  icon: React.ReactNode;
  institution: string;
  degree?: string;
  field?: string;
  period: string;
  description?: string;
  bullets?: string[];
}

export function EducationCard({ icon, institution, degree, field, period, description, bullets }: EducationCardProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`glass-card rounded-t-none border border-primary/30 hover:border-primary/50 transition-colors ${
      isMobile ? "border-t-2 p-2" : "border-t-0 space-y-4 p-6"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <h3 className="text-lg font-semibold text-foreground font-hero-heading">
              {institution}
            </h3>
          </div>
          {degree && (
          <p 
            className="text-base text-foreground font-hero-heading mb-1"
          >
            {degree}
          </p>
          )}
          {field && (
          <p 
            className="text-sm text-muted-foreground mb-2"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {field}
          </p>
          )}
          <p 
            className="text-sm text-primary/80 mb-2"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {period}
          </p>
        </div>
      </div>
      <RetroScrollbar 
        maxHeight={isMobile ? undefined : "36vh"}
        className="text-base leading-relaxed text-foreground"
      >
        {description && (
          <p 
            className="text-base leading-relaxed text-muted-foreground mb-4"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {description}
          </p>
        )}
        {bullets && bullets.length > 0 && (
            <ul 
              className="space-y-2 list-disc list-inside text-white [&>li::marker]:text-primary"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {bullets.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
        )}
      </RetroScrollbar>
    </div>
  );
}

interface EducationProps {
  isTransitioning?: boolean;
  showEducation?: boolean;
}

export const educationEntries = [
    {
      tabName: "Formal",
      icon: <GraduationCap className="h-5 w-5 text-primary/60" />,
      institution: "Niagara College",
      degree: "Computer Programmer",
      field: "Ontario College Diploma",
      period: "2018",
      description: "Software development, database design, and web design were the primary focuses of the program. Received supplimental training in graphic design and network protocols.",
      bullets: [
        "On the President's Honour Roll for all 4 terms",
        "Overall GPA of 97",
        "Recipient of the Associate Dean's Award of Excellence",
        "Class Representative for two years"
      ],
    },
    {
      tabName: "Informal",
      icon: <BookOpenText className="h-5 w-5 text-primary/60" />,
      institution: "Technical Books",
      degree: "Software Engineering / Development",
      period: "Ongoing since 2013",
      description: "Independent learning and practice is essential for mastering skills, and is arguably more important than formal education.",
      bullets: [
        "Design Patterns: Elements of Reusable Object-Oriented Software by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides",
        "Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin",
        "The Art of Readable Code by Dustin Boswell & Trevor Foucher",
        "The Pragmatic Programmer: From Journeyman to Master by Andrew Hunt and David Thomas",
        "PHP Objects, Patterns, and Practice by Matt Zandstra",
        "A Common-Sense Guide to Data Structures and Algorithms by Jay Wengrow",
        "Eloquent JavaScript by Marijn Haverbeke",
      ],
    },
];

export function MobileEducation({ isTransitioning = false, showEducation = false }: EducationProps) {
  const educationPlanet = planets.find((p) => p.label === "Education")!;

  return (
    <ContentSection
      title="Education"
      titleGradient="gradient-text-green"
      isTransitioning={isTransitioning}
      showSection={showEducation}
      backgroundGradientColor="hsl(150,70%,50%,0.05)"
      backgroundBlobColor="bg-neon-green/5"
      planetData={educationPlanet}
    >
      <div className="space-y-0">
        {educationEntries.map((education, index) => (
          <div key={index}>
            <EducationCard {...education} />
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

export function Education({ isTransitioning = false, showEducation = false, shouldShowSquare = false, isReversing = false }: EducationProps & { shouldShowSquare?: boolean; isReversing?: boolean }) {
  // Active tab state - use index as value, default to first entry
  const [activeTab, setActiveTab] = useState(String(0));

  return (
    <ContentSection
      title="Education"
      titleGradient="gradient-text-green"
      isTransitioning={isTransitioning}
      showSection={showEducation}
      backgroundGradientColor="hsl(150,70%,50%,0.05)"
      backgroundBlobColor="bg-neon-green/5"
      shouldShowSquare={shouldShowSquare}
      isReversing={isReversing}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList data-hoverable className="w-full justify-end bg-transparent border-2 border-primary/30 p-0 h-10 mb-0 gap-0 rounded-none rounded-b-none">
          {educationEntries.map((education, index) => {
            const isRightmostTab = index === educationEntries.length - 1;
            return (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className={`rounded-none border border-primary/30 text-primary/60 hover:text-primary/80 transition-colors px-4 py-2 font-normal flex-1 data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:border-b-2 ${!isRightmostTab ? 'border-r-2' : ''}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {education.tabName}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="relative min-h-[28rem]">
          {educationEntries.map((education, index) => (
            <TabsContent 
              key={index} 
              value={index.toString()} 
              className="mt-0 inset-0 data-[state=inactive]:hidden"
            >
              <div className="-mt-px">
                <EducationCard {...education} />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </ContentSection>
  );
}
