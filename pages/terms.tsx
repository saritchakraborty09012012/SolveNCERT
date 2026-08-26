import React from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';

export default function TermsPage() {
  return (
    <CompanyLayout title="Terms of Service" description="SolveNCERT Terms of Service." canonical="/terms" breadcrumb="Terms of Service" lastUpdated="May 2026">
      <h1>Terms of Service</h1>
      <p className="lead">By using SolveNCERT, you agree to these terms. Please read them carefully.</p>

      <h2>1. Acceptance of Terms</h2>
      <p>These Terms govern your use of SolveNCERT. By accessing or using our platform, you agree to be bound by these terms.</p>

      <h2>2. Description of Service</h2>
      <p>SolveNCERT provides <strong>human-verified, AI-assisted</strong> NCERT solutions, educational content, quizzes, and collaborative study tools for CBSE students, following the <strong>2026 Revised NCERT Syllabus</strong>. The platform is provided "as is" and may evolve over time.</p>

      <h2>3. User Accounts</h2>
      <ul>
        <li>You must provide accurate and complete information when creating an account.</li>
        <li>You are responsible for maintaining the security of your account and password.</li>
        <li>One person may hold multiple accounts only if they use different email addresses.</li>
        <li>We reserve the right to suspend accounts that violate these terms.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the platform for any unlawful purpose</li>
        <li>Attempt to access restricted areas or other users' accounts</li>
        <li>Use automated tools to scrape or harvest content</li>
        <li>Upload malicious content or attempt to compromise platform security</li>
        <li>Share your account credentials with others</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>All original content on SolveNCERT — including solutions written by our team, platform design, and branding — is owned by SolveNCERT and NOVEXA. NCERT textbooks and their content are the intellectual property of the National Council of Educational Research and Training.</p>

      <h2>6. Free and Premium Plans</h2>
      <p>SolveNCERT offers a free tier and a premium subscription at ₹99/month. All users get a free 1-month trial. We reserve the right to modify plan features with reasonable notice.</p>

      <h2>7. AI-Generated Content Disclaimer</h2>
      <p>While our NCERT solutions are human-written and verified, AI features generate responses dynamically. These are educational aids only — always cross-reference with your textbook.</p>

      <h2>8. Limitation of Liability</h2>
      <p>SolveNCERT is provided for educational purposes. We strive for accuracy but do not guarantee error-free content. We are not liable for academic outcomes resulting from use of our platform.</p>

      <h2>9. Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>10. Contact</h2>
      <p>For questions, contact us via our <a href="/contact">Contact page</a>.</p>
    </CompanyLayout>
  );
}
