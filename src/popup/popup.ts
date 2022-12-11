import { setSetting } from "../settings"
import { getExtensionStatus, getExtensionMode } from "../utils"
import { ViewMode, ON_ICON, OFF_ICON, TARGET_SITE, IMessage } from "../types"
let activeTabId = -1

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const { id, url } = tabs[0]
  if (url && url.indexOf(TARGET_SITE) > -1) {
    url.indexOf("https://eksisozluk.com/biri") > -1 ? hideExtension() : init(id)
  } else {
    hideExtension()
  }
})

const init = async (tabId?: number) => {
  if (tabId) {
    activeTabId = tabId
    const state = await getExtensionStatus(tabId)
    const mode = await getExtensionMode()
    setStatus(state)
    mode === "INLINE" ? setMode("INLINE") : setMode("GALLERY")
  }
}

const setStatus = (status: "ON" | "OFF") => {
  const onOffButton = document.getElementById("activeButton")
  if (onOffButton) {
    status === "ON"
      ? onOffButton.classList.add("active")
      : onOffButton.classList.remove("active")
  }
}

const setMode = (mode: ViewMode) => {
  const galleryButton = document.getElementById("galleryMode")
  const inlineMode = document.getElementById("inlineMode")
  if (mode === "GALLERY") {
    inlineMode!.style.display = "none"
    galleryButton!.style.display = "flex"
  } else if (mode === "INLINE") {
    galleryButton!.style.display = "none"
    inlineMode!.style.display = "flex"
  }
}

const hideExtension = () => {
  const extensionDiv = document.getElementById("extension")
  const noExtensionDiv = document.getElementById("no-extension")
  if (extensionDiv) extensionDiv.style.display = "none"
  if (noExtensionDiv) noExtensionDiv.style.display = "flex"
}

const onActiveClick = async () => {
  if (activeTabId > 0) {
    const prevState = await getExtensionStatus(activeTabId)
    const nextState = prevState === "ON" ? "OFF" : "ON"
    const mode = await getExtensionMode()
    await setSetting(activeTabId.toString(), nextState)
    //Change extension icon
    const path = nextState === "ON" ? ON_ICON : OFF_ICON
    chrome.action.setIcon({ tabId: activeTabId, path })
    setStatus(nextState)
    // Send to content script
    const message: IMessage = {
      message: nextState,
      data: mode,
    }
    chrome.tabs.sendMessage(activeTabId, message)
  }
}

const onModeClick = async () => {
  if (activeTabId > 0) {
    const status = await getExtensionStatus(activeTabId)
    const prevMode = await getExtensionMode()
    const nextMode: ViewMode = prevMode === "INLINE" ? "GALLERY" : "INLINE"
    await setSetting("mode", nextMode)
    setMode(nextMode)
    if (status === "ON") {
      const message: IMessage = {
        message: "CHANGE_MODE",
      }
      chrome.tabs.sendMessage(activeTabId, message)
    }
  }
}

document
  .getElementById("activeButton")!
  .addEventListener("click", onActiveClick)

document.getElementById("galleryMode")!.addEventListener("click", onModeClick)

document.getElementById("inlineMode")!.addEventListener("click", onModeClick)

export {}
