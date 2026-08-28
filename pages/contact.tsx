import React from 'react';
import { Mail, MessageSquare, MapPin, Rocket } from 'lucide-react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { FeedbackStars } from '@/components/features/FeedbackWidget';

export default function ContactPage() {
  return (
    <CompanyLayout title="Contact Us" description="Contact the SolveNCERT team for support, feedback or partnership queries. We respond within 24 hours." canonical="/contact" breadcrumb="Contact">
      <h1>Contact Us</h1>
      <p className="lead">We'd love to hear from you — feedback, suggestions, or support. Our contact form is coming soon.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 not-prose">
        {[
          { icon: Mail,          title: 'Email',    value: 'Coming soon', sub: 'For support & billing'               },
          { icon: MessageSquare, title: 'Feedback', value: 'Coming soon', sub: 'Share suggestions & ideas'            },
          { icon: MapPin,        title: 'Based in', value: 'India',       sub: 'Serving CBSE students nationwide'     },
        ].map(({ icon: Icon, title, value, sub }) => (
          <div key={title} className="card p-4">
            <Icon size={16} className="text-blue-500 mb-2" />
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{title}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 not-prose my-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 mb-4">
          <Rocket size={20} className="text-white" />
        </div>
        <h2 className="font-display font-bold text-[var(--text-primary)] mb-2">Contact Form — Coming Soon</h2>
        <p className="text-sm text-[var(--text-muted)]">
          We are setting up our support system. In the meantime, you can reach us directly at the email addresses above.
        </p>
      </div>

      <div className="card p-6 not-prose my-6">
        <h2 className="font-display font-bold text-[var(--text-primary)] mb-1">Rate your experience</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Tell us how SolveNCERT is working for you.</p>
        <FeedbackStars />
      </div>
    </CompanyLayout>
  );
}
