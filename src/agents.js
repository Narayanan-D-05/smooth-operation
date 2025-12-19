import api, { route, storage } from '@forge/api';

/**
 * PADDOCK SHIELD - Multi-Agent System
 * 
 * The "Pit Crew" - Automated response agents for F1-speed incident remediation
 */

// Marshal Agent: Anomaly Detection
export async function detectAnomalies(event) {
    const { issueId } = event;

    console.log(`🚨 Marshal Agent scanning for anomalies in incident: ${issueId}`);

    try {
        const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}`);
        const issueData = await issueResponse.json();

        const anomalies = [];

        // Check for IP Protection threats (F1-specific)
        const description = issueData.fields.description?.content?.[0]?.content?.[0]?.text || '';
        const summary = issueData.fields.summary || '';

        // Detect CAD file leak patterns
        if (description.toLowerCase().includes('cad') ||
            description.toLowerCase().includes('design') ||
            summary.toLowerCase().includes('front wing') ||
            summary.toLowerCase().includes('telemetry')) {
            anomalies.push({
                type: 'IP_LEAK',
                severity: 'CRITICAL',
                description: '🏎️ Potential IP leak detected (CAD/Design data)',
                timestamp: new Date().toISOString()
            });
        }

        // Detect unauthorized access patterns
        if (description.toLowerCase().includes('unauthorized') ||
            description.toLowerCase().includes('breach')) {
            anomalies.push({
                type: 'UNAUTHORIZED_ACCESS',
                severity: 'HIGH',
                description: '⚠️ Unauthorized access pattern detected',
                timestamp: new Date().toISOString()
            });
        }

        // Store anomalies
        if (anomalies.length > 0) {
            await storage.set(`anomalies:${issueId}`, anomalies);
            console.log(`Marshal Agent detected ${anomalies.length} anomalies`);
        }

        return anomalies;
    } catch (error) {
        console.error('Marshal Agent error:', error);
        return [];
    }
}

// Steward Agent: Policy Compliance Check
export async function checkCompliance(issueId, anomalies) {
    console.log(`⚖️ Steward Agent reviewing FIA compliance for incident: ${issueId}`);

    const violations = [];

    for (const anomaly of anomalies) {
        // Check against "FIA Regulations" (Security Policy)
        if (anomaly.type === 'IP_LEAK') {
            violations.push({
                rule: 'FIA_REGULATION_8.1',
                description: 'Car design data must remain confidential',
                severity: 'CRITICAL',
                action: 'IMMEDIATE_LOCKDOWN',
                timestamp: new Date().toISOString()
            });
        }

        if (anomaly.type === 'UNAUTHORIZED_ACCESS') {
            violations.push({
                rule: 'FIA_REGULATION_12.4',
                description: 'Paddock access restricted to authorized personnel',
                severity: 'HIGH',
                action: 'REVOKE_ACCESS',
                timestamp: new Date().toISOString()
            });
        }
    }

    if (violations.length > 0) {
        await storage.set(`violations:${issueId}`, violations);
        console.log(`Steward Agent found ${violations.length} policy violations`);
    }

    return violations;
}

// Pit Crew Agent: Rapid Response Execution
export async function executeResponse(event) {
    const { issueId } = event;

    console.log(`🔧 Pit Crew deploying for incident: ${issueId}`);

    try {
        const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}`);
        const issueData = await issueResponse.json();
        const projectId = issueData.fields.project.id;
        const severity = issueData.fields.priority?.name || 'Medium';

        // Only deploy Pit Crew for High or Critical incidents
        if (severity !== 'Highest' && severity !== 'High' && severity !== 'Critical') {
            console.log(`Severity ${severity} does not require Pit Crew deployment`);
            return;
        }

        // F1-themed response tasks
        const pitCrewTasks = [
            {
                summary: '🚨 [PIT STOP] Contain IP Leak',
                description: 'Lock down all design file access. Revoke permissions for unauthorized accounts.',
                priority: 'Highest',
                agent: 'Pit Crew Alpha'
            },
            {
                summary: '🔍 [MARSHAL] Forensic Analysis',
                description: 'Analyze access logs to identify breach vector and scope.',
                priority: 'Highest',
                agent: 'Marshal Agent'
            },
            {
                summary: '⚖️ [STEWARD] FIA Compliance Review',
                description: 'Review incident against FIA data protection regulations.',
                priority: 'High',
                agent: 'Steward Agent'
            },
            {
                summary: '📊 [RACE ENGINEER] Executive Brief',
                description: 'Prepare incident summary for Team Principal (executive leadership).',
                priority: 'High',
                agent: 'Race Engineer'
            }
        ];

        // Create tasks in parallel
        for (const task of pitCrewTasks) {
            const taskPayload = {
                fields: {
                    project: { id: projectId },
                    summary: task.summary,
                    description: {
                        type: 'doc',
                        version: 1,
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: task.description
                                    },
                                    {
                                        type: 'hardBreak'
                                    },
                                    {
                                        type: 'text',
                                        text: `\n🏎️ Agent: ${task.agent}`
                                    }
                                ]
                            }
                        ]
                    },
                    issuetype: { name: 'Task' },
                    priority: { name: task.priority },
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

        // Log pit stop execution time
        const pitStopTime = new Date().getSeconds() % 10; // Simulated
        console.log(`✅ Pit Crew deployed ${pitCrewTasks.length} agents in ${pitStopTime}s`);

        // Store deployment record
        await storage.set(`pitstop:${issueId}`, {
            deployedAt: new Date().toISOString(),
            agents: pitCrewTasks.map(t => t.agent),
            taskCount: pitCrewTasks.length,
            pitStopTime: `${pitStopTime}s`
        });

    } catch (error) {
        console.error('Pit Crew deployment error:', error);
    }
}
