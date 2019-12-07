function triggerReminder () {
  chrome.storage.sync.set({ openedReminder: Date.now() }, () => {
    console.log('watch your breath now: ', Date.now())
  })

  const notificationOptions = {
    type: "basic",
    title: "Watch your breath",
    message: "It's time to become mindful of your breath.",
    iconUrl: "images/get_started128.png"
  }

  chrome.notifications.create(`breath_watch_reminder_${Date.now()}`, notificationOptions)
}

chrome.runtime.onInstalled.addListener(() => triggerReminder())
chrome.runtime.onStartup.addListener(() => triggerReminder())
chrome.alarms.create("BreathWatch Alert", { periodInMinutes: 1 })

chrome.alarms.onAlarm.addListener(() => triggerReminder())
