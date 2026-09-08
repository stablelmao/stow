import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Stow home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>stow</span>
    </Link>
  );
}

