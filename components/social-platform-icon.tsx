type SocialPlatformIconProps = { platform: "instagram" | "tiktok"; size?: number };

/** Consistent, monochrome platform marks for creator social links. */
export function SocialPlatformIcon({ platform, size = 15 }: SocialPlatformIconProps) {
  if (platform === "instagram") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M14.5 3h3.1c.2 1.5 1 2.8 2.4 3.6.6.4 1.3.6 2 .7v3.2a8.4 8.4 0 0 1-4.4-1.3v6.3a5.5 5.5 0 1 1-4.7-5.4v3.3a2.3 2.3 0 1 0 1.6 2.1V3Z" />
    </svg>
  );
}
