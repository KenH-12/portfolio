import { useEffect, useState } from "react";
import { Linkedin, Github, MailIcon, ChevronUp, Copy, Check } from "lucide-react";

const EMAIL_ADDRESS = "kenhenderson12@hotmail.com";
const EMAIL = `mailto:${EMAIL_ADDRESS}`;
const LINKEDIN_URL = "https://linkedin.com/in/ken-henderson-7828161b5";
const GITHUB_URL = "https://github.com/KenH-12";

const CONTACT_GRADIENT =
  "linear-gradient(to bottom, rgba(0,5,20,0.95) 0%, rgba(15,23,42,0.85) 14%, rgba(15,23,42,0.4) 25%, transparent 100%)";

/** Side gradients for viewports >= 1920px: fade background image to transparent at left/right edges */
const CONTACT_SIDE_GRADIENT_LEFT =
  "linear-gradient(to right, rgba(0,5,20,0.95) 0%, rgba(15,23,42,0.4) 15%, transparent 25%)";
const CONTACT_SIDE_GRADIENT_RIGHT =
  "linear-gradient(to left, rgba(0,5,20,0.95) 0%, rgba(15,23,42,0.4) 15%, transparent 25%)";

const linkStyle = {
  textShadow:
    "0 0 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.6)",
};

function ContactContent() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: open mailto
      window.location.href = EMAIL;
    }
  };

  return (
    <>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/radio-telescope.jpg')" }}
      />
      {/* Top-edge transparency gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: CONTACT_GRADIENT }}
      />
      {/* Side transparency gradients at 1920px+ */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 pointer-events-none opacity-0 min-[1920px]:opacity-100"
        style={{ background: CONTACT_SIDE_GRADIENT_LEFT }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-1/3 pointer-events-none opacity-0 min-[1920px]:opacity-100"
        style={{ background: CONTACT_SIDE_GRADIENT_RIGHT }}
        aria-hidden
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        <h2
          className="font-hero-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white/95"
          style={{
            textShadow:
              "0 0 20px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          Make Contact
        </h2>
        <p
          className="text-white/85 text-sm sm:text-base max-w-md px-4"
          style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
        >
          Want to work together? Send me a transmission! 👽
        </p>
        <div className="flex flex-col items-center gap-3 lg:mt-5">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <a
              href={EMAIL}
              className="flex items-center gap-2 text-sm sm:text-base text-white/90 hover:text-amber-200/95 transition-colors"
              style={linkStyle}
            >
              <MailIcon size={20} className="flex-shrink-0" />
              <span>{EMAIL_ADDRESS}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex-shrink-0 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              title={copied ? "Copied!" : "Copy email"}
              aria-label={copied ? "Copied!" : "Copy email"}
            >
              {copied ? (
                <>
                  <Check size={18} className="text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Copied!</span>
                </>
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm sm:text-base text-white/90 hover:text-amber-200/95 transition-colors"
            style={linkStyle}
          >
            <Linkedin size={20} className="flex-shrink-0" />
            <span>LinkedIn</span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm sm:text-base text-white/90 hover:text-amber-200/95 transition-colors"
            style={linkStyle}
          >
            <Github size={20} className="flex-shrink-0" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </>
  );
}

/** In-flow section for mobile (and scroll on desktop fallback). */
export function Contact() {
  return (
    <section
      id="contact-section"
      className="relative w-full max-w-[1920px] min-h-[40vh] flex flex-col items-center justify-center pt-16 px-6 pb-0 lg:py-16 mx-auto"
    >
      <ContactContent />
    </section>
  );
}

/** Delay before overlay slide-up so StarrySky elongation is visible first (ms). Exported for scroll-up binding. */
export const CONTACT_OVERLAY_DELAY_MS = 300;

/** Duration of overlay slide up/down (ms). Exported for reverse transition timing. */
export const CONTACT_OVERLAY_TRANSITION_MS = 900;

interface ContactOverlayProps {
  /** When true, overlay slides down and out of view (reverse transition). */
  exiting?: boolean;
  /** Called when the back (chevron) button is clicked to reverse the transition. */
  onBackClick?: () => void;
}

/** Full-viewport overlay for desktop: background slides up from below viewport (or down when exiting). */
export function ContactOverlay({ exiting = false, onBackClick }: ContactOverlayProps) {
  const year = new Date().getFullYear();
  const [inView, setInView] = useState(false);
  const [chevronHidden, setChevronHidden] = useState(false);

  // Forward: after delay, slide up into view
  useEffect(() => {
    if (exiting) return;
    setChevronHidden(false); // show chevron again when transitioning to contact
    const id = setTimeout(() => setInView(true), CONTACT_OVERLAY_DELAY_MS);
    return () => clearTimeout(id);
  }, [exiting]);

  // Reverse: when exiting becomes true, hide chevron immediately and slide down out of view
  useEffect(() => {
    if (exiting) {
      setChevronHidden(true);
      setInView(false);
    }
  }, [exiting]);

  const handleBackClick = () => {
    setChevronHidden(true);
    onBackClick?.();
  };

  return (
    <div className="fixed inset-0 z-20 overflow-hidden pointer-events-auto">
      {/* Sliding panel: up from below (forward) or down and out (reverse); max 1920px centered */}
      <div
        className="absolute inset-0 w-full max-w-[1920px] h-full left-1/2 -translate-x-1/2 flex flex-col items-center justify-center py-16 px-6"
        style={{
          transform: inView
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(100%)",
          transition: `transform ${CONTACT_OVERLAY_TRANSITION_MS}ms cubic-bezier(0.25, 0.9, 0.45, 1)`,
        }}
      >
        {/* Bouncing upward chevron - top center, hide immediately on click */}
        {onBackClick && !chevronHidden && (
          <button
            type="button"
            onClick={handleBackClick}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{
              animation: "contact-chevron-bounce 2s ease-in-out infinite",
              boxShadow: "0 0 20px rgba(255,255,255,0.15)",
            }}
            aria-label="Back"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
          </button>
        )}
        <style>{`
          @keyframes contact-chevron-bounce {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -8px); }
          }
        `}</style>
        <ContactContent />
      </div>
    </div>
  );
}
