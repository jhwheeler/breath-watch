function triggerReminder () {
  const timeNow = Date.now()

  chrome.storage.sync.set({ openedReminder: timeNow }, () => {
    console.log('watch your breath now: ', timeNow)
  })

  const notificationOptions = {
    type: "basic",
    title: "Watch your breath",
    message: "It's time to become mindful of your breath.",
    iconUrl: "images/get_started128.png",
    requireInteraction: true,
  }

  const notificationId = `breath_watch_reminder_${timeNow}`
  chrome.notifications.create(notificationId, notificationOptions)

  const timeToPersist = 60000
  setTimeout(() => {
    chrome.notifications.clear(notificationId)
  }, timeToPersist)
}

chrome.runtime.onInstalled.addListener(() => triggerReminder())
chrome.runtime.onStartup.addListener(() => triggerReminder())
chrome.alarms.create("BreathWatch Alert", { periodInMinutes: 15 })

chrome.alarms.onAlarm.addListener(() => triggerReminder())
