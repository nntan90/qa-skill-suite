---
name: accessibility-test
description: >
  Test web and mobile applications for accessibility compliance. Load when asked to
  test for WCAG compliance, screen reader compatibility, keyboard navigation, color
  contrast, ARIA implementation, or assistive technology support. Covers WCAG 2.1
  Level A and AA criteria, Section 508, and accessibility best practices.
  Trigger phrases: "accessibility test", "WCAG", "screen reader", "a11y", "keyboard navigation",
  "color contrast", "ARIA", "Section 508", "assistive technology", "accessible".
metadata:
  author: qa-skill-suite
  version: '4.1'
---

# Accessibility Test Skill
## WCAG 2.1 · Section 508 · Assistive Technology Testing

## When to Use This Skill

- User needs to test for WCAG 2.1 Level A/AA compliance
- User wants to verify screen reader compatibility
- User needs to test keyboard navigation
- User wants to check color contrast ratios
- User needs to audit ARIA implementation
- User wants to ensure Section 508 compliance

---

## Agent Persona

**Act like a senior QA engineer with 20 years of experience.**

- Use plain, clear English. Short sentences. No robot language.
- Be direct. If something is wrong or missing, say it straight.
- Share real experience. Say things like: *"I've seen this fail accessibility audits before"* or *"Most teams miss this, but it blocks users with disabilities."*
- Always explain WHY accessibility matters, not just what to fix.
- Point out risks even when the user didn't ask.

**Language standard:** Write all output in B1-level English. Simple words. Active voice. One idea per sentence.

---

## Output Review Loop

**After producing any output, the agent MUST run this self-check and include the result at the bottom.**

```
My Self-Check:
  [ ] Keyboard navigation — all interactive elements tested
  [ ] Screen reader — semantic structure verified
  [ ] Color contrast — all text meets 4.5:1 ratio
  [ ] Focus management — focus order is logical
  [ ] Form accessibility — labels and error messages tested
  [ ] Alternative text — all images have meaningful alt text
  [ ] Output is complete — no "TODO" or "add more" placeholders

Verdict: COMPLETE / INCOMPLETE
If INCOMPLETE — what I still need to add: [list]
```

---

## Input Schema

**Before testing, the agent MUST collect the following information.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  target_url_or_component:
    description: "URL to test or component/page description"
    example: "https://example.com/login or 'Login form component'"

  compliance_level:
    description: "Target WCAG compliance level"
    options: ["WCAG 2.1 Level A", "WCAG 2.1 Level AA", "WCAG 2.1 Level AAA", "Section 508"]
    default: "WCAG 2.1 Level AA"

  # --- Recommended ---
  user_personas:
    description: "Types of users with disabilities to consider"
    options:
      - "Blind (screen reader users)"
      - "Low vision (magnification users)"
      - "Color blind"
      - "Motor impairment (keyboard-only users)"
      - "Cognitive disabilities"
      - "Deaf/hard of hearing"
    default: "All"

  assistive_technologies:
    description: "Specific assistive technologies to test with"
    options: ["NVDA", "JAWS", "VoiceOver", "TalkBack", "Dragon NaturallySpeaking"]

  # --- Optional ---
  existing_audit:
    description: "Previous accessibility audit results to compare"
    
  framework:
    description: "Testing framework/tool preference"
    options: ["axe-core", "Lighthouse", "WAVE", "Pa11y", "manual testing"]
```

---

## Output Contract

**The agent MUST produce ALL sections below.**

### Section 1 — WCAG Compliance Checklist

```
WCAG 2.1 Level [A/AA] Compliance Audit
======================================
URL/Component: [target]
Date: [date]
Tester: AI QA Agent

PERCEIVABLE (1.x)
-----------------
1.1.1 Non-text Content          [PASS/FAIL/N/A]
  - All images have alt text: [Yes/No]
  - Decorative images use alt="": [Yes/No]
  - Complex images have long descriptions: [Yes/No]

1.2.1 Audio/Video Alternatives  [PASS/FAIL/N/A]
  - Captions available: [Yes/No]
  - Transcripts available: [Yes/No]

1.3.1 Info and Relationships    [PASS/FAIL/N/A]
  - Semantic HTML used: [Yes/No]
  - Headings in logical order: [Yes/No]
  - Form labels associated: [Yes/No]

1.4.1 Use of Color              [PASS/FAIL/N/A]
  - Information not conveyed by color alone: [Yes/No]

1.4.3 Contrast (Minimum)        [PASS/FAIL/N/A]
  - Text contrast ratio ≥ 4.5:1: [Yes/No]
  - Large text contrast ratio ≥ 3:1: [Yes/No]

OPERABLE (2.x)
--------------
2.1.1 Keyboard                  [PASS/FAIL/N/A]
  - All functionality keyboard accessible: [Yes/No]
  - No keyboard traps: [Yes/No]

2.4.1 Bypass Blocks             [PASS/FAIL/N/A]
  - Skip link present: [Yes/No]

2.4.3 Focus Order               [PASS/FAIL/N/A]
  - Focus order matches visual order: [Yes/No]

2.4.4 Link Purpose              [PASS/FAIL/N/A]
  - Link text is descriptive: [Yes/No]
  - No "click here" links: [Yes/No]

2.4.7 Focus Visible             [PASS/FAIL/N/A]
  - Focus indicator visible: [Yes/No]

UNDERSTANDABLE (3.x)
--------------------
3.1.1 Language of Page          [PASS/FAIL/N/A]
  - lang attribute present: [Yes/No]

3.2.1 On Focus                  [PASS/FAIL/N/A]
  - No unexpected context changes on focus: [Yes/No]

3.3.1 Error Identification      [PASS/FAIL/N/A]
  - Errors clearly identified: [Yes/No]
  - Error messages descriptive: [Yes/No]

3.3.2 Labels or Instructions    [PASS/FAIL/N/A]
  - Form fields have labels: [Yes/No]
  - Required fields indicated: [Yes/No]

ROBUST (4.x)
------------
4.1.1 Parsing                   [PASS/FAIL/N/A]
  - Valid HTML: [Yes/No]

4.1.2 Name, Role, Value         [PASS/FAIL/N/A]
  - ARIA roles correctly used: [Yes/No]
  - Custom controls accessible: [Yes/No]
```

### Section 2 — Keyboard Navigation Test Results

```
Keyboard Navigation Audit
=========================

Tab Order:
1. [Element 1] → [Element 2] → [Element 3]...
Tab order logical: [Yes/No]

Focus Visibility:
- All elements show focus indicator: [Yes/No]
- Focus indicator meets contrast requirements: [Yes/No]

Keyboard Shortcuts:
- All shortcuts documented: [Yes/No]
- No conflicts with AT shortcuts: [Yes/No]

Traps/Blocks:
- Modal dialogs trap focus correctly: [Yes/No]
- No infinite loops: [Yes/No]
- Escape key closes modals: [Yes/No]

Interactive Elements Tested:
| Element | Tab Access | Enter/Space | Arrow Keys | Notes |
|---------|------------|-------------|------------|-------|
| [Button] | ✅ | ✅ | N/A | Works |
| [Dropdown] | ✅ | ✅ | ✅ | Works |
| [Modal] | ✅ | ✅ | N/A | Focus trapped correctly |
```

### Section 3 — Screen Reader Test Results

```
Screen Reader Compatibility
===========================
Tested with: [NVDA / VoiceOver / JAWS]

Page Structure:
- Heading hierarchy announced: [Yes/No]
- Landmarks announced: [Yes/No]
- Page title announced: [Yes/No]

Images:
- Alt text read correctly: [Yes/No]
- Decorative images skipped: [Yes/No]

Forms:
- Labels announced with inputs: [Yes/No]
- Required fields announced: [Yes/No]
- Error messages announced: [Yes/No]

Tables:
- Table headers announced: [Yes/No]
- Row/column context provided: [Yes/No]

Dynamic Content:
- Live regions announced: [Yes/No]
- ARIA-live used appropriately: [Yes/No]

Issues Found:
| Element | Issue | Screen Reader Output | Expected |
|---------|-------|---------------------|----------|
| [element] | [issue] | "[what SR said]" | "[expected]" |
```

### Section 4 — Color Contrast Analysis

```
Color Contrast Report
=====================

Text Elements:
| Element | Foreground | Background | Ratio | Required | Status |
|---------|------------|------------|-------|----------|--------|
| Body text | #333333 | #FFFFFF | 12.63:1 | 4.5:1 | ✅ PASS |
| Link text | #0066CC | #FFFFFF | 5.12:1 | 4.5:1 | ✅ PASS |
| [element] | [fg] | [bg] | [ratio] | [req] | [status] |

Non-Text Elements:
| Element | Ratio | Required | Status |
|---------|-------|----------|--------|
| Focus indicator | [ratio] | 3:1 | [status] |
| Icons | [ratio] | 3:1 | [status] |
| Form borders | [ratio] | 3:1 | [status] |

Color Blindness Simulation:
- Protanopia (red-blind): [Pass/Fail]
- Deuteranopia (green-blind): [Pass/Fail]
- Tritanopia (blue-blind): [Pass/Fail]
```

### Section 5 — Findings & Remediation

| ID | WCAG Criterion | Severity | Element | Issue | Remediation |
|----|---------------|----------|---------|-------|-------------|
| A-001 | 1.1.1 | High | img#hero | Missing alt text | Add descriptive alt text |
| A-002 | 2.1.1 | Critical | #dropdown | Not keyboard accessible | Add tabindex and key handlers |
| A-003 | 1.4.3 | Medium | .footer-link | Contrast 3.2:1 | Change color to #0055AA |

### Section 6 — Compliance Verdict

```
ACCESSIBILITY COMPLIANCE SUMMARY
================================
Target: WCAG 2.1 Level [AA]
Overall Status: [PASS / FAIL / PARTIAL]

Criteria Summary:
- Level A: [X]/[Y] passed
- Level AA: [X]/[Y] passed

Critical Issues: [N]
High Issues: [N]
Medium Issues: [N]
Low Issues: [N]

Recommendation: [GO / NO-GO for release]

Priority Fixes Before Release:
1. [Issue A-001] — [description]
2. [Issue A-002] — [description]
```

---

## Testing Tools & Commands

### Automated Testing with axe-core

```javascript
// Playwright + axe-core
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### Jest + axe-core

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('LoginForm is accessible', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Cypress + axe-core

```typescript
import 'cypress-axe';

describe('Accessibility', () => {
  it('has no a11y violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    });
  });
});
```

### Command Line Tools

```bash
# Pa11y CLI
pa11y https://example.com --standard WCAG2AA

# Lighthouse
lighthouse https://example.com --only-categories=accessibility --output=json

# axe CLI
npx @axe-core/cli https://example.com
```

---

## WCAG 2.1 Quick Reference

### Level A (Minimum)
- 1.1.1 Non-text Content — alt text for images
- 1.2.1 Audio/Video Alternatives
- 1.3.1 Info and Relationships — semantic HTML
- 1.4.1 Use of Color — don't rely on color alone
- 2.1.1 Keyboard — all functionality via keyboard
- 2.4.1 Bypass Blocks — skip links
- 3.1.1 Language of Page — lang attribute
- 4.1.1 Parsing — valid HTML
- 4.1.2 Name, Role, Value — accessible names

### Level AA (Recommended)
- 1.4.3 Contrast (Minimum) — 4.5:1 for text
- 1.4.4 Resize Text — 200% zoom support
- 2.4.3 Focus Order — logical tab order
- 2.4.4 Link Purpose — descriptive link text
- 2.4.7 Focus Visible — visible focus indicator
- 3.2.3 Consistent Navigation
- 3.2.4 Consistent Identification
- 3.3.3 Error Suggestion

---

## Common Accessibility Issues

### 1. Missing Alt Text
```html
<!-- ❌ Bad -->
<img src="hero.jpg">

<!-- ✅ Good — informative image -->
<img src="hero.jpg" alt="Team collaborating in office">

<!-- ✅ Good — decorative image -->
<img src="divider.png" alt="" role="presentation">
```

### 2. Missing Form Labels
```html
<!-- ❌ Bad -->
<input type="email" placeholder="Email">

<!-- ✅ Good -->
<label for="email">Email</label>
<input type="email" id="email" placeholder="user@example.com">
```

### 3. Low Color Contrast
```css
/* ❌ Bad — ratio 2.5:1 */
.text { color: #999999; background: #ffffff; }

/* ✅ Good — ratio 7:1 */
.text { color: #595959; background: #ffffff; }
```

### 4. Missing Focus Indicator
```css
/* ❌ Bad — removes focus */
*:focus { outline: none; }

/* ✅ Good — custom focus */
*:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### 5. Non-Keyboard Accessible
```html
<!-- ❌ Bad — div not keyboard accessible -->
<div onclick="submit()">Submit</div>

<!-- ✅ Good — button is accessible -->
<button onclick="submit()">Submit</button>
```

---

## References

- `references/wcag-checklist.md` — Complete WCAG 2.1 checklist
- `references/aria-patterns.md` — Common ARIA patterns
- `references/screen-reader-commands.md` — NVDA, JAWS, VoiceOver shortcuts
- `assets/templates/accessibility-audit.md` — Blank audit template
- `assets/templates/color-contrast-report.md` — Contrast analysis template
