"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { SocialPlatformIcon } from "@/components/social-platform-icon";
import { EmptyState } from "@/components/empty-state";
import { inviteCreatorAction } from "@/app/actions";
import { useActionState } from "react";
import { initialActionState } from "@/lib/action-state";
import type { Niche } from "@/lib/niches";

export type DiscoverCreator = { id: string; display_name: string; creator_profiles: Array<{ bio: string | null; portfolio_url: string | null; instagram_handle: string | null; tiktok_handle: string | null; top_content_links?: string[]; niches: Niche[] }> };
type LiveCampaign = { id: string; title: string };

function InviteButton({ creator, campaigns }: { creator: DiscoverCreator; campaigns: LiveCampaign[] }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(inviteCreatorAction, initialActionState);
  if (!campaigns.length) return <button className="button button--secondary" type="button" disabled title="Publish a campaign first">Invite to campaign</button>;
  return <div className="invite-control"><button className="button button--primary" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Invite to campaign</button>{open ? <div className="invite-menu panel"><strong>Choose a live campaign</strong>{campaigns.map((campaign) => <form action={action} key={campaign.id}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="campaignId" value={campaign.id} /><button className="invite-menu__item" type="submit" onClick={() => setOpen(false)}>{campaign.title}</button></form>)}{state.message ? <p className={state.status === "error" ? "field__error" : "field__hint"} role="status">{state.message}</p> : null}</div> : null}</div>;
}

export function CreatorDiscover({ creators, campaigns, niches }: { creators: DiscoverCreator[]; campaigns: LiveCampaign[]; niches: readonly Niche[] }) {
  const [search, setSearch] = useState("");
  const [activeNiches, setActiveNiches] = useState<Niche[]>([]);
  const visible = useMemo(() => creators.filter((creator) => { const profile = creator.creator_profiles[0]; const query = search.trim().toLocaleLowerCase(); return (!query || `${creator.display_name} ${profile.bio ?? ""}`.toLocaleLowerCase().includes(query)) && (!activeNiches.length || activeNiches.some((niche) => profile.niches.includes(niche))); }), [activeNiches, creators, search]);
  return <div className="stack"><div className="discover-toolbar"><div className="field"><label className="field__label" htmlFor="creator-search">Search creators</label><div className="search-field"><Search size={17} aria-hidden="true" /><input id="creator-search" className="input" type="search" value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Search name or bio" /></div></div></div><div className="niche-badges" aria-label="Filter creators by category">{niches.map((niche) => <button className={`badge ${activeNiches.includes(niche) ? "badge--active" : ""}`} type="button" key={niche} onClick={() => setActiveNiches((current) => current.includes(niche) ? current.filter((item) => item !== niche) : [...current, niche])}>{niche}</button>)}</div>{visible.length ? <div className="creator-grid">{visible.map((creator) => { const profile = creator.creator_profiles[0]; return <article className="panel creator-card" key={creator.id}><div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><div><h2 className="section-title">{creator.display_name}</h2><div className="niche-badges">{profile.niches.map((niche) => <span className="badge" key={niche}>{niche}</span>)}</div></div><InviteButton creator={creator} campaigns={campaigns} /></div>{profile.bio ? <p className="creator-card__bio">{profile.bio}</p> : null}<div className="cluster creator-card__links">{profile.portfolio_url ? <a href={profile.portfolio_url} target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" /> Portfolio</a> : null}{profile.instagram_handle ? <a href={`https://instagram.com/${profile.instagram_handle}`} target="_blank" rel="noreferrer"><SocialPlatformIcon platform="instagram" /> @{profile.instagram_handle}</a> : null}{profile.tiktok_handle ? <a href={`https://tiktok.com/@${profile.tiktok_handle}`} target="_blank" rel="noreferrer"><SocialPlatformIcon platform="tiktok" /> @{profile.tiktok_handle}</a> : null}</div>{profile.top_content_links?.filter(Boolean).length ? <div className="cluster creator-card__links"><strong className="muted">Top content</strong>{profile.top_content_links.filter(Boolean).map((url, index) => <a href={url} target="_blank" rel="noreferrer" key={url}>Top video {index + 1}</a>)}</div> : null}</article>; })}</div> : <EmptyState title="No creator profiles yet — check back soon." message={search || activeNiches.length ? "Try a different search or category." : "Creators with completed profiles will appear here."} action={search ? <button className="button button--secondary" type="button" onClick={() => setSearch("")}>Clear search</button> : undefined} />}</div>;
}
