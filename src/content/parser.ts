import { UploadSites, IScrapLink } from "../types"

const parseHTML = (data: IScrapLink): string => {
  let res = ""
  const parser = new DOMParser()
  const htmlDoc = parser.parseFromString(data.html!, "text/html")

  if (data.url.startsWith(UploadSites.Eksi)) {
    const target = htmlDoc.getElementById("image-zoom") as HTMLAnchorElement
    if (target) res = target.href
  } else if (data.url.startsWith(UploadSites.Ibb)) {
    const target = htmlDoc.querySelector(
      "#image-viewer-container > img"
    ) as HTMLImageElement
    if (target) res = target.src
  } else if (data.url.startsWith(UploadSites.EksiUp)) {
    const target = htmlDoc.getElementsByClassName("zoom-in")
    if (target.length > 0) {
      const img = target[0] as HTMLImageElement
      res = img.src
    }
  }

  return res
}

export default parseHTML
