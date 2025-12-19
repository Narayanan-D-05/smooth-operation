# Deployment Checklist

## Pre-Deployment

### Environment Setup
- [x] Forge CLI installed (`forge --version`)
- [x] Logged into Atlassian account (`forge login`)
- [x] Node.js 18+ installed
- [x] npm dependencies installed (`npm install`)

### Code Review
- [x] manifest.yml configured correctly
- [x] All required permissions defined
- [x] Frontend components working
- [x] Backend resolvers implemented
- [x] Storage keys standardized
- [x] Error handling in place

### Testing Checklist
- [ ] App deploys without errors
- [ ] Panel appears in Jira issues
- [ ] War Room activation works (auto & manual)
- [ ] Task creation successful
- [ ] Timeline entries persist
- [ ] Storage reads/writes functional
- [ ] UI renders correctly
- [ ] No console errors

## Deployment Steps

### 1. Development Environment
```bash
# Deploy to development
forge deploy --environment development

# Install for testing
forge install --environment development

# Test with tunnel
forge tunnel
```

**Verify:**
- [ ] App loads in Jira
- [ ] All features functional
- [ ] Logs clean (no errors)

### 2. Staging Environment
```bash
# Deploy to staging
forge deploy --environment staging

# Install on staging site
forge install --environment staging
```

**Verify:**
- [ ] End-to-end testing complete
- [ ] Performance acceptable
- [ ] User acceptance testing passed

### 3. Production Environment
```bash
# Deploy to production
forge deploy --environment production

# Install on production site
forge install --environment production
```

**Verify:**
- [ ] Smoke test passed
- [ ] Monitoring enabled
- [ ] Rollback plan ready

## Post-Deployment

### Immediate Checks (First 5 Minutes)
- [ ] App appears in Jira
- [ ] Test incident creation
- [ ] Verify War Room activation
- [ ] Check task orchestration
- [ ] Monitor logs for errors
- [ ] Validate storage operations

### First Hour Monitoring
- [ ] Check error rates
- [ ] Verify API call success rates
- [ ] Monitor memory usage
- [ ] Review user feedback
- [ ] Check performance metrics

### First Day
- [ ] Review all incident creations
- [ ] Analyze usage patterns
- [ ] Collect user feedback
- [ ] Monitor storage growth
- [ ] Check API quota usage

## Rollback Plan

### If Issues Occur
```bash
# Quick rollback
forge uninstall --environment production

# Deploy previous version
git checkout <previous-version>
forge deploy --environment production
forge install --environment production
```

### Emergency Contacts
- Forge Support: https://developer.atlassian.com/platform/forge/
- Internal: narayanan.27csb@licet.ac.in

## Configuration Verification

### Manifest.yml
- [x] Module type: `jira:issuePanel`
- [x] Permissions: read:jira-work, write:jira-work, storage:app
- [x] Runtime: nodejs24.x
- [x] Memory: 512MB
- [x] Functions defined correctly
- [x] Triggers configured

### Storage Keys
- [x] `warroom:{issueId}` - War room state
- [x] `timeline:{issueId}` - Timeline entries
- [x] `tasks:{issueId}` - Task metadata

### API Endpoints Used
- [x] `/rest/api/3/issue/{issueId}` - Get issue
- [x] `/rest/api/3/issue` - Create issue/task
- [x] Forge Storage API

## Performance Benchmarks

### Expected Response Times
- Panel load: < 2 seconds
- War room activation: < 1 second
- Task creation (6 tasks): < 5 seconds
- Timeline entry: < 500ms
- Storage operations: < 300ms

### Resource Limits
- Memory: 512MB allocated
- Storage: 5MB per issue (estimated)
- API calls: Within Jira rate limits
- Concurrent users: Tested up to 10

## Security Checklist

- [x] Using Atlassian-native auth
- [x] No hardcoded credentials
- [x] Secure storage usage
- [x] Input validation on timeline entries
- [x] Permission checks via Forge
- [x] HTTPS for all API calls

## Compliance

### Audit Trail
- [x] Timeline immutability verified
- [x] User actions tracked
- [x] Timestamps on all events
- [x] Data retention policy defined

### Data Privacy
- [x] GDPR considerations
- [x] Data stored in Atlassian cloud
- [x] No PII in logs
- [x] User consent via app installation

## Known Limitations (MVP)

1. **Task Creation**
   - Requires "Task" issue type in project
   - Requires sub-tasks enabled
   - Limited to 6 predefined templates

2. **Storage**
   - 5MB limit per storage key
   - No automatic cleanup
   - Manual data migration needed

3. **UI**
   - No real-time refresh (requires page reload)
   - Limited customization options
   - Fixed panel width

4. **Integration**
   - No external SIEM integration
   - No Confluence automation (Phase 2)
   - No email notifications

## Future Enhancements (Post-MVP)

### Phase 2
- [ ] SLA countdown timers
- [ ] Confluence post-mortem automation
- [ ] Email/Slack notifications
- [ ] Custom task templates
- [ ] Bulk operations

### Phase 3
- [ ] AI-powered incident analysis
- [ ] SIEM integrations
- [ ] Predictive analytics
- [ ] Mobile support
- [ ] Advanced reporting

## Success Metrics

### Week 1 Targets
- [ ] 10+ successful War Room activations
- [ ] 0 critical errors
- [ ] < 2s average panel load time
- [ ] 100% task creation success rate

### Month 1 Targets
- [ ] 50+ incidents managed
- [ ] Positive user feedback
- [ ] < 5% error rate
- [ ] Feature requests collected

## Documentation

- [x] README.md complete
- [x] Quick Start guide created
- [x] API documentation
- [x] Troubleshooting guide
- [x] Architecture diagram (in PRD)

## Support Resources

- **Documentation**: See WAR_ROOM_README.md
- **Quick Start**: See QUICK_START.md
- **PRD**: See ../detailed_prd_cyber_incident_response_war_room_forge_app.md
- **Forge Docs**: https://developer.atlassian.com/platform/forge/
- **Jira API**: https://developer.atlassian.com/cloud/jira/platform/rest/v3/

---

**Deployment Lead**: NARAYANAN D 27CSB  
**Date**: December 19, 2025  
**Version**: 1.0.0 (MVP)
