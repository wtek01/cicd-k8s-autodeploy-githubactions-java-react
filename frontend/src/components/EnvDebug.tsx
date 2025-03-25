import config from "../config/env";

/**
 * Debugging component to display current environment configuration
 * Can be added to any page temporarily for testing/debugging
 */
export default function EnvDebug() {
  return (
    <div
      style={{
        margin: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#f8f9fa",
        fontFamily: "monospace",
        fontSize: "14px",
      }}
    >
      <h3>Environment Configuration</h3>
      <pre
        style={{
          background: "#212529",
          color: "#f8f9fa",
          padding: "15px",
          borderRadius: "4px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(
          {
            environment: config.environment,
            userServiceUrl: config.userServiceUrl,
            orderServiceUrl: config.orderServiceUrl,
            isDevelopment: config.isDevelopment,
            isDocker: config.isDocker,
            isKubernetes: config.isKubernetes,
            isProduction: config.isProduction,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
