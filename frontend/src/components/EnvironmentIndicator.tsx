import config from "../config/env";

/**
 * A visual indicator showing which environment the application is running in
 * Only appears in non-production environments
 */
export default function EnvironmentIndicator() {
  // Don't show in production
  if (config.isProduction) return null;

  // Choose color based on environment
  const colors: Record<string, string> = {
    development: "#28a745", // green
    docker: "#0d6efd", // blue
    kubernetes: "#6f42c1", // purple
    production: "#dc3545", // red (should never be shown)
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        padding: "5px 10px",
        background: colors[config.environment] || "#6c757d",
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        opacity: 0.8,
        zIndex: 1000,
        fontFamily: "monospace",
      }}
    >
      {config.environment.toUpperCase()}
    </div>
  );
}
