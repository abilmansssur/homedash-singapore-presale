import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://singapore.homedash.ai/", {
      headers: { accept: "text/html", host: "singapore.homedash.ai" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the HomeDash Singapore presale page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>HomeDash Singapore \| AI Listing Studio Presale<\/title>/i);
  assert.match(html, /One listing/);
  assert.match(html, /\/homedash-singapore-hero\.png/i);
  assert.match(html, /Static image → AI video/i);
  assert.match(html, /Agent-led AI property tour/i);
  assert.match(html, /Automated social marketing/i);
  assert.match(html, /RICACORP PROPERTIES/i);
  assert.match(html, /CENTURY 21/i);
  assert.match(html, /\/logo-ricacorp\.png/i);
  assert.match(html, /\/logo-century21\.png/i);
  assert.match(html, /\/logo-gamway\.png/i);
  assert.match(html, /\/logo-sunrise\.png/i);
  assert.doesNotMatch(html, /LAND MASTER|伯樂行/i);
  assert.match(html, /30\+/i);
  assert.match(html, /912/);
  assert.doesNotMatch(html, /168\.6K|GMA users/i);
  assert.match(html, /As Featured In/i);
  assert.match(html, /hkej\.com\/dailynews\/ceoai\/article\/4016842/i);
  assert.match(html, /am730\.com\.hk\/column/i);
  assert.match(html, /etnet\.com\.hk\/www\/tc\/news/i);
  assert.match(html, /itpromag\.com\/2024\/12\/13\/mooneybird/i);
  assert.match(html, /HomeDash in 60 seconds/i);
  assert.match(html, /\/homedash-product-story-60s\.mp4/i);
  assert.doesNotMatch(html, /STOP and do-not-contact|transaction PDF/i);
  assert.match(html, /Part of the wider HomeDash platform/i);
  assert.match(html, /not part of the one-week content pilot/i);
  assert.match(html, /One week\. Unlimited videos/i);
  assert.match(html, /AutoPan/i);
  assert.match(html, /Classic Tour/i);
  assert.match(html, /approximately five minutes/i);
  assert.doesNotMatch(html, /id="demos"|See the workflows in action/i);
  assert.match(html, /\/videos\/property-tour-demo\.mp4/i);
  assert.match(html, /\/videos\/automated-post-creation\.mp4/i);
  assert.match(html, /\/videos\/automated-marketing\.mp4/i);
  assert.match(html, /\/videos\/property-tour-poster\.jpg/i);
  assert.match(html, /\/dashboard-property-tour\.png/i);
  assert.match(html, /\/dashboard-image-processing\.png/i);
  assert.match(html, /\/dashboard-listing-poster\.png/i);
  assert.match(html, /Singapore market pilot/i);
  assert.match(html, /Apply for the Singapore pilot/i);
  assert.match(html, /Input/i);
  assert.match(html, /Best for/i);
  assert.match(html, /Pilot this workflow/i);
  assert.match(html, /For individual agents/i);
  assert.match(html, /For team leaders/i);
  assert.doesNotMatch(html, /A specific Singapore opening/i);
  assert.doesNotMatch(html, /Typical listing stack|Book a 20-minute call/i);
  assert.match(html, /https:\/\/calendly\.com\/max-homedash\/30min/i);
  assert.match(html, /og\.png/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
