import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingPage({ onBegin }) {
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    document.body.classList.add('landing-active');
    return () => document.body.classList.remove('landing-active');
  }, []);

  const enterOracle = () => {
    if (isEntering) return;
    setIsEntering(true);
    window.setTimeout(onBegin, 760);
  };

  return (
    <section className={`landing-page ${isEntering ? 'is-entering' : ''}`} aria-labelledby="landing-title">
      {isEntering && (
        <div className="door-transition" aria-hidden="true">
          <div className="corridor-light"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="heavenly-portal"><span /></div>
          <div className="door-vignette" />
        </div>
      )}
      <div className="landing-particles" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>
      <div className="landing-copy">
        <h1 id="landing-title">Know<br /><em>yourself.</em></h1>
        <p>Find out what shapes the way you see the world.</p>
        <button className="landing-cta" onClick={enterOracle} disabled={isEntering}>
          Start the quiz <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="landing-art">
        <div className="landing-ring ring-large" />
        <div className="landing-ring ring-small" />
        <div className="statue-frame">
          <div className="statue-light" />
          <img
            src="/socrates.jpg"
            alt="Classical marble statue of Socrates"
          />
          <span>Socrates · c. 470–399 BC</span>
        </div>
      </div>
    </section>
  );
}
