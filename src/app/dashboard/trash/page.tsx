"use client";

import { JobBrowser } from "../_components/job-browser";

export default function FavoritesPage() {
  return (
    <div>
      <JobBrowser title="Trash" deletedOnly />
    </div>
  );
}
