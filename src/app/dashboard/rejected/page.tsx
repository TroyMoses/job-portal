"use client";

import { RejectedBrowser } from "../_components/rejected-browser";

export default function FavoritesPage() {
  return (
    <div>
      <RejectedBrowser title="Rejected Applications" rejectedOnly />
    </div>
  );
}
