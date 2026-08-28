"use client";
import { useState } from "react";
import { NICHES, type Niche } from "@/lib/niches";

export function NichePicker({ selected = [], limit, error }: { selected?: Niche[]; limit: number; error?: string }) {
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>(selected);
  return <fieldset className="niche-picker"><legend>Categories <span className="muted">(choose 1–{limit})</span></legend><div className="niche-picker__options">{NICHES.map((niche) => { const checked = selectedNiches.includes(niche); return <label className="niche-pill" key={niche}><input type="checkbox" name="niches" value={niche} checked={checked} disabled={!checked && selectedNiches.length >= limit} onChange={(event) => setSelectedNiches((current) => event.currentTarget.checked ? [...current, niche] : current.filter((item) => item !== niche))} />{niche}</label>; })}</div>{error ? <p className="field__error" role="alert">{error}</p> : null}</fieldset>;
}
