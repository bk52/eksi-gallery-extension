![eksi-gallery](https://user-images.githubusercontent.com/24523985/206904837-e23a8d0f-be74-419f-b14e-8274ae7f5b48.gif)
# eksi-gallery-extension
This chrome extension allows you to view the image links in the posts on the eksisozluk.com website.

<table>
<tr>
<td><img src="https://user-images.githubusercontent.com/24523985/206909864-27b35a72-cc88-4e9a-9cc0-4c1541927ad1.jpg" width="300" alt="Inline mode"/></td>
<td><img src="https://user-images.githubusercontent.com/24523985/206910008-6a326e5b-034e-44ef-b3b4-73a284d7183d.jpg" width="300" alt="Gallery mode"/></td>
</tr>
<tr>
<td align='center'>Inline Mode</td>
<td align='center'>Gallery Mode</td>
</tr>
</table>

## Installation
- Clone repository
```
 git clone https://github.com/bk52/eksi-gallery-extension.git
 ```
 - Install packages
 ```
npm install
 ```
 - Build project
 ```
npm run build
 ```
 After successful build, **dist** folder will be created from the project directory.
 
 - Install the **dist** folder by following [these steps](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) in the Chrome browser.

## How It Works?

![Schema](https://user-images.githubusercontent.com/24523985/206916200-67e395c7-486e-4c70-bb63-f4daba9df099.jpg)

1. **popup.js** catches when the button in the extension is clicked.
2. When the extension is activated, a message is sent to **content.js**.
3. *Since it has access to the DOM*, **content.js** finds and parses the posts on the page.
4. *Due to [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)*, **content.js** cannot send HTTP requests to links obtained from posts. Instead it sends the links to **background.js**.
5. **background.js** sends HTTP requests to links. 
6. **background.js** forwards the incoming response to **content.js**.
7. **content.js** parses the incoming responses and finds the image link. Links are added to the posts on the page as previews or displayed as a gallery.

