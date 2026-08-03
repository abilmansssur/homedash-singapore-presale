"use client";

import { FormEvent, useState } from "react";

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
  const [submitted, setSubmitted] = useState(false);

  function submitPilot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hi HomeDash, I’d like to discuss the Singapore market pilot.",
      `Name: ${form.get("name")}`,
      `Agency: ${form.get("agency")}`,
      `Contact: ${form.get("contact")}`,
      `Team size: ${form.get("teamSize")}`,
      `Priority: ${form.get("priority")}`,
    ].join("\n");

    window.open(
      `https://wa.me/85293173883?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitted(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HomeDash Singapore home">
          <span className="brand-mark">H</span>
          <span>HomeDash<span className="brand-dot">.ai</span></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#tools">Tools</a>
          <a href="#demos">Demos</a>
          <a href="#workflow">How it works</a>
          <a href="#pilot">Singapore pilot</a>
        </nav>
        <a className="button button-small" href="#pilot">Join the presale</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> Singapore market pilot · Presale 2026</p>
          <h1>One listing.<br /><em>Three ways</em> to win attention.</h1>
          <p className="hero-lede">
            HomeDash turns property photos into listing videos, agent-led AI tours and approved social campaigns—without a production crew.
          </p>
          <div className="hero-actions">
            <a className="button" href="#pilot">Request pilot access <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#tools">Explore the AI listing studio <span aria-hidden="true">↓</span></a>
          </div>
          <p className="microcopy">Built for Singapore property agents, teams and agencies.</p>
        </div>

        <div className="studio-shell" aria-label="Illustration of the HomeDash listing studio workflow">
          <div className="studio-topbar">
            <span className="studio-title"><span className="live-dot" /> Listing Studio</span>
            <span className="studio-status">Draft saved</span>
          </div>
          <div className="studio-body">
            <div className="source-card">
              <div className="property-scene" role="img" aria-label="Stylised Singapore condominium listing photo">
                <span className="building building-a" />
                <span className="building building-b" />
                <span className="building building-c" />
                <span className="scene-label">NEW LISTING · D09</span>
              </div>
              <div className="source-meta">
                <div><strong>Orchard residence</strong><span>3 bed · 2 bath · 1,184 sq ft</span></div>
                <span className="ready">Ready</span>
              </div>
            </div>
            <div className="flow-arrow" aria-hidden="true"><span>AI</span>→</div>
            <div className="output-stack">
              <div className="output-card active">
                <span className="output-icon">▶</span>
                <div><strong>Listing video</strong><small>9:16 · 38 sec</small></div>
                <span className="check">✓</span>
              </div>
              <div className="output-card">
                <span className="output-icon avatar-icon">A</span>
                <div><strong>Agent-led tour</strong><small>Avatar + voice</small></div>
                <span className="check">✓</span>
              </div>
              <div className="output-card">
                <span className="output-icon social-icon">#</span>
                <div><strong>Social campaign</strong><small>3 posts drafted</small></div>
                <span className="review">Review</span>
              </div>
            </div>
          </div>
          <div className="studio-footer">
            <span><i /> Photos imported</span><span><i /> Brand applied</span><span><i className="pending" /> Approval pending</span>
          </div>
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
              <div className={`tool-visual ${tool.visual}`}>
                {tool.visual === "video" && (
                  <>
                    <div className="media-label">FROM 8 PROPERTY PHOTOS</div>
                    <div className="phone-frame">
                      <div className="phone-scene"><span className="phone-play">▶</span><span className="phone-caption">Space to arrive.<br /><strong>Room to stay.</strong></span></div>
                      <div className="timeline"><span /><span /><span /><span /></div>
                    </div>
                    <div className="render-pill"><span className="spinner">✦</span> Motion, captions and voiceover prepared</div>
                  </>
                )}
                {tool.visual === "avatar" && (
                  <>
                    <div className="tour-screen">
                      <div className="tour-room"><span className="window" /><span className="sofa" /></div>
                      <div className="agent-bubble"><span className="agent-head" /><strong>Your agent</strong><small>Digital twin</small></div>
                      <div className="tour-subtitle">“Let me show you the view from the living room.”</div>
                    </div>
                    <div className="consent-note"><span>✓</span><div><strong>Agent-approved assets</strong><small>Photo · voice · brand profile</small></div></div>
                  </>
                )}
                {tool.visual === "social" && (
                  <>
                    <div className="calendar-head"><strong>Content queue</strong><span>Week 32</span></div>
                    <div className="social-grid">
                      <div className="social-post"><span className="post-day">MON</span><div className="post-image p1" /><strong>New listing</strong><small>Instagram · Draft</small></div>
                      <div className="social-post"><span className="post-day">WED</span><div className="post-image p2" /><strong>Market pulse</strong><small>LinkedIn · Approved</small></div>
                      <div className="social-post"><span className="post-day">FRI</span><div className="post-image p3" /><strong>Agent insight</strong><small>Facebook · Review</small></div>
                    </div>
                    <div className="approval-bar"><span>Human approval required</span><button type="button">Review all</button></div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-section" id="demos">
        <div className="demo-heading">
          <div>
            <p className="eyebrow">See the workflows in action</p>
            <h2>Real product demos.<br />No slideware.</h2>
          </div>
          <p>Watch HomeDash turn listing assets into an agent-led property story and an always-on social marketing workflow.</p>
        </div>

        <div className="demo-grid">
          <article className="demo-card">
            <div className="demo-video-shell">
              <video controls playsInline preload="metadata" poster="/videos/property-tour-poster.jpg" aria-label="HomeDash AI property tour demonstration">
                <source src="/videos/property-tour-demo.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              <span className="demo-duration">00:57</span>
            </div>
            <div className="demo-meta">
              <span>01</span>
              <div><p>AI property tour</p><h3>From property assets to an agent-led tour.</h3></div>
            </div>
          </article>

          <article className="demo-card">
            <div className="demo-video-shell">
              <video controls playsInline preload="metadata" poster="/videos/post-creation-poster.jpg" aria-label="HomeDash automated social post creation demonstration">
                <source src="/videos/automated-post-creation.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              <span className="demo-duration">00:55</span>
            </div>
            <div className="demo-meta">
              <span>02</span>
              <div><p>Automated post creation</p><h3>Turn a content brief into a branded post.</h3></div>
            </div>
          </article>

          <article className="demo-card">
            <div className="demo-video-shell">
              <video controls playsInline preload="metadata" poster="/videos/automated-marketing-poster.jpg" aria-label="HomeDash automated marketing workflow demonstration">
                <source src="/videos/automated-marketing.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              <span className="demo-duration">00:52</span>
            </div>
            <div className="demo-meta">
              <span>03</span>
              <div><p>Automated marketing</p><h3>Keep the campaign moving with human approval.</h3></div>
            </div>
          </article>
        </div>

        <div className="demo-cta">
          <p><span className="live-dot" /> Three live workflows. One connected content engine.</p>
          <a className="button button-small" href="#pilot">Discuss a pilot use case <span aria-hidden="true">↗</span></a>
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
          <p>In a focused 20-minute call, we’ll map your workflow, approval points and what a useful first result should look like.</p>
          <ul className="pilot-benefits">
            <li><span>01</span><div><strong>Singapore-ready workflow</strong><p>Localised around your listing, brand and team structure.</p></div></li>
            <li><span>02</span><div><strong>Early product influence</strong><p>Help shape the templates and controls your team needs.</p></div></li>
            <li><span>03</span><div><strong>Focused first use case</strong><p>Start with video, avatar tours or social marketing—not a giant rollout.</p></div></li>
          </ul>
        </div>
        <form className="pilot-form" onSubmit={submitPilot}>
          <div className="form-head"><span>MARKET PILOT APPLICATION</span><strong>Singapore · 2026</strong></div>
          <label>Name<input name="name" required placeholder="Your name" /></label>
          <label>Agency / company<input name="agency" required placeholder="Agency name" /></label>
          <label>Email or WhatsApp<input name="contact" required placeholder="How should we reach you?" /></label>
          <div className="form-row">
            <label>Team size<select name="teamSize" defaultValue=""><option value="" disabled>Select</option><option>Independent agent</option><option>2–10 agents</option><option>11–50 agents</option><option>51+ agents</option></select></label>
            <label>Priority workflow<select name="priority" defaultValue="Listing video"><option>Listing video</option><option>Agent-avatar tour</option><option>Social marketing</option><option>Full content loop</option></select></label>
          </div>
          <button className="button form-button" type="submit">Request pilot access <span>↗</span></button>
          <p className="form-note">Opens a pre-filled WhatsApp message. You stay in control of sending it.</p>
          {submitted && <p className="success-message" role="status">Your pilot request is ready in WhatsApp. We look forward to speaking with you.</p>}
          <a className="email-link" href="mailto:info@homedash.hk">Prefer email? info@homedash.hk</a>
        </form>
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
