// app/events/create/page.jsx
// OR pages/events/create.jsx  — works for both App Router and Pages Router

import EventCreationWizard from "@/components/EventCreationWizard";

export const metadata = {
  title: "Create Event | YourApp",
  description: "Plan your perfect event step by step",
};

export default function CreateEventPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "32px 16px" }}>
      <EventCreationWizard />
    </main>
  );
}
