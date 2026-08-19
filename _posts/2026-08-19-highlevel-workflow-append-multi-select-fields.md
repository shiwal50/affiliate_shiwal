---
title: "Stop Overwriting Contact Data: New Workflow Field Append"
date: 2026-08-19
source_url: "https://ideas.gohighlevel.com/changelog/update-contact-field-now-append-values-to-multi-select-fields"
affiliate_link: default
cta_text: "Ready to clean up your agency automations? See what else HighLevel can do."
image: /assets/images/highlevel-workflow-append-multi-select-fields.png
---

If you have ever built complex client onboarding sequences in HighLevel, you have likely run into a frustrating limitation with multi-select fields. Until now, using the 'Update Contact Field' action inside a workflow meant completely overwriting whatever values were already stored in a multi-dropdown or checkbox field. If a contact already checked three items on a form and a later automation step updated that same field, previous selections would vanish unless you built convoluted, multi-branch conditional logic to check existing values first.

HighLevel has finally solved this friction point by introducing an explicit 'Add' action type for multi-select fields in the workflow builder. 

### How the New Append Logic Works

When you configure an 'Update Contact Field' step in your workflow now, you can explicitly choose between updating, clearing, or adding to field data. When you select the 'Add' operation, the field picker intelligently filters your options to show only multi-dropdown and multiple-checkbox fields. 

Instead of wiping out historical data, the system simply appends the new selection to the end of the existing array. 

Consider a practical agency use case: a local service client runs a comprehensive intake form where leads select areas of interest from a multi-checkbox field called 'Services Needed'. A lead initially checks 'SEO' and 'PPC'. A few days later, they interact with an automated SMS campaign and reply expressing interest in 'Web Design'. 

Previously, triggering an update step to add 'Web Design' would require you to pull all existing tags, run custom code or complex conditional branches, and rewrite the entire array. If you didn't, the automation would accidentally erase 'SEO' and 'PPC', leaving your sales team blind to their initial intent. With the new append action, 'Web Design' is seamlessly stacked onto the existing selections. The contact profile now accurately reflects all three interests without requiring custom webhooks or messy workaround logic.

### Why This Matters for Agency Operations

Clean data is the foundation of effective segmentation. When automations accidentally overwrite user preferences, downstream email campaigns, smart lists, and dynamic trigger links break down. Leads receive irrelevant messaging because half their profile data got wiped out by a poorly configured workflow step.

This update removes a massive headache for automation builders. It keeps your CRM records intact, ensures historical context is preserved across multi-touch journeys, and drastically reduces the number of nested branches you need to build in complex client pipelines. It is a small backend adjustment that saves hours of troubleshooting and keeps your client databases pristine.

To see how these continuous updates can streamline your agency's tech stack, take a closer look at what is possible by exploring the [HighLevel platform overview](https://www.gohighlevel.com/?fp_ref=affiliatealfa).

### Implementation Checklist

If you want to take advantage of this feature right away, audit your existing workflows where contact properties get updated iteratively. Look specifically for client intake sequences, multi-step quiz funnels, and long-term nurture campaigns where leads accumulate preferences over time. Swap out destructive overwrite actions for the new append operation to ensure your data stays unified and reliable.
