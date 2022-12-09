class AlertComponent {
  // eslint-disable-next-line no-use-before-define
  private static _instance: AlertComponent
  private AlertDiv: HTMLDivElement
  private alertTimeout: NodeJS.Timeout | undefined

  private constructor() {
    this.AlertDiv = document.createElement("div")
    this.AlertDiv.id = "eg-alert"
    this.AlertDiv.style.cssText = `
    background-color: #54B4D3DD;
    color:white;
    width:auto;
    position:absolute;
    z-index:99999;
    bottom:0px;
    padding:8px;
    left:50%;
    border-radius:8px;
    visibility: hidden;
    transition: bottom 1s;
    `
    document.body.appendChild(this.AlertDiv)
  }

  show(message: string, type: "info" | "warning" | "error" = "info") {
    if (type === "error") this.AlertDiv.style.backgroundColor = "#DC4C64DD"
    else if (type === "warning")
      this.AlertDiv.style.backgroundColor = "#E4A11BDD"

    if (this.alertTimeout) clearTimeout(this.alertTimeout)

    this.AlertDiv.innerText = message
    this.AlertDiv.style.visibility = "visible"
    this.AlertDiv.style.bottom = "50px"

    this.alertTimeout = setTimeout(() => {
      this.hide()
    }, 2000)
  }

  hide() {
    this.AlertDiv.style.bottom = "0px"
    setTimeout(() => {
      this.AlertDiv.style.visibility = "hidden"
    }, 1000)
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }
}

const Alert = AlertComponent.Instance
export default Alert
