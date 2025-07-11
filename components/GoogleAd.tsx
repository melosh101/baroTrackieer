"use client"

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = ({ slot }: { slot: string }) => {

  return (
    <div className="google-ad-container my-4 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8683265010525240" // Replace with your publisher ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );
};

export default GoogleAd;
