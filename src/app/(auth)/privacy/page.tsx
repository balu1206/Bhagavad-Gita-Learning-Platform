import Link from 'next/link';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-warm-50 py-12 px-4 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-saffron-600 hover:text-saffron-700 dark:text-saffron-400"
        >
          ← Back
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-dark-900 dark:text-warm-50">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-warm-500">Last updated: May 2026</p>

        <div className="space-y-8 rounded-2xl border border-warm-200 bg-white p-8 dark:border-dark-700 dark:bg-dark-800">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Introduction
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              The Bhagavad Gita Learning Platform ("we," "us," "our," or "Company") operates this website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our platform and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Information Collection and Use
            </h2>
            <p className="mb-3 text-warm-600 dark:text-warm-300">
              We collect several different types of information for various purposes to provide and improve our service to you.
            </p>
            <h3 className="mb-2 font-semibold text-dark-800 dark:text-warm-100">Types of Data Collected:</h3>
            <ul className="space-y-2 text-warm-600 dark:text-warm-300">
              <li>• <strong>Personal Data:</strong> Name, email address, profile picture (when using OAuth providers)</li>
              <li>• <strong>Usage Data:</strong> Pages visited, time spent, verses read, bookmarks saved, and progress information</li>
              <li>• <strong>Device Data:</strong> Browser type, IP address, operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Use of Data
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              The Bhagavad Gita Learning Platform uses the collected data for various purposes:
            </p>
            <ul className="mt-3 space-y-2 text-warm-600 dark:text-warm-300">
              <li>• To provide and maintain our platform</li>
              <li>• To notify you about changes to our platform</li>
              <li>• To provide customer support</li>
              <li>• To gather analysis or valuable information so we can improve our platform</li>
              <li>• To monitor the usage of our platform</li>
              <li>• To detect, prevent and address technical and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Security of Data
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Cookies
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              We use cookies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Third-Party Services
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              Our platform may use third-party services for authentication (Google OAuth, GitHub OAuth) and analytics. These third-party service providers have their own privacy policies addressing how they use such information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Children's Privacy
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              Our platform does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that a child under 13 has provided us with personal information, we immediately delete such information from our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Changes to This Privacy Policy
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              Contact Us
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              If you have any questions about this Privacy Policy, please contact us at support@gitalearning.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
