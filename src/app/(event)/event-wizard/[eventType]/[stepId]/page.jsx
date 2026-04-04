/**
 * app/event-wizard/[eventType]/[stepId]/page.jsx
 *
 * Route: /event-wizard/:eventType/:stepId?node=:eventUID
 *
 * Server component shell — resolves step config and renders WizardShell.
 * All draft / state logic lives in the client WizardShell.
 *
 * To add the real form for a step, import its component here and
 * pass it as the StepForm prop. Until then, WizardShell shows a
 * field-list placeholder so you can see what needs building.
 *
 * Example:
 *   import BasicInfoStep from '@/components/steps/BasicInfoStep';
 *   const STEP_FORMS = { 'basic-info': BasicInfoStep, ... };
 */

import { notFound } from 'next/navigation';
import {
  EVENT_STEPS,
  getStep,
  getStepsForEvent,
  getStepIndex,
  getNextStepId,
  getPrevStepId,
} from '@/features/event/event-wizard/config/eventSteps.js';
import WizardShell from '@/features/event/event-wizard/components/WizardShell.jsx';

// ── Map step id → real form component (add as you build each step) ──────────
 import BasicInfoStep       from '@/features/event/event-wizard/components/steps/BasicInfoStep.jsx';
// import DateTimeStep        from '@/components/steps/DateTimeStep';
// import VenueStep           from '@/components/steps/VenueStep';
// import GuestListStep       from '@/components/steps/GuestListStep';
// import BudgetStep          from '@/components/steps/BudgetStep';
// import VendorsStep         from '@/components/steps/VendorsStep';
// import CateringStep        from '@/components/steps/CateringStep';
// import DecorStep           from '@/components/steps/DecorStep';
// import EntertainmentStep   from '@/components/steps/EntertainmentStep';
// import InvitationsStep     from '@/components/steps/InvitationsStep';
// import TransportStep       from '@/components/steps/TransportStep';
// import PhotographyStep     from '@/components/steps/PhotographyStep';
// import ReviewStep          from '@/components/steps/ReviewStep';
// — wedding-specific —
// import WeddingDetailsStep  from '@/components/steps/WeddingDetailsStep';
// import CeremonyStep        from '@/components/steps/CeremonyStep';
// import AttireStep          from '@/components/steps/AttireStep';
// import HoneymoonStep       from '@/components/steps/HoneymoonStep';
// — birthday-specific —
// import BirthdayDetailsStep from '@/components/steps/BirthdayDetailsStep';
// import CakeStep            from '@/components/steps/CakeStep';
// — corporate-specific —
// import CorporateDetailsStep from '@/components/steps/CorporateDetailsStep';
// import AgendaStep           from '@/components/steps/AgendaStep';
// import AvTechStep           from '@/components/steps/AvTechStep';
// import BrandingStep         from '@/components/steps/BrandingStep';

const STEP_FORMS = {
   'basic-info': BasicInfoStep,
  // 'date-time':  DateTimeStep,
  // ... add as you build
};

export async function generateMetadata({ params }) {
  const step = getStep(params.eventType, params.stepId);
  if (!step) return {};
  return { title: `${step.label} | EventApp` };
}

export default function StepPage({ params, searchParams }) {
  const { eventType, stepId } = params;
  const eventUID = searchParams?.node ?? '';

  const eventMeta  = EVENT_STEPS[eventType];
  const step       = getStep(eventType, stepId);

  if (!eventMeta || !step) notFound();
  if (!eventUID) notFound();

  const allSteps   = getStepsForEvent(eventType);
  const stepIndex  = getStepIndex(eventType, stepId);
  const nextStepId = getNextStepId(eventType, stepId);
  const prevStepId = getPrevStepId(eventType, stepId);
  const StepForm   = STEP_FORMS[stepId] ?? null;

  return (
    <WizardShell
      eventType={eventType}
      eventUID={eventUID}
      allSteps={allSteps}
      currentStep={step}
      stepIndex={stepIndex}
      nextStepId={nextStepId}
      prevStepId={prevStepId}
      StepForm={StepForm}
    />
  );
}
