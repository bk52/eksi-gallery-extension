import { IMessage, ON_ICON, OFF_ICON, TARGET_SITE } from "../types"
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
  chrome.tabs.query({ url: TARGET_SITE }, function (tabs) {
    tabs.forEach(async (tab) => {
      const tabId = tab.id!
      await setSetting(tabId.toString(), "OFF")
      chrome.action.setIcon({ tabId, path: OFF_ICON })
    })
  })
})

// When page loaded init extension
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url!.startsWith(TARGET_SITE) && changeInfo.status === "complete") {
    initExtension(tab.id!)
  }
})

chrome.runtime.onMessage.addListener(function (
  request: IMessage,
  sender,
  sendResponse
) {
  if (request.message === "GET_CONTENT") {
    getHtml(request.data)
      .then((res) => {
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
