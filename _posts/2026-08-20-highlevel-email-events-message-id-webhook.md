---
title: "Send Webhooks with Real Email Message IDs in HighLevel"
date: 2026-08-20
source_url: "https://ideas.gohighlevel.com/changelog/email-events-message-id-now-available-in-the-dynamic-picker"
affiliate_link: default
cta_text: "Ready to scale your agency operations with HighLevel? Start your free trial today."
image: /assets/images/highlevel-email-events-message-id-webhook.png
---

If your agency relies on external reporting dashboards to track client email performance, you have likely run into a frustrating data matching problem. Until now, using HighLevel's Email Events trigger alongside a Send Webhook action meant passing open and click data without a reliable way to tie those events back to the specific message that caused them. 

HighLevel has quietly shipped a crucial fix for this: the unique Message ID is now accessible right inside the dynamic custom value picker. When you build out your webhook payload, you can pull this ID directly into your data stream.

### Why the Message ID Fix Matters for Agency Reporting

Previously, tracking email engagement via webhooks introduced a messy deduplication hurdle. The Email Opened event fires every single time a contact opens a message. If a recipient opens an email four times, your webhook fires four times. 

When external analytics engines or data warehouses tried to resolve which email generated those opens using an API call for 'most recently sent,' the logic frequently broke down. If a contact went back and opened an older nurture sequence email, the system would incorrectly attribute that open to the newest broadcast instead of the actual legacy message. 

With a stable Message ID riding along in the payload, your external database can finally group repeat opens against the exact email record. Four opens of the same message now cleanly collapse into a single engagement metric for that specific campaign. 

### How to Implement It in Your Workflows

Setting this up takes just a few seconds inside your automation builder:

1. Open any workflow triggered by **Email Events** (applicable to both Email Opened and Email Clicked).
2. Add a **Send Webhook** action to your sequence.
3. Open the custom value picker within the webhook body configuration.
4. Select **Message ID** and map it to your outgoing payload JSON.

Once configured, every single engagement event carries the exact string needed to update your custom dashboards accurately. 

For agencies building out bespoke reporting infrastructure for clients, small workflow data additions like this remove hours of custom API plumbing. To see how these infrastructure updates can streamline your client delivery, explore the platform on [HighLevel's official site](https://www.gohighlevel.com/?fp_ref=affiliatealfa).

### Better Data Quality Without Custom Code Workarounds

Agency clients care about engagement metrics, but they care even more about accuracy. When you pitch automated email nurturing campaigns, reporting inflated or misattributed open rates due to webhook limitations creates unnecessary friction during monthly reviews. 

By leveraging the native Message ID in your webhook payloads, you eliminate guessing games in your data warehouse. It is a minor configuration update inside the workflow builder, but it drastically improves the integrity of any third-party reporting stack you have connected to your sub-accounts.
