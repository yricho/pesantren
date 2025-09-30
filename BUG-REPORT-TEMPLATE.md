# Bug Report Template - Pondok Imam Syafi'i Blitar

## Bug Report Information

### Basic Information
- **Bug ID**: #[AUTO-GENERATED]
- **Reporter**: [Your Name]
- **Date**: [YYYY-MM-DD]
- **Priority**: [Critical | High | Medium | Low]
- **Severity**: [Critical | Major | Minor | Trivial]
- **Status**: [Open | In Progress | Resolved | Closed]

### Environment
- **Browser**: [Chrome 120 / Firefox 121 / Safari 17]
- **Operating System**: [Windows 11 / macOS 14 / Ubuntu 22.04]
- **Screen Resolution**: [1920x1080]
- **Device Type**: [Desktop | Mobile | Tablet]
- **Application Version**: [v1.0.0]
- **URL**: [https://your-app-url.com/page]

## Bug Description

### Summary
[Provide a brief, clear summary of the bug in one sentence]

### Expected Behavior
[Describe what should happen]

### Actual Behavior
[Describe what actually happens]

### Steps to Reproduce
1. Navigate to [specific page/section]
2. Click on [specific element]
3. Enter [specific data]
4. Press [specific button]
5. Observe [the issue]

### Preconditions
[Any specific setup or conditions needed to reproduce the bug]

## Impact Assessment

### User Impact
- [ ] Prevents user from completing critical tasks
- [ ] Causes data loss or corruption
- [ ] Creates security vulnerability
- [ ] Affects user experience negatively
- [ ] Minor cosmetic issue

### Business Impact
- [ ] Blocks revenue-generating activities
- [ ] Affects user authentication/authorization
- [ ] Impacts financial transactions
- [ ] Causes compliance issues
- [ ] No significant business impact

### Affected Components
- [ ] Authentication System
- [ ] Dashboard
- [ ] Financial Transactions
- [ ] Activity Management
- [ ] Course Management
- [ ] Video Management
- [ ] User Management
- [ ] Offline Functionality
- [ ] Mobile Responsiveness

## Technical Details

### Error Messages
```
[Include any error messages, stack traces, or console logs]
```

### Network Information
- **Failed Requests**: [List any failed API calls]
- **Status Codes**: [HTTP status codes received]
- **Response Times**: [If performance related]

### Browser Console Logs
```javascript
// Include relevant console.log, console.error, or console.warn messages
```

### Database Issues
- **Affected Tables**: [If database related]
- **Data Corruption**: [Yes/No - describe if yes]
- **Query Errors**: [Include SQL errors if applicable]

## Supporting Evidence

### Screenshots
[Attach screenshots showing the bug]
- Before: [Screenshot of expected state]
- After: [Screenshot showing the bug]
- Error: [Screenshot of any error messages]

### Screen Recordings
[Link to screen recording if the bug involves interaction]

### Test Data
```json
{
  "testUser": {
    "username": "testuser",
    "email": "test@example.com",
    "role": "STAFF"
  },
  "testTransaction": {
    "type": "INCOME",
    "amount": 1000000,
    "description": "Test transaction causing the issue"
  }
}
```

## Workaround
[Describe any temporary workaround if available]

### Alternative Steps
1. [Alternative way to achieve the same result]
2. [Temporary solution]

### Limitations
[Any limitations of the workaround]

## Regression Information

### When First Observed
- **Version**: [First version where bug appeared]
- **Date**: [When the bug was first noticed]
- **Reporter**: [Who first reported it]

### Was it Working Before?
- [ ] Yes - it worked in version [X.X.X]
- [ ] No - this is a new feature
- [ ] Unknown

### Related Changes
[Any recent deployments, updates, or changes that might be related]

## Additional Information

### Browser Developer Tools
#### Local Storage
```javascript
// Relevant localStorage data
```

#### Session Storage
```javascript
// Relevant sessionStorage data
```

#### Service Worker Status
- **Registered**: [Yes/No]
- **Active**: [Yes/No]
- **Cached Resources**: [List if relevant]

### Performance Metrics
- **Page Load Time**: [X seconds]
- **First Contentful Paint**: [X milliseconds]
- **Time to Interactive**: [X milliseconds]
- **Memory Usage**: [X MB]

### Accessibility Impact
- [ ] Screen reader compatibility affected
- [ ] Keyboard navigation broken
- [ ] Color contrast issues
- [ ] Focus management problems
- [ ] ARIA attributes missing/incorrect

## Testing Information

### Tested Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Tested Devices
- [ ] Desktop (Windows)
- [ ] Desktop (macOS)
- [ ] Desktop (Linux)
- [ ] iPhone
- [ ] Android Phone
- [ ] Tablet

### Test Data Used
[Describe the test data that triggers the bug]

## Security Implications

### Potential Security Issues
- [ ] Data exposure
- [ ] Authentication bypass
- [ ] Authorization elevation
- [ ] XSS vulnerability
- [ ] CSRF vulnerability
- [ ] SQL injection potential
- [ ] No security implications

### Sensitive Information
[Describe if any sensitive data is involved - DO NOT include actual sensitive data]

## Fix Priority Matrix

### Priority Assessment
| Factor | Score (1-5) | Weight | Total |
|--------|-------------|--------|-------|
| User Impact | | 0.3 | |
| Business Impact | | 0.3 | |
| Technical Complexity | | 0.2 | |
| Workaround Available | | 0.1 | |
| Security Risk | | 0.1 | |
| **Total Priority Score** | | | **X.X** |

### Recommended Action
Based on priority score:
- **4.0-5.0**: Critical - Fix immediately
- **3.0-3.9**: High - Fix within 24-48 hours
- **2.0-2.9**: Medium - Fix within 1 week
- **1.0-1.9**: Low - Fix in next sprint
- **0.0-0.9**: Trivial - Fix when convenient

## Assignee and Tracking

### Assignment
- **Assigned To**: [Developer Name]
- **Assigned Date**: [YYYY-MM-DD]
- **Target Resolution**: [YYYY-MM-DD]

### Related Issues
- **Blocks**: [List of issues this bug blocks]
- **Blocked By**: [List of issues blocking this fix]
- **Related To**: [List of related issues]
- **Duplicates**: [List of duplicate reports]

### Labels
- `bug`
- `priority:high`
- `component:authentication`
- `browser:chrome`
- `needs-testing`

## Resolution Information

### Root Cause Analysis
[To be filled when bug is analyzed]

### Fix Description
[To be filled when bug is fixed]

### Code Changes
[To be filled with PR links or commit hashes]

### Test Cases Added
[To be filled with new test cases to prevent regression]

### Verification Steps
[To be filled with steps to verify the fix]

## Prevention Measures

### How to Prevent Similar Bugs
[Suggestions for preventing similar issues in the future]

### Process Improvements
[Any process changes recommended]

### Additional Testing Needed
[Types of testing that should be added to catch similar bugs]

---

## Template Usage Instructions

### For Bug Reporters:
1. Fill out all relevant sections
2. Attach screenshots and recordings
3. Be specific about steps to reproduce
4. Include technical details from browser dev tools
5. Assess impact honestly

### For Developers:
1. Reproduce the bug using provided steps
2. Add technical analysis
3. Update status as work progresses
4. Document root cause and fix
5. Add regression tests

### For QA Team:
1. Verify bug reproduction
2. Test across different browsers/devices
3. Validate the fix
4. Update test cases
5. Close bug after verification

### Priority Guidelines:
- **Critical**: Application crashes, data loss, security vulnerabilities
- **High**: Core functionality broken, significant user impact
- **Medium**: Minor functionality issues, workaround available
- **Low**: Cosmetic issues, minor inconveniences

### Status Definitions:
- **Open**: Bug reported and confirmed
- **In Progress**: Developer assigned and working on fix
- **Resolved**: Fix implemented and ready for testing
- **Closed**: Fix verified and deployed to production

Remember to update this template as needed and ensure all team members are familiar with its usage.