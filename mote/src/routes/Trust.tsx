import { Card, PageHead } from '../components/ui';

/**
 * The commitments, in-app and verbatim (PRD §12.1). Every absolute claim
 * carries its exceptions in the same breath — a footnote that contradicts a
 * headline later is the failure mode this page exists to avoid.
 */
const COMMITMENTS: { title: string; body: string; exceptions?: string[] }[] = [
  {
    title: 'Your screen stays on your machine',
    body: 'During a run, the model receives extracted text and element descriptions for the task at hand. No frame streaming, no background capture. Three things can carry an image off this machine, and you trigger all three:',
    exceptions: [
      'The redacted step screenshot inside an approval request you asked to receive elsewhere.',
      'A run log you choose to export or send to support.',
      'A builder recording you record and consent to send for review, per recording. (Builder is coming in v1.5.)',
    ],
  },
  {
    title: 'Memory and logs are local and encrypted',
    body: 'Encrypted at rest, with the key held in your operating system credential store and tied to your OS login. There is no cloud copy. That also means: if you lose your OS account, this data is unrecoverable — we cannot restore it for you.',
  },
  {
    title: 'Redaction by default',
    body: 'Password fields are never captured. A maintained blocklist covers banking and health domains, and you can add your own apps and URL patterns. Redaction applies to what the model sees and to what gets stored in your own logs.',
  },
  {
    title: 'Every run is auditable',
    body: 'Step by step, with the execution layer and the verification result on each line. Exportable as PDF or JSON, deletable per run, per employee, or all at once. Deletion removes the screenshots too.',
  },
  {
    title: 'Kill switch',
    body: 'Esc, or click the face. It halts mid-action, in every state, including a cloud run. Discreet mode never blocks it.',
  },
  {
    title: 'No credentials taken from your computer',
    body: 'On this machine, employees work inside sessions you are already signed into — they never ask for, store, or read your passwords. One labelled exception:',
    exceptions: [
      'Logins you explicitly provision for your own cloud browser are stored encrypted, listed in plain sight, and revocable in one click. Nothing is ever sourced from this machine. (Cloud shift is coming in v1.5.)',
    ],
  },
  {
    title: 'The cloud shift never sees your screen',
    body: 'Cloud sessions run isolated, per user, and touch only cloud-native surfaces. There is no route from a cloud session to this desktop.',
  },
  {
    title: 'Our threat model is public',
    body: 'What MOTE defends against, and what it honestly cannot — including the one that matters: anyone with your unlocked session already has your powers. MOTE does not expand them, and red actions still require a person to confirm.',
  },
];

export function Trust() {
  return (
    <>
      <PageHead
        title="What we promise, and where it stops"
        sub="MOTE works on your screen, so it is built to keep your screen to yourself. Each commitment carries its own exceptions — there are no footnotes elsewhere."
      />

      <div className="grid gap-4 2xl:grid-cols-2">
        {COMMITMENTS.map((c, i) => (
          <Card key={c.title} className="p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[12px] tabular-nums text-shell-ink/25">{i + 1}</span>
              <h3 className="text-[15px] font-semibold tracking-tight">{c.title}</h3>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-shell-ink/70">{c.body}</p>
            {c.exceptions && (
              <ul className="mt-3 space-y-2 border-t hairline pt-3">
                {c.exceptions.map((e) => (
                  <li key={e} className="flex gap-2.5 text-[13px] text-shell-ink/60">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-crown" />
                    {e}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
