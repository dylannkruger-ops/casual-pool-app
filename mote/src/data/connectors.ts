import type { Connector } from '../lib/types';

/**
 * Connectors are layer 1 — the fastest, cheapest, most reliable way to do a
 * step (PRD §5.4). Everything here is one MCP client under the hood, so a
 * custom server gets exactly the same treatment as a first-party app.
 *
 * Permissions are declared, shown before you connect, and enforced at runtime.
 */
export const CONNECTORS: Connector[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    kind: 'app',
    category: 'Mail',
    blurb: 'Read threads, draft replies. Sending still needs your yes.',
    connected: true,
    auth: 'oauth',
    permissions: ['Reads mail', 'Creates drafts', 'Never sends without approval'],
  },
  {
    id: 'gsheets',
    name: 'Google Sheets',
    kind: 'app',
    category: 'Spreadsheets',
    blurb: 'Read and append rows without driving the browser.',
    connected: true,
    auth: 'oauth',
    permissions: ['Reads sheets', 'Appends rows', 'Never deletes'],
  },
  {
    id: 'xero',
    name: 'Xero',
    kind: 'app',
    category: 'Accounting',
    blurb: 'Invoices and contacts for reconcile work.',
    connected: true,
    auth: 'oauth',
    permissions: ['Reads invoices', 'Reads contacts', 'No payment access'],
  },
  {
    id: 'slack',
    name: 'Slack',
    kind: 'app',
    category: 'Messaging',
    blurb: 'Post run reports to a channel you pick.',
    connected: false,
    auth: 'oauth',
    permissions: ['Posts to one channel', 'Reads nothing else'],
  },
  {
    id: 'notion',
    name: 'Notion',
    kind: 'app',
    category: 'Docs',
    blurb: 'File briefs and reports into a database.',
    connected: false,
    auth: 'oauth',
    permissions: ['Reads pages', 'Creates pages'],
  },
  {
    id: 'drive',
    name: 'Google Drive',
    kind: 'app',
    category: 'Files',
    blurb: 'Find and file documents by name.',
    connected: false,
    auth: 'oauth',
    permissions: ['Reads files', 'Uploads files'],
  },
  {
    id: 'stripe-read',
    name: 'Stripe (read-only)',
    kind: 'app',
    category: 'Payments data',
    blurb: 'Payout and invoice data for reconciles. Read-only by design.',
    connected: false,
    auth: 'oauth',
    permissions: ['Reads charges and payouts', 'Cannot move money — ever'],
  },
  {
    id: 'mcp-warehouse',
    name: 'Warehouse MCP',
    kind: 'mcp',
    category: 'Custom',
    blurb: 'Our own stock service. Added as an MCP server.',
    connected: true,
    custom: true,
    url: 'https://mcp.halden.internal/warehouse',
    auth: 'token',
    permissions: ['Reads stock levels', 'Reads order status'],
    tools: ['stock.lookup', 'order.status', 'sku.search'],
  },
];

/** Catalogue rows the user has not added yet — shown under "Available". */
export const SUGGESTED_MCP = [
  { name: 'Postgres MCP', url: 'https://…/postgres', blurb: 'Query a database directly.' },
  { name: 'Linear MCP', url: 'https://…/linear', blurb: 'Read and file issues.' },
  { name: 'Shopify MCP', url: 'https://…/shopify', blurb: 'Orders, products, inventory.' },
];
