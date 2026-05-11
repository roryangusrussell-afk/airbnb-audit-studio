import { LegalLayout } from "@/components/LegalLayout";

const Cookies = () => (
  <LegalLayout title="Cookies" lastUpdated="11 May 2026">
    <p>
      Auditable uses a small number of cookies and local storage entries to run the audit and remember
      your email between visits. We don't use advertising or tracking cookies.
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
      cookieless and uses a hashed visitor signature that cannot identify you. No personal data is
      transmitted to advertising networks.
    </p>

    <h2>How to control them</h2>
    <p>
      You can clear the local storage entries above at any time from your browser's developer tools or
      by clearing site data for this domain. Doing so will sign you out of the cached email and
      reset your free-audit counter.
    </p>

    <h2>Third-party services</h2>
    <p>
      Auditable embeds no third-party content. The audit calls our own backend, which in turn talks
      to Anthropic and Apify (see <a href="/privacy">Privacy Policy</a>). Those calls happen
      server-side and don't drop cookies in your browser.
    </p>

    <h2>Changes</h2>
    <p>
      If we add or remove any cookie, this page will be updated. If a change is material we'll
      surface a banner before applying it.
    </p>
  </LegalLayout>
);

export default Cookies;
