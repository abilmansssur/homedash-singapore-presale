const tools = [
  {
    number: "01",
    eyebrow: "STATIC IMAGE → AI VIDEO",
    title: "Turn listing photos into scroll-stopping motion.",
    copy: "Upload a set of property photos and HomeDash prepares a polished vertical listing video—camera movement, captions, transitions and voiceover included.",
    points: ["No filming day", "No editing timeline", "Reusable for listings, Reels and owner updates"],
    input: "Property photos + listing details",
    time: "≈ 5 minutes with ready photos",
    bestFor: "Listings · Reels · Owner updates",
    visual: "video",
  },
  {
    number: "02",
    eyebrow: "AGENT-LED AI PROPERTY TOUR",
    title: "Put the agent back inside every property story.",
    copy: "Add one approved agent photo and a short voice sample. HomeDash creates an agent-avatar property tour that feels personal, consistent and ready for your brand review.",
    points: ["Agent avatar", "Branded voiceover", "Reusable format"],
    input: "Property photos + one agent photo + a short voice note",
    time: "≈ 5 minutes with ready assets",
    bestFor: "Personal branding · Agent-led tours · Social video",
    visual: "avatar",
  },
  {
    number: "03",
    eyebrow: "AUTOMATED SOCIAL MARKETING",
    title: "Keep your content calendar moving—with control.",
    copy: "Turn listings and local market signals into branded images, captions and campaign drafts. Your team approves customer-facing work before anything is published.",
    points: ["Local content research", "Brand-aware drafts", "Approved work moves into the content calendar"],
    input: "Listing details + brand settings + local market signals",
    time: "Minutes to a review-ready campaign draft",
    bestFor: "Consistent campaigns · Content calendars · Reels",
    visual: "social",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HomeDash Singapore home">
          <span className="brand-mark">H</span>
          <span>HomeDash<span className="brand-dot">.ai</span></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#tools">Tools</a>
          <a href="#workspace">Workspace</a>
          <a href="#workflow">How it works</a>
        </nav>
        <a className="button button-small" href="#booking">Apply for the pilot</a>
      </header>

      <section className="hero hero-artwork-section" id="top" aria-labelledby="hero-title">
        <img
          className="hero-artwork"
          src="/homedash-singapore-hero.png"
          alt="HomeDash Singapore AI Listing Studio showing one property transformed into a listing video, an agent-avatar property tour and approved social media campaigns"
          width="1735"
          height="907"
          fetchPriority="high"
        />
        <div className="hero-accessible-copy">
          <p>Singapore market pilot · Presale 2026</p>
          <h1 id="hero-title">One listing. Three ways to win attention.</h1>
        </div>
        <div className="hero-mobile-copy">
          <p className="eyebrow"><span className="pulse" /> Singapore market pilot · Presale 2026</p>
          <h2>One listing.<br /><em>Three ways</em> to win attention.</h2>
          <p>Turn property photos into listing videos, agent-led AI tours and approved social campaigns.</p>
          <a className="button" href="#booking">Apply for the pilot <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="hero-pilot-strip" aria-label="Singapore pilot proof and actions">
        <div className="hero-pilot-actions">
          <a className="button" href="#booking">Apply for the Singapore pilot <span aria-hidden="true">↗</span></a>
          <a className="text-link" href="#tools">Watch the three demos ↓</a>
        </div>
        <div className="hero-proof-list">
          <span><strong>7 days</strong> unlimited generation</span>
          <span><strong>≈ 5 min</strong> from ready photos</span>
          <span><strong>3 formats</strong> AutoPan, Classic Tour, Social Video</span>
          <span><strong>Rolling</strong> applications</span>
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-title">
        <p className="eyebrow" id="press-title">As Featured In</p>
        <div className="press-logos" aria-label="Media publications featuring HomeDash">
          <a className="press-logo press-logo-hkej" href="https://www.hkej.com/dailynews/ceoai/article/4016842/" target="_blank" rel="noreferrer" aria-label="Read the HKEJ coverage"><strong>信報財經新聞</strong><span>HKEJ · Read article ↗</span></a>
          <a className="press-logo press-logo-am730" href="https://www.am730.com.hk/column/%2A/556598" target="_blank" rel="noreferrer" aria-label="Read the am730 coverage"><strong>am<span>730</span></strong><small>Read article ↗</small></a>
          <a className="press-logo press-logo-etnet" href="https://www.etnet.com.hk/www/tc/news/mediaoutreach_news_detail.php?newsid=365787" target="_blank" rel="noreferrer" aria-label="Read the etnet coverage"><strong>經濟通 <span>et</span>net</strong><small>Read article ↗</small></a>
          <a className="press-logo press-logo-itpro" href="https://itpromag.com/2024/12/13/mooneybird/" target="_blank" rel="noreferrer" aria-label="Read the IT PRO coverage"><strong>IT PRO</strong><small>Read article ↗</small></a>
        </div>
      </section>

      <section className="adoption-section" aria-labelledby="adoption-title">
        <div className="adoption-heading">
          <div>
            <p className="eyebrow">Proven in Hong Kong · Ready to pilot in Singapore</p>
            <h2 id="adoption-title">Already running inside real agency operations.</h2>
          </div>
          <p>HomeDash’s wider operating platform is trusted by established Hong Kong property agencies. The Singapore presale brings its newest listing-video, agent-avatar and marketing workflows to a focused local pilot.</p>
        </div>
        <div className="agency-list" aria-label="Hong Kong agencies named by HomeDash">
          <div><div className="agency-logo"><img src="/logo-ricacorp.png" alt="Ricacorp Properties logo" width="500" height="114" loading="lazy" /></div><strong>RICACORP PROPERTIES</strong><span>利嘉閣</span></div>
          <div><div className="agency-logo"><img src="/logo-century21.png" alt="Century 21 logo" width="1807" height="230" loading="lazy" /></div><strong>CENTURY 21</strong><span>世紀21</span></div>
          <div><div className="agency-logo"><img src="/logo-gamway.png" alt="Gamway Property logo" width="1000" height="105" loading="lazy" /></div><strong>GAMWAY PROPERTY</strong><span>金滙地產</span></div>
          <div><div className="agency-logo"><img src="/logo-sunrise.png" alt="Sunrise Property logo" width="1281" height="353" loading="lazy" /></div><strong>SUNRISE PROPERTY</strong><span>太陽物業</span></div>
        </div>
        <div className="adoption-stats">
          <div><strong>30+</strong><span>paying agencies</span></div>
          <div><strong>912</strong><span>agents in the latest snapshot</span></div>
          <div><strong>24/7</strong><span>connected agency operations</span></div>
          <p>HomeDash product snapshot, July 2026. <a href="https://homedash.ai/" target="_blank" rel="noreferrer">View official source ↗</a></p>
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The AI listing studio</p>
            <h2>Create once.<br />Show up everywhere.</h2>
          </div>
          <p>These are the three workflows included in the one-week Singapore pilot—nothing hidden behind “coming soon”.</p>
        </div>

        <div className="tool-list">
          {tools.map((tool) => (
            <article className="tool-row" key={tool.number}>
              <div className="tool-copy">
                <span className="tool-number">{tool.number}</span>
                <p className="eyebrow">{tool.eyebrow}</p>
                <h3>{tool.title}</h3>
                <p>{tool.copy}</p>
                <ul>
                  {tool.points.map((point) => <li key={point}><span>✓</span>{point}</li>)}
                </ul>
                <dl className="tool-meta">
                  <div><dt>Input</dt><dd>{tool.input}</dd></div>
                  <div><dt>Time</dt><dd>{tool.time}</dd></div>
                  <div><dt>Best for</dt><dd>{tool.bestFor}</dd></div>
                </dl>
                <a className="tool-cta" href="#booking">Pilot this workflow <span aria-hidden="true">↗</span></a>
              </div>
              <div className={`tool-visual tool-video ${tool.visual}`}>
                {tool.visual === "video" && (
                  <>
                    <video controls playsInline preload="metadata" poster="/videos/post-creation-poster.jpg" aria-label="HomeDash automated post creation demonstration">
                      <source src="/videos/automated-post-creation.mp4" type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                    <span className="tool-video-label">Automated post creation</span>
                    <span className="tool-video-duration">00:55</span>
                  </>
                )}
                {tool.visual === "avatar" && (
                  <>
                    <video controls playsInline preload="metadata" poster="/videos/property-tour-poster.jpg" aria-label="HomeDash AI property tour demonstration">
                      <source src="/videos/property-tour-demo.mp4" type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                    <span className="tool-video-label">AI property tour</span>
                    <span className="tool-video-duration">00:57</span>
                  </>
                )}
                {tool.visual === "social" && (
                  <>
                    <video controls playsInline preload="metadata" poster="/videos/automated-marketing-poster.jpg" aria-label="HomeDash automated marketing workflow demonstration">
                      <source src="/videos/automated-marketing.mp4" type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                    <span className="tool-video-label">Automated marketing</span>
                    <span className="tool-video-duration">00:52</span>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scope-section" aria-labelledby="scope-title">
        <div className="scope-heading">
          <p className="eyebrow">Clear pilot scope</p>
          <h2 id="scope-title">Start with content creation.<br />Expand only when it proves useful.</h2>
        </div>
        <div className="scope-columns">
          <article className="scope-card scope-card-included">
            <span>Included in your one-week pilot</span>
            <h3>The AI Listing Studio</h3>
            <ul>
              <li>Unlimited AutoPan, Classic Tour and Social Video generation</li>
              <li>Agent-avatar setup from one photo and a short voice note</li>
              <li>Automated social campaign drafts and approval-ready content</li>
            </ul>
          </article>
          <article className="scope-card">
            <span>Part of the wider HomeDash platform</span>
            <h3>Agency operating workflows</h3>
            <ul>
              <li>Shared customer and listing context across modules</li>
              <li>Lead follow-up, reports and next-best-action preparation</li>
              <li>Branch visibility, coordination and controlled automation</li>
            </ul>
            <a href="https://homedash.ai/" target="_blank" rel="noreferrer">Explore the wider platform ↗</a>
          </article>
        </div>
      </section>

      <section className="workspace-section" id="workspace" aria-labelledby="workspace-title">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow light">Inside the HomeDash workspace</p>
            <h2 id="workspace-title">Real tools your team can put to work.</h2>
          </div>
          <p>Move from listing selection and image preparation to branded property content inside one practical workspace.</p>
        </div>
        <div className="workspace-gallery">
          <figure className="workspace-card workspace-card-featured">
            <a className="workspace-image" href="/dashboard-property-tour.png" target="_blank" rel="noreferrer" aria-label="Open the property tour builder screenshot at full size">
              <img src="/dashboard-property-tour.png" alt="HomeDash property tour builder with listing selection, video templates and a three-step creation workflow" width="1620" height="837" loading="lazy" />
              <span>View full size ↗</span>
            </a>
            <figcaption><span>01</span><div><h3>Property tour builder</h3><p>Select a listing and template, then prepare the script, voiceover and video through a guided workflow.</p></div></figcaption>
          </figure>
          <figure className="workspace-card">
            <a className="workspace-image" href="/dashboard-image-processing.png" target="_blank" rel="noreferrer" aria-label="Open the image processing workspace screenshot at full size">
              <img src="/dashboard-image-processing.png" alt="HomeDash image processing workspace with decluttering, furniture removal and watermark tools" width="1620" height="837" loading="lazy" />
              <span>View full size ↗</span>
            </a>
            <figcaption><span>02</span><div><h3>Listing image preparation</h3><p>Declutter images, remove furniture or watermarks, and prepare clean source assets before content creation.</p></div></figcaption>
          </figure>
          <figure className="workspace-card">
            <a className="workspace-image" href="/dashboard-listing-poster.png" target="_blank" rel="noreferrer" aria-label="Open the listing poster workspace screenshot at full size">
              <img src="/dashboard-listing-poster.png" alt="HomeDash listing poster generator with agent identity, company branding and image upload controls" width="1622" height="841" loading="lazy" />
              <span>View full size ↗</span>
            </a>
            <figcaption><span>03</span><div><h3>Branded listing posters</h3><p>Bring agent identity, company branding, listing images and campaign formats into one generation flow.</p></div></figcaption>
          </figure>
        </div>
      </section>

      <section className="platform-story-section" aria-labelledby="platform-story-title">
        <div className="platform-story-copy">
          <p className="eyebrow light">See the wider system</p>
          <h2 id="platform-story-title">HomeDash in 60 seconds.</h2>
          <p>This broader operating layer is not part of the one-week content pilot. See how HomeDash can connect listings, content, leads and branch operations when an agency is ready to expand.</p>
          <ul>
            <li>Shared customer and listing context across modules</li>
            <li>Lead follow-up, reports and next-best-action preparation</li>
            <li>Branch visibility and controlled automation</li>
          </ul>
        </div>
        <figure className="platform-story-video">
          <video controls playsInline preload="metadata" poster="/homedash-product-story-poster.jpg" aria-label="HomeDash product story in 60 seconds">
            <source src="/homedash-product-story-60s.mp4" type="video/mp4" />
            Your browser does not support embedded video.
          </video>
          <figcaption><strong>HomeDash in 60 seconds</strong><span>From consented conversations to visible agent action.</span></figcaption>
        </figure>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-heading">
          <p className="eyebrow">Your one-week pilot workflow</p>
          <h2>From listing photos to approved content.</h2>
          <p>Use one live listing to test speed, quality and brand fit. Your team keeps the publishing decision.</p>
        </div>
        <ol className="workflow-steps">
          <li><span>01</span><strong>Provide</strong><p>Add listing photos, property details and your preferred format.</p></li>
          <li><span>02</span><strong>Generate</strong><p>HomeDash prepares the video, captions, voiceover and campaign draft.</p></li>
          <li><span>03</span><strong>Approve</strong><p>Your team reviews customer-facing content before it goes live.</p></li>
          <li><span>04</span><strong>Reuse</strong><p>Move approved assets into listings, Reels, owner updates and your content calendar.</p></li>
        </ol>
      </section>

      <section className="pilot-package-section" aria-labelledby="pilot-package-title">
        <div className="pilot-package-heading">
          <div>
            <p className="eyebrow">Singapore pilot package</p>
            <h2 id="pilot-package-title">One week. Unlimited videos. Three ways to publish.</h2>
          </div>
          <div className="rolling-note"><span className="live-dot" /> Applications reviewed on a rolling basis</div>
        </div>
        <div className="pilot-package-stats">
          <article><strong>7 days</strong><h3>Unlimited generation</h3><p>Generate as many property videos as you need during your pilot week.</p></article>
          <article><strong>≈ 5 min</strong><h3>From photos to video</h3><p>When the property photos are ready, production time is reduced to approximately five minutes.</p></article>
          <article><strong>3 formats</strong><h3>Choose the right story</h3><p>Use AutoPan, Classic Tour or Social Video for each listing and channel.</p></article>
          <article><strong>1 + 1</strong><h3>Your agent avatar</h3><p>Provide one approved agent picture and a short voice note to appear in Social Videos.</p></article>
        </div>
        <div className="pilot-formats" aria-label="Video formats included in the HomeDash pilot">
          <div><span>01</span><strong>AutoPan</strong><p>Add smooth motion to static property photos.</p></div>
          <div><span>02</span><strong>Classic Tour</strong><p>Turn listing images into a guided property story.</p></div>
          <div><span>03</span><strong>Social Video</strong><p>Bring the agent on-screen through an approved avatar and voice.</p></div>
        </div>
        <div className="pilot-package-cta">
          <p>No fixed application deadline. Start when there is a suitable pilot slot.</p>
          <a className="button" href="#booking">Book your pilot consultation <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div>
          <p className="eyebrow">Choose your pilot path</p>
          <h2 id="audience-title">A focused next step for how you work.</h2>
        </div>
        <div className="audience-paths">
          <article>
            <span>For individual agents</span>
            <h3>Turn one live listing into a week of usable content.</h3>
            <p>Bring your photos and brand preferences. Test all three formats without a filming day or editing timeline.</p>
            <a className="button" href="#booking">Pilot as an agent <span aria-hidden="true">↗</span></a>
          </article>
          <article>
            <span>For team leaders</span>
            <h3>Test a repeatable approval workflow with your team.</h3>
            <p>Choose a listing, an agent identity and a reviewer. Measure turnaround, consistency and reuse before a wider rollout.</p>
            <a className="button button-dark" href="#booking">Plan a team pilot <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <section className="pilot-section" id="pilot">
        <div className="pilot-copy">
          <p className="eyebrow light">Singapore market pilot · Limited intake</p>
          <h2>Bring one live listing bottleneck.<br />Leave with a practical pilot plan.</h2>
          <p>In a focused pilot consultation, we’ll map your workflow, approval points and what a useful first result should look like.</p>
          <ul className="pilot-benefits">
            <li><span>01</span><div><strong>Singapore-ready workflow</strong><p>Localised around your listing, brand and team structure.</p></div></li>
            <li><span>02</span><div><strong>Early product influence</strong><p>Help shape the templates and controls your team needs.</p></div></li>
            <li><span>03</span><div><strong>Focused first use case</strong><p>Start with video, avatar tours or social marketing—not a giant rollout.</p></div></li>
          </ul>
        </div>
        <div className="booking-panel" id="booking">
          <div className="booking-head">
            <div><span>BOOK YOUR PILOT CONSULTATION</span><strong>Singapore · pilot planning call</strong></div>
            <p>Select an available time without leaving the page.</p>
          </div>
          <iframe
            className="calendly-frame"
            src="https://calendly.com/max-homedash/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=17203d&primary_color=ffb21a"
            title="Book a HomeDash Singapore pilot consultation"
            loading="lazy"
          />
          <div className="booking-fallback">
            <span>The available HomeDash calendar currently reserves 30 minutes. Prefer another channel?</span>
            <a href="https://wa.me/85293173883" target="_blank" rel="noreferrer">Discuss your use case on WhatsApp ↗</a>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div><p className="eyebrow">Questions, answered</p><h2>Before you join the pilot.</h2></div>
        <div className="faq-list">
          <details><summary>Do agents need to film the property?</summary><p>No. The static-image-to-video workflow starts from property photos and listing details. HomeDash prepares the motion, captions and voiceover for review.</p></details>
          <details><summary>How many videos can I generate during the pilot?</summary><p>There is no video-generation cap during your one-week pilot. You can test AutoPan, Classic Tour and Social Video across as many suitable listings as you need.</p></details>
          <details><summary>How quickly can a video be produced?</summary><p>When the property photos are already available, the HomeDash workflow reduces production time to approximately five minutes.</p></details>
          <details><summary>What is needed for an agent-avatar Social Video?</summary><p>One approved agent picture and a short voice note, plus your listing assets and brand preferences. Your team reviews the result before use.</p></details>
          <details><summary>Will social posts publish automatically?</summary><p>HomeDash prepares campaign drafts and a content queue. Customer-facing content is routed through human approval before publishing.</p></details>
          <details><summary>Is HomeDash already available in Singapore?</summary><p>HomeDash is recruiting Singapore market-pilot agencies. The presale call is used to identify a focused use case, approval process and useful pilot result.</p></details>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>HomeDash<span className="brand-dot">.ai</span></span></a>
        <p>AI operating systems for real estate agencies.</p>
        <div><a href="https://homedash.ai/" target="_blank" rel="noreferrer">Global site ↗</a><a href="mailto:info@homedash.hk">Contact</a><a href="#top">Back to top ↑</a></div>
        <span>© 2026 HomeDash.ai</span>
      </footer>
    </main>
  );
}
