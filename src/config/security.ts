export const SecurityConfig = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_FILES: 1000,
  MAX_DEPTH: 10,
  OPERATION_TIMEOUT: 30000,
  ALLOWED_EXTENSIONS: ['.md', '.markdown'],
  MAX_OPS_PER_SECOND: 100
} as const;
