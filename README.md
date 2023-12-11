# 🚀 HourSteamWeb [NodeJS]

## Descrição
**HourSteamWeb** é um sistema para rodar em localhost para você que curte farmar cartas na steam.<br><br>
⚠️ Não é recomendado que esse sistema fique público na web fora do localhost pois não há nenhuma segurança no seu código, esse sistema foi feito para rodar localmente no seu computador como host.

## 💼 Requisições
- [Node](https://nodejs.org/en) - Link
- Steam 😂

## ⚙️ Instalação
- Extraia o arquivo ou baixe acima
- Dentro da pasta aperte SHIFT + CLIQUE DIREITO
- Clique em abrir novo terminal ou abra o powershell
- Digite o comando "npm i"
- Após a instalação de todos os recursos execute o "start.bat"

## 📃 Como usar?
- Após conectar o servidor node, acesse pelo seu navegador "http://localhost:3000"
- Basta conectar com sua steam, caso ela tenha steam guard um novo campo aparecerá para você confirmar o steam guard.
#### Como conectar mais de uma conta?
- Basta dar refresh da na página (F5) e conectar com outra conta.
- Sua outra conta continuará conectada normalmente.
#### Como saber quais contas estão conectadas?
- Clique em "Informações" no canto superior e poderá visualizar as informações das demais contas.
#### Como desconectar uma conta?
- Ainda não adicionei suporte, por hora terá que clicar em desligar serviços.
#### Como adicionar jogos?
- Procure o jogo na sua biblioteca da steam e olhe a URL dele (https://store.steampowered.com/app/730/CounterStrike_2/) esse número que fica depois do /app/ é o número que você terá que informar, no caso do exemplo ali, o CS2 é 730
- Após logar, coloque o ID's dos seus jogos e clique em salvar para quando você retomar, os IDs estejam lá.

## 🤖 Resposta Automatica
- Você pode configurar as respostas automaticas em config.json

## 🪴 Observações
- Jamais coloque essa aplicação em alguma hospedagem, pois como eu disse acima, não há nenhuma proteção no código e ele está rodando praticamente em client-side.
- Não adicione mais de 30 jogos, após isso há um limite imposto pela steam.
- Eu não testei logar em mais de 2 contas, então possa ser que haja algum limite imposto pela steam de IPs por conta.
- Se você tiver steam guard e relogar várias vezes em pouco tempo essa aplicação, possa ser que der erro de limite de querys imposto pela steam.

## 🫡 Recursos Utilizado
- NodeJs + HTML + Js
- Express
- Socket.io
- Body-parser
- steam-user

## Prints
![Captura de tela do projeto](https://i.imgur.com/la48yye.png)
![Captura de tela do projeto](https://i.imgur.com/1dOTCyT.png)
