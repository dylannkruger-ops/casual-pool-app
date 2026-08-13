import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Licence",
  description:
    "The commercial licence covering output built from Lucen prompts and asset bundles.",
};

export default function LicencePage() {
  return (
    <LegalPage title="Commercial licence" updated="9 July 2026">
      <p>
        This licence covers what you may do with the build prompts, asset
        bundles and the websites, components and scenes you create using them
        (together, the &ldquo;output&rdquo;). Plain-English summary first, then
        the specifics. Where this summary and the detail differ, the detail
        governs.
      </p>

      <LegalSection heading="In short">
        <p>
          Build whatever you like with a Lucen prompt and ship it commercially.
          Don&apos;t resell or redistribute the prompts and asset bundles
          themselves, and don&apos;t pass Lucen off as your own product.
        </p>
      </LegalSection>

      <LegalSection heading="What you may do">
        <ul className="ml-4 list-disc space-y-1.5 marker:text-faint">
          <li>
            Use the output in unlimited personal and commercial projects,
            including paid client work and products you sell.
          </li>
          <li>
            Modify the output freely and combine it with your own code, content
            and assets.
          </li>
          <li>
            Deploy the resulting sites and applications to any host, for any
            number of end users.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="What you may not do">
        <ul className="ml-4 list-disc space-y-1.5 marker:text-faint">
          <li>
            Redistribute, resell, sublicense or publish the build prompts or
            asset bundles themselves, in whole or in substantial part.
          </li>
          <li>
            Create a product that competes with Lucen by repackaging its prompts
            or assets as a library, template pack or marketplace listing.
          </li>
          <li>
            Share your account or unlocked content with people outside your
            organisation to avoid separate subscriptions.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Bundled third-party assets">
        <p>
          Some asset bundles include third-party resources (for example fonts or
          textures) under their own licences. Where that is the case, the
          bundle names the resource and its licence, and that licence governs
          your use of that resource. Everything Lucen authors is covered by this
          licence.
        </p>
      </LegalSection>

      <LegalSection heading="Ownership">
        <p>
          You own the output you create and any content you add. Lucen retains
          all rights in the prompts, asset bundles and the Lucen name and marks.
          This licence grants you a right to use, not ownership of, the prompts
          and bundles.
        </p>
      </LegalSection>

      <LegalSection heading="Warranty and liability">
        <p>
          The prompts and assets are provided &ldquo;as is&rdquo;, without
          warranty of any kind. To the extent permitted by law, Lucen is not
          liable for any loss arising from their use. Nothing here excludes
          rights you have under the Australian Consumer Law that cannot be
          excluded.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          If you&apos;re unsure whether a use is covered — an unusual
          redistribution case, an agency arrangement, an OEM deal — email{" "}
          <a
            href="mailto:hello@lucen.ai"
            className="text-muted underline-offset-2 hover:text-bone hover:underline"
          >
            hello@lucen.ai
          </a>{" "}
          and we&apos;ll give you a straight answer.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
