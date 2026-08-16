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
          <img className="brand-logo" src="/homedash-logo.png" alt="HomeDash" width="476" height="186" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#tools">Features</a>
          <a href="#pilot-package">Pilot</a>
          <a href="#review">Reviews</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="button button-small" href="#booking">Join the agent pilot</a>
      </header>

      <section className="hero hero-redesign" id="top" aria-labelledby="hero-title">
        <figure className="hero-property-visual">
          <img
            src="/homedash-singapore-hero.png"
            alt="A Singapore property transformed by HomeDash into a listing video, agent-avatar tour and social campaign"
            width="1735"
            height="907"
            fetchPriority="high"
          />
          <figcaption>
            <span>AI LISTING STUDIO</span>
            <strong>Photos in. Three publish-ready formats out.</strong>
          </figcaption>
        </figure>
        <div className="hero-redesign-copy">
          <p className="eyebrow">HomeDash Singapore · Presale 2026</p>
          <h1 id="hero-title">Turn one listing into <em>a week of marketing.</em></h1>
          <p className="hero-lede">Create listing videos, agent-led property tours and ready-to-publish social content from property photos.</p>
          <div className="hero-proof-list hero-proof-inline" aria-label="Singapore pilot package highlights">
            <span><strong><b>7</b> days</strong><small>unlimited video generation</small></span>
            <span><strong><b>≈5</b> min</strong><small>from ready property photos</small></span>
            <span><strong><b>3</b> formats</strong><small>Photo Motion Video, Classic Tour, Social Video</small></span>
          </div>
          <div className="hero-actions">
            <a className="button" href="#booking">Join the agent pilot <span aria-hidden="true">↗</span></a>
            <a className="hero-demo-link" href="#tools">Watch the three demos <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="studio-preview" id="tools" aria-labelledby="studio-preview-title">
        <div className="studio-preview-intro">
          <p className="eyebrow">AI Listing Studio</p>
          <h2 id="studio-preview-title">One workflow.<br /><em>Three</em> high-impact outputs.</h2>
          <p>From ready property photos to polished, publish-ready content in minutes.</p>
        </div>
        <a className="studio-preview-card" href="#workflows" aria-label="View the Photo Motion Video workflow">
          <span className="preview-card-title"><b>01</b> Photo Motion Video</span>
          <span className="preview-image preview-image-motion"><img src="/homedash-singapore-hero.png" alt="Photo Motion Video property preview" width="1735" height="907" /></span>
          <strong>Cinematic property highlight with smooth motion.</strong>
        </a>
        <a className="studio-preview-card" href="#workflows" aria-label="View the Classic Tour workflow">
          <span className="preview-card-title"><b>02</b> Classic Tour</span>
          <span className="preview-image preview-image-tour"><img src="/videos/property-tour-poster.jpg" alt="Agent-led Classic Tour preview" width="480" height="854" /></span>
          <strong>Agent-led tour with avatar and natural voice.</strong>
        </a>
        <a className="studio-preview-card" href="#workflows" aria-label="View the Social Video workflow">
          <span className="preview-card-title"><b>03</b> Social Video</span>
          <span className="preview-image preview-image-social"><img src="/homedash-singapore-hero.png" alt="Social Video property preview" width="1735" height="907" /></span>
          <strong>Short, attention-grabbing clips for every platform.</strong>
        </a>
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

      <section className="review-section" id="review" aria-labelledby="review-title">
        <div className="review-heading">
          <p className="eyebrow light">Verified public review</p>
          <h2 id="review-title">Early feedback from HomeDash Hong Kong.</h2>
          <p>This review is shown with its original wording, an English translation and a direct public source.</p>
        </div>
        <figure className="review-card">
          <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>
            <span lang="zh-Hant">“好用，直接在平台上對話”</span>
            <em>“Easy to use; you can chat directly on the platform.”</em>
          </blockquote>
          <figcaption>
            <div><strong>葵興深情</strong><span>HomeDash Hong Kong app user</span></div>
            <a href="https://apps.apple.com/hk/app/homedash-%E5%AE%B6%E9%80%9F/id6754503144" target="_blank" rel="noreferrer">View on the Apple App Store ↗</a>
          </figcaption>
          <p className="review-context">Consumer review of the Hong Kong property-search app; not a Singapore pilot or agency-workflow testimonial.</p>
        </figure>
      </section>

      <section className="tools-section" id="workflows">
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
                <a className="tool-cta" href="#booking">Join the agent pilot <span aria-hidden="true">↗</span></a>
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
              <li>Unlimited Photo Motion Video, Classic Tour and Social Video generation</li>
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

      <section className="pilot-package-section" id="pilot-package" aria-labelledby="pilot-package-title">
        <div className="pilot-package-heading">
          <div>
            <p className="eyebrow">Singapore pilot package</p>
            <h2 id="pilot-package-title">One week. Unlimited videos. Three ways to publish.</h2>
          </div>
          <div className="rolling-note"><span className="live-dot" /> Applications reviewed on a rolling basis</div>
        </div>
        <div className="pilot-package-stats">
          <article><strong><b>7</b> days</strong><p>unlimited video generation</p></article>
          <article><strong><b>≈5</b> min</strong><p>from ready property photos</p></article>
          <article><strong><b>3</b> formats</strong><p>Photo Motion, Classic Tour, Social Video</p></article>
        </div>
        <div className="pilot-formats" aria-label="Video formats included in the HomeDash pilot">
          <div><span>01</span><strong>Photo Motion Video</strong><p>Add smooth motion to static property photos.</p></div>
          <div><span>02</span><strong>Classic Tour</strong><p>Turn listing images into a guided property story.</p></div>
          <div><span>03</span><strong>Social Video</strong><p>Bring the agent on-screen through an approved avatar and voice.</p></div>
        </div>
        <div className="pilot-package-cta">
          <p>No fixed application deadline. Start when there is a suitable pilot slot.</p>
          <a className="button" href="#booking">Join the agent pilot <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div>
          <p className="eyebrow">Choose your pilot path</p>
          <h2 id="audience-title">A focused next step for how you work.</h2>
        </div>
        <div className="audience-paths">
          <article className="audience-path-primary" id="agent-pilot">
            <span>Primary path · For individual agents</span>
            <h3>Join the Singapore agent pilot.</h3>
            <p>Bring your photos and brand preferences. Test all three formats without a filming day or editing timeline.</p>
            <a className="button" href="#booking">Join the agent pilot <span aria-hidden="true">↗</span></a>
          </article>
          <article id="team-pilot">
            <span>For team leaders</span>
            <h3>Test a repeatable approval workflow with your team.</h3>
            <p>Choose a listing, an agent identity and a reviewer. Measure turnaround, consistency and reuse before a wider rollout.</p>
            <a className="audience-secondary-link" href="#booking">Discuss a team pilot <span aria-hidden="true">→</span></a>
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
            <div><span>JOIN THE SINGAPORE AGENT PILOT</span><strong>Singapore · pilot planning call</strong></div>
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

      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="faq-heading"><p className="eyebrow">Questions, answered</p><h2 id="faq-title">Before you join the pilot.</h2><p>Browse the practical details by topic—from pilot access to video creation and publishing control.</p></div>
        <div className="faq-groups">
          <article className="faq-group">
            <div className="faq-category"><span>01</span><h3>Pilot access</h3></div>
            <div className="faq-list">
              <details><summary>What is included in the one-week pilot?</summary><p>Unlimited generation across Photo Motion Video, Classic Tour and Social Video, plus agent-avatar setup and approval-ready social campaign drafts.</p></details>
              <details><summary>How many videos can I generate?</summary><p>There is no video-generation cap during your pilot week. You can test the three formats across as many suitable listings as you need.</p></details>
              <details><summary>Is there an application deadline?</summary><p>No fixed deadline. Applications are reviewed on a rolling basis and pilots begin when a suitable slot is available.</p></details>
            </div>
          </article>
          <article className="faq-group">
            <div className="faq-category"><span>02</span><h3>Video creation</h3></div>
            <div className="faq-list">
              <details><summary>Do agents need to film the property?</summary><p>No. HomeDash starts from property photos and listing details, then prepares motion, captions and voiceover for review.</p></details>
              <details><summary>How quickly can a video be produced?</summary><p>When property photos are ready, the HomeDash workflow can reduce production time to approximately five minutes.</p></details>
              <details><summary>What is needed for an agent-avatar video?</summary><p>One approved agent picture and a short voice note, together with the listing assets and brand preferences.</p></details>
            </div>
          </article>
          <article className="faq-group">
            <div className="faq-category"><span>03</span><h3>Publishing and control</h3></div>
            <div className="faq-list">
              <details><summary>Will social posts publish automatically?</summary><p>HomeDash prepares campaign drafts and a content queue. Customer-facing content is routed through human approval before publishing.</p></details>
              <details><summary>Where can generated videos be reused?</summary><p>Approved videos can be reused for property listings, social Reels, owner updates and planned content calendars.</p></details>
              <details><summary>Can a team leader test the workflow?</summary><p>Yes. Team pilots can test agent identity, reviewer roles, turnaround and brand consistency before considering a wider rollout.</p></details>
            </div>
          </article>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="HomeDash Singapore home"><img className="brand-logo" src="/homedash-logo.png" alt="HomeDash" width="476" height="186" /></a>
        <p>AI operating systems for real estate agencies.</p>
        <div className="footer-details">
          <a href="mailto:max@homedash.hk">Email: max@homedash.hk</a>
          <span>Location: Hong Kong</span>
          <a href="https://wa.me/85293173883" target="_blank" rel="noreferrer" aria-label="Contact HomeDash on WhatsApp at +852 9317 3883">WhatsApp: +852 9317 3883 ↗</a>
          <a href="https://homedash.ai/" target="_blank" rel="noreferrer">Global site ↗</a>
          <a href="#top">Back to top ↑</a>
        </div>
        <span>© 2026 HomeDash.ai</span>
      </footer>
    </main>
  );
}
