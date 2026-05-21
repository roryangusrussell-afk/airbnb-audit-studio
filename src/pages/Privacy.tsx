import { LegalLayout } from "@/components/LegalLayout";

const Privacy = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="21 May 2026">
    <p>
      This policy explains what data Auditable collects, why, and what you can do about it.
      Auditable is operated by Rory Russell, based in Lisbon, Portugal. If you have any questions
      about anything below, email <a href="mailto:rory@santacatarinacollection.com">rory@santacatarinacollection.com</a>.
    </p>

    <h2>What we collect</h2>
    <ul>
      <li>
        <strong>The Airbnb listing URL you submit.</strong> We fetch the public listing page to run
        the audit. We do not log into your account and do not see private host data.
      </li>
      <li>
        <strong>Your email address</strong>, after the audit completes, so we can send you the
        report and contact you about issues with this service.
      </li>
      <li>
        <strong>Audit results</strong> linked to your email so we can answer support questions.
      </li>
      <li>
        <strong>Basic usage data</strong> such as page views and referrer, via Vercel Analytics.
        This data is aggregated and does not identify individuals.
      </li>
      <li>
        <strong>Marketing opt-in flag</strong>, if you tick the box, along with the timestamp of
        when you gave consent.
      </li>
    </ul>

    <h2>Why we collect it</h2>
    <ul>
      <li>To run the audit you asked for.</li>
      <li>To email the audit report to you (transactional, required to deliver the service).</li>
      <li>To reply if you contact us with questions or feedback.</li>
      <li>To send occasional listing-improvement tips, only if you opted in. You can unsubscribe at any time.</li>
    </ul>

    <h2>Legal basis (GDPR)</h2>
    <p>
      We process the listing URL and your email under the legal basis of performing the service you
      requested. Marketing emails are sent only on the basis of your explicit opt-in consent. You can
      withdraw consent at any time by replying "unsubscribe" or emailing us.
    </p>

    <h2>Who we share data with</h2>
    <p>
      We use a small set of trusted processors to run Auditable:
    </p>
    <ul>
      <li><strong>Vercel</strong>: hosting and analytics (US; transferred under Standard Contractual Clauses).</li>
      <li><strong>Anthropic</strong>: AI analysis of listing content. Listing text and a small sample of public photo URLs are sent for scoring; data is not used to train models per Anthropic's API terms (US; transferred under Standard Contractual Clauses).</li>
      <li><strong>Resend</strong>: to deliver the audit report email (US; transferred under Standard Contractual Clauses).</li>
      <li><strong>A data fetching service</strong>: to retrieve the public listing page. No personal data is shared beyond the listing URL.</li>
      <li><strong>Internal records system</strong>: to log audits for support and service improvement.</li>
    </ul>
    <p>
      We do not sell your data. We do not share it with advertisers or data brokers.
    </p>

    <h2>How long we keep data</h2>
    <ul>
      <li>Audit results: 24 months from your last audit, after which data is anonymised or deleted. You can request deletion at any time.</li>
      <li>Email address: until you ask us to delete it or unsubscribe (in which case the email is removed from marketing lists immediately).</li>
      <li>Server logs: 30 days.</li>
    </ul>

    <h2>Your rights</h2>
    <p>
      Under the GDPR you have the right to access, correct, export, and delete your personal data.
      Email <a href="mailto:rory@santacatarinacollection.com">rory@santacatarinacollection.com</a> with the
      subject line "Data request" and we'll respond within 30 days.
    </p>
    <p>
      You also have the right to lodge a complaint with a data protection authority. In Portugal that
      is the CNPD (<a href="https://www.cnpd.pt" target="_blank" rel="noreferrer">cnpd.pt</a>).
    </p>

    <h2>Cookies</h2>
    <p>
      Auditable uses a small number of cookies for analytics and to remember your email between audits.
      Details are on the <a href="/cookies">Cookies</a> page.
    </p>

    <h2>Children</h2>
    <p>
      Auditable is not intended for anyone under 16. We do not knowingly collect data from children.
    </p>

    <h2>Changes to this policy</h2>
    <p>
      If we make material changes we'll update the "Last updated" date at the top of this page and,
      where appropriate, email anyone who has used Auditable.
    </p>
  </LegalLayout>
);

export default Privacy;
