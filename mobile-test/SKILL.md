---
name: mobile-test
description: >
  Test mobile applications on iOS and Android platforms. Load when asked to
  test mobile apps, create Appium tests, test touch gestures, mobile-specific
  interactions, device compatibility, or mobile performance. Covers native apps,
  hybrid apps, and mobile web testing across multiple devices and OS versions.
  Trigger phrases: mobile test, iOS test, Android test, Appium, touch gesture,
  mobile app, device testing, XCUITest, Espresso, Detox, React Native test.
metadata:
  author: qa-skill-suite
  version: '4.1'
---

# Mobile Test Skill
## iOS and Android - Appium - Native and Hybrid Apps

## When to Use This Skill

- User needs to test mobile applications (iOS/Android)
- User wants to write Appium or Detox tests
- User needs to test touch gestures and mobile interactions
- User wants device/OS version compatibility testing
- User needs to test mobile-specific features (camera, GPS, notifications)
- User wants mobile performance testing

---

## Agent Persona

**Act like a senior QA engineer with 20 years of experience.**

- Use plain, clear English. Short sentences. No robot language.
- Be direct. If something is wrong or missing, say it straight.
- Share real experience. Say things like: I have seen this crash on older devices or Most teams forget to test on slow networks.
- Always explain WHY mobile-specific testing matters.
- Point out risks even when the user did not ask.

**Language standard:** Write all output in B1-level English. Simple words. Active voice. One idea per sentence.

---

## Output Review Loop

**After producing any output, the agent MUST run this self-check and include the result at the bottom.**

```
My Self-Check:
  [ ] Touch gestures - tap, swipe, pinch tested
  [ ] Orientation - portrait and landscape tested
  [ ] Network conditions - offline and slow network tested
  [ ] Device variety - multiple screen sizes considered
  [ ] OS versions - min and max supported versions tested
  [ ] Interruptions - calls, notifications, background/foreground tested
  [ ] Output is complete - no TODO or add more placeholders

Verdict: COMPLETE / INCOMPLETE
If INCOMPLETE - what I still need to add: [list]
```

---

## Input Schema

**Before testing, the agent MUST collect the following information.**

```yaml
INPUT REQUIRED:
  app_type:
    description: "Type of mobile application"
    options: ["native_ios", "native_android", "react_native", "flutter", "hybrid", "mobile_web"]

  platforms:
    description: "Target platforms to test"
    options: ["iOS", "Android", "both"]

  min_os_version:
    description: "Minimum supported OS version"
    example: "iOS 14.0 / Android 10 (API 29)"

  test_framework:
    description: "Testing framework to use"
    options:
      - "Appium (cross-platform)"
      - "XCUITest (iOS native)"
      - "Espresso (Android native)"
      - "Detox (React Native)"
      - "Flutter Driver"
    default: "Appium"

  devices:
    description: "Target devices for testing"
    example: "iPhone 15, iPhone SE, Pixel 8, Samsung Galaxy S24"

  features_to_test:
    description: "Mobile-specific features to cover"
    options:
      - "Touch gestures"
      - "Camera access"
      - "GPS/Location"
      - "Push notifications"
      - "Biometric auth"
      - "Deep links"
      - "App permissions"
```

---

## Output Contract

**The agent MUST produce ALL sections below.**

### Section 1 - Device/OS Test Matrix

| Device | OS Version | Screen Size | Status | Notes |
|--------|------------|-------------|--------|-------|
| iPhone 15 Pro Max | iOS 17.4 | 6.7 inch | PASS | Latest flagship |
| iPhone 15 | iOS 17.4 | 6.1 inch | PASS | Standard flagship |
| iPhone SE 3rd | iOS 17.4 | 4.7 inch | PASS | Small screen |
| Pixel 8 Pro | Android 14 | 6.7 inch | PASS | Reference device |
| Samsung Galaxy S24 | Android 14 | 6.2 inch | PASS | Popular flagship |

### Section 2 - Mobile-Specific Test Cases

**TOUCH GESTURES**

| TC-ID | Gesture | Action | Expected Result | Priority |
|-------|---------|--------|-----------------|----------|
| MOB-GEST-001 | Tap | Single tap on button | Action triggered | P1 |
| MOB-GEST-002 | Double Tap | Double tap on image | Zoom in | P2 |
| MOB-GEST-003 | Long Press | Hold on item | Context menu appears | P2 |
| MOB-GEST-004 | Swipe Left | Swipe on list item | Delete option shown | P1 |
| MOB-GEST-005 | Swipe Down | Pull down on list | Refresh triggered | P1 |
| MOB-GEST-006 | Pinch In | Pinch on image | Zoom out | P2 |
| MOB-GEST-007 | Pinch Out | Expand on image | Zoom in | P2 |

**ORIENTATION**

| TC-ID | Test | Expected | Priority |
|-------|------|----------|----------|
| MOB-ORI-001 | Portrait to Landscape | Layout adjusts correctly | P1 |
| MOB-ORI-002 | Landscape to Portrait | Layout adjusts correctly | P1 |
| MOB-ORI-003 | Rotation during input | Text preserved | P2 |

**NETWORK CONDITIONS**

| TC-ID | Condition | Expected | Priority |
|-------|-----------|----------|----------|
| MOB-NET-001 | Offline mode | Offline message shown | P1 |
| MOB-NET-002 | Slow 3G | Loading states shown | P1 |
| MOB-NET-003 | Network switch | Request retried | P2 |

**INTERRUPTIONS**

| TC-ID | Interruption | Expected | Priority |
|-------|--------------|----------|----------|
| MOB-INT-001 | Incoming call | App pauses, resumes after | P1 |
| MOB-INT-002 | Push notification | App stable | P1 |
| MOB-INT-003 | Background to Foreground | State preserved | P1 |

**PERMISSIONS**

| TC-ID | Permission | Action | Expected | Priority |
|-------|------------|--------|----------|----------|
| MOB-PERM-001 | Camera | Deny | Graceful fallback | P1 |
| MOB-PERM-002 | Location | Allow | Features work | P1 |
| MOB-PERM-003 | Notifications | Deny | App works without | P1 |

### Section 3 - Appium Test Template

```typescript
import { remote } from 'webdriverio';

const caps = {
  platformName: 'iOS',
  'appium:deviceName': 'iPhone 15',
  'appium:platformVersion': '17.4',
  'appium:app': '/path/to/app.ipa',
  'appium:automationName': 'XCUITest',
};

describe('Login Flow', () => {
  let driver;

  beforeAll(async () => {
    driver = await remote({
      hostname: 'localhost',
      port: 4723,
      capabilities: caps,
    });
  });

  afterAll(async () => {
    await driver.deleteSession();
  });

  it('should login successfully', async () => {
    const emailField = await driver.$('~email-input');
    const passwordField = await driver.$('~password-input');
    const loginButton = await driver.$('~login-button');

    await emailField.setValue('test@example.com');
    await passwordField.setValue('password123');
    await loginButton.click();

    const dashboard = await driver.$('~dashboard-screen');
    await dashboard.waitForDisplayed({ timeout: 5000 });

    expect(await dashboard.isDisplayed()).toBe(true);
  });
});
```

### Section 4 - Platform-Specific Testing

**iOS-Specific Tests**

| TC-ID | Feature | Test | Expected |
|-------|---------|------|----------|
| IOS-001 | Face ID | Auth with Face ID | Biometric prompt shown |
| IOS-002 | Widget | Home screen widget | Widget displays data |
| IOS-003 | Deep Link | Open via URL scheme | App opens to correct screen |

**Android-Specific Tests**

| TC-ID | Feature | Test | Expected |
|-------|---------|------|----------|
| AND-001 | Back Button | System back | Navigation handled |
| AND-002 | Split Screen | Multi-window | App resizes correctly |
| AND-003 | Fingerprint | Auth with fingerprint | Biometric prompt shown |

### Section 5 - Mobile Performance Checklist

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Cold start | < 2s | [X]s | [PASS/FAIL] |
| Warm start | < 1s | [X]s | [PASS/FAIL] |
| Memory idle | < 100MB | [X]MB | [PASS/FAIL] |
| Memory active | < 200MB | [X]MB | [PASS/FAIL] |

---

## Mobile Testing Tools

### Appium Setup

```bash
npm install -g appium
appium driver install xcuitest
appium driver install uiautomator2
appium --relaxed-security
```

### React Native with Detox

```typescript
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
  });
});
```

---

## Common Mobile Testing Issues

### 1. Element Not Found

```typescript
// Bad - uses UI text that may change
await driver.$('//XCUIElementTypeButton[@name="Log In"]');

// Good - uses accessibility ID
await driver.$('~login-button');
```

### 2. Timing Issues

```typescript
// Bad - fixed sleep
await driver.pause(3000);

// Good - wait for condition
await driver.$('~success-message').waitForDisplayed({ timeout: 5000 });
```

---

## References

- `references/appium-cheatsheet.md` - Appium commands reference
- `references/mobile-gestures.md` - Touch gesture patterns
- `assets/templates/mobile-test-plan.md` - Mobile test plan template
