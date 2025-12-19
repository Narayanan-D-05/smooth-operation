import api, { route, storage } from '@forge/api';

// Handler for automated task creation
export async function createIncidentTasks(event) {
  const { issueId } = event;
  
  console.log(`Creating incident tasks for issue: ${issueId}`);
  
  try {
    // Fetch issue details
    const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}`);
    const issueData = await issueResponse.json();
    const projectId = issueData.fields.project.id;
    const severity = issueData.fields.priority?.name || 'Medium';
    
    // Only auto-create tasks for High or Critical severity
    if (severity !== 'Highest' && severity !== 'High' && severity !== 'Critical') {
      console.log(`Severity ${severity} does not trigger auto-task creation`);
      return;
    }
    
    // Define critical response tasks
    const taskTemplates = [
      {
        summary: '[URGENT] Initial Threat Assessment',
        description: 'Perform immediate threat assessment and determine scope of incident.',
        priority: 'Highest'
      },
      {
        summary: '[URGENT] Containment Actions',
        description: 'Execute containment procedures to prevent incident escalation.',
        priority: 'Highest'
      }
    ];
    
    // Create tasks
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
      
      await api.asApp().requestJira(route`/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskPayload)
      });
    }
    
    console.log(`Successfully created ${taskTemplates.length} incident tasks`);
  } catch (error) {
    console.error('Error in createIncidentTasks:', error);
  }
}
