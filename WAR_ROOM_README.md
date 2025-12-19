# Cyber Incident Response War Room - Forge App

## Overview
The **Cyber Incident Response War Room** is an Atlassian Forge app that enables real-time, cross-functional coordination during cybersecurity incidents. Built for Jira Service Management, it provides a centralized operational workspace for security, IT operations, legal, and management teams.

## Features

### 🚨 War Room Activation
- **Auto-activation** for Critical/High severity incidents
- **Manual activation** option for any incident
- Dedicated incident panel in Jira issues

### 📊 Real-Time Dashboard
- Incident metadata display (severity, status, assignee, timestamps)
- Visual status indicators and badges
- SLA tracking (future enhancement)

### 🔄 Automated Task Orchestration
- One-click creation of parallel response tasks:
  - **[Security]** Contain and Isolate Threat
  - **[IT Ops]** System Isolation and Recovery
  - **[Security]** Forensic Analysis
  - **[Legal]** Assess Breach Notification Requirements
  - **[Management]** Stakeholder Communication
  - **[IT Ops]** Patch and Remediate Vulnerabilities
- Tasks created as sub-tasks of parent incident
- Priority-based assignment

### 📝 Incident Timeline
- Immutable audit trail of all actions
- Auto-logged system events (task creation, status changes)
- Manual entry capability for decisions and observations
- Timestamp-based chronological ordering
- Compliance-ready documentation

### 🔐 Security & Permissions
- Atlassian permission-based access control
- Secure Forge storage for incident data
- Audit-ready logging

## Installation

### Prerequisites
- Atlassian account with Forge access
- Jira Software or Jira Service Management instance
- Node.js 18+ installed
- Forge CLI installed globally

### Setup Steps

1. **Navigate to the app directory:**
   ```bash
   cd limit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Deploy to development environment:**
   ```bash
   forge deploy
   ```

4. **Install on your Jira site:**
   ```bash
   forge install
   ```
   - Select your Jira site
   - Confirm installation

5. **View logs (optional):**
   ```bash
   forge logs
   ```

## Usage

### Activating the War Room

#### Automatic Activation
War Room automatically activates for incidents with:
- Priority: **Critical** or **High** or **Highest**
- Trigger: Issue creation event

#### Manual Activation
1. Open any Jira issue
2. Look for the **"Cyber War Room"** panel
3. Click **"Activate War Room"** button

### Creating Response Tasks
1. Open an active War Room
2. Click **"Create Incident Tasks"** button
3. System creates 6 parallel tasks covering:
   - Security containment
   - IT operations
   - Forensics
   - Legal compliance
   - Management communication
   - Remediation

### Managing Timeline
1. View auto-logged events in the Timeline section
2. Add manual entries using the text area
3. Click **"Add Entry"** to document decisions
4. All entries are timestamped and immutable

## Architecture

### Frontend
- **Framework:** React with Forge UI Kit
- **Components:**
  - `IncidentMetadata` - Displays incident details
  - `TaskOrchestration` - Manages task creation
  - `IncidentTimeline` - Shows audit trail
- **Module:** Jira Issue Panel (`jira:issuePanel`)

### Backend
- **Runtime:** Node.js 24.x (ARM64)
- **Functions:**
  - `resolver` - Main resolver for UI data
  - `create-incident-tasks` - Task orchestration
  - `incident-trigger` - Auto-activation trigger

### Storage
- **Forge Storage API** for:
  - War room state (`warroom:{issueId}`)
  - Timeline entries (`timeline:{issueId}`)
  - Task metadata (`tasks:{issueId}`)

### APIs Used
- Jira REST API v3
  - Issue retrieval
  - Task creation
  - Project data access

## Permissions
The app requests the following scopes:
- `read:jira-work` - Read Jira issues and projects
- `write:jira-work` - Create tasks and update issues
- `read:jira-user` - Access user information
- `storage:app` - Store war room data

## Development

### File Structure
```
limit/
├── manifest.yml              # Forge app configuration
├── src/
│   ├── frontend/
│   │   └── index.jsx         # React UI components
│   ├── resolvers/
│   │   └── index.js          # Backend resolvers
│   ├── taskOrchestration.js  # Task creation logic
│   ├── triggers.js           # Event triggers
│   └── index.js              # Entry point
├── package.json
└── README.md
```

### Local Development
```bash
# Watch for changes and auto-deploy
forge tunnel

# View real-time logs
forge logs --follow
```

### Testing
1. Create a test incident in Jira
2. Set priority to "High" or "Critical"
3. Verify War Room auto-activates
4. Test task creation
5. Add timeline entries
6. Verify data persistence

## Roadmap

### Phase 1 (MVP) ✅
- War Room UI with incident dashboard
- Automated task orchestration
- Incident timeline with manual entries
- Auto-activation for high-severity incidents

### Phase 2 (Future)
- SLA countdown timers
- Confluence post-mortem automation
- Advanced escalation rules
- Integration with Compass for service mapping
- Notification system (email/Slack)

### Phase 3 (Advanced)
- AI-assisted incident summaries
- SIEM integration (Splunk, QRadar)
- Predictive analytics for incident response
- Custom runbook execution

## Compliance & Audit
- All timeline entries are immutable
- System events auto-logged with timestamps
- User actions tracked with account IDs
- Data stored securely in Forge storage
- Supports GDPR, CCPA, SOC 2 requirements

## Forge Commands

```bash
# Deploy app to Forge
forge deploy

# Install app on a Jira site
forge install

# Run app locally with hot reload
forge tunnel

# View app logs
forge logs

# Uninstall app from a site
forge uninstall

# List installed environments
forge environments
```

## Support
For issues or questions:
1. Check Forge documentation: https://developer.atlassian.com/platform/forge
2. Review Jira API docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3
3. Contact: narayanan.27csb@licet.ac.in

## License
MIT

## Credits
Developed by: NARAYANAN D 27CSB
Platform: Atlassian Forge
Version: 1.0.0 (MVP)

---

**Note:** This is an MVP version developed for hackathon/proof-of-concept purposes. Production deployment should include additional security hardening, performance optimization, and comprehensive testing.
