import Link from "next/link";
import { Bell, BriefcaseBusiness, ClipboardList, LayoutDashboard, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { SignOutButton } from "@/components/sign-out-button";
import type { Profile } from "@/lib/types";

const roleNavigation = {
  brand: [
    { href: "/brand/campaigns", label: "Campaigns", icon: BriefcaseBusiness },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  creator: [
    { href: "/creator/campaigns", label: "Find campaigns", icon: BriefcaseBusiness },
    { href: "/creator/applications", label: "My applications", icon: ClipboardList },
    { href: "/creator/profile", label: "Creator profile", icon: UserRound },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
};

export function AppShell({ profile, unread = 0, children }: { profile: Profile; unread?: number; children: React.ReactNode }) {
  const initials = profile.display_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="app-shell">
      <aside className="app-nav">
        <BrandMark href={profile.role === "brand" ? "/brand/campaigns" : profile.role === "creator" ? "/creator/campaigns" : "/admin"} />
        <nav className="nav-list" aria-label="Main navigation">
          {roleNavigation[profile.role].map(({ href, label, icon: Icon }) => (
            <Link className="nav-link" href={href} key={href}><Icon size={18} aria-hidden="true" />{label}{label === "Notifications" && unread > 0 ? <span className="badge" aria-label={`${unread} unread`}>{unread > 99 ? "99+" : unread}</span> : null}</Link>
          ))}
        </nav>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <span className="eyebrow">{profile.role} workspace</span>
          <div className="cluster">
            <div className="user-chip"><span className="avatar" aria-hidden="true">{initials}</span><span><strong>{profile.display_name}</strong><small className="muted" style={{ display: "block" }}>{profile.role}</small></span></div>
            <SignOutButton />
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
