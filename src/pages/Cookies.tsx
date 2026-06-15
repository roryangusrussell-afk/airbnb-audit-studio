import { LegalLayout } from "@/components/LegalLayout";

const Cookies = () => (
  <LegalLayout title="Cookies" lastUpdated="15 June 2026">
    <p>
      Auditable uses a small number of cookies and local storage entries to run the audit and remember
      your email between visits. We also use the Meta (Facebook) Pixel for advertising measurement,
      which sets advertising cookies. Details are below.
    </p>

    <h2>What we use</h2>

    <h3>Strictly necessary</h3>
    <p>These keep the audit working. They cannot be disabled because the service depends on them.</p>
    <ul>
      <li><strong>auditEmail</strong> (local storage): remembers the email you gave so you don't have to re-enter it on subsequent audits.</li>
      <li><strong>auditsRun</strong> (local storage): counts how many audits you've run from this browser, so we can enforce the free-tier cap.</li>
      <li><strong>pendingRef</strong> (local storage): temporary store for a referral code if you arrived via someone's invite link.</li>
    </ul>

    <h3>Analytics</h3>
    <p>
      We use <strong>Vercel Analytics</strong> to count page views and understand referrers. This is
      cookieless and uses a hashed visitor signature that cannot identify you. Vercel Analytics is
      separate from the advertising pixel below and transmits no data to advertising networks.
    </p>

    <h3>Advertising</h3>
    <p>
      We use the <strong>Meta Pixel</strong> on this site. It sets cookies (such as <strong>_fbp</strong>)
      and reports actions like page views, report requests, and purchases back to Meta, so we can
      measure whether our advertising works. This is the only advertising or tracking cookie we use.
      You can opt out through your Meta ad preferences, your browser's cookie controls, or by emailing
      us.
    </p>

    <h2>How to control them</h2>
    <p>
      You can clear the local storage entries above at any time from your browser's developer tools or
      by clearing site data for this domain. Doing so will sign you out of the cached email and
      reset your free-audit counter.
    </p>

    <h2>Third-party services</h2>
    <p>
      The audit calls our own backend, which in turn talks to Anthropic and Apify (see
      <a href="/privacy">Privacy Policy</a>). Those calls happen server-side and don't drop cookies in
      your browser. The exception is the Meta Pixel described above, which loads from Meta in your
      browser and does set cookies.
    </p>

    <h2>Changes</h2>
    <p>
      If we add or remove any cookie, this page will be updated. If a change is material we'll
      surface a banner before applying it.
    </p>
  </LegalLayout>
);

export default Cookies;
