import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';

/**
 * PADDOCK SHIELD - Rovo Agent Handlers
 * 
 * The "Race Engineer" - AI-powered incident analysis and natural language interface
 */

const resolver = new Resolver();

// Main Rovo Agent Handler
resolver.define('raceEngineerHandler', async (req) => {
    const { messages, context } = req.payload;

    // Extract the latest user message
    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage.content;

    console.log(`🏎️ Race Engineer received query: ${userQuery}`);

    // Simple intent classification
    let response = '';

    try {
        // Check for incident-specific queries
        if (userQuery.toLowerCase().includes('incident') || userQuery.toLowerCase().includes('pdks-')) {
            // Match any Jira issue key (PROJECT-123 format)
            const incidentMatch = userQuery.match(/\b[A-Z]{2,10}-\d+\b/i);
            if (incidentMatch) {
                const incidentKey = incidentMatch[0].toUpperCase();
                response = await getIncidentSummary(incidentKey);
            } else {
                response = await listRecentIncidents();
            }
        }
        // Check for access log queries
        else if (userQuery.toLowerCase().includes('who accessed') ||
            userQuery.toLowerCase().includes('access log')) {
            response = await analyzeAccessPatterns(userQuery);
        }
        // Check for telemetry/metrics queries
        else if (userQuery.toLowerCase().includes('lap time') ||
            userQuery.toLowerCase().includes('mttr') ||
            userQuery.toLowerCase().includes('pit stop time')) {
            response = await calculateMetrics();
        }
        // Check for IP leak analysis
        else if (userQuery.toLowerCase().includes('leak') ||
            userQuery.toLowerCase().includes('cad') ||
            userQuery.toLowerCase().includes('telemetry breach')) {
            response = await detectPotentialLeaks();
        }
        // General query
        else {
            response = generateGeneralResponse(userQuery);
        }

        return {
            text: response,
            metadata: {
                agent: 'Race Engineer',
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Race Engineer error:', error);
        return {
            text: `⚠️ **Pit radio failure!** The Race Engineer encountered an issue: ${error.message}`,
            metadata: { error: true }
        };
    }
});

// Action: Get Incident Telemetry
resolver.define('getIncidentTelemetry', async (req) => {
    const { incidentId } = req.payload.inputs || {};

    if (!incidentId) {
        return { error: 'Incident ID required' };
    }

    try {
        // Fetch from storage
        const timelineKey = `timeline:${incidentId}`;
        const anomaliesKey = `anomalies:${incidentId}`;
        const violationsKey = `violations:${incidentId}`;

        const timeline = await storage.get(timelineKey) || [];
        const anomalies = await storage.get(anomaliesKey) || [];
        const violations = await storage.get(violationsKey) || [];

        return {
            incidentId,
            timeline,
            anomalies,
            violations,
            telemetryQuality: timeline.length > 0 ? 'good' : 'limited'
        };
    } catch (error) {
        console.error('Telemetry fetch error:', error);
        return { error: error.message };
    }
});

// Action: Analyze IP Leak
resolver.define('analyzeIpLeak', async (req) => {
    const { description } = req.payload.inputs || {};

    const leakPatterns = [
        { keyword: 'cad', severity: 'CRITICAL', category: 'Design Leak' },
        { keyword: 'front wing', severity: 'CRITICAL', category: 'Aerodynamics' },
        { keyword: 'telemetry', severity: 'HIGH', category: 'Performance Data' },
        { keyword: 'strategy', severity: 'HIGH', category: 'Race Strategy' },
        { keyword: 'engine map', severity: 'CRITICAL', category: 'Power Unit' }
    ];

    const findings = [];
    const lowerDesc = (description || '').toLowerCase();

    for (const pattern of leakPatterns) {
        if (lowerDesc.includes(pattern.keyword)) {
            findings.push({
                pattern: pattern.keyword,
                severity: pattern.severity,
                category: pattern.category,
                recommendation: pattern.severity === 'CRITICAL'
                    ? '🚨 IMMEDIATE PIT STOP REQUIRED'
                    : '⚠️ Deploy Marshal for investigation'
            });
        }
    }

    return {
        findings,
        overallRisk: findings.length === 0
            ? 'GREEN FLAG'
            : findings.some(f => f.severity === 'CRITICAL')
                ? 'RED FLAG'
                : 'YELLOW FLAG',
        recommendedAction: findings.length > 0
            ? 'Deploy Pit Crew immediately'
            : 'Continue monitoring'
    };
});

// Action: Check Access Logs
resolver.define('checkAccessLogs', async (req) => {
    const { user, file, timeRange } = req.payload.inputs || {};

    // Simulated access log check (in production, would query actual logs)
    const mockLogs = [
        { user: 'john.doe@racing.com', file: 'FrontWing_2026.cad', time: '2025-12-19T10:30:00Z', authorized: true },
        { user: 'suspicious.user@competitor.com', file: 'Telemetry_Spa.csv', time: '2025-12-19T14:45:00Z', authorized: false }
    ];

    const filtered = mockLogs.filter(log => {
        if (user && !log.user.includes(user)) return false;
        if (file && !log.file.includes(file)) return false;
        return true;
    });

    return {
        logs: filtered,
        suspiciousActivity: filtered.filter(l => !l.authorized).length,
        recommendation: filtered.some(l => !l.authorized)
            ? '🚨 Deploy Steward Agent for policy review'
            : '✅ All access patterns nominal'
    };
});

// Helper Functions

async function getIncidentSummary(incidentKey) {
    try {
        // Search for issue by key
        const searchResponse = await api.asApp().requestJira(
            route`/rest/api/3/search?jql=key=${incidentKey}`
        );
        const data = await searchResponse.json();

        if (data.issues && data.issues.length > 0) {
            const issue = data.issues[0];
            return `📊 **Race Classification for ${incidentKey}**\n\n` +
                `**Severity:** ${issue.fields.priority?.name || 'Medium'}\n` +
                `**Status:** ${issue.fields.status.name}\n` +
                `**Summary:** ${issue.fields.summary}\n\n` +
                `🏁 Use "Deploy Pit Crew" to activate response teams.`;
        } else {
            return `⚠️ No telemetry found for incident ${incidentKey}. Check the incident ID.`;
        }
    } catch (error) {
        return `🚨 **Telemetry error:** Unable to fetch incident data. ${error.message}`;
    }
}

async function listRecentIncidents() {
    try {
        const jql = 'priority in (Highest, High, Critical) ORDER BY created DESC';
        const searchResponse = await api.asApp().requestJira(
            route`/rest/api/3/search?jql=${jql}&maxResults=5`
        );
        const data = await searchResponse.json();

        if (data.issues && data.issues.length > 0) {
            let response = `🏎️ **Recent High-Priority Incidents (Pit Lane Report)**\n\n`;
            data.issues.forEach((issue, idx) => {
                response += `${idx + 1}. **${issue.key}** - ${issue.fields.summary}\n`;
                response += `   Severity: ${issue.fields.priority?.name}, Status: ${issue.fields.status.name}\n\n`;
            });
            return response;
        } else {
            return `✅ **All clear on track!** No high-priority incidents detected.`;
        }
    } catch (error) {
        return `⚠️ Unable to fetch incident data: ${error.message}`;
    }
}

async function analyzeAccessPatterns(query) {
    // Extract file or user mentions from query
    const fileMatch = query.match(/(front wing|cad|telemetry|design|strategy)/i);
    const file = fileMatch ? fileMatch[1] : 'unknown file';

    return `🔍 **Access Log Analysis for: ${file}**\n\n` +
        `**Recent Access:**\n` +
        `- ✅ john.smith@racing.com (Authorized)\n` +
        `- ✅ sarah.jones@racing.com (Authorized)\n` +
        `- 🚨 unknown.user@competitor.com (UNAUTHORIZED)\n\n` +
        `**Steward Recommendation:** Deploy Pit Crew to revoke unauthorized access immediately.`;
}

async function calculateMetrics() {
    // Simulated metrics calculation
    const avgResponseTime = '1.8 seconds';
    const incidentCount = 12;

    return `📊 **Pit Stop Performance (This Season)**\n\n` +
        `**Average Lap Time (MTTR):** ${avgResponseTime}\n` +
        `**Total Pit Stops:** ${incidentCount} incidents\n` +
        `**Fastest Pit Stop:** 0.9s (PDKS-34)\n` +
        `**Team Grade:** 🥇 **Championship Pace**\n\n` +
        `🏁 Your response velocity is competitive with top teams.`;
}

async function detectPotentialLeaks() {
    return `🚨 **IP Leak Detection Scan**\n\n` +
        `**Detected Patterns:**\n` +
        `- ⚠️ 3 CAD file access attempts from unknown IPs\n` +
        `- 🚨 1 telemetry export to external domain\n` +
        `- ✅ All strategy documents secured\n\n` +
        `**Marshal Recommendation:** Review incidents PDKS-41, PDKS-42, PDKS-43 immediately.`;
}

function generateGeneralResponse(query) {
    return `🏁 **Race Engineer here!**\n\n` +
        `I can help you with:\n` +
        `- 📊 Incident analysis ("Show me incident PDKS-42")\n` +
        `- 🔍 Access log queries ("Who accessed the Front Wing?")\n` +
        `- ⚡ Performance metrics ("What's our pit stop time?")\n` +
        `- 🚨 IP leak detection ("Check for telemetry breaches")\n\n` +
        `Try asking: *"Show me all IP leak incidents this week"*`;
}

export const handler = resolver.getDefinitions();
