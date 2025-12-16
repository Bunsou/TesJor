// Simple console logger that works in both Edge and Node.js runtime
// Safe for client-side and server-side usage
const isDevelopment =
  typeof process !== "undefined" && process.env?.NODE_ENV === "development";

const formatMessage = (level: string, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;

  if (meta && Object.keys(meta).length > 0) {
    msg += `\n${JSON.stringify(meta, null, 2)}`;
  }

  return msg;
};

// Export simple logger that works in Edge Runtime
export const log = {
  error: (message: string, meta?: unknown) => {
    console.error(formatMessage("error", message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(formatMessage("warn", message, meta));
  },
  info: (message: string, meta?: unknown) => {
    if (isDevelopment) {
      console.info(formatMessage("info", message, meta));
    }
  },
  debug: (message: string, meta?: unknown) => {
    if (isDevelopment) {
      console.debug(formatMessage("debug", message, meta));
    }
  },
};

export default log;
