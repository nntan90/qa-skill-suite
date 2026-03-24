# Unit Test Pre-Writing Checklist

## Unit Under Test
- Function/Method name: ___________
- File path: ___________
- Language / Framework: ___________

## Dependencies to Mock
- [ ] Database / ORM
- [ ] HTTP clients / external APIs
- [ ] File system
- [ ] Message queues
- [ ] Date/time (use fake timers)
- [ ] Environment variables
- [ ] Other services: ___________

## Test Cases to Write

### Happy Path
- [ ] Valid input → expected output
- [ ] Minimum valid input
- [ ] Maximum valid input

### Edge Cases
- [ ] Empty string / empty array
- [ ] Zero / negative numbers
- [ ] Null / undefined / None
- [ ] Very long strings / large arrays
- [ ] Special characters

### Error Paths
- [ ] Invalid type input
- [ ] Missing required field
- [ ] Dependency throws exception
- [ ] Dependency returns unexpected response
- [ ] Timeout / slow dependency

### State Transitions (if stateful)
- [ ] Initial state → expected state
- [ ] Transition back (undo/rollback)
- [ ] Concurrent state changes

## Naming Convention Used
`[MethodName]_[StateUnderTest]_[ExpectedBehavior]`

## Post-Writing Checks
- [ ] All tests follow AAA pattern
- [ ] No test depends on another test's state
- [ ] Tests are fast (< 100ms each)
- [ ] Test names describe what they test (not how)
- [ ] Mocks are reset between tests
- [ ] Coverage report generated and checked
