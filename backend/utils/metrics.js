/**
 * @fileoverview Utility for recording custom metrics to Google Cloud Monitoring
 */

const { MetricServiceClient } = require("@google-cloud/monitoring");

let client;
const isTestEnv = () =>
  process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

/**
 * Gets the GCP project path for monitoring.
 * @returns {string|null} The project path, or null if missing/testing
 */
const getProjectName = () => {
  if (isTestEnv()) {
    return null;
  }
  const projectId = process.env.GCP_PROJECT_ID;
  if (!projectId) {
    return null;
  }
  if (!client) {
    client = new MetricServiceClient();
  }
  return client.projectPath(projectId);
};

// Custom metric names (appear in GCP).
const LATENCY_METRIC = "custom.googleapis.com/api_latency";
const ERROR_METRIC = "custom.googleapis.com/api_errors";

/**
 * Record latency (in milliseconds).
 * @param {number} ms - The latency in milliseconds
 * @returns {Promise<void>}
 */
async function recordLatency(ms) {
  const projectName = getProjectName();
  if (!projectName) {
    return;
  }

  const dataPoint = {
    interval: {
      endTime: { seconds: Date.now() / 1000 },
    },
    value: {
      doubleValue: ms,
    },
  };

  const request = {
    name: projectName,
    timeSeries: [
      {
        metric: { type: LATENCY_METRIC },
        resource: { type: "global" },
        points: [dataPoint],
      },
    ],
  };

  await client.createTimeSeries(request);
}

/**
 * Record error count.
 * @returns {Promise<void>}
 */
async function recordError() {
  const projectName = getProjectName();
  if (!projectName) {
    return;
  }

  const dataPoint = {
    interval: {
      endTime: { seconds: Date.now() / 1000 },
    },
    value: {
      int64Value: 1,
    },
  };

  const request = {
    name: projectName,
    timeSeries: [
      {
        metric: { type: ERROR_METRIC },
        resource: { type: "global" },
        points: [dataPoint],
      },
    ],
  };

  await client.createTimeSeries(request);
}

module.exports = {
  recordLatency,
  recordError,
};
