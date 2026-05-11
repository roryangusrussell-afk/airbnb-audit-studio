import { LegalLayout } from "@/components/LegalLayout";

const Terms = () => (
  <LegalLayout title="Terms of Use" lastUpdated="11 May 2026">
    <p>
      These terms explain how Auditable works and what you can expect from it. Using the audit means
      you agree to these terms. The service is operated by Rory Russell from Lisbon, Portugal.
    </p>

    <h2>What Auditable is</h2>
    <p>
      Auditable is a free diagnostic tool. You paste an Airbnb listing URL and we return a written
      report scoring the listing on copy, photos, amenities, and reviews, with paste-ready rewrites
      where useful. It is positioned as a lead magnet and is not a paid product.
    </p>

    <h2>What Auditable is not</h2>
    <ul>
      <li>It is not financial, legal, or tax advice.</li>
      <li>It is not affiliated with Airbnb. Airbnb is a trademark of Airbnb, Inc.</li>
      <li>It does not modify your Airbnb listing or push changes on your behalf. You apply rewrites manually if you choose.</li>
      <li>It does not guarantee bookings, ranking improvements, or revenue uplift.</li>
    </ul>

    <h2>Accuracy and limitations</h2>
    <p>
      The audit is automated. We use AI models to read your listing and judge it against a rubric
      derived from Airbnb best practice. The output is our best opinion based on visible data, not
      an authoritative ranking signal from Airbnb itself. You should treat suggestions as input to
      your own judgement, not as instructions.
    </p>

    <h2>Acceptable use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Submit listings that aren't yours without the host's permission.</li>
      <li>Attempt to overload, scrape, or reverse-engineer the service.</li>
      <li>Use the output to harass another host, listing, or property.</li>
      <li>Misrepresent Auditable's output as Airbnb-endorsed advice.</li>
    </ul>

    <h2>Your account / data</h2>
    <p>
      Auditable doesn't require an account. The only personal data we collect is your email and the
      audits you've run. See the <a href="/privacy">Privacy Policy</a> for details. You can request
      deletion at any time by emailing us.
    </p>

    <h2>Liability</h2>
    <p>
      Auditable is provided "as is" and "as available". We don't accept liability for any losses
      arising from acting on the suggestions in your audit. You're free to ignore them.
    </p>

    <h2>Changes to these terms</h2>
    <p>
      If we change these terms we'll update the "Last updated" date above. Continued use of Auditable
      after a change means you accept the new terms.
    </p>

    <h2>Governing law</h2>
    <p>
      These terms are governed by the laws of Portugal. Any disputes will be handled by Portuguese
      courts unless a different forum is required by mandatory consumer protection rules in your
      country.
    </p>

    <h2>Contact</h2>
    <p>
      Questions: <a href="mailto:roryangusrussell@gmail.com">roryangusrussell@gmail.com</a>.
    </p>
  </LegalLayout>
);

export default Terms;
