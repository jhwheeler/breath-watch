function triggerReminder () {
  chrome.storage.sync.set({ openedReminder: Date.now() }, () => {
    console.log('watch your breath now: ', Date.now())
  })
}

chrome.runtime.onInstalled.addListener(() => triggerReminder())
chrome.runtime.onStartup.addListener(() => triggerReminder())
chrome.alarms.create("BreathWatch Alert", { periodInMinutes: 1 })

chrome.alarms.onAlarm.addListener(() => triggerReminder())
