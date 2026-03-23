"use client";

import { useState } from "react";

export default function PricingToggle() {
  const [isLifetime, setIsLifetime] = useState(false);

  return (
    <section className="pr">
      <h2 className="st">Simple pricing</h2>

      <div style={{ textAlign: "center" }}>
        <div className="prtog">
          <div className={`togslider${isLifetime ? " right" : ""}`} />
          <button
            className={`togopt${!isLifetime ? " active" : ""}`}
            onClick={() => setIsLifetime(false)}
          >
            Monthly
          </button>
          <button
            className={`togopt${isLifetime ? " active" : ""}`}
            onClick={() => setIsLifetime(true)}
          >
            Lifetime
          </button>
        </div>
        <span className="togsave">Save 50%</span>
      </div>

      <div className="prg">
        <div className="prc">
          <div className="prn">Free</div>
          <div className="pra">$0</div>
          <ul className="prf">
            <li>10 drinks available</li>
            <li>1 card export per week</li>
            <li>All templates available</li>
            <li>ToastIT watermark</li>
          </ul>
          <a href="/auth/signup" className="prb">
            Start free
          </a>
        </div>
        <div className="prc ft">
          <div className="prn">Pro</div>
          <div className="pra">
            {isLifetime ? (
              <>
                $29<span> one-time</span>
              </>
            ) : (
              <>
                $5<span>/mo</span>
              </>
            )}
          </div>
          <div className="pra-alt">
            {isLifetime ? "Pay once, toast forever" : "or $29 one-time"}
          </div>
          <ul className="prf">
            <li>Unlimited exports</li>
            <li>No watermark</li>
            <li>New drinks every week</li>
            <li>Request new drinks</li>
            <li>Featured on Toasters wall</li>
          </ul>
          <a href="/auth/signup" className="prb f">
            Go Pro
          </a>
        </div>
      </div>
    </section>
  );
}
