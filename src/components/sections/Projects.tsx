import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { RetroScrollbar } from '@/components/ui/RetroScrollbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContentSection } from './ContentSection';
import { planets } from './Hero';

interface ProjectCardProps {
  title: string;
  description: React.ReactNode;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

function ProjectCard({ title, description, technologies, githubUrl, liveUrl, imageUrl }: ProjectCardProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`glass-card border border-primary/30 ${isMobile ? "p-2" : "p-6"} xl:pb-7 hover:border-primary/50 transition-colors`}
    >
      <RetroScrollbar
        maxHeight={isMobile ? undefined : '60vh'}
        className="text-base leading-relaxed text-foreground"
      >
        <div className="space-y-2">
          {imageUrl && (
            <div className="w-full aspect-video sm:max-h-48 md:max-h-64 lg:max-h-80 xl:max-h-96 overflow-hidden bg-muted/20 flex sm:items-start md:items-center sm:justify-left md:justify-center">
              <img 
                src={imageUrl} 
                alt={title}
                className="max-w-full max-h-full w-auto h-full object-contain"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-primary font-hero-heading">
            {title}
          </h3>
          {(githubUrl || liveUrl) && (
            <div className="flex gap-4">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hoverable
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>GitHub</span>
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hoverable
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>Live Demo</span>
                </a>
              )}
            </div>
          )}
          {description}
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </RetroScrollbar>
    </div>
  );
}

interface ProjectsProps {
  isTransitioning?: boolean;
  showProjects?: boolean;
}

export function Projects({ isTransitioning = false, showProjects = false, shouldShowSquare = false, isReversing = false }: ProjectsProps & { shouldShowSquare?: boolean; isReversing?: boolean }) {

  // Sample project data - one project for now
  const projects = [
    {
      title: "Pandemic Web App",
      description: (
        <div className="mt-4">
          A fully functional adaptation of the award-winning board game, <em>Pandemic</em>. Showcases database design, organization of a complex system, the ability to hold tightly to a set of requirements (the game's original ruleset), and creativity in adapting the various aspects of a physical board game for a Web application. <span className="text-primary"><a href="mailto:ken@kenhenderson.ca" data-hoverable>Email me</a></span> for an access key! <span role="img" aria-label="key">🔑</span>
        </div>
      ),
      technologies: ["PHP", "MySQL", "Javascript", "CSS"],
      githubUrl: "https://github.com/KenH-12/Pandemic",
      liveUrl: "https://pandemic.kenhenderson.ca",
      imageUrl: "/projects/pandemic-app.gif",
    },
  ];

  const projectsPlanet = planets.find((p) => p.label === "Projects")!;

  return (
    <ContentSection
      title="Projects"
      titleGradient="gradient-text-cyan"
      isTransitioning={isTransitioning}
      showSection={showProjects}
      backgroundGradientColor="hsl(174,72%,56%,0.05)"
      backgroundBlobColor="bg-primary/5"
      planetData={projectsPlanet}
      shouldShowSquare={shouldShowSquare}
      isReversing={isReversing}
    >
      <div className="space-y-4">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </ContentSection>
  );
}
