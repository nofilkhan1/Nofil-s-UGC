import Link from "next/link";
import { Sparkles } from "lucide-react";

export function BrandMark({ href = "/" }: { href?: string }) {
  return <Link href={href} className="brand-mark"><span className="brand-mark__icon"><Sparkles size={17} aria-hidden="true" /></span>CreatorDock</Link>;
}
