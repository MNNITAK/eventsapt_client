/**
 * app/event-wizard/[eventType]/steps/page.jsx
 *
 * Route: /event-wizard/:eventType/steps?node=:eventUID
 *
 * Server component — guards the eventType, then hands off to the
 * client component EventStepsList which reads the Zustand draft.
 */

import { notFound } from 'next/navigation';
import { EVENT_STEPS } from '@/features/event/event-wizard/config/eventSteps.js';
import EventStepsList from '@/features/event/event-wizard/components/EventStepsList.jsx';

export async function generateMetadata({ params }) {
  const meta = EVENT_STEPS[params.eventType];
  if (!meta) return {};
  return {
    title: `Plan your ${meta.label} | EventApp`,
    description: meta.description,
  };
}

export default function EventStepsPage({ params, searchParams }) {
  const { eventType } = params;
  const eventUID      = searchParams?.node ?? '';

  if (!EVENT_STEPS[eventType]) notFound();
  if (!eventUID) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <EventStepsList eventType={eventType} eventUID={eventUID} />
    </main>
  );
}
