import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FlashcardsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/flash-cards'); }, [router]);
  return null;
}
