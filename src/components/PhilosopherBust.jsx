export default function PhilosopherBust() {
  return (
    <div className="philosopher-stage" aria-hidden="true">
      <div className="stage-glow" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <svg className="philosopher-bust" viewBox="0 0 260 360" role="presentation">
        <defs>
          <linearGradient id="marble" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f4e3b2" />
            <stop offset=".48" stopColor="#b9975b" />
            <stop offset="1" stopColor="#5e472b" />
          </linearGradient>
          <linearGradient id="shadow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff2c8" stopOpacity=".6" />
            <stop offset="1" stopColor="#4a351f" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <path d="M56 344c8-39 24-63 56-75l1-29c-28-18-43-48-42-85 1-59 35-96 77-96 44 0 79 38 79 96 0 38-15 68-43 86l2 28c33 12 50 36 58 75H56Z" fill="url(#marble)" />
        <path d="M73 151c-13-47 7-92 45-105 36-13 76 7 87 49-20-17-44-24-69-20-25 4-45 19-63 44Z" fill="url(#shadow)" />
        <path d="M101 165c15 8 31 11 48 7 7-2 14-6 21-12-3 32-19 53-37 53-18 0-30-19-32-48Z" fill="#60482b" opacity=".34" />
        <path d="M103 144c7-5 15-6 23-2M148 142c8-4 16-3 23 2" fill="none" stroke="#4b371f" strokeLinecap="round" strokeWidth="5" />
        <path d="M132 145c-3 12-4 23-1 31l9 2" fill="none" stroke="#60482b" strokeLinecap="round" strokeWidth="4" />
        <path d="M113 194c12 8 28 9 42 0" fill="none" stroke="#4b371f" strokeLinecap="round" strokeWidth="4" />
        <path d="M79 271c30 17 76 22 107-1M69 318c36 14 92 15 126 0" fill="none" stroke="#fff2c8" strokeOpacity=".22" strokeWidth="3" />
      </svg>
      <span className="stage-caption">Know thyself</span>
    </div>
  );
}
