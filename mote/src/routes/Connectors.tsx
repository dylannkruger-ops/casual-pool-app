import { useState } from 'react';
import { useMote } from '../store/useMote';
import { SUGGESTED_MCP } from '../data/connectors';
import { Field, Modal, inputClass } from '../components/Modal';
import { Button, Card, Chip, PageHead } from '../components/ui';
import type { Connector } from '../lib/types';

/**
 * One row per connector rather than a card each. The permission list is the
 * important part, but as a stack of bulleted cards it turned eight connectors
 * into a page you had to scroll through twice.
 */
function ConnectorRow({ c }: { c: Connector }) {
  const { toggleConnector, removeConnector } = useMote();

  return (
    <li className="flex flex-col gap-3 border-b hairline p-4 last:border-0 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-medium">{c.name}</span>
          {c.kind === 'mcp' && <Chip tone="quiet">MCP</Chip>}
          <span className="text-[12.5px] muted">{c.category}</span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/65">{c.blurb}</p>

        {/* Declared up front, enforced at runtime (FR-37). */}
        <p className="mt-1.5 text-[12px] muted">
          <span className="text-ink/40">May: </span>
          {c.permissions.join(' · ')}
        </p>
        {c.url && <p className="mt-1 truncate font-mono text-[11.5px] text-ink/40">{c.url}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {c.custom && (
          <Button size="sm" variant="quiet" onClick={() => removeConnector(c.id)}>
            Remove
          </Button>
        )}
        <Button size="sm" variant={c.connected ? 'ghost' : 'primary'} onClick={() => toggleConnector(c.id)}>
          {c.connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </li>
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
      permissions: perms.split(',').map((p) => p.trim()).filter(Boolean),
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
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Warehouse MCP" aria-label="Server name" className={inputClass} />
      </Field>
      <Field label="Server URL">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://mcp.example.com/warehouse" aria-label="Server URL" className={`${inputClass} font-mono text-[12.5px]`} />
      </Field>
      <Field label="Access token (optional)">
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Leave empty for an open server" aria-label="Access token" className={inputClass} />
      </Field>
      <Field label="What it may do (comma separated)">
        <input value={perms} onChange={(e) => setPerms(e.target.value)} placeholder="Reads stock levels, Reads order status" aria-label="Declared permissions" className={inputClass} />
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
        sub="When an app has an API, your team uses it instead of clicking through the screen — faster, cheaper, more reliable. When it doesn't, they fall back to the accessibility tree, then to vision."
        action={<Button onClick={() => setAdding(true)}>Add MCP server</Button>}
      />

      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink/35">
        Connected · {connected.length}
      </h2>
      <Card className="mb-6 overflow-hidden">
        <ul>
          {connected.map((c) => (
            <ConnectorRow key={c.id} c={c} />
          ))}
        </ul>
      </Card>

      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink/35">
        Available · {available.length}
      </h2>
      <Card className="mb-6 overflow-hidden">
        <ul>
          {available.map((c) => (
            <ConnectorRow key={c.id} c={c} />
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h3 className="text-[14px] font-semibold tracking-tight">Bring your own server</h3>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink/70">
          MOTE speaks MCP, so anything you can expose as an MCP server becomes something your team
          can use — your database, your internal tools, the thing only your company has. There is no
          per-app integration to wait for.
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {SUGGESTED_MCP.map((m) => (
            <span
              key={m.name}
              title={m.blurb}
              className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink/65"
            >
              {m.name}
            </span>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
            Add yours
          </Button>
        </div>
      </Card>

      <AddMcpDialog open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
