import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyPaymentAI } from '@/lib/groq';
import { createAdminClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { paymentId, utr, amount, screenshotDescription } = req.body;
  if (!utr || !paymentId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const result = await verifyPaymentAI(utr, amount || 99, screenshotDescription || '');
    if (result.verified && result.confidence !== 'low') {
      const admin = createAdminClient();
      await admin.from('payments').update({ status: 'verified', verified_at: new Date().toISOString() }).eq('id', paymentId);
      const { data: payment } = await admin.from('payments').select('user_id, plan_months').eq('id', paymentId).single();
      if (payment) {
        const premiumEnd = new Date();
        premiumEnd.setMonth(premiumEnd.getMonth() + (payment.plan_months || 1));
        await admin.from('profiles').update({ plan: 'premium', premium_ends_at: premiumEnd.toISOString() }).eq('id', payment.user_id);
      }
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ verified: false, confidence: 'low', reason: 'Service unavailable.' });
  }
}
