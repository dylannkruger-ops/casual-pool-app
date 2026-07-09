import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms of service for using Lucen.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="9 July 2026">
      <p>
        These terms govern your use of Lucen. By creating an account or using
        the service you agree to them. If you don&apos;t agree, please
        don&apos;t use Lucen.
      </p>

      <LegalSection heading="Your account">
        <p>
          You&apos;re responsible for activity under your account and for keeping
          your sign-in secure. Sign-in is by email link or Google — there&apos;s
          no password to leak, but keep your inbox secure. Accounts are for a
          single person or organisation; don&apos;t share access to sidestep
          subscriptions.
        </p>
      </LegalSection>

      <LegalSection heading="Subscriptions and billing">
        <p>
          Pro is billed monthly or annually through Stripe. Subscriptions renew
          automatically until cancelled. You can cancel anytime from the
          customer portal in your account; access continues until the end of the
          period you&apos;ve already paid for. Annual plans include two months
          free versus monthly.
        </p>
        <p>
          If a payment fails we&apos;ll keep your access active for a short grace
          period while the payment retries. If it can&apos;t be recovered, the
          subscription lapses and premium content locks.
        </p>
      </LegalSection>

      <LegalSection heading="Refunds">
        <p>
          Because you can preview every item and use free items before
          subscribing, we don&apos;t offer refunds for change of mind. If
          something is genuinely broken, email us and we&apos;ll make it right.
          This doesn&apos;t affect your rights under the Australian Consumer Law.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Don&apos;t attempt to bypass the access controls that gate premium
          prompts and assets, scrape the service, or redistribute unlocked
          content. What you may do with the output you build is covered by the{" "}
          <Link
            href="/licence"
            className="text-muted underline-offset-2 hover:text-bone hover:underline"
          >
            licence
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Content and availability">
        <p>
          The library changes over time — items are added, revised and
          occasionally retired. We aim to keep the service available but
          don&apos;t guarantee uninterrupted access. Prompts and assets are
          provided as-is, as described in the licence.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <p>
          We may update these terms as the service evolves. Material changes will
          be reflected in the &ldquo;last updated&rdquo; date above and, where
          significant, flagged in-product. Continued use after a change means you
          accept it.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a
            href="mailto:hello@lucen.ai"
            className="text-muted underline-offset-2 hover:text-bone hover:underline"
          >
            hello@lucen.ai
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
