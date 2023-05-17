# <img width="36" src="https://user-images.githubusercontent.com/24523985/232335625-56cf4139-4df0-44f8-bf57-0ad330ffa1e6.png"/> Eksi Gallery

This chrome extension allows you to view the image links in the posts on the **eksisozluk.com** websites.

![eksi-gallery](https://user-images.githubusercontent.com/24523985/206904837-e23a8d0f-be74-419f-b14e-8274ae7f5b48.gif)

You can view pictures inside the page or in gallery mode.

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

## Supported Sozluk Sites

- https://eksisozluk.com/
- https://eksisozluk42.com/
- https://eksisozluk1923.com/
- https://eksisozluk2023.com/

## Supported Upload Sites

- https://soz.lk/
- https://eksiup.com/
- https://ibb.co/

## How It Works

![Schema](https://user-images.githubusercontent.com/24523985/232336063-f61d3cad-8c5e-4d74-bfee-b6fab87be829.jpg)

[1] The user can activate the extension and change the mode with the popup opened by clicking on the icon on the sites **eksisozluk.com**

[2-3-4] When the extension is active, **content.js** parses the links in the entries on the page and sends them to **background.js**.

[5-6] In order to overcome the CORS problem, requests are sent to these links via **background.js**. The received response is sent back to **content.js**.

[7] The response from **background.js** is parsed in **content.js** and the images are displayed to the user according to the selected mode.

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

## ⚠ Known Issues

- If Adblock is active in your browser, the images of eksiup.com cannot be displayed and it will cause an error in the gallery view.

✔ Solutions
- Close adblock
 
