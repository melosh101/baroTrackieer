import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 1, 2025</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using the Baro Ki'teer Inventory Manager (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use of the Service</h2>
                <p className="text-muted-foreground">
                  You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground">
                  If you create an account with us, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of the Service owner and its licensors. The names, images, and likenesses of in-game items from Warframe are the property of Digital Extremes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not to a breach of the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall the Service owner, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the Service owner is based, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at <a className="underline hover:text-foreground" href="mailto:trackeer@milasholsting.dk">trackeer@milasholsting.dk</a>.
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
