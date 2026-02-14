import { ContentSection } from './ContentSection';
import { RetroScrollbar } from '@/components/ui/RetroScrollbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { planets } from './Hero';

const description =
  <>
    <span className="gradient-text-green font-bold">
      I was born to code.
    </span>{" "}
    My enduring fascination with the near-infinite potential of software manifests as a love for what I do and a drive to do it well. 
    I'm notorious for saying, "anything is possible" and backing it up, so if you've got a dream then let's make it happen!
  </>

const lists = [
  {
    title: "My Principles",
    items: [
      "Leave the codebase better than you found it",
      "There is always more to learn and room to improve",
      "Always be open to feedback; never take offense and never make excuses",
      "Exceed expectations when possible; recognize \"good enough\" when time is limited",
      "Leverage AI, but don't place your trust in it",
      "Where there's a will, there's a way",
    ]
  },
  {
    title: "My Passions",
    items: [
      "Figuring out how things work",
      "Finding elegant solutions to tough problems",
      "Writing clean, maintainable code",
      "Mastering skills",
      "Optimizing workflows",
    ]
  },
  {
    title: "My Preferences",
    items: [
      "Back-end over front-end, but full-stack above all",
      "Test-driven development",
      "Windows",
    ]
  },
];

interface AboutMeProps {
  isTransitioning?: boolean;
  showAboutMe?: boolean;
}

function AboutMeCardContent() {
  const isMobile = useIsMobile();
  return (
    <RetroScrollbar
      maxHeight={isMobile ? undefined : '52vh'}
      className="text-base leading-relaxed text-foreground"
    >
      <p
        className="text-base leading-relaxed text-muted-foreground mb-4"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {description}
      </p>
      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list.title}>
            <h3 className="text-lg font-semibold text-primary font-hero-heading">{list.title}</h3>
            <ul
              className="space-y-2 list-disc list-inside text-white [&>li::marker]:text-primary"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {list.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </RetroScrollbar>
  );
}

export function MobileAboutMe({ isTransitioning = false, showAboutMe = false }: AboutMeProps) {
  const aboutPlanet = planets.find((p) => p.label === "About Me")!;
  const isMobile = useIsMobile();

  return (
    <ContentSection
      title="About Me"
      titleGradient="gradient-text-blue"
      isTransitioning={isTransitioning}
      showSection={showAboutMe}
      backgroundGradientColor="hsl(0,0%,90%,0.06)"
      backgroundBlobColor="bg-white/5"
      planetData={aboutPlanet}
    >
      <div
        className={`glass-card rounded-t-none border border-primary/30 hover:border-primary/50 transition-colors ${isMobile ? 'p-2' : 'p-6'}`}
      >
        <AboutMeCardContent />
      </div>
    </ContentSection>
  );
}

export function AboutMe({
  isTransitioning = false,
  showAboutMe = false,
  shouldShowSquare = false,
  isReversing = false,
}: AboutMeProps & { shouldShowSquare?: boolean; isReversing?: boolean }) {
  return (
    <ContentSection
      title="About Me"
      titleGradient="gradient-text-blue"
      isTransitioning={isTransitioning}
      showSection={showAboutMe}
      backgroundGradientColor="hsl(0,0%,90%,0.06)"
      backgroundBlobColor="bg-white/5"
      shouldShowSquare={shouldShowSquare}
      isReversing={isReversing}
    >
      <div className="glass-card rounded-t-none border border-primary/30 hover:border-primary/50 transition-colors p-6">
        <AboutMeCardContent />
      </div>
    </ContentSection>
  );
}
