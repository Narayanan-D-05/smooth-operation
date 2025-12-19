import api, { route, storage } from '@forge/api';

// Trigger handler for incident creation
export async function onIncidentCreated(event) {
  console.log('Incident created trigger fired:', event);
  
  const { issue } = event;
  const issueId = issue.id;
  const issueKey = issue.key;
  const priority = issue.fields.priority?.name || 'Medium';
  
  // Auto-activate war room for Critical/High severity incidents
  if (priority === 'Highest' || priority === 'Critical' || priority === 'High') {
    console.log(`Auto-activating war room for ${priority} priority incident: ${issueKey}`);
    
    try {
      const warRoomKey = `warroom:${issueId}`;
      const timelineKey = `timeline:${issueId}`;
      
      // Activate war room
      await storage.set(warRoomKey, {
        active: true,
        activatedAt: new Date().toISOString(),
        activatedBy: 'system',
        autoActivated: true
      });
      
      // Initialize timeline
      const timeline = [
        {
          timestamp: new Date().toLocaleString(),
          message: `🚨 Incident ${issueKey} created with ${priority} priority`,
          type: 'system'
        },
        {
          timestamp: new Date().toLocaleString(),
          message: '⚡ War Room auto-activated for high-severity incident',
          type: 'system'
        }
      ];
      
      await storage.set(timelineKey, timeline);
      
      console.log(`War room activated for incident ${issueKey}`);
    } catch (error) {
      console.error('Error auto-activating war room:', error);
    }
  } else {
    console.log(`Priority ${priority} does not trigger auto-activation for incident: ${issueKey}`);
  }
}
