
const express       = require('express');
const http          = require('http');
const fs            = require('fs');
const socketIo      = require('socket.io');
const bodyParser    = require('body-parser');
const SteamUser     = require('steam-user');
const SteamID       = require('steamid');

const app           = express();
const server        = http.createServer(app);
const io            = socketIo(server);

const PORT          = process.env.PORT || 3000;
const config        = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.use(bodyParser.json());
app.use(express.static('public'));

let userClients = {}; // Armazena as instâncias SteamUser por usuário
let userMessages = {}; // Armazenar mensagens por usuário
let responseQueue = [];

io.on('connection', (socket) => {
    console.log('🌐 Conexão de cliente encontrada.');

    socket.on('join', (accountName) => {
        console.log('🔍 Conta Registrada:', accountName)
        socket.join(accountName); // Associa o socket a uma 'sala' específica para o usuário

        fs.readFile(`dados/${accountName}_gameId.txt`, 'utf8', (err, data) => {
            if(!err) {
                sendMessageToUser(accountName, `🕹️ Jogos Identificados (${data})`);
                console.log(accountName, `🕹️ Jogos Identificados (${data})`)
            }
        });

        // Enviar histórico de mensagens para o usuário
        if (userMessages[accountName]) {
            socket.emit('messageHistory', userMessages[accountName]);
        }
    });

    socket.on('disconnect', () => {
        console.log('🌐 Cliente desconectado.');
    });
});

function setupFriendMessageListener(accountName, userClient) {

    if (userClients[accountName].isFriendMessageListenerSetup) {
        return; 
    }

    userClient.on('friendMessage', function(steamID, message) {

        let user = userClient.users[steamID]?.player_name || "Usuário Desconhecido";
 
        sendMessageToUser(accountName, `🪴 ${user}[${steamID}] enviou: ${message}`);
        console.log(accountName, `🪴 ${user}[${steamID}] enviou: ${message}`);

        let command = message.toLowerCase();
        let response = config.autoReplyCommands[command] || 
                       "Comando não reconhecido. Digite 'ajuda' para ver os comandos disponíveis.";

        userClient.chatMessage(steamID, response);

        sendMessageToUser(accountName, `🫡 ${user} foi respondido.`);
        console.log(accountName, `🫡 ${user} foi respondido.`);
    });

    userClients[accountName].isFriendMessageListenerSetup = true;
}

function loginSteam(accountName, password, steamGuardCode) {
    if (!userClients[accountName]) {
        userClients[accountName] = { client: new SteamUser(), isLoggedIn: false, isClientId:'', isFriendMessageListenerSetup: false };
    }

    const user = userClients[accountName];

    return new Promise((resolve, reject) => {
        if (user.isLoggedIn) {
            sendMessageToUser(accountName, `😶‍🌫️ ${accountName} re-login.`);
            resolve(`202Login`);
            return;
        }

        const logOnOptions = {accountName: accountName, password: password};
        
        user.client.logOn(logOnOptions);

        user.client.once('loggedOn', () => {
            user.isLoggedIn = true;
            user.client.setPersona(SteamUser.EPersonaState.Online);      // Set Online
            sendMessageToUser(accountName, `😶‍🌫️ ${accountName} conectado com sucesso.`);
            setupFriendMessageListener(accountName, user.client);  // Configurar listener de mensagens
            resolve(`202Login`);
        });

        user.client.once('steamGuard', (domain, callback) => {
            console.log("📃 Steam Guard Request");
            if (steamGuardCode) {
                console.log(`📝 ${accountName} Código Informado: ${steamGuardCode}`);
                sendMessageToUser(accountName, `📝 ${accountName} Código Informado: ${steamGuardCode}`);
                callback(steamGuardCode);
            } else {
                console.log(`📝 Informe o código do Steam Guard (${domain})`);
                sendMessageToUser(accountName, `📝 ${accountName} Informe o código do Steam Guard (${domain})`);
                resolve("202SteamGuard");
            }
        });
    
        user.client.once('error', (error) => {
            sendMessageToUser(accountName, `Erro ao conectar: ${error}`);
            reject(`Erro ao conectar: ${error}`);
        });
    });
}

function sendMessageToUser(accountName, message) {
    if (!userMessages[accountName]) 
        userMessages[accountName] = [];
    
    userMessages[accountName].push(message);
    io.to(accountName).emit('newMessage', message);
}

app.post('/login', async (req, res) => {
    
    const { accountName, password, steamGuardCode } = req.body;
    try 
    {
        const message = await loginSteam(accountName, password, steamGuardCode);
        res.send(message); // Envia a resposta de volta ao cliente
    } 
    catch (error) {res.status(400).send(error);} // Envia um erro se a promessa for rejeitada
});

app.post('/startGame', (req, res) => {
    const { accountName, gameId } = req.body;
    const user = userClients[accountName];

    if (!user || !user.isLoggedIn) {
        res.status(400).send('Usuário não está conectado ou não encontrado');
        return;
    }

    if (!gameId || gameId.length < 1) {
        sendMessageToUser(accountName, `⚠️ Informe os jogos.`);
        return;
    }

    try 
    {
        // Convertendo o gameId para um número, ou para um array de números se forem múltiplos IDs
        const gameIds = gameId.includes(',') ? gameId.split(',').map(id => parseInt(id.trim())) : [parseInt(gameId)];

        user.client.gamesPlayed(gameIds);
        sendMessageToUser(accountName, `🚀 Jogo(s) (${gameIds}) iniciado(s) para ${accountName}`);
        res.send(`Jogo(s) iniciado(s)`);
    } 
    catch (error) {res.status(500).send(`Erro ao iniciar o jogo: ${error}`);}
});

app.post('/stopGame', (req, res) => {
    const { accountName } = req.body;
    const user = userClients[accountName];

    if (user) 
    {
        user.client.gamesPlayed([]);
        sendMessageToUser(accountName, `⚠️ Jogos parados para ${accountName}`);
        res.send(`OK`);
    } 
    else res.status(400).send('Usuário não está conectado');
});

app.post('/stopSystem', (req, res) => {
    console.log("👋🏼 Desligando Sistemas.");

    for (let accountName in userClients) {
        if (userClients[accountName].isLoggedIn) {
            userClients[accountName].client.logOff();
            sendMessageToUser(accountName, `👋🏼 Sistema desligado.`);
        }
    }
    process.exit();
});

app.post('/salvar', (req, res) => {
    const { accountName, texto } = req.body;
    fs.writeFile(`dados/${accountName}_gameId.txt`, texto, (err) => {
        if (err) throw err;
        res.send('Dados salvos!');
    });
});

app.get('/carregar', (req, res) => {
    const accountName = req.query.accountName;
    fs.readFile(`dados/${accountName}_gameId.txt`, 'utf8', (err, data) => {
        if (err) {
            res.send('');
            return;
        }
        res.send(data);
    });
});

app.get('/info', (req, res) => {

    let clientData = {};
    for (let account in userClients) {
        clientData[account] = {
            isLoggedIn: userClients[account].isLoggedIn,
            isClientId: userClients[account].isClientId
            // inclua outras propriedades relevantes e serializáveis
        };
    }
    res.json(clientData);
});

app.get('/heartbeat', (req, res) => {
    res.status(200).send('OK');
});

server.listen(PORT, () => console.log(`🚪 Servidor rodando na porta '${PORT}' (http://localhost:${PORT})`));