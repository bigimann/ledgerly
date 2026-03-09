export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-blue max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By accessing and using Ledgerly, you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Description of Service
            </h2>
            <p className="text-gray-700">
              Ledgerly is a financial tracking application that helps users:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Track income and expenses</li>
              <li>Estimate tax obligations under Nigerian tax laws</li>
              <li>Generate financial reports</li>
              <li>Manage transaction history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tax Calculation Disclaimer
            </h2>
            <p className="text-gray-700 font-semibold">
              IMPORTANT: Ledgerly provides tax estimates for informational
              purposes only.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Our tax calculations are based on the Nigeria Tax Act 2026
              </li>
              <li>Estimates may not reflect your actual tax liability</li>
              <li>We are not a substitute for professional tax advice</li>
              <li>
                Always consult a qualified tax professional or NRS for official
                guidance
              </li>
              <li>
                We are not responsible for any tax filing errors or penalties
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Responsibilities
            </h2>
            <p className="text-gray-700">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with Nigerian laws</li>
              <li>Not misuse or attempt to harm the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Ledgerly and its operators shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use of the service, including but not limited to tax
              calculation errors, data loss, or financial losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Modifications
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Continued
              use of the service after changes constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700">
              These terms shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
