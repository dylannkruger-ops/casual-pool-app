import { useState } from 'react';
import { useMote } from '../store/useMote';
import { Button, Card, Chip, ComingLabel, PageHead, Row, Toggle } from '../components/ui';

export function Settings() {
  const {
    discreet,
    toggleDiscreet,
    telemetry,
    toggleTelemetry,
    retentionDays,
    setRetention,
    blocklist,
    addBlock,
    removeBlock,
  } = useMote();
  const [draft, setDraft] = useState('');

  return (
    <>
      <PageHead title="Settings" sub="Everything MOTE keeps, and everything it is allowed to look at." />

      <div className="grid gap-4 2xl:grid-cols-2">
        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-ink/35">
            The widget
          </div>
          <Row
            title="Discreet mode"
            sub="Hides step captions on shared screens. States still show; the kill switch still works."
            right={<Toggle on={discreet} onChange={toggleDiscreet} label="Discreet mode" />}
          />
          <Row
            title="Hold my screen during desk runs"
            sub="Dims the screen behind the face so work in progress isn't readable over your shoulder."
            right={<ComingLabel when="v1.0" />}
          />
        </Card>

        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-ink/35">
            Data
          </div>
          <Row
            title="Keep run logs for"
            sub="Applies to steps and step screenshots alike. Deleting is real deletion."
            right={
              <select
                value={retentionDays}
                onChange={(e) => setRetention(Number(e.target.value))}
                className="h-9 rounded-lg border border-line bg-surface px-3 text-[13px]"
              >
                {[7, 14, 30, 90].map((d) => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </select>
            }
          />
          <Row
            title="Share anonymous product telemetry"
            sub="Run outcomes, latency buckets, crashes. Never screen content, never anything from the apps your team touches."
            right={<Toggle on={telemetry} onChange={toggleTelemetry} label="Telemetry" />}
          />
          <Row
            title="Ambient screen memory"
            sub="Searchable local history of what was on screen. Off unless you turn it on, and it never leaves this machine."
            right={<ComingLabel />}
          />
          <Row
            title="Export or delete everything"
            sub="Your data is never held hostage — export works even on a lapsed plan."
            right={
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  Export
                </Button>
                <Button size="sm" variant="quiet">
                  Delete all
                </Button>
              </div>
            }
          />
        </Card>

        <Card className="px-5 py-1 2xl:col-span-2">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-ink/35">
            Never look here
          </div>
          <div className="py-4">
            <p className="mb-3.5 text-[13px] muted">
              Apps and URL patterns MOTE will not capture — not for the model, and not for your own
              logs. Password fields are excluded everywhere, always, whatever this list says.
            </p>
            <div className="mb-3.5 flex flex-wrap gap-2">
              {blocklist.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 rounded-full bg-sunk px-3 py-1.5 text-[12.5px]"
                >
                  <span className="font-mono">{b}</span>
                  <button
                    onClick={() => removeBlock(b)}
                    className="text-ink/35 hover:text-ink"
                    aria-label={`Remove ${b}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addBlock(draft.trim());
                setDraft('');
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="app name or *.example.com"
                className="h-10 flex-1 rounded-full border border-line bg-surface px-4 text-[13.5px] placeholder:text-ink/30"
              />
              <Button size="sm">Add</Button>
            </form>
          </div>
        </Card>

        <Card className="px-5 py-1 2xl:col-span-2">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-ink/35">
            This machine
          </div>
          <Row title="Desk shift" sub="Runs execute here, one at a time. Touch the mouse or keyboard and the run pauses." right={<Chip tone="good">Ready</Chip>} />
          <Row
            title="Cloud shift"
            sub="Connector and browser steps running while this machine is off. The cloud never sees this screen."
            right={<ComingLabel />}
          />
          <Row title="Registered machines" sub="Studio covers 3. Revoke any of them from here." right={<Chip tone="quiet">1 of 1</Chip>} />
        </Card>
      </div>
    </>
  );
}
