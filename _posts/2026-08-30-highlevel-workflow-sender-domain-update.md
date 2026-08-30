---
title: "HighLevel Workflow Update: Pick Sender Domain Per Workflow"
date: 2026-08-30
source_url: "https://ideas.gohighlevel.com/changelog/workflow-builder-pick-an-email-sender-domain-for-each-workflow"
affiliate_link: default
cta_text: "Ready to streamline your agency's email infrastructure on HighLevel?"
image: /assets/images/highlevel-workflow-sender-domain-update.png
---

HighLevel has quietly pushed out one of the most critical email deliverability updates for marketing agencies managing client sub-accounts: you can now select a specific sender domain directly inside the workflow builder settings.

Up until now, configuring sender details on a workflow only changed the visible 'From' name and prefix. The actual domain used to send the message was tied globally across the board. That meant transactional emails, like booking confirmations and appointment reminders, shared the exact same infrastructure as your cold outbound or monthly promotional blasts. If a aggressive promo campaign got flagged or hit spam traps, your critical client receipts and calendar confirmations ran the risk of going down with it.

### How the Sender Domain Dropdown Works

Inside any workflow, navigate to Settings, and you will find a new **Sender domain** dropdown under Sender details. This dynamically populates with any verified dedicated domain configured for that specific sub-account.

You have two main paths here:
1. **All domains:** This retains the old behavior, utilizing the weighted distribution across your configured domains with a custom prefix like `marketing`.
2. **A specific verified domain:** Select a precise domain (e.g., `mail.clientdomain.com`), and every single email action fired within that specific workflow will route through that exact infrastructure.

If you happen to type a full sender email address that conflicts with your selection, HighLevel throws a domain mismatch warning to protect you from hurting your deliverability scores. Furthermore, individual email actions can still override the workflow-level settings if you need granular control over a specific step.

### Why This Matters for Agency Operations

For agencies running heavy automation for local businesses, this is a massive risk mitigation feature. 

Consider a medical clinic or a home service contractor. Their appointment reminders and payment receipts are high-value operational messages that must hit the inbox. By isolating those workflows onto a dedicated transactional domain (like `reminders.clientdomain.com`), you can run separate promotional nurturing sequences on a completely different domain (`news.clientdomain.com`). 

If a promotional campaign tanks or receives high spam complaints, the fallout is contained strictly to the marketing domain. Your client's core operational communications stay clean, protected, and out of the spam folder.

This also opens up safer testing environments. When you are onboarding a new client or trying out a brand new cold email sequence, you can test a fresh domain on a single workflow without risking the primary sending reputation of the entire business.

To start taking advantage of advanced routing and robust client setups like this, make sure your dedicated domains are verified under Email Services. If you are ready to scale your agency's operations and see what else the platform can do, take a look at the [HighLevel main platform overview](https://www.gohighlevel.com/?fp_ref=affiliatealfa) to explore all the latest infrastructure updates.

Small infrastructure tweaks like this prevent major client headaches down the line. Go into your sub-account workflows today and segment your transactional traffic from your marketing blasts.
