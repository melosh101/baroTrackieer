import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 1, 2025</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to Baro Ki'teer Inventory Manager. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. By using our service, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We may collect information about you in a variety of ways. The information we may collect on the Service includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>
                    <strong>No Personal Data:</strong> For users who log in, we may collect your username, discord id, and profile picture to create and manage your account.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We automatically collect information about the items you mark as owned. This data is stored locally in your browser if you are not logged in, or synced to our database if you are logged in. This includes which items you have marked, and when you marked them.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>Create and manage your account.</li>
                  <li>Sync your owned items data across multiple devices.</li>
                  <li>Analyze usage to improve our Service.</li>
                  <li>Provide you with customer support.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
                <p className="text-muted-foreground">
                  We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other third-party service providers who need access to such information to carry out work on our behalf.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Choices</h2>
                <p className="text-muted-foreground">
                  You have the right to review, update, or delete your personal information. You can manage your owned items data directly within the application. If you wish to delete your account and all associated data, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at <a className="underline hover:text-foreground" href="mailto:trackeer@milasholsting.dk">trackeer@milasholsting.dk</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
