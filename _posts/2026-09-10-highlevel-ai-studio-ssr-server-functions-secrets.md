---
title: "Build Real Apps Inside HighLevel with AI Studio's New Stack"
date: 2026-09-10
source_url: "https://ideas.gohighlevel.com/changelog/ai-studio-introducing-ssr-server-functions-secrets"
affiliate_link: ai
cta_text: "Discover how HighLevel's advanced AI capabilities can transform your agency's tech stack."
image: /assets/images/highlevel-ai-studio-ssr-server-functions-secrets.png
---

HighLevel has quietly pushed out an update to AI Studio that changes what you can build inside the platform. Until now, asking the AI to spin up a web app usually meant getting a static frontend wrapped in a template—great for a quick prototype, but practically useless if you needed real backend logic, secure API keys, or proper search engine indexing.

That limitation is gone. New AI Studio projects now run on TanStack Start, bringing true full-stack architecture directly into your agency dashboard. For marketing agencies building client tools, lead-gen widgets, or custom web apps, this opens up practical deployment options that previously required a separate developer stack.

### What the New Stack Means for Agency Builders

The addition of three core architectural layers solves the traditional roadblocks of no-code and AI-generated apps:

* **Native Server-Side Rendering (SSR):** Previous AI builders generated single-page applications that crawled poorly on search engines and social sharing cards. With SSR, every page is fully rendered on each request. Google, LinkedIn, and Twitter see actual HTML, meaning your dynamically generated pages are finally SEO-friendly out of the box.
* **Server Functions & REST APIs:** You can now run backend logic securely without exposing your code to the browser. The system supports full REST endpoints (`/api/...`), allowing your app to handle JSON payloads, execute webhooks, and communicate with external software while keeping your primary logic hidden from a simple 'View Source' browser check.
* **A Secure Secrets Vault:** API keys and sensitive tokens can finally be stored securely. They no longer leak into the frontend client bundle or get exposed during chat prompts, making it safe to connect external services like CRMs, payment gateways, or custom databases directly from your AI-built application.

### A Practical Use Case for Agencies

Imagine you are building a custom client-facing portal that pulls live data from an external industry database, calculates custom quotes, and submits a webhook back to your main CRM. Previously, doing this inside HighLevel meant stitching together third-party hosting, setting up environment variables on Vercel or AWS, and managing CORS issues.

Now, you can prompt AI Studio to build the multi-page interface, write the server-side functions to query the external database using securely stored vault keys, and expose a clean REST endpoint to handle incoming data. You publish the entire thing directly from your workspace as a live, functional web application rather than a static zip file.

### Moving Forward

Existing Vite and React projects continue to run unchanged, and HighLevel has promised a migration guide for older apps down the road. But for new projects, the barrier between a basic landing page generator and a full-stack web application has effectively vanished.

If you want to leverage these capabilities to build internal utilities or client-facing applications without maintaining a separate server infrastructure, it is worth exploring what [HighLevel's AI tools](https://www.gohighlevel.com/ai?fp_ref=affiliatealfa) can do for your agency's workflow automation and custom application development.
