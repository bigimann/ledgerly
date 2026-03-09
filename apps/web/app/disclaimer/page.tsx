export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>

        <div className="prose prose-blue max-w-none space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-800 font-semibold">
              IMPORTANT: Please read this disclaimer carefully before using
              Ledgerly.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tax Calculation Disclaimer
            </h2>
            <p className="text-gray-700">
              Ledgerly provides estimated tax calculations based on the Nigeria
              Tax Act 2026. These estimates are for informational and planning
              purposes only and should NOT be considered as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Professional tax advice</li>
              <li>Official tax assessments</li>
              <li>Guaranteed accurate tax liability figures</li>
              <li>
                A substitute for consultation with qualified tax professionals
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitations of Tax Estimates
            </h2>
            <p className="text-gray-700">Our tax calculations:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Use simplified assumptions and may not account for all
                individual circumstances
              </li>
              <li>Do not include employer-specific PAYE deductions</li>
              <li>
                Do not include state-specific taxes or local government levies
              </li>
              <li>May not reflect recent changes in tax laws or regulations</li>
              <li>
                Do not include all possible tax reliefs, allowances, or
                exemptions
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Financial Advice
            </h2>
            <p className="text-gray-700">
              Ledgerly is a financial tracking tool, not a financial advisor. We
              do not provide:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Investment advice or recommendations</li>
              <li>Financial planning services</li>
              <li>Accounting or bookkeeping services</li>
              <li>Legal advice regarding tax obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Responsibility
            </h2>
            <p className="text-gray-700">
              As a user of Ledgerly, you are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Entering accurate transaction data</li>
              <li>Verifying all tax calculations independently</li>
              <li>
                Consulting with qualified tax professionals for official tax
                filing
              </li>
              <li>
                Ensuring compliance with all applicable tax laws and regulations
              </li>
              <li>
                Filing your taxes correctly with the Nigeria Revenue Service
                (NRS)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Liability
            </h2>
            <p className="text-gray-700">
              Ledgerly and its operators shall not be held liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Errors or inaccuracies in tax calculations</li>
              <li>Tax penalties or interest charges</li>
              <li>Financial losses resulting from use of the application</li>
              <li>
                Decisions made based on information provided by the application
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Consult Professionals
            </h2>
            <p className="text-gray-700">
              For accurate tax filing and compliance, we strongly recommend
              consulting with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Qualified tax consultants or accountants</li>
              <li>The Nigeria Revenue Service (NRS)</li>
              <li>State Board of Internal Revenue</li>
              <li>Licensed financial advisors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Updates and Changes
            </h2>
            <p className="text-gray-700">
              Tax laws and regulations change frequently. While we strive to
              keep our calculations up-to-date with the Nigeria Tax Act 2026, we
              cannot guarantee that all changes are immediately reflected in the
              application.
            </p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
            <p className="text-blue-800">
              By using Ledgerly, you acknowledge that you have read, understood,
              and agree to this disclaimer and accept full responsibility for
              your tax filing and financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
