import Link from 'next/link';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-warm-500">Last updated: May 2026</p>

        <div className="space-y-8 rounded-2xl border border-warm-200 bg-white p-8 dark:border-dark-700 dark:bg-dark-800">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              1. Acceptance of Terms
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              By accessing and using this Bhagavad Gita Learning Platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              2. Use License
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              Permission is granted to temporarily download one copy of the materials (information or software) on this platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="mt-3 space-y-2 text-warm-600 dark:text-warm-300">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer any software contained on the platform</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              3. Disclaimer
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              The materials on this platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              4. Limitations
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              In no event shall this platform or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              5. Accuracy of Materials
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              The materials appearing on this platform could include technical, typographical, or photographic errors. This platform does not warrant that any of the materials on our platform are accurate, complete, or current. We may make changes to the materials contained on our platform at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              6. Links
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              We have not reviewed all of the sites linked to our platform and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              7. Modifications
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              This platform may revise these terms of service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark-900 dark:text-warm-50">
              8. Governing Law
            </h2>
            <p className="text-warm-600 dark:text-warm-300">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the platform is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
