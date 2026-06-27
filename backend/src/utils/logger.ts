export const logger = {
  info: (message: string, meta?: unknown) => {
    // Lightweight structured logging suitable for Raspberry Pi.
    console.info(`[INFO] ${message}`, meta ?? '')
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${message}`, meta ?? '')
  },
  error: (message: string, meta?: unknown) => {
    console.error(`[ERROR] ${message}`, meta ?? '')
  },
}
