import React, { useEffect, useState } from 'react';
import ForgeReconciler, { 
  Text, 
  Strong, 
  Button, 
  Badge,
  ButtonSet,
  Heading,
  SectionMessage,
  StatusLozenge,
  Table,
  Head,
  Row,
  Cell,
  Form,
  TextArea,
  DatePicker,
  Select,
  useProductContext,
  Fragment
} from '@forge/react';
import { invoke } from '@forge/bridge';

const IncidentMetadata = ({ incident }) => {
  if (!incident) return null;
  
  return (
    <Fragment>
      <Heading size="medium">Incident Overview</Heading>
      <Table>
        <Head>
          <Cell><Strong>Property</Strong></Cell>
          <Cell><Strong>Value</Strong></Cell>
        </Head>
        <Row>
          <Cell>Incident ID</Cell>
          <Cell>{incident.key}</Cell>
        </Row>
        <Row>
          <Cell>Severity</Cell>
          <Cell>
            <StatusLozenge 
              text={incident.severity || 'Medium'} 
              appearance={incident.severity === 'Critical' ? 'removed' : 'default'}
            />
          </Cell>
        </Row>
        <Row>
          <Cell>Status</Cell>
          <Cell>
            <StatusLozenge 
              text={incident.status} 
              appearance={incident.status === 'In Progress' ? 'inprogress' : 'default'}
            />
          </Cell>
        </Row>
        <Row>
          <Cell>Assigned Team</Cell>
          <Cell>{incident.assignee || 'Unassigned'}</Cell>
        </Row>
        <Row>
          <Cell>Created</Cell>
          <Cell>{incident.created}</Cell>
        </Row>
      </Table>
    </Fragment>
  );
};

const IncidentTimeline = ({ timeline, onAddEntry }) => {
  const [newEntry, setNewEntry] = useState('');
  
  const handleAddEntry = async () => {
    if (newEntry.trim()) {
      await onAddEntry(newEntry);
      setNewEntry('');
    }
  };
  
  return (
    <Fragment>
      <Heading size="medium">Incident Timeline</Heading>
      <SectionMessage appearance="information">
        <Text>All actions are logged for compliance and audit purposes.</Text>
      </SectionMessage>
      
      <Form onSubmit={handleAddEntry}>
        <TextArea 
          label="Add Timeline Entry" 
          value={newEntry}
          onChange={setNewEntry}
          placeholder="Document actions, decisions, or observations..."
        />
        <Button text="Add Entry" appearance="primary" />
      </Form>
      
      <Heading size="small">Timeline Entries</Heading>
      {timeline && timeline.length > 0 ? (
        <Table>
          <Head>
            <Cell><Strong>Time</Strong></Cell>
            <Cell><Strong>Event</Strong></Cell>
          </Head>
          {timeline.map((entry, index) => (
            <Row key={index}>
              <Cell>{entry.timestamp}</Cell>
              <Cell>{entry.message}</Cell>
            </Row>
          ))}
        </Table>
      ) : (
        <Text>No timeline entries yet.</Text>
      )}
    </Fragment>
  );
};

const TaskOrchestration = ({ tasks, onCreateTasks, isLoading }) => {
  return (
    <Fragment>
      <Heading size="medium">Response Tasks</Heading>
      <SectionMessage appearance="warning">
        <Text>Automated task creation for parallel incident response across teams.</Text>
      </SectionMessage>
      
      <ButtonSet>
        <Button 
          text="Create Incident Tasks" 
          appearance="primary" 
          onClick={onCreateTasks}
          isDisabled={isLoading}
        />
      </ButtonSet>
      
      {tasks && tasks.length > 0 && (
        <Fragment>
          <Heading size="small">Active Tasks</Heading>
          <Table>
            <Head>
              <Cell><Strong>Task</Strong></Cell>
              <Cell><Strong>Assignee</Strong></Cell>
              <Cell><Strong>Status</Strong></Cell>
            </Head>
            {tasks.map((task, index) => (
              <Row key={index}>
                <Cell>{task.summary}</Cell>
                <Cell>{task.assignee || 'Unassigned'}</Cell>
                <Cell>
                  <StatusLozenge 
                    text={task.status} 
                    appearance="default"
                  />
                </Cell>
              </Row>
            ))}
          </Table>
        </Fragment>
      )}
    </Fragment>
  );
};

const App = () => {
  const context = useProductContext();
  const [incident, setIncident] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [warRoomActive, setWarRoomActive] = useState(false);
  
  useEffect(() => {
    if (context) {
      loadIncidentData();
    }
  }, [context]);
  
  const loadIncidentData = async () => {
    setIsLoading(true);
    try {
      const data = await invoke('getIncidentData', { 
        issueId: context?.platformContext?.issueId 
      });
      setIncident(data.incident);
      setTimeline(data.timeline || []);
      setTasks(data.tasks || []);
      setWarRoomActive(data.warRoomActive);
    } catch (error) {
      console.error('Error loading incident data:', error);
    }
    setIsLoading(false);
  };
  
  const activateWarRoom = async () => {
    setIsLoading(true);
    try {
      await invoke('activateWarRoom', { 
        issueId: context?.platformContext?.issueId 
      });
      await loadIncidentData();
    } catch (error) {
      console.error('Error activating war room:', error);
    }
    setIsLoading(false);
  };
  
  const createTasks = async () => {
    setIsLoading(true);
    try {
      await invoke('orchestrateTasks', { 
        issueId: context?.platformContext?.issueId 
      });
      await loadIncidentData();
    } catch (error) {
      console.error('Error creating tasks:', error);
    }
    setIsLoading(false);
  };
  
  const addTimelineEntry = async (message) => {
    try {
      await invoke('addTimelineEntry', { 
        issueId: context?.platformContext?.issueId,
        message 
      });
      await loadIncidentData();
    } catch (error) {
      console.error('Error adding timeline entry:', error);
    }
  };
  
  if (isLoading && !incident) {
    return <Text>Loading War Room...</Text>;
  }
  
  if (!warRoomActive) {
    return (
      <Fragment>
        <Heading size="large">🚨 Cyber Incident War Room</Heading>
        <SectionMessage appearance="warning">
          <Text>
            The War Room is not active for this incident. Activate it to enable 
            real-time cross-team coordination and automated task orchestration.
          </Text>
        </SectionMessage>
        <Button 
          text="Activate War Room" 
          appearance="primary" 
          onClick={activateWarRoom}
          isDisabled={isLoading}
        />
      </Fragment>
    );
  }
  
  return (
    <Fragment>
      <Heading size="large">🚨 Cyber Incident War Room</Heading>
      <Badge text="Active" appearance="added" />
      
      <IncidentMetadata incident={incident} />
      
      <TaskOrchestration 
        tasks={tasks} 
        onCreateTasks={createTasks}
        isLoading={isLoading}
      />
      
      <IncidentTimeline 
        timeline={timeline} 
        onAddEntry={addTimelineEntry}
      />
      
      <SectionMessage appearance="information">
        <Text>
          <Strong>War Room Status:</Strong> All actions are audit-ready and compliance-tracked.
        </Text>
      </SectionMessage>
    </Fragment>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
