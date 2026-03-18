'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminScrollFix() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname.startsWith('/TuSaiChi')) {
      document.documentElement.setAttribute('data-admin', 'true');
    } else {
      document.documentElement.removeAttribute('data-admin');
    }
  }, [pathname]);

  return null;
}
