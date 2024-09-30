import { sendToContentScript } from "@plasmohq/messaging"

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed")
})

// This function will be called by the PortHandler
export async function startBooking(data) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tabs[0]?.id) {
    sendToContentScript({
      name: "startBooking",
      body: data,
      tabId: tabs[0].id
    })
  }
}
