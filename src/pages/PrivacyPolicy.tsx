import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Helmet>
        <title>Privacy Policy — Rocket</title>
        <meta name="description" content="How Rocket collects, uses, and protects your information." />
        <link rel="canonical" href="https://rocket-technologies.web.app/privacy" />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-ink-700">
        <p>
          This policy explains what information Rocket ("we," "us") collects
          when you visit rocket-technologies.web.app, how we use it, and the
          choices you have.
        </p>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Information we collect
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Contact form:</strong> if you submit our contact form,
              we collect the name, email address, and message you provide.
              This is sent via EmailJS directly to our inbox so we can
              respond to you.
            </li>
            <li>
              <strong>Analytics:</strong> we use Firebase Analytics (built on
              Google Analytics) to understand general site usage — pages
              visited, approximate location, device type, and similar
              aggregate data. This does not identify you personally.
            </li>
            <li>
              <strong>Post view counts:</strong> we track how many times each
              blog post is viewed. This is a simple counter and isn't tied to
              your identity.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> our site may
              use cookies or local browser storage for basic functionality
              (such as avoiding duplicate view counts in a single session)
              and, where advertising is enabled, for ad delivery — see
              "Advertising" below.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Advertising
          </h2>
          <p className="mt-3">
            We may display ads through Google AdSense. Google and its
            partners may use cookies to serve ads based on your visits to
            this and other sites. You can learn more about how Google uses
            data and manage your ad personalization settings at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Third-party services
          </h2>
          <p className="mt-3">We rely on the following third-party services to run this site:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Firebase</strong> (Google) — hosting, database, and
              authentication for site administration.
            </li>
            <li>
              <strong>Cloudinary</strong> — hosting for blog post images.
            </li>
            <li>
              <strong>EmailJS</strong> — delivering messages from our contact
              form to our inbox.
            </li>
            <li>
              <strong>Google AdSense</strong> — serving ads, where enabled.
            </li>
          </ul>
          <p className="mt-3">
            Each of these providers has its own privacy practices governing
            any data that passes through their services.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            How we use information
          </h2>
          <p className="mt-3">
            We use the information above to respond to inquiries, understand
            how visitors use our site so we can improve it, and — where
            enabled — to support advertising that keeps this site free to
            read. We do not sell your personal information.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Your choices
          </h2>
          <p className="mt-3">
            You can use your browser's settings to block or delete cookies.
            If ads are enabled, you can opt out of personalized advertising
            through Google's Ad Settings. If you'd like us to delete a
            message you sent through our contact form, reach out via the{" "}
            <a href="/contact" className="text-orange-600 hover:underline">
              Contact page
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Children's privacy
          </h2>
          <p className="mt-3">
            This site is not directed at children under 13, and we do not
            knowingly collect personal information from children.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Changes to this policy
          </h2>
          <p className="mt-3">
            We may update this policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink-950">Contact</h2>
          <p className="mt-3">
            Questions about this policy? Reach out via our{" "}
            <a href="/contact" className="text-orange-600 hover:underline">
              Contact page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
