import "server-only";

export function logOperationalEvent(event, fields = {}) {
  const safeFields = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null)
  );
  console.info(JSON.stringify({ event, ...safeFields }));
}
