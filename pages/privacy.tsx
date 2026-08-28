import React from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';

export default function PrivacyPage() {
  return (
    <CompanyLayout title="Privacy Policy" description="SolveNCERT Privacy Policy." canonical="/privacy" breadcrumb="Privacy Policy" lastUpdated="May 2026">
      <h1>Privacy Policy</h1>
      <p className="lead">Your privacy matters. This policy explains how SolveNCERT collects, uses, and protects your information.</p>

      <h2>1. Information We Collect</h2>
      <h3>Account Information</h3>
      <p>When you create an account, we collect your full name, email address, date of birth, and optionally your phone number.</p>
      <h3>Usage Data</h3>
      <p>We collect information about how you use SolveNCERT — pages visited, chapters viewed, AI queries made, and session duration — to improve the platform.</p>
      <h3>Device Information</h3>
      <p>We may collect device identifiers and browser type for security purposes and to enforce guest usage limits.</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our educational services</li>
        <li>To personalise your learning experience</li>
        <li>To send account-related notifications</li>
        <li>To process premium subscriptions and verify payments</li>
        <li>To prevent fraud and abuse</li>
        <li>To analyse platform performance and usage</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <p>Your data is stored securely using Supabase, a SOC 2 Type II certified platform. We use TLS encryption for data in transit and encryption at rest. Payment screenshots are stored in private, access-controlled storage.</p>

      <h2>4. Sharing of Information</h2>
      <p>We do not sell, trade, or rent your personal information. We use some external service providers for services like database, authentication, AI interface, etc. which are safe and protect your privacy.</p>

      <h2>5. Cookies and Local Storage</h2>
      <p>We use cookies and browser local storage to remember your preferences (theme, session state) and to enforce guest usage limits. You can clear these at any time through your browser settings.</p>

      <h2>6. Your Rights</h2>
      <p>You can access, correct, or delete your personal data any time, any where — directly from your account Settings page. No need to contact us for data management.</p>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this privacy policy periodically. Significant changes will be communicated via email or a prominent notice on the platform.</p>

      <h2>8. Contact</h2>
      <p>For privacy-related queries, contact us via our <a href="/contact">Contact page</a>.</p>
    </CompanyLayout>
  );
}
