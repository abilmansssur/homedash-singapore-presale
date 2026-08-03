const tools = [
  {
    number: "01",
    eyebrow: "STATIC IMAGE → AI VIDEO",
    title: "Turn listing photos into scroll-stopping motion.",
    copy: "Upload a set of property photos and HomeDash prepares a polished vertical listing video—camera movement, captions, transitions and voiceover included.",
    points: ["No filming day", "No editing timeline", "Ready for review"],
    visual: "video",
  },
  {
    number: "02",
    eyebrow: "AGENT-LED AI PROPERTY TOUR",
    title: "Put the agent back inside every property story.",
    copy: "Add one approved agent photo and a short voice sample. HomeDash creates an agent-avatar property tour that feels personal, consistent and ready for your brand review.",
    points: ["Agent avatar", "Branded voiceover", "Reusable format"],
    visual: "avatar",
  },
  {
    number: "03",
    eyebrow: "AUTOMATED SOCIAL MARKETING",
    title: "Keep your content calendar moving—with control.",
    copy: "Turn listings and local market signals into branded images, captions and campaign drafts. Your team approves customer-facing work before anything is published.",
    points: ["Local content research", "Brand-aware drafts", "Human approval"],
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
          <a href="#pilot">Singapore pilot</a>
        </nav>
        <a className="button button-small" href="#booking">Book a 30-minute call</a>
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
          <a className="button" href="#booking">Book a 30-minute call <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="research-strip" aria-label="Singapore market research finding">
        <p className="eyebrow">A specific Singapore opening</p>
        <div>
          <strong>5</strong>
          <p>major portal and agency toolsets reviewed</p>
        </div>
        <div className="research-line" />
        <p className="research-finding">
          The reviewed tools cover distribution, analytics and lead workflows. <em>Fully automated static-image-to-video listing generation was not found.</em>
        </p>
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
          <div><strong>RICACORP PROPERTIES</strong><span>利嘉閣</span></div>
          <div><strong>CENTURY 21</strong><span>世紀21</span></div>
          <div><strong>GAMWAY PROPERTY</strong><span>金滙地產</span></div>
          <div><strong>SUNRISE PROPERTY</strong><span>太陽物業</span></div>
          <div><strong>LAND MASTER</strong><span>伯樂行</span></div>
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
          <p>Three connected tools turn the assets you already have into a consistent, always-on content engine.</p>
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

      <section className="workflow-section" id="workflow">
        <div className="workflow-heading">
          <p className="eyebrow">One connected content loop</p>
          <h2>Automation with a visible decision boundary.</h2>
          <p>Move quickly where AI helps. Keep a person in control where your reputation matters.</p>
        </div>
        <ol className="workflow-steps">
          <li><span>01</span><strong>Capture</strong><p>Property photos, listing details and local market signals enter one workspace.</p></li>
          <li><span>02</span><strong>Prepare</strong><p>AI builds video, agent-tour and social variants around your brand.</p></li>
          <li><span>03</span><strong>Approve</strong><p>Your team reviews customer-facing content before it goes live.</p></li>
          <li><span>04</span><strong>Publish</strong><p>Approved content is ready for your selected channels and follow-up.</p></li>
        </ol>
      </section>

      <section className="difference-section">
        <div className="difference-copy">
          <p className="eyebrow">Built for the gap between listing and attention</p>
          <h2>Your portal helps people find the listing.<br /><em>HomeDash helps them feel it.</em></h2>
        </div>
        <div className="comparison">
          <div className="comparison-row comparison-head"><span>Workflow</span><span>Typical listing stack</span><span>HomeDash studio</span></div>
          <div className="comparison-row"><span>Publish listing data</span><span className="yes">✓</span><span className="yes">✓</span></div>
          <div className="comparison-row"><span>Create video from photos</span><span className="no">—</span><span className="highlight">Automated</span></div>
          <div className="comparison-row"><span>Add the agent on-screen</span><span className="no">—</span><span className="highlight">Agent avatar</span></div>
          <div className="comparison-row"><span>Prepare ongoing social content</span><span>Separate tools</span><span className="highlight">One workflow</span></div>
          <div className="comparison-row"><span>Approval before publishing</span><span>Varies</span><span className="highlight">Built in</span></div>
        </div>
      </section>

      <section className="pilot-section" id="pilot">
        <div className="pilot-copy">
          <p className="eyebrow light">Singapore market pilot · Limited intake</p>
          <h2>Bring one live listing bottleneck.<br />Leave with a practical pilot plan.</h2>
          <p>In a focused 30-minute call, we’ll map your workflow, approval points and what a useful first result should look like.</p>
          <ul className="pilot-benefits">
            <li><span>01</span><div><strong>Singapore-ready workflow</strong><p>Localised around your listing, brand and team structure.</p></div></li>
            <li><span>02</span><div><strong>Early product influence</strong><p>Help shape the templates and controls your team needs.</p></div></li>
            <li><span>03</span><div><strong>Focused first use case</strong><p>Start with video, avatar tours or social marketing—not a giant rollout.</p></div></li>
          </ul>
        </div>
        <div className="booking-panel" id="booking">
          <div className="booking-head">
            <div><span>BOOK YOUR PILOT CONSULTATION</span><strong>Singapore · 30 minutes</strong></div>
            <p>Select an available time without leaving the page.</p>
          </div>
          <iframe
            className="calendly-frame"
            src="https://calendly.com/max-homedash/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=17203d&primary_color=ffb21a"
            title="Book a 30-minute HomeDash Singapore pilot consultation"
            loading="lazy"
          />
          <div className="booking-fallback">
            <span>Prefer another channel?</span>
            <a href="https://wa.me/85293173883" target="_blank" rel="noreferrer">Discuss your use case on WhatsApp ↗</a>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div><p className="eyebrow">Questions, answered</p><h2>Before you join the pilot.</h2></div>
        <div className="faq-list">
          <details><summary>Do agents need to film the property?</summary><p>No. The static-image-to-video workflow starts from property photos and listing details. HomeDash prepares the motion, captions and voiceover for review.</p></details>
          <details><summary>What is needed for an agent-avatar tour?</summary><p>One approved agent photo and a short voice sample, plus your listing assets and brand preferences. Your team reviews the result before use.</p></details>
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
