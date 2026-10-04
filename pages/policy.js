import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-4">
          <strong>Effective Date:</strong> March 6, 2026
        </p>

        <p className="text-gray-700 mb-4">
          This Privacy Policy explains how <strong>DataEase</strong> collects,
          uses, and protects your personal information when you use our
          application (“App”).
        </p>

        {/* 1 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Transaction History</li>
            <li>Wallet Balance Information</li>
            <li>Device and Usage Data</li>
          </ul>
        </section>

        {/* 2 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>To create and manage your account</li>
            <li>To process wallet funding and transactions</li>
            <li>To provide customer support</li>
            <li>To improve our services</li>
            <li>To communicate important updates</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            3. Payment Processing
          </h2>
          <p className="text-gray-700">
            DataEase does not collect or store your debit/credit card or bank
            payment details. All payments are securely processed by third-party
            providers such as <strong>Paystack</strong>. These providers handle
            your payment information in accordance with their own privacy
            policies.
          </p>
        </section>

        {/* 4 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            4. Sharing of Information
          </h2>
          <p className="text-gray-700">
            We do not sell your personal data. However, we may share necessary
            information with trusted third-party providers (such as Paystack)
            strictly for the purpose of processing transactions and delivering
            our services. We do not have access to your sensitive payment
            details.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            5. Data Security
          </h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to
            protect your personal data. However, no system is completely secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            6. Data Retention
          </h2>
          <p className="text-gray-700">
            We retain your information only as long as necessary to provide our
            services and comply with legal obligations.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            7. Your Rights
          </h2>
          <p className="text-gray-700">
            You have the right to access, update, or delete your personal
            information. You may contact us to exercise these rights.
          </p>
        </section>

        {/* 8 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            8. Third-Party Services
          </h2>
          <p className="text-gray-700">
            Our App may integrate with third-party services. We are not
            responsible for the privacy practices of these external platforms.
          </p>
        </section>

        {/* 9 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            9. Changes to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Continued use of
            the App means you accept any changes.
          </p>
        </section>

        {/* 10 */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            10. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, contact us:
            <br />
            <strong>Email:</strong> info@nexadataease.com <br />
            <strong>Phone:</strong> +234 9074-235-666
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;