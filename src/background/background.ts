import { IMessage, ON_ICON, OFF_ICON } from "../types"
import { setSetting } from "../settings"
import { getExtensionMode, getExtensionStatus } from "../utils"
import getHtml from "./getHtml"

// Set extension badge for specific tab
// Send extension status and mode to content script
const initExtension = async (tabId: number) => {
  const state = await getExtensionStatus(tabId)
  const mode = await getExtensionMode()
  if (state === "ON") {
    const message: IMessage = {
      message: state,
      data: mode,
    }
    chrome.action.setIcon({ tabId, path: ON_ICON })
    chrome.tabs.sendMessage(tabId, message)
  }
}

// Set all extension's badge to OFF in the target websites when extension installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: "https://eksisozluk*.com" }, function (tabs) {
    tabs &&
      tabs.forEach(async (tab) => {
        const tabId = tab.id!
        await setSetting(tabId.toString(), "OFF")
        chrome.action.setIcon({ tabId, path: OFF_ICON })
      })
  })
})

// When page loaded init extension
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  let matched = false

  if (tab.url!.startsWith("https://eksisozluk")) matched = true

  if (matched && changeInfo.status === "complete") {
    initExtension(tab.id!)
  }
})

chrome.runtime.onMessage.addListener(function (
  request: IMessage,
  sender,
  sendResponse
) {
  if (request.message === "GET_CONTENT" && sender.tab!.url) {
    const newSite = `https://${new URL(sender.tab!.url).hostname}`

    console.log("New Site -> " + newSite)

    getHtml(request.data, newSite)
      .then((res) => {
        console.log(res)
        chrome.tabs.sendMessage(sender.tab!.id!, {
          message: "GET_CONTENT_RESULT",
          data: res,
        })
      })
      .catch((err) =>
        chrome.tabs.sendMessage(sender.tab!.id!, {
          message: "GET_CONTENT_RESULT",
          data: { err },
          error: true,
        })
      )
  }
  return true
})

export {}
