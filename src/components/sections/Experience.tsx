import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { RetroScrollbar } from '@/components/ui/RetroScrollbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContentSection } from './ContentSection';
import { planets } from './Hero';

export interface ExperienceCardProps {
  jobTitle: string;
  company: string;
  dateRange: string;
  bullets?: string[];
  techStack: string[];
}

export function ExperienceCard({ jobTitle, company, dateRange, bullets, techStack }: ExperienceCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`glass-card rounded-t-none border border-primary/30  hover:border-primary/50 transition-colors flex flex-col ${
      isMobile ? "border-t-2 p-2" : "border-t-0 p-6 pb-2"
    }`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground font-hero-heading">
                {jobTitle}
              </h3>
            </div>
            {company && (
              <h5 className="text-base text-primary font-hero-heading">
                {company}
              </h5>
            )}
          </div>
        </div>
        <span 
          className="text-sm text-primary/80"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {dateRange}
        </span>
        {bullets && bullets.length > 0 && (
          <RetroScrollbar 
            maxHeight={isMobile ? undefined : '38vh'}
            className="text-base leading-relaxed text-primary"
          >
            <ul 
              className="space-y-2 list-disc list-inside text-white [&>li::marker]:text-primary"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </RetroScrollbar>
        )}
      </div>
      {techStack && techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 mt-2">
          {techStack.map((tech, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 font-normal"
            >
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface ExperienceProps {
  isTransitioning?: boolean;
  showExperience?: boolean;
}

export const experienceEntries = [
    {
      jobTitle: "Senior Software Engineer",
      company: "EmitIQ",
      dateRange: "2022 - 2026",
      bullets: [
        "Developed and shipped a generalized, highly performant Temporal Graph Framework as a means of maximizing data storage flexibility and agility in the face of a high variability problem with many unknowns",
        "Created and implemented a JSON schema specification with automated validation logic as a means of defining and restricting the shape graph nodes and relationships, and provided thorough documentation of the spec",
        "Contributed to a suite of tools on the backend of an AI-powered carbon accounting platform",
        "Worked closely with frontend developers in sprints to solidify API requirements",
        "Consistently maintained high test coverage and thorough documentation as new features were added",
        "Engineered an ecosystem of smart contracts to facilitate the writing of carbon project development data to the Flow blockchain",
      ],
      techStack: ["C#", "Python", "Django", "Cadence", "React", "Tailwind", "JSON"]
    },
    {
      jobTitle: "Senior Programmer",
      company: "Danima Creative Group",
      dateRange: "2020 - 2022",
      bullets: [
        "Designed and built custom full-stack enterprise software solutions for a wide variety of businesses in the Niagara Region and beyond",
        "Lead a small team of developers, conducted regular code reviews, and interviewed potential hires",
        "Maintained a small collection of SaaS products",
        "Managed an handful of production Linux servers and MySQL databases",
        "Regularly met with clients to determine feature requirements"
      ],
      techStack: ["PHP", "MySQL", "Javascript", "CSS"]
    },
    {
      jobTitle: "Programmer",
      company: "Danima Creative Group",
      dateRange: "2020",
      bullets: [
        "Apprenticed under the then Senior Programmer of 11 years, training to become his successor",
        "Quickly learned the ropes of a 20-year-old business",
        "Learned the ins and outs of many legacy systems",
        "Refined my ability to become accustomed to unfamiliar applications in short order"
      ],
      techStack: ["PHP", "MySQL", "Javascript", "CSS"]
    },
    {
      jobTitle: "Freelance Software Developer",
      company: "",
      dateRange: "2018 - 2019",
      bullets: [
        "Translated clients' business requirements into technical solutions and clear project timelines",
        "Independently designed, built, and deployed custom web applications for small businesses",
        "Built secure, RESTful APIs",
        "Implemented payment processing and email delivery"
      ],
      techStack: ["PHP", "MySQL", "Javascript", "CSS"]
    }
];

export function MobileExperience({ isTransitioning = false, showExperience = false }: ExperienceProps) {
  const experiencePlanet = planets.find((p) => p.label === "Experience")!;

  return (
    <ContentSection
      title="Experience"
      titleGradient="gradient-text-red"
      isTransitioning={isTransitioning}
      showSection={showExperience}
      backgroundGradientColor="hsl(174,72%,56%,0.05)"
      backgroundBlobColor="bg-primary/5"
      planetData={experiencePlanet}
    >
      <div className="space-y-0">
        {experienceEntries.map((experience, index) => (
          <div key={index}>
            <ExperienceCard {...experience} />
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

export function Experience({ isTransitioning = false, showExperience = false, shouldShowSquare = false, isReversing = false }: ExperienceProps & { shouldShowSquare?: boolean; isReversing?: boolean }) {
  // Active tab state - use index as value, default to last entry
  const [activeTab, setActiveTab] = useState(String(0));

  return (
    <ContentSection
      title="Experience"
      titleGradient="gradient-text-red"
      isTransitioning={isTransitioning}
      showSection={showExperience}
      backgroundGradientColor="hsl(174,72%,56%,0.05)"
      backgroundBlobColor="bg-primary/5"
      shouldShowSquare={shouldShowSquare}
      isReversing={isReversing}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList data-hoverable className="w-full justify-end bg-transparent border-2 border-primary/30 p-0 mb-0 gap-0 rounded-none rounded-b-none">
          {experienceEntries.slice().reverse().map((experience, reversedIndex) => {
            const originalIndex = experienceEntries.length - 1 - reversedIndex;
            const isRightmostTab = reversedIndex === experienceEntries.length - 1;
            return (
              <TabsTrigger
                key={originalIndex}
                value={originalIndex.toString()}
                className={`rounded-none border border-primary/30 text-primary/60 hover:text-primary/80 transition-colors px-4 py-2 font-normal flex-1 data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:border-b-2 ${!isRightmostTab ? 'border-r-2' : ''}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {experience.dateRange}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="relative">
          {experienceEntries.map((experience, index) => (
            <TabsContent 
              key={index} 
              value={index.toString()} 
              className="data-[state=inactive]:hidden"
            >
              <div className="-mt-px">
                <ExperienceCard {...experience} />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </ContentSection>
  );
}
