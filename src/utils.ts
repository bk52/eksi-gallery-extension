import { getSetting } from "./settings"
import { ViewMode } from "./types"

export const dateTimeConverter = (dateStr: string): Date => {
  const [date, time] = dateStr.split(" ")
  const [day, month, year] = date.split(".").map((item) => parseInt(item))
  const [hour, minute] = time.split(":").map((item) => parseInt(item))
  return new Date(year, month - 1, day, hour, minute)
}

export const getExtensionStatus = async (
  tabId: number
): Promise<"ON" | "OFF"> => {
  const state = await getSetting(tabId.toString())
  return state[tabId] === "ON" ? "ON" : "OFF"
}

export const getExtensionMode = async (): Promise<ViewMode> => {
  const mode = await getSetting("mode")
  return mode["mode"] === "INLINE" ? "INLINE" : "GALLERY"
}
