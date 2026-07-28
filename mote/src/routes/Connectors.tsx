import { useState } from 'react';
import { useMote } from '../store/useMote';
import { SUGGESTED_MCP } from '../data/connectors';
import { Field, Modal, inputClass } from '../components/Modal';
import { Button, Card, Chip, PageHead } from '../components/ui';
import type { Connector } from '../lib/types';

function ConnectorCard({ c }: { c: Connector }) {
  const { toggleConnector, removeConnector } = useMote();
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold tracking-tight">{c.name}</h3>
            {c.kind === 'mcp' && <Chip tone="quiet">MCP</Chip>}
            {c.connected && <Chip tone="good">Connected</Chip>}
          </div>
          <p className="mt-1 text-[13px] muted">{c.category}</p>
        </div>
      </div>

      <p className="mt-2.5 text-[13.5px] leading-relaxed text-shell-ink/70">{c.blurb}</p>

      {c.url && <p className="mt-2 truncate font-mono text-[12px] muted">{c.url}</p>}

      <div className="mt-3.5 border-t hairline pt-3.5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
          What it may do
        </p>
        <ul className="space-y-1.5">
          {c.permissions.map((p) => (
            <li key={p} className="flex gap-2 text-[12.5px] text-shell-ink/65">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-glow" />
              {p}
            </li>
          ))}
        </ul>
        {c.tools && (
          <p className="mt-2.5 font-mono text-[11.5px] muted">{c.tools.join(' · ')}</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant={c.connected ? 'ghost' : 'primary'} onClick={() => toggleConnector(c.id)}>
          {c.connected ? 'Disconnect' : 'Connect'}
        </Button>
        {c.custom && (
          <Button size="sm" variant="quiet" onClick={() => removeConnector(c.id)}>
            Remove
          </Button>
        )}
      </div>
    </Card>
  );
}

function AddMcpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addMcpServer } = useMote();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [perms, setPerms] = useState('');

  const submit = () => {
    if (!name.trim() || !url.trim()) return;
    addMcpServer({
      name: name.trim(),
      url: url.trim(),
      auth: token.trim() ? 'token' : 'none',
      permissions: perms
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    });
    setName('');
    setUrl('');
    setToken('');
    setPerms('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add an MCP server"
      sub="Any MCP server becomes a connector. Your team will prefer it over driving the screen, because it is faster and more reliable."
      width={520}
    >
      <Field label="Name">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Warehouse MCP"
          aria-label="Server name"
          className={inputClass}
        />
      </Field>
      <Field label="Server URL">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://mcp.example.com/warehouse"
          aria-label="Server URL"
          className={`${inputClass} font-mono text-[12.5px]`}
        />
      </Field>
      <Field label="Access token (optional)">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Leave empty for an open server"
          aria-label="Access token"
          className={inputClass}
        />
      </Field>
      <Field label="What it may do (comma separated)">
        <input
          value={perms}
          onChange={(e) => setPerms(e.target.value)}
          placeholder="Reads stock levels, Reads order status"
          aria-label="Declared permissions"
          className={inputClass}
        />
      </Field>

      <p className="text-[12.5px] muted">
        The token goes into your operating system's credential store, never to MOTE's servers.
        Whatever the server declares here is enforced at runtime — if it asks to do something
        outside this list mid-run, the step halts.
      </p>

      <div className="mt-6 flex items-center gap-2">
        <Button onClick={submit} disabled={!name.trim() || !url.trim()}>
          Add server
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export function Connectors() {
  const { connectors } = useMote();
  const [adding, setAdding] = useState(false);

  const connected = connectors.filter((c) => c.connected);
  const available = connectors.filter((c) => !c.connected);

  return (
    <>
      <PageHead
        title="Connectors"
        sub="When an app has an API, your team uses it instead of clicking through the screen — it is faster, cheaper and more reliable. When it doesn't, they fall back to the accessibility tree, then to vision."
        action={<Button onClick={() => setAdding(true)}>Add MCP server</Button>}
      />

      <h2 className="mb-2.5 mt-1 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
        Connected · {connected.length}
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {connected.map((c) => (
          <ConnectorCard key={c.id} c={c} />
        ))}
      </div>

      <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
        Available
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {available.map((c) => (
          <ConnectorCard key={c.id} c={c} />
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-[15px] font-semibold tracking-tight">Bring your own server</h3>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-shell-ink/70">
          MOTE speaks MCP, so anything you can expose as an MCP server becomes something your team
          can use — your database, your internal tools, the thing only your company has. There is no
          per-app integration to wait for.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED_MCP.map((m) => (
            <span
              key={m.name}
              title={m.blurb}
              className="rounded-full border border-black/[.10] px-3 py-1.5 text-[12.5px] text-shell-ink/70"
            >
              {m.name}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
            Add MCP server
          </Button>
        </div>
      </Card>

      <AddMcpDialog open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
