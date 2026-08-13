import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Lucen handles your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="9 July 2026">
      <p>
        This policy explains what we collect, why, and what we do with it. We
        collect as little as we can to run the service and we don&apos;t sell
        your data.
      </p>

      <LegalSection heading="What we collect">
        <ul className="ml-4 list-disc space-y-1.5 marker:text-faint">
          <li>
            <strong className="text-bone">Account data</strong> — your email
            address and, if you sign in with Google, your basic profile (name).
            Handled by our authentication provider, Supabase.
          </li>
          <li>
            <strong className="text-bone">Billing data</strong> — managed by
            Stripe. We store your Stripe customer and subscription identifiers
            and status; we never see or store your card number.
          </li>
          <li>
            <strong className="text-bone">Usage data</strong> — which items you
            download, so we can show your history and understand what&apos;s
            useful.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          To authenticate you, provide access to content you&apos;re entitled
          to, process subscriptions, show your account and download history, and
          improve the library. That&apos;s it. We don&apos;t run advertising and
          we don&apos;t sell or rent your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Who processes your data">
        <ul className="ml-4 list-disc space-y-1.5 marker:text-faint">
          <li>
            <strong className="text-bone">Supabase</strong> — database, auth and
            file storage.
          </li>
          <li>
            <strong className="text-bone">Stripe</strong> — payments and billing.
          </li>
          <li>
            <strong className="text-bone">Vercel</strong> — hosting and delivery.
          </li>
        </ul>
        <p>
          Each processes data on our behalf under their own security and privacy
          commitments.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies">
        <p>
          We use a small number of essential cookies to keep you signed in and
          to run checkout securely. We don&apos;t use advertising or
          cross-site tracking cookies.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can access and update your details from your account, and you can
          ask us to delete your account and associated personal data at any
          time. Some records may be retained where we&apos;re legally required to
          keep them (for example billing records).
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For any privacy question or a deletion request, email{" "}
          <a
            href="mailto:privacy@lucen.ai"
            className="text-muted underline-offset-2 hover:text-bone hover:underline"
          >
            privacy@lucen.ai
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
