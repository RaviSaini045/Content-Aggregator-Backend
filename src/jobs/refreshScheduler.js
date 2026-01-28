import { refreshAllSources } from "../services/refreshAllSources.js";

let timerId = null;
let isRunning = false;

async function runRefresh(trigger) {
  if (isRunning) {
    return { skipped: true, reason: "refresh already in progress", trigger };
  }

  isRunning = true;
  try {
    const result = await refreshAllSources();
    console.log(`article ${trigger} refreshed sucessfully..`);
    return { ...result, trigger };
  } catch (err) {
    console.log(`error during article ${trigger} refresh..`, err);
    return { skipped: false, error: err?.message || String(err), trigger };
  } finally {
    isRunning = false;
  }
}

export function startScheduler() {
  const timeInMinutes = Number(process.env.REFRESH_INTERVAL_MINUTES) || 5;

  scheduleNext(timeInMinutes);
}

export function scheduleNext(timeInMinutes) {
  if (timerId) clearTimeout(timerId);

  timerId = setTimeout(async () => {
    await runRefresh("auto");
    scheduleNext(timeInMinutes);
  }, timeInMinutes * 60 * 1000);
}

export async function manualRefreshAndReset() {
  const timeInMinutes = Number(process.env.REFRESH_INTERVAL_MINUTES) || 15;

  const result = await runRefresh("manual");

  scheduleNext(timeInMinutes);

  return result;
}
