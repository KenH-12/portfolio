export const HERO_INTRO_DURATIONS = {
  LIGHTSPEED_MS: 2000,
  /** Delay before the solar scale-up animation starts (solar stays at scale 0 during this). */
  SOLAR_SCALE_DELAY_MS: 800,
  SOLAR_MS: 1400,
  CONTENT_MS: 800,
} as const;

export const CONTENT_FADE_DELAY_MS =
  HERO_INTRO_DURATIONS.SOLAR_SCALE_DELAY_MS + HERO_INTRO_DURATIONS.LIGHTSPEED_MS + 800;
