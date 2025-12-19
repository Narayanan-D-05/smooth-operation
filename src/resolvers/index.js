import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';

const resolver = new Resolver();

// Get incident data including war room status, timeline, and tasks
resolver.define('getIncidentData', async (req) => {
  const { issueId } = req.payload;

  try {
    // Fetch issue details from Jira
    const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}`);
    const issueData = await issueResponse.json();

    // Get war room data from storage
    const warRoomKey = `warroom:${issueId}`;
    const warRoomData = await storage.get(warRoomKey) || {};

    // Get timeline from storage
    const timelineKey = `timeline:${issueId}`;
    const timeline = await storage.get(timelineKey) || [];

    // Get tasks from storage
    const tasksKey = `tasks:${issueId}`;
    const tasks = await storage.get(tasksKey) || [];

    return {
      incident: {
        key: issueData.key,
        summary: issueData.fields.summary,
        status: issueData.fields.status.name,
        severity: issueData.fields.priority?.name || 'Medium',
        assignee: issueData.fields.assignee?.displayName || 'Unassigned',
        created: new Date(issueData.fields.created).toLocaleString(),
        description: issueData.fields.description
      },
      warRoomActive: warRoomData.active || false,
      timeline,
      tasks
    };
  } catch (error) {
    console.error('Error fetching incident data:', error);
    throw error;
  }
});

// Activate war room for an incident
resolver.define('activateWarRoom', async (req) => {
  const { issueId } = req.payload;

  try {
    const warRoomKey = `warroom:${issueId}`;
    const timelineKey = `timeline:${issueId}`;

    // Set war room as active
    await storage.set(warRoomKey, {
      active: true,
      activatedAt: new Date().toISOString(),
      activatedBy: req.context.accountId
    });

    // Add initial timeline entry
    const existingTimeline = await storage.get(timelineKey) || [];
    existingTimeline.push({
      timestamp: new Date().toLocaleString(),
      message: '🏁 Race Control Activated - Paddock Shield deployed',
      type: 'system'
    });
    await storage.set(timelineKey, existingTimeline);

    return { success: true };
  } catch (error) {
    console.error('Error activating war room:', error);
    throw error;
  }
});

// Add timeline entry
resolver.define('addTimelineEntry', async (req) => {
  const { issueId, message } = req.payload;

  try {
    const timelineKey = `timeline:${issueId}`;
    const timeline = await storage.get(timelineKey) || [];

    timeline.push({
      timestamp: new Date().toLocaleString(),
      message,
      type: 'manual',
      user: req.context.accountId
    });

    await storage.set(timelineKey, timeline);

    return { success: true };
  } catch (error) {
    console.error('Error adding timeline entry:', error);
    throw error;
  }
});

// Orchestrate automated task creation
resolver.define('orchestrateTasks', async (req) => {
  const { issueId } = req.payload;

  try {
    // Fetch parent issue details
    const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}`);
    const issueData = await issueResponse.json();
    const projectId = issueData.fields.project.id;

    // Define task templates for F1 IP Protection (Paddock Shield)
    const taskTemplates = [
      {
        summary: '🚨 [PIT STOP] Contain IP Leak',
        description: 'Lock down all design file access. Revoke permissions for unauthorized accounts.',
        priority: 'Highest'
      },
      {
        summary: '🔍 [MARSHAL] Forensic Analysis',
        description: 'Analyze access logs to identify breach vector and scope of data exposure.',
        priority: 'Highest'
      },
      {
        summary: '⚖️ [STEWARD] FIA Compliance Review',
        description: 'Review incident against FIA data protection regulations and team policies.',
        priority: 'High'
      },
      {
        summary: '📊 [RACE ENGINEER] Executive Brief',
        description: 'Prepare incident summary for Team Principal (executive leadership).',
        priority: 'High'
      },
      {
        summary: '🔧 [PIT CREW] Patch and Remediate',
        description: 'Apply security patches and implement remediation measures.',
        priority: 'High'
      },
      {
        summary: '📝 [LEGAL] Breach Notification Assessment',
        description: 'Determine if regulatory breach notification is required (GDPR, CCPA, etc.).',
        priority: 'Medium'
      }
    ];

    const createdTasks = [];
    const timelineKey = `timeline:${issueId}`;
    const timeline = await storage.get(timelineKey) || [];

    // Create tasks in Jira
    for (const template of taskTemplates) {
      const taskPayload = {
        fields: {
          project: { id: projectId },
          summary: template.summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: template.description
                  }
                ]
              }
            ]
          },
          issuetype: { name: 'Task' },
          priority: { name: template.priority },
          parent: { key: issueData.key }
        }
      };

      try {
        const createResponse = await api.asApp().requestJira(route`/rest/api/3/issue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskPayload)
        });

        const createdTask = await createResponse.json();
        createdTasks.push({
          key: createdTask.key,
          summary: template.summary,
          status: 'To Do',
          assignee: null
        });

        // Add timeline entry with F1 terminology
        timeline.push({
          timestamp: new Date().toLocaleString(),
          message: `✅ Pit Crew deployed: ${template.summary} (${createdTask.key})`,
          type: 'system'
        });
      } catch (taskError) {
        console.error(`Error creating task ${template.summary}:`, taskError);
        timeline.push({
          timestamp: new Date().toLocaleString(),
          message: `❌ Failed to create task: ${template.summary}`,
          type: 'error'
        });
      }
    }

    // Save tasks and timeline
    const tasksKey = `tasks:${issueId}`;
    await storage.set(tasksKey, createdTasks);
    await storage.set(timelineKey, timeline);

    return { success: true, tasks: createdTasks };
  } catch (error) {
    console.error('Error orchestrating tasks:', error);
    throw error;
  }
});

export const handler = resolver.getDefinitions();
