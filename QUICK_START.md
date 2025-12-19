# Quick Start Guide - Cyber Incident Response War Room

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Deploy the App
```bash
cd limit
forge deploy
```
Expected output: ✓ App deployed successfully

### Step 2: Install on Your Jira Site
```bash
forge install
```
- Select your Jira site from the list
- Confirm the installation when prompted

### Step 3: Test the App

1. **Navigate to Jira**
   - Open your Jira instance
   - Go to any project

2. **Create a Test Incident**
   - Create a new issue (any type)
   - Set Priority to **"High"** or **"Critical"**
   - Save the issue

3. **Open the War Room Panel**
   - Look for the **"Cyber War Room"** panel on the right side
   - War Room should auto-activate for high-priority issues
   - If not active, click **"Activate War Room"**

4. **Create Response Tasks**
   - Click **"Create Incident Tasks"**
   - Watch as 6 response tasks are created automatically
   - Check the timeline for logged actions

5. **Add Timeline Entry**
   - Type a manual entry (e.g., "Security team notified")
   - Click **"Add Entry"**
   - Verify entry appears in timeline

## 🔍 Troubleshooting

### Panel Not Showing?
```bash
# Check deployment status
forge deploy --verbose

# Reinstall if needed
forge uninstall
forge install
```

### Permissions Error?
- Ensure you have admin access to the Jira site
- Verify app permissions in Jira Admin → Manage Apps

### Task Creation Failing?
- Check that sub-tasks are enabled in your project
- Verify "Task" issue type exists in your project
- View logs: `forge logs`

### Storage Issues?
```bash
# Clear app storage (development only)
forge storage delete --all
```

## 📊 What You Should See

### Active War Room Panel
```
🚨 Cyber Incident War Room
[Active Badge]

Incident Overview
├── Incident ID: PROJ-123
├── Severity: Critical
├── Status: In Progress
├── Assigned Team: Security Team
└── Created: Dec 19, 2025, 10:30 AM

Response Tasks
[Create Incident Tasks Button]

Active Tasks:
├── [Security] Contain and Isolate Threat
├── [IT Ops] System Isolation and Recovery
├── [Security] Forensic Analysis
├── [Legal] Assess Breach Notification Requirements
├── [Management] Stakeholder Communication
└── [IT Ops] Patch and Remediate Vulnerabilities

Incident Timeline
[Add Timeline Entry Form]

Timeline Entries:
├── 10:30 AM - 🚨 War Room Activated
├── 10:31 AM - ✅ Created task: [Security] Contain...
├── 10:32 AM - User note: "Security team notified"
└── ...
```

## 🎯 Next Steps

### Customize Task Templates
Edit `src/taskOrchestration.js` to add your organization's specific response tasks.

### Integrate with Other Tools
- Add Confluence page creation for post-mortems
- Integrate with Slack for notifications
- Connect to your SIEM for automated threat data

### Enable for Specific Projects
Modify `src/triggers.js` to filter by project key or custom fields.

## 📝 Common Use Cases

### Use Case 1: Ransomware Attack
1. Create incident with Priority: Critical
2. War Room auto-activates
3. Create all response tasks
4. Document all actions in timeline
5. Tasks assigned to Security, IT, Legal teams in parallel

### Use Case 2: Data Breach
1. Security analyst creates incident
2. Manually activate War Room
3. Create tasks including legal notification assessment
4. Timeline tracks all compliance-related actions
5. Management gets real-time visibility

### Use Case 3: Infrastructure Compromise
1. Monitoring system creates incident via API
2. War Room auto-activates based on severity
3. IT Ops receives isolation tasks immediately
4. Timeline captures all remediation steps
5. Audit trail ready for compliance review

## 🔗 Useful Links

- [Full Documentation](./WAR_ROOM_README.md)
- [Forge Documentation](https://developer.atlassian.com/platform/forge/)
- [Jira API Reference](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [PRD Document](../detailed_prd_cyber_incident_response_war_room_forge_app.md)

## 💡 Tips

1. **Test in Development First**: Use `forge tunnel` for live development
2. **Monitor Logs**: Keep `forge logs` running during testing
3. **Check Storage**: Use Forge storage viewer to inspect data
4. **API Rate Limits**: Be aware of Jira API rate limits for production use
5. **Backup Data**: Timeline data is critical - implement backup strategy

## 🎓 Learning Path

1. ✅ Deploy and install (you are here!)
2. 📚 Read full documentation
3. 🔧 Customize task templates
4. 🎨 Modify UI components
5. 🔌 Add integrations
6. 🚀 Deploy to production

---

**Need Help?** Contact: narayanan.27csb@licet.ac.in
