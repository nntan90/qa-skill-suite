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

---
## Input Schema
**Trước khi viết bug report, agent PHẢI thu thập đủ thông tin sau. Nếu user mô tả tự do, hãy tự phân tích và điền vào template. Hỏi lại chỉ khi thiếu thông tin bắt buộc.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  observed_behavior:
    description: "Điều gì đã xảy ra (thực tế)"
    format: "Mô tả cụ thể, dùng đúng text từ UI/log nếu có"
    bad_example: "Button không hoạt động"
    good_example: "Submit button trên trang /checkout không phản hồi khi click, không có loading state, không có error message. Console log: TypeError: Cannot read property 'id' of undefined"

  expected_behavior:
    description: "Hành vi mong đợi (should happen)"
    note: "Mô tả đúng đắn theo spec/requirement, không chỉ nói 'should work'"
    example: "Click Submit nên gửi POST /api/orders, hiện loading spinner, và redirect sang /orders/success"

  steps_to_reproduce:
    description: "Các bước tái tạo lỗi"
    format: "Numbered steps, mỗi step là 1 action, bắt đầu từ clean state"
    example: |
      1. Open incognito browser
      2. Go to https://app.com/login
      3. Login with user@example.com / password123
      4. Navigate to /cart, add 2 items
      5. Click 'Proceed to Checkout'
      6. Fill card: 4111111111111111, 12/27, CVV 123
      7. Click 'Submit Order'
      8. Observe: button becomes unresponsive

  # --- Strongly Recommended ---
  environment:
    description: "Môi trường xảy ra lỗi"
    fields:
      app_version: "v2.3.1 hoặc commit SHA abc1234"
      environment: "Production / Staging / Dev"
      os: "macOS 14.3 / Windows 11 / Ubuntu 22.04"
      browser: "Chrome 123 / Firefox 124 / Safari 17"
      device: "Desktop / iPhone 15 Pro / Samsung Galaxy S24"
      user_role: "Admin / Free user / Guest / [specific role]"

  severity_hint:
    description: "Gợi ý mức độ nghiệm trọng (agent sẽ xác nhận lại)"
    options: ["Critical — system down", "High — major feature broken", "Medium — partial impact", "Low — cosmetic"]
    note: "Nếu không biết, agent sẽ tự phân loại dựa trên impact"

  # --- Optional ---
  frequency:
    description: "Tần suất xảy ra"
    options: ["Always (100%)", "Often (>50%)", "Sometimes (~25%)", "Rarely (<10%)", "Once"]

  evidence:
    description: "Bằng chứng kèm theo"
    types: ["screenshot", "video/loom", "console errors", "network request/response", "server logs"]
    note: "Paste text evidence trực tiếp nếu có; mô tả những gì cần attach"

  target_platform:
    description: "Platform để format bug report"
    options: ["standard (default)", "jira", "github", "linear"]
    default: "standard"
```

> Nếu user paste mô tả tự do ("button không hoạt động"), hãy tự phân tích thông tin và tạo report draft. Sau đó nêu rõ những trường còn thiếu để hỏi user một lần duy nhất.

---
## Output Contract
**Agent PHẢI xuất ra ĐẦY ĐỦ tất cả các section sau. KHÔNG được bỏ qua bất kỳ section nào.**

### Section 1 — Formatted Bug Report
Bug report hoàn chỉnh theo standard template (hoặc format của target platform):
- Summary line (1 dòng, cụ thể: what broke + where + impact)
- Environment (tất cả fields)
- Steps to Reproduce (numbered, atomic, start từ clean state)
- Expected vs Actual Behavior (sử dụng exact text từ UI/log)
- Frequency
- Evidence (moà tả rõ cần attach gì, paste text evidence nếu có)
- Workaround (nếu có)
- Root Cause Hypothesis (Section riêng ngày cuối)

### Section 2 — Severity/Priority Classification
Phân loại với giải thích:
```
Severity:  [Critical/High/Medium/Low]
Rationale: [Tại sao chọn mức này — scope of impact, workaround availability]

Priority:  [P1/P2/P3/P4]
Rationale: [Business impact, user count affected, urgency]

Affected users: [All / ~X% / specific role/segment]

Severity vs Priority note:
  [Giải thích nếu severity và priority khác nhau — ví dụ: S4 cosmetic nhưng P1 vì release ngày mai]
```

### Section 3 — Root Cause Hypothesis
```
Hypothesis: [Best guess về nguyên nhân kỹ thuật]
Supporting evidence: [Tại sao nghĩ vậy — dựa trên console error, network response, behavior pattern]
Suggested investigation path:
  1. Check [location/file] for [suspected issue]
  2. Verify [behavior] in [context]
  3. Review [related change / recent deploy / config]
```

### Section 4 — Reproduction Confidence Score
```
Reproduction Confidence: [High / Medium / Low]

Factors:
  ✅/❌ Steps are atomic and start from clean state
  ✅/❌ Environment is fully specified
  ✅/❌ Frequency is clear ([Always/Sometimes/Rarely])
  ✅/❌ At least one piece of evidence provided
  ✅/❌ Steps were verified by reporter

If Low confidence:
  Additional info needed: [liệt kê những gì cần để tăng confidence]
```

### Section 5 — Suggested Fix Direction
```
Fix Suggestion (QA perspective):
  Likely fix: [kỹ thuật cụ thể — ví dụ: "Add null check before accessing order.id"]
  Code area: [file/module/service nghi ngờ]
  Test to add after fix: [test case cần thêm để cover scenario này]
  Regression risk: [Low/Medium/High — các areas có thể bị ảnh hưởng bởi fix]
```

---
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
