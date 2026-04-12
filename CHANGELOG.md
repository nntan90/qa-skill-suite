# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CI/CD validation workflow (.github/workflows/validate.yml)
- GitHub issue templates (bug report, feature request, new skill proposal)
- Pull request template
- CONTRIBUTING.md with contribution guidelines
- CODE_OF_CONDUCT.md with community standards
- New skill: qa/accessibility-test (WCAG 2.1 testing)
- New skill: qa/mobile-test (Appium, iOS, Android testing)
- Code templates for all major testing frameworks
- Documentation folder with architecture and guides
- Examples folder with sample test suites

### Changed
- Standardized all skills to use English only (removed Vietnamese content)
- Updated all skill versions to 4.1
- Standardized folder structure (all skills now have references/)
- Enhanced README with badges, verification, and troubleshooting

### Fixed
- Mixed language content in test-review and bug-report skills

## [4.1.0] - 2026-04-12

### Added
- qa/automation-framework sub-skill with Test Pyramid/Diamond/Trophy patterns
- Framework selection guide for CTAL-TAE alignment
- CI/CD pipeline templates

### Changed
- Improved routing logic in root SKILL.md
- Enhanced agent persona consistency across all skills

## [4.0.0] - 2026-04-10

### Added
- Advanced testing patterns for unit-test, api-test, e2e-test, performance-test, security-test
- Comprehensive ISTQB Advanced Test Analyst alignment
- Input schema and output contract for all skills
- Self-review checklist enforcement

### Changed
- Major restructure of all skill files
- Enhanced anti-pattern detection in test-review skill
- Improved bug report severity classification

## [3.0.0] - 2026-03-15

### Added
- qa/test-plan skill with IEEE 829/ISO 29119 alignment
- qa/test-review skill with 10 anti-pattern catalog
- qa/bug-report skill with platform-specific templates
- PROMPTING-GUIDE.md with skill-by-skill examples

### Changed
- Unified agent persona across all skills
- Standardized TC-ID naming convention

## [2.0.0] - 2026-02-01

### Added
- qa/performance-test skill with k6, Locust, JMeter
- qa/security-test skill with OWASP alignment
- Multi-language framework support matrix

### Changed
- Restructured repository to sub-skill model
- Enhanced ISTQB technique coverage

## [1.0.0] - 2026-01-15

### Added
- Initial release
- qa/manual-test skill
- qa/unit-test skill
- qa/api-test skill
- qa/e2e-test skill
- Root SKILL.md with routing logic
- ISTQB glossary reference

[Unreleased]: https://github.com/nntan90/qa-skill-suite/compare/v4.1.0...HEAD
[4.1.0]: https://github.com/nntan90/qa-skill-suite/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/nntan90/qa-skill-suite/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/nntan90/qa-skill-suite/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/nntan90/qa-skill-suite/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/nntan90/qa-skill-suite/releases/tag/v1.0.0
