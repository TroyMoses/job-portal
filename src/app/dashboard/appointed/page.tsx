"use client";

import { AppointedBrowser } from "../_components/appointed-browser";

export default function AppointedPage() {
  return (
    <div>
      <AppointedBrowser title="Appointed Applicants" appointedOnly />
    </div>
  );
}
