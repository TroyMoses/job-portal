"use client";

import { ShortListBrowser } from "../_components/shortlist-browser";

export default function FavoritesPage() {
  return (
    <div>
      <ShortListBrowser title="Shortlisted Applications" shortlistedOnly />
    </div>
  );
}
