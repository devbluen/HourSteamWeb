# 🚀 HourSteamWeb [NodeJS]

## Description
**HourSteamWeb** is a system to run on localhost for those who enjoy farming Steam cards.<br><br>
⚠️ It is not recommended to make this system public on the web outside of localhost as there is no security in its code. This system was made to run locally on your computer as a host.

## 💼 Requirements
- [Node](https://nodejs.org/en) - Link
- Steam 😂

## ⚙️ Installation
- Extract the file or download above
- Inside the folder, press SHIFT + RIGHT CLICK
- Click on open new terminal or open PowerShell
- Type the command "npm i"
- After installing all resources, execute "start.bat"

## 📃 How to use?
- After connecting the node server, access through your browser "http://localhost:3000"
- Just connect with your Steam account, if it has Steam Guard, a new field will appear for you to confirm the Steam Guard.
#### How to connect more than one account?
- Just refresh the page (F5) and connect with another account.
- Your other account will continue to be connected normally.
#### How to know which accounts are connected?
- Click on "Information" in the top corner to view the information of the other accounts.
#### How to disconnect an account?
- I have not yet added support, for now you will have to click on turn off services.
#### How to add games?
- Search for the game in your Steam library and look at its URL (https://store.steampowered.com/app/730/CounterStrike_2/) the number after /app/ is the number you will have to inform, in the example there, CS2 is 730
- After logging in, enter the IDs of your games and click save so that when you resume, the IDs are there.

## 🤖 Automatic Response
- You can configure automatic responses in config.json

## 🪴 Observations
- Never put this application on any hosting, because as I said above, there is no protection in the code and it is running almost on the client-side.
- Do not add more than 30 games, after that there is a limit imposed by Steam.
- I have not tested logging in to more than 2 accounts, so there may be some limit imposed by Steam on accounts per IP.
- If you have Steam Guard and re-login several times in a short time with this application, there may be an error due to a query limit imposed by Steam.
- Do not delete the "dados" folder as it will save the IDs of the games you saved on the accounts.

## 🫡 Resources Used
- NodeJs + HTML + Js
- Express
- Socket.io
- Body-parser
- steam-user

## Screenshots
![Screenshot of the project](https://i.imgur.com/la48yye.png)
![Screenshot of the project](https://i.imgur.com/1dOTCyT.png)
