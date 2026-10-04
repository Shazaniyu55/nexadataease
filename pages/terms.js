import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-4">
          <strong>Effective Date:</strong> March 6, 2026
        </p>

        <p className="text-gray-700 mb-4">
          Welcome to <strong>DataEase</strong>. By accessing or using our web application (“<strong>App</strong>”), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using the App.
        </p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By using DataEase, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree, you must not use the App.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Eligibility</h2>
          <p className="text-gray-700">
            You must be at least 18 years old to use DataEase. By using the App, you represent and warrant that you meet this age requirement.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Account Registration</h2>
          <p className="text-gray-700">
            Users may be required to create an account to access certain services. You are responsible for maintaining the confidentiality of your account login information and all activities under your account. Provide accurate and up-to-date information.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Services Provided</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Data Purchases – purchase of mobile data bundles.</li>
            <li>Utility Payments – payments for electricity, water, and other bills.</li>
            <li>Cable Subscriptions – subscription services for TV channels and content.</li>
            <li>Secure Wallet – storing, transferring, and managing funds securely.</li>
            <li>Vendor Connectivity – allowing vendors to showcase services to users.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Payment Terms</h2>
          <p className="text-gray-700">
            All transactions must be made using valid payment methods supported by the App. Users are responsible for any fees, taxes, or charges imposed by their bank, card provider, or network. Refunds, if any, will follow our Refund Policy.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. User Obligations</h2>
          <p className="text-gray-700">
            By using DataEase, you agree not to use the App for unlawful purposes, hack or disrupt the system, submit false information, or infringe intellectual property rights.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Security</h2>
          <p className="text-gray-700">
            DataEase uses advanced encryption and security measures. However, no method of transmission over the internet is 100% secure. You are responsible for safeguarding your login credentials.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Vendor Responsibilities</h2>
          <p className="text-gray-700">
            Vendors must provide accurate and lawful service information, comply with applicable laws, and not engage in fraudulent or misleading practices. DataEase reserves the right to suspend or remove vendors who violate these Terms.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Limitation of Liability</h2>
          <p className="text-gray-700">
            DataEase will not be liable for any damages arising from your use of the App, errors, delays, interruptions, or loss of data, profits, or other intangible losses.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">10. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, trademarks, logos, and software on DataEase are the property of DataEase or its licensors. Copying, distributing, or creating derivative works without permission is prohibited.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">11. Termination</h2>
          <p className="text-gray-700">
            DataEase may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason deemed necessary to protect the App and its users.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">12. Changes to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms from time to time. Continued use of the App after updates constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">13. Governing Law</h2>
          <p className="text-gray-700">
            These Terms are governed by the laws of <strong>Nigeria</strong>. Any disputes shall be subject to the exclusive jurisdiction of the courts in Nigeria.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">14. Contact</h2>
          <p className="text-gray-700">
            For questions about these Terms or the App, please contact us at: <br />
            <strong>Email:</strong> info@nexadataease.com <br />
            <strong>Phone:</strong> +234 9074-235-666
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;