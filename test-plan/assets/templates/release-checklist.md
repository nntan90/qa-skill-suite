# Release Readiness Checklist — v[X.Y.Z]

**Release date**:  
**Release manager**:  
**Environment**: Staging → Production

---

## Testing
- [ ] All sprint stories have QA sign-off
- [ ] Regression suite passes on staging
- [ ] Smoke test passing on staging (run: `npm run test:smoke`)
- [ ] Performance tests show no regression vs baseline
- [ ] Security scan clean (Snyk / Dependabot — 0 critical/high)
- [ ] No open Critical (S1) or High (S2) bugs

## Code Quality
- [ ] All PRs reviewed and merged to main
- [ ] CI/CD pipeline green
- [ ] No new lint errors or type errors
- [ ] Code coverage maintained (≥ 80%)

## Database
- [ ] Migrations tested in staging
- [ ] Rollback script tested
- [ ] No destructive migrations (drop column/table) without confirmed backup

## Operations
- [ ] Rollback plan documented
- [ ] Feature flags set correctly for production
- [ ] Monitoring alerts configured for new endpoints
- [ ] Error rate alerts configured
- [ ] Response time alerts configured

## Communication
- [ ] Release notes written
- [ ] Product/business stakeholders notified
- [ ] Support team briefed on new features
- [ ] Customer-facing changelog updated (if public)

## Post-Deploy
- [ ] Smoke test run on production immediately after deploy
- [ ] Error rate monitored for 30 minutes post-deploy
- [ ] On-call engineer notified

---

**QA Sign-off**: _________________ Date: _______  
**Dev Sign-off**: _________________ Date: _______  
**PM Sign-off**:  _________________ Date: _______
