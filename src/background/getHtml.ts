import { UploadSites, IScrapLink } from "../types"

const getHtml = async (
  data: IScrapLink,
  newSite?: boolean
): Promise<IScrapLink> => {
  const { url } = data
  if (url.startsWith(UploadSites.Eksi)) {
    data.html = await getEksi(url, newSite)
  } else if (url.startsWith(UploadSites.Ibb)) {
    data.html = await getIBB(url)
  } else if (url.startsWith(UploadSites.EksiUp)) {
    data.html = await getEksiUp(url)
  }

  return data
}

const getEksi = async (url: string, newSite?: boolean): Promise<string> => {
  let result = ""
  try {
    const imageCode = url.split("/").pop()
    const scrapUrl = newSite
      ? `https://eksisozluk2023.com/img/${imageCode}`
      : `https://eksisozluk.com/img/${imageCode}`

    const response = await fetch(scrapUrl, { mode: "no-cors" })
    result = await response.text()
  } catch (e) {
    console.error(e)
  }
  return result
}

const getIBB = async (url: string): Promise<string> => {
  let result = ""
  try {
    const response = await fetch(url, { mode: "no-cors" })
    result = await response.text()
  } catch (e) {
    console.error(e)
  }
  return result
}

const getEksiUp = async (url: string): Promise<string> => {
  let result = ""
  try {
    const response = await fetch(url, { mode: "no-cors" })
    result = await response.text()
  } catch (e) {
    console.error(e)
  }
  return result
}

export default getHtml
