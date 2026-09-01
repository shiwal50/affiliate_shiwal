---
title: "HighLevel Workflow Update: Pick Sender Domains per Automation"
date: 2026-09-01
source_url: "https://ideas.gohighlevel.com/changelog/workflow-builder-pick-an-email-sender-domain-for-each-workflow"
affiliate_link: default
cta_text: "Ready to streamline your agency's client workflows and email infrastructure? See what else the platform can do."
image: /assets/images/highlevel-workflow-sender-domain-selection.png
---

For years, agency owners running email marketing out of HighLevel sub-accounts faced an annoying architectural limitation: every single automated email sent from a sub-account shared the exact same underlying sending domain. Even if you changed the display 'From' address on a workflow, the actual sending domain remained tied to your global configuration.

That meant high-risk marketing blasts and critical transactional messages like booking confirmations, password resets, and payment receipts all rose and fell together. If a promotional campaign triggered a sudden spike in spam complaints or minor deliverability flags, your transactional receipts took the hit right alongside it. 

HighLevel has finally solved this issue with a targeted update to the workflow builder.

### Granular Control Over Sender Domains

You can now select a specific verified dedicated domain directly inside Workflow Settings via a new Sender domain dropdown. Rather than forcing every automation to rely on a single global pool, you can segment your outbound traffic by workflow type.

For example, an agency managing a local clinic can route all appointment reminders, intake forms, and billing receipts through a secure transactional domain like `mail.acmeclinic.com`. Meanwhile, automated monthly nurture sequences and promotional campaigns can fire from a completely separate subdomain like `news.acmeclinic.com`. 

If a promotional blast underperforms or triggers user friction, the reputation penalty stays isolated to that specific subdomain. Your core operational workflows continue landing safely in the inbox.

### How It Works in Practice

Setting this up takes just a few clicks inside your sub-account setup:

1. Ensure your domains are fully authenticated and verified under **Email Services > Dedicated Domains**.
2. Open any workflow, navigate to **Settings**, and locate the **Sender domain** dropdown.
3. Choose your specific verified domain and define your email prefix and display name. 

If you leave the setting on 'All domains,' HighLevel will continue using your standard weighted distribution across configured domains. But for workflows that demand isolation—like cold outreach, aggressive sales sequences, or sensitive client notifications—locking them to a dedicated domain gives you enterprise-grade deliverability protection.

It is also worth noting that individual email action steps retain override capabilities. If you need a specific email inside a larger sequence to deploy from a different address, action-level settings will take final preference.

### Why This Matters for Agencies

Deliverability is the invisible foundation of client retention. When an automated text or email fails to land, clients blame the agency, not the underlying mail servers. By separating transactional communication from marketing volume, you drastically reduce the risk of client panic over sudden spam folder dips.

This update also opens up safer testing environments. When rolling out a brand new lead nurture campaign for a local business, you can route that specific workflow through an isolated subdomain to monitor engagement metrics before scaling volume across the rest of the account.

To see how updates like this continue to refine agency operations, [explore HighLevel](https://www.gohighlevel.com/?fp_ref=affiliatealfa) and test out the latest workflow architecture for yourself.
