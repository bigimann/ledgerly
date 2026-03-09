export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-blue max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700">
              Ledgerly ("we," "our," or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              financial tracking application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name and email address (for account creation)</li>
              <li>Phone number (optional)</li>
              <li>Financial transaction data you input</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Device information and IP address</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To calculate tax estimates based on Nigerian tax laws</li>
              <li>To send you important notifications and updates</li>
              <li>To improve our application and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your
              personal information. Your data is encrypted both in transit and
              at rest. However, no method of transmission over the internet is
              100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Retention
            </h2>
            <p className="text-gray-700">
              We retain your personal information only for as long as necessary
              to provide our services and comply with legal obligations. You can
              request deletion of your account and data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700">
              Under Nigerian Data Protection laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us
              at:
              <br />
              Email: eneojogoswill@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
