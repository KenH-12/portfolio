import { useState } from 'react';
import { Quote } from 'lucide-react';
import { RetroScrollbar } from '../ui/RetroScrollbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { ContentSection } from './ContentSection';
import { planets } from './Hero';

export interface TestimonialCardProps {
  author: string;
  role: string;
  company?: string;
  testimonial: string[];
}

export function TestimonialCard({ author, role, company, testimonial }: TestimonialCardProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Combine all testimonial paragraphs into a single string for truncation
  const fullText = testimonial.join(' ');
  const TRUNCATE_LENGTH = 300; // Character limit for truncation
  const shouldTruncate = isMobile && fullText.length > TRUNCATE_LENGTH;
  
  // Truncate at word boundary to avoid cutting words in half
  const getTruncatedText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  };
  
  const truncatedText = shouldTruncate && !isExpanded 
    ? getTruncatedText(fullText, TRUNCATE_LENGTH) + '...'
    : null;

  return (
    <div className={`glass-card rounded-t-none border border-primary/30 hover:border-primary/50 transition-colors ${
      isMobile ? "border-t-2 p-2 pr-4" : "border-t-0 space-y-4 p-6"
    }`}>
      <RetroScrollbar 
        maxHeight={isMobile ? undefined : '50vh'}
        className="text-base leading-relaxed text-foreground"
      >
        <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground font-hero-heading">
                {author}
              </h3>
              <p 
                className="text-sm text-primary mb-0"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {role}{company && ` at ${company}`}
              </p>
            </div>
            <Quote className="h-6 w-6 text-primary/40 flex-shrink-0" />
          </div>
          {shouldTruncate && !isExpanded ? (
            <p>
              <em>"{truncatedText}"</em>
            </p>
          ) : (
            testimonial.map((paragraph, index) => {
              // Split paragraph by line breaks
              const lines = paragraph.split('\n');
              return (
                <p key={index} className={index === 0 ? '' : 'mt-4'}>
                  <em>
                    {index === 0 && '"'}
                    {lines.map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                    {index === testimonial.length - 1 && '"'}
                  </em>
                </p>
              );
            })
          )}
        </div>
      </RetroScrollbar>
      {shouldTruncate && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  );
}

interface TestimonialsProps {
  isTransitioning?: boolean;
  showTestimonials?: boolean;
}

export const testimonialEntries = [
    {
      author: "Ryan Lider",
      role: "Chief Technology Officer",
      company: "EmitIQ",
      testimonial: [
        "Ken is, quite simply, the ultimate hire. When we recruited Ken to join EmitIQ, our expectations were high; yet, he still managed to far exceed them.",
        "Ken is efficient, thoughtful, and deeply consistent. He is a man of few words, but every word carries weight. Whenever Ken spoke, we became accustomed to hushing ourselves as we anticipated, correctly, that a solution was imminent.",
        "This seemingly effortless ability to identify issues and provide solutions is, no doubt, due in part to his versatility as a developer. Indeed, unlike any engineer I have worked with before, Ken has an uncanny ability to quickly adapt to any new language, environment, framework, project, or team that we threw at him (and trust me, we tested him in this regard often). From what I know about Ken, however, this ability isn't solely an innate talent; he dedicates himself to learning outside of working hours and is a true perfectionist.",
        "With all this said, perhaps Ken's best attribute is his calm leadership. He is an incredible teacher. No matter how chaotic a pivot or deadline became, Ken remained the calmest person in the room. I truly believe Ken relished teaching, and his patience as a mentor allowed our junior and senior devs alike to thrive under his guidance. When you hire Ken, you not only get the benefit of his profound personal output as a coder, but you also increase the output and quality of everyone around him.",
        "Ken was an incredible hire for EmitIQ. He represents the gold-standard for what it means to be a lead engineer - someone who possesses both the hard skills to solve challenging technical problems and the soft skills to lead a team through them without ego. I would relish the opportunity to work with him again without a moment’s hesitation, and any organization would be better for having him."
      ]
    },
    {
      author: "Lindsey Bellman",
      role: "Senior Frontend Developer",
      company: "EmitIQ",
      testimonial: [
        "Ken is an absolute wizard of a software engineer. He is, without doubt, the most creative, dependable, and competent engineer I have ever worked with. He has the rare superpower of seeing through the abstract logical layers of any problem, consistently impressing me by offering inspired and creative solutions to complex issues he only knew a few high-level details about. Ken has the grounded, methodical mindset of a born programmer. He thinks at the system level, anticipates all edge cases, seizes optimization opportunities, and produces clean, production-ready code with impressive consistency. Beyond his technical excellence, Ken is an exceptional communicator. I watched him explain complex technical concepts to non-technical teammates with clarity, calm, and precision. He is patient, humble, kind, and extremely helpful—a rare and invaluable combination in a developer of his caliber.",
        "If you have the opportunity to bring Ken onto your team, seize it. Developers like Ken are exceedingly hard to find, and I would work with him again in a heartbeat."
      ]
    },
];

export function MobileTestimonials({ isTransitioning = false, showTestimonials = false }: TestimonialsProps) {
  const testimonialsPlanet = planets.find((p) => p.label === "Testimonials")!;

  return (
    <ContentSection
      title="Testimonials"
      titleGradient="gradient-text-pink"
      isTransitioning={isTransitioning}
      showSection={showTestimonials}
      backgroundGradientColor="hsl(174,72%,56%,0.05)"
      backgroundBlobColor="bg-primary/5"
      planetData={testimonialsPlanet}
    >
      <div className="space-y-0">
        {testimonialEntries.map((testimonial, index) => (
          <div key={index}>
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

export function Testimonials({ isTransitioning = false, showTestimonials = false, shouldShowSquare = false, isReversing = false }: TestimonialsProps & { shouldShowSquare?: boolean; isReversing?: boolean }) {
  // Active tab state - use index as value, default to first entry
  const [activeTab, setActiveTab] = useState(String(0));

  return (
    <ContentSection
      title="Testimonials"
      titleGradient="gradient-text-pink"
      isTransitioning={isTransitioning}
      showSection={showTestimonials}
      backgroundGradientColor="hsl(174,72%,56%,0.05)"
      backgroundBlobColor="bg-primary/5"
      shouldShowSquare={shouldShowSquare}
      isReversing={isReversing}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList data-hoverable className="w-full justify-end bg-transparent border-2 border-primary/30 p-0 h-10 mb-0 gap-0 rounded-none rounded-b-none">
          {testimonialEntries.map((testimonial, index) => {
            const isRightmostTab = index === testimonialEntries.length - 1;
            return (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className={`rounded-none border border-primary/30 text-primary/60 hover:text-primary/80 transition-colors px-4 py-2 font-normal flex-1 data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:border-b-2 ${!isRightmostTab ? 'border-r-2' : ''}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {testimonial.role} at {testimonial.company}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="relative min-h-[28rem]">
          {testimonialEntries.map((testimonial, index) => (
            <TabsContent 
              key={index} 
              value={index.toString()} 
              className="mt-0 data-[state=inactive]:hidden"
            >
              <div className="-mt-px">
                <TestimonialCard {...testimonial} />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </ContentSection>
  );
}
