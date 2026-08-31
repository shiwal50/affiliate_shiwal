---
title: "HighLevel Workflow Update: Pick Sender Domains Per Workflow"
date: 2026-08-31
source_url: "https://ideas.gohighlevel.com/changelog/workflow-builder-pick-an-email-sender-domain-for-each-workflow"
affiliate_link: default
cta_text: "Ready to streamline your agency's client workflows and email infrastructure?"
image: /assets/images/highlevel-workflow-sender-domain-selection.png
---

For years, running email marketing inside a HighLevel sub-account meant tying your entire outbound reputation to a single mast. If you changed the sender address on a workflow, you were only tweaking the display name. The actual domain sending the payload remained locked at the sub-account level. 

That meant a high-volume promotional blast and an essential booking receipt shared the exact same infrastructure. If a cold outreach campaign ticked off spam filters or suffered from a high bounce rate, your transactional notifications—like appointment reminders and payment confirmations—risked sinking right down into the junk folder alongside it. 

HighLevel has finally solved this structural bottleneck by rolling out dedicated sender domain selection directly inside individual workflow settings. 

### How Workflow-Level Domain Routing Works

When you open up a workflow's settings, you will now spot a new Sender domain dropdown under the sender details section. Providing you have verified dedicated domains set up under your sub-account's Email Services, you can explicitly assign which domain handles every single email action inside that specific automation.

You have two clear paths here:

1. **All domains:** This keeps the old behavior intact, using your standard weighted distribution across configured domains while letting you prepend a custom email prefix like 'marketing'.
2. **Specific domain:** You pick an isolated, verified domain (for instance, `news.yourdomain.com` for newsletters and `mail.yourdomain.com` for client onboarding) and lock that workflow into using it exclusively.

Crucially, individual email actions still retain ultimate override power if you need to force a specific address on a single step, and the system throws a handy warning if it detects a domain mismatch that could harm your deliverability.

### Why This Changes the Game for Agencies

If you manage client sub-accounts that mix transactional workflows with heavy marketing automation, this update is a massive risk mitigator. 

Consider a local service business running automated review requests, emergency booking confirmations, and aggressive monthly discount pushes. Previously, an aggressive discount campaign that triggered a spike in spam complaints could temporarily torch domain reputation for the entire sub-account, blinding the client to incoming appointment notices. 

By segregating your operational touchpoints onto dedicated transactional domains and keeping marketing volume contained elsewhere, you protect your client's core business functions. If a promotional sequence underperforms or generates friction, the fallout is isolated entirely to that specific sending domain. It also gives agencies a safe sandbox to test out newly warmed domains on a single automated sequence before migrating a client's entire email volume over.

To see how these advanced routing controls fit into a broader agency tech stack, take a look at the [HighLevel platform overview](https://www.gohighlevel.com/?fp_ref=affiliatealfa) to explore how modern CRM architecture can protect your client deliverables.

### Implementation Checklist

Before you start moving workflows around, make sure your infrastructure is prepped:

* Head over to **Email Services > Dedicated Domains** and ensure all relevant domains are fully authenticated and verified.
* Audit your existing high-volume promotional workflows versus your transactional sequences.
* Move your critical paths—such as appointment reminders, form receipts, and member onboarding—onto a dedicated sending domain.
* Leave your promotional sequences on a separate domain so reputation issues never cross contamination boundaries.

It is a subtle backend adjustment, but for agencies serious about inbox placement and deliverability, this update eliminates one of the platform's most persistent legacy limitations.
