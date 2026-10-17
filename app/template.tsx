"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={loading ? "site-loader" : "site-loader is-leaving"} aria-hidden={!loading}>
        <div className="site-loader-inner" role="status" aria-label="Loading Omololu Hospital website">
          <div className="site-loader-mark">
            <img src="/photo_2026-09-26_02-25-49.jpg" alt="" />
          </div>
          <p className="site-loader-name">OMOLOLU HOSPITAL</p>
          <p className="site-loader-caption">Quality Healthcare for You</p>
          <div className="site-loader-track" aria-hidden="true"><span /></div>
        </div>
      </div>
      <div className="page-transition">{children}</div>
    </>
  );
}
