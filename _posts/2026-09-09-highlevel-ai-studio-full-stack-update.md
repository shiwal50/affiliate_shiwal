---
title: "AI Studio Gets Full-Stack: SSR, Server Functions & Secrets"
date: 2026-09-09
source_url: "https://ideas.gohighlevel.com/changelog/ai-studio-introducing-ssr-server-functions-secrets"
affiliate_link: ai
cta_text: "Ready to build smarter automated applications inside HighLevel? Check out the latest platform capabilities today."
image: /assets/images/highlevel-ai-studio-full-stack-update.png
---

HighLevel has just pushed out an update that fundamentally changes what you can build inside AI Studio. Up until now, prompting the studio meant generating a nice-looking frontend—essentially a static single-page app wrapped in a pretty interface. Useful for mockups, but limiting if you needed real backend logic, secure API keys, or actual SEO performance.

The latest update shifts AI Studio over to TanStack Start, turning it into a full-stack web app builder with native server-side rendering (SSR), server functions, and a dedicated secrets vault. For marketing agencies building client-facing tools or custom lead-gen applications, this removes a massive technical hurdle.

### Why Native SSR Matters for Agencies

If you have ever tried to rank an AI-generated landing page or web app on Google, you know the frustration of the empty root div. Traditional client-side React apps often leave search engine crawlers and social media scrapers staring at blank HTML until JavaScript executes.

With native SSR built straight into AI Studio, every page renders fully on the server on every single request. When Google, LinkedIn, or Slack crawls your URL, they receive real HTML with correct titles, descriptions, and headings immediately. You no longer have to cross your fingers and hope prerendering plugins cooperate. Even if a user has JavaScript disabled in their browser, the page loads and renders correctly.

### Backend Logic Without Managing Servers

Building out custom backend infrastructure usually means spinning up separate node servers, setting up environment variables, and worrying about hosting costs and CORS policies. 

AI Studio now handles this natively through server functions and REST endpoints. Your app can load data, communicate with external APIs, and run backend computations safely. Because these functions execute entirely on the server, the browser never sees the implementation details. Your proprietary logic and database queries stay hidden.

Furthermore, the new secrets vault means you can drop sensitive API keys and authentication tokens straight into your project without risking client-side exposure. Credentials never leak into the frontend bundle or show up when someone right-clicks to view the source code. Your applications can safely interact with third-party web services right out of the box.

### What This Means for Your Agency Tech Stack

For agencies looking to prototype fast and deploy functional micro-apps, client portals, or internal utility tools, this update bridges the gap between no-code builders and custom coding. You can prompt your way to a fully deployed application complete with unique URLs, secure data handling, and public REST endpoints without ever leaving the ecosystem.

Existing Vite and React projects will continue running normally without interruption, but any new project initiated in the studio immediately takes advantage of this robust runtime framework. If you want to see how these automation and development tools fit into your broader agency operations, take a closer look at [HighLevel's AI tools](https://www.gohighlevel.com/ai?fp_ref=affiliatealfa) to see what is possible for your client delivery pipelines.

This is a major step forward for agencies trying to consolidate their software stack. By letting AI generate not just the UI, but the underlying server logic and API routes as well, building custom client solutions just got significantly faster.
