---
name: bug-report
description: >
  Create structured, reproducible bug reports for software defects. Load when asked to
  file a bug, report an issue, write a defect report, or document unexpected behavior.
  Generates complete bug reports with steps to reproduce, expected vs actual behavior,
  severity classification, environment details, and evidence. Also provides templates
  for Jira, GitHub Issues, and Linear. Trigger phrases: "report this bug", "file a bug",
  "write a bug report", "this is broken", "defect report", "issue template", "bug template",
  "document this issue", "create a ticket".
metadata:
  author: qa-skill-builder
  version: '1.0'
---

# Bug Report Skill

## When to Use This Skill

- User found unexpected behavior and needs to document it
- User wants to create a bug ticket for Jira, GitHub Issues, or Linear
- User wants a standardized template for their team
- User needs to classify severity/priority of a defect

## Workflow

1. **Gather information** — ask user for: what happened, what was expected, how to reproduce
2. **Classify severity** — use the severity matrix below
3. **Identify environment** — OS, browser, version, environment (prod/staging)
4. **Write report** — use the standard template
5. **Attach evidence** — note where to add logs, screenshots, video
6. **Format for tool** — adapt to Jira, GitHub Issues, or Linear format

## Severity Classification Matrix

| Severity | Definition | Examples |
|---|---|---|
| **Critical (S1)** | System down, data loss, security breach, no workaround | Login broken for all users, data corruption, exposed credentials |
| **High (S2)** | Major feature broken, significant user impact, no workaround | Payment flow fails, key API returns 500, core feature unusable |
| **Medium (S3)** | Feature partially broken, workaround exists | Button works on Chrome but not Firefox, slow page load, wrong calculation |
| **Low (S4)** | Minor cosmetic issue, minimal user impact | Typo, misaligned UI element, incorrect tooltip text |

## Priority vs Severity

```
Priority = Business impact × Urgency
Severity = Technical impact on the system

A cosmetic bug on the homepage (S4) can be P1 if it goes live tomorrow.
A major feature bug (S2) can be P3 if it affects 0.1% of users.

Always set BOTH independently.
```

## Standard Bug Report Template

```markdown
## Summary
[One line: what broke, where, and impact]
Example: "User cannot reset password — reset email is never sent"

## Environment
- **App version / Commit**: v2.3.1 / abc1234
- **Environment**: Production / Staging / Dev
- **OS**: macOS 14.3 / Windows 11 / Ubuntu 22.04
- **Browser**: Chrome 123 / Firefox 124 / Safari 17 (if applicable)
- **Device**: Desktop / iPhone 15 Pro / Samsung Galaxy S24
- **User role**: Admin / Free user / Guest

## Steps to Reproduce
1. Go to [URL]
2. Click on [element]
3. Fill in [field] with [value]
4. Click [action]
5. Observe [what happens]

## Expected Behavior
[What SHOULD happen according to spec or intuition]

## Actual Behavior
[What ACTUALLY happens — be precise, use exact text from UI/logs]

## Severity / Priority
- **Severity**: Critical / High / Medium / Low
- **Priority**: P1 / P2 / P3 / P4
- **Affected Users**: All / % estimate / specific role

## Frequency
- [ ] Always (100%)
- [ ] Often (>50%)
- [ ] Sometimes (~25%)
- [ ] Rarely (<10%)
- [ ] Once (could not reproduce)

## Evidence
- **Screenshot**: [attach]
- **Video**: [attach or Loom link]
- **Console errors**: 
  ```
  [paste browser console errors here]
  ```
- **Network request/response**:
  ```
  [paste relevant XHR/API response here]
  ```
- **Server logs**:
  ```
  [paste relevant log lines with timestamps]
  ```

## Workaround
[If any exists, describe it. Otherwise: "None"]

## Root Cause Hypothesis
[Optional — QA's guess about what's causing this]

## Linked Issues
- Related to: #[issue number]
- Blocks: #[issue number]
- Duplicate of: #[issue number]
```

## Platform-Specific Formats

### GitHub Issues Template

```markdown
---
name: Bug Report
about: Report unexpected behavior
labels: bug, needs-triage
---

**Summary**
<!-- One-line description of the bug -->

**Steps to Reproduce**
1. 
2. 
3. 

**Expected Behavior**
<!-- What should happen -->

**Actual Behavior**
<!-- What actually happens -->

**Environment**
- OS: 
- Browser: 
- App version: 

**Severity**: Critical / High / Medium / Low

**Evidence**
<!-- Screenshots, logs, video -->
```

### Jira Bug Format (structured fields)

```
Summary: [COMPONENT] Short description of the bug

Description:
*Environment:* [env]
*Version:* [v]
*Browser:* [browser]

*Steps to Reproduce:*
# Step one
# Step two
# Step three

*Expected Result:*
[description]

*Actual Result:*
[description]

*Evidence:*
[attach screenshots/logs]

Labels: bug, regression, needs-triage
Priority: Blocker / Critical / Major / Minor / Trivial
Components: [component name]
Affects versions: [v]
```

### Linear Issue Template

```
Title: [Bug] Short description

Description:
**What happened:**
[actual behavior]

**What should happen:**
[expected behavior]

**How to reproduce:**
1.
2.
3.

**Environment:** [env, OS, browser, version]

**Evidence:** [attach]

Priority: Urgent / High / Medium / Low
Labels: bug
```

## Bug Report Quality Checklist

Before submitting, verify:

```
[ ] Summary is specific — not "button doesn't work" but "Submit button on /checkout unresponsive on Firefox 124"
[ ] Steps are numbered and atomic — each step is one action
[ ] Steps start from a known clean state (e.g., "Go to /login as a new incognito session")
[ ] Expected behavior describes the correct behavior, not just "it should work"
[ ] Actual behavior uses exact wording from the UI or logs
[ ] Environment is fully specified (version, OS, browser)
[ ] Severity and priority are both set
[ ] At least one piece of evidence attached (screenshot or log)
[ ] Workaround is documented if one exists
[ ] Report is written in neutral tone — describes facts, not blame
```

## Common Anti-Patterns to Avoid

```
❌ "The app is broken" → too vague
✅ "POST /api/orders returns 500 when cart contains out-of-stock items"

❌ "Sometimes it fails" → not reproducible
✅ "Fails 3/5 times when submitting quickly after page load (< 2 seconds)"

❌ "Fix ASAP" → urgency without context
✅ Severity: High — affects all checkout users, no workaround

❌ "I think the JS is wrong" → hypothesis in summary
✅ Move root cause hypothesis to a dedicated field at the bottom

❌ Attaching 10 unrelated screenshots
✅ One annotated screenshot showing exactly what's wrong
```

## References

- `assets/templates/bug-report-standard.md` — blank standard template
- `assets/templates/bug-report-github.md` — GitHub Issues format
- `assets/templates/bug-report-jira.md` — Jira description format
- `assets/templates/bug-report-linear.md` — Linear issue format
