
const socket = io();
let accountName = '';



/*

                    SOCKETS

*/

socket.on('connect', () => {
    //
});

socket.on('messageHistory', (messages) => {
    messages.forEach(message => updateConsole(message));
});

socket.on('newMessage', (message) => {
    updateConsole(message);
});



/*

                    FUNCTIONS

*/

function connectSocket() {
    socket.emit('join', accountName); // Agora usamos a variável accountName
}

function submitLogin() {
    accountName = document.getElementById('accountName').value;
    const password = document.getElementById('password').value;
    const steamGuardCode = document.getElementById('steamGuardCode').value;

    fetch('/login', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ accountName, password, steamGuardCode }),
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes("202Login")) {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('gameControl').classList.remove('hidden');
            document.getElementById('gameConsole').classList.remove('hidden'); 

            document.getElementById('serverStatus').textContent = accountName;

            connectSocket(); // Conecta ao Socket.io após o login
            carregar();
        } 
        else if (data.includes("202SteamGuard")) {
            document.getElementById('steamGuardCodeForm').classList.remove('hidden');
        }
    })
    .catch(error => updateConsole('Erro: ' + error));
}

function startGame() {
    const accountName = document.getElementById('accountName').value;
    const gameId = document.getElementById('gameId').value; // Obtém o ID do jogo

    fetch('/startGame', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName, gameId }) 
    })
    .then(response => response.text())
    .then(data => {})
    .catch(error => {console.error('Erro:', error);});
}

function stopGame() {
    const accountName = document.getElementById('accountName').value;

    fetch('/stopGame', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName }) 
    })
    .then(response => response.text())
    .then(data => {})
    .catch(error => {console.error('Erro:', error);});
}

function updateConsole(message) {
    const consoleLog = document.getElementById('consoleLog');
    consoleLog.innerHTML += `<p>${message}</p>`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
}

function checkServerStatus() {
    fetch('/heartbeat')
        .then(response => {
            if (!response.ok) {
                throw new Error('Servidor não disponível');
            }
            // console.log('Servidor ativo');
        })
        .catch(error => {
            console.error(error);
            location.reload(); // Recarrega a página
        });
}
setInterval(checkServerStatus, 3000);

function stopSystem() {
    fetch('/stopSystem', { method: 'POST' })
        .then(response => response.text())
        .then(data => {})
        .catch(error => {console.error('Erro:', error);});
}

function salvar() {
    const texto = document.getElementById('gameId').value;
    fetch('/salvar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountName, texto }),
    });
}

function carregar() {
    fetch(`/carregar?accountName=${accountName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('gameId').value = data;
        });
}

function toggleServer() {

    var infoBox = document.getElementById("serverInfoBox");

    fetch('/info')
        .then(response => response.json())
        .then(data => {
            var htmlContent = '<h3>Informações dos Usuários</h3>';
            
            infoBox.style.display = "block";

            for (let account in data) {
                htmlContent += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-user"></i> Usuário: ${account}
                            <p class="card-text"><i class="fas fa-signal" style='color: #25cc2a'></i> Status: ${data[account].isLoggedIn ? 'Conectado' : 'Desconectado'}</p>
                        </div>
                    </div>`;
            }

            infoBox.innerHTML = htmlContent;
        })
        .catch(error => console.error('Erro ao buscar informações:', error));
    
    setTimeout(function() {
        infoBox.style.display = "none";
    }, 1000 * 5);
}