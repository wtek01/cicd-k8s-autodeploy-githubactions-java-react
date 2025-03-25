import React from "react";
import config from "../config/env.config";

// Style object for the environment banner
const styles = {
  banner: {
    position: "fixed" as const,
    bottom: "10px",
    right: "10px",
    padding: "5px 10px",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: "bold" as const,
    color: "white",
    zIndex: 1000,
    opacity: 0.8,
  },
  production: {
    backgroundColor: "#2E7D32", // Green
    display: "none", // Hide in production
  },
  development: {
    backgroundColor: "#1565C0", // Blue
  },
  docker: {
    backgroundColor: "#0DB7ED", // Docker blue
  },
  kubernetes: {
    backgroundColor: "#326CE5", // Kubernetes blue
  },
  version: {
    marginLeft: "5px",
    fontSize: "10px",
    opacity: 0.8,
  },
};

const EnvironmentBanner: React.FC = () => {
  // Skip rendering in production unless forced
  if (config.isProduction && !config.isDevelopment) {
    return null;
  }

  // Determine the style based on environment
  const environmentStyle = {
    ...styles.banner,
    ...(config.isProduction
      ? styles.production
      : config.isDocker
      ? styles.docker
      : config.isKubernetes
      ? styles.kubernetes
      : styles.development),
  };

  return (
    <div style={environmentStyle}>
      {config.environment.toUpperCase()}
      <span style={styles.version}>v{config.version}</span>
    </div>
  );
};

export default EnvironmentBanner;
