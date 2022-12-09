const PreviewImage = (url: string): HTMLAnchorElement => {
  const LINK = document.createElement("a")
  LINK.href = url
  LINK.target = "_blank"

  const IMAGE = document.createElement("img")
  IMAGE.style.width = "auto"
  IMAGE.style.height = "200px"
  IMAGE.src = url

  LINK.appendChild(IMAGE)

  return LINK
}

export default PreviewImage
