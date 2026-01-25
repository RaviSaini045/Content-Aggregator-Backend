let lastRefreshAt = 0;

export function canRefreshNow(cooldownPeriod) {
  const now = Date.now();
  if (now - lastRefreshAt < cooldownPeriod) return false;
  lastRefreshAt = now;
  return true;
}
