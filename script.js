let mens = [];
let participantes = [];

let nomeDoUsuario = prompt("Digite seu nome");
enviarNomeDoUsuario();

function enviarNomeDoUsuario(){

    const nome = {
        name: nomeDoUsuario
    };

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome );
    promessa.then(nomeDoUsuarioChegou);
    promessa.catch(nomeDoUsuarioNaoChegou);

}

function nomeDoUsuarioChegou(answer){

    console.log('Deu tudo certo, nome chegou!');
    console.log(answer);
    buscarMensagensNoServidor();
    setInterval(manterConexao, 5000);
    setInterval(buscarMensagensNoServidor, 3000);
}

function nomeDoUsuarioNaoChegou(error){

    const statusCode = error.response.status;
    console.log(error);
    if(statusCode === 400){
        alert("Este nome já está online");
        nomeDoUsuario = prompt("Digite outro nome");
    } else if(statusCode === 200){
        return;
    }
}
const parada = setInterval(manterConexao, 5000);

function manterConexao(){

    
    const nomeOnline = {
        name: nomeDoUsuario
    };

    const prom = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeOnline);
    prom.then(usuarioOnline);
    prom.catch(erroUsuarioOffline);
}
function usuarioOnline(resposta){
    console.log('Usuário online');
    console.log(resposta);

}
function erroUsuarioOffline(erro){
    console.log('Aconteceu um erro ou usuário offline');
    console.log(erro);

    clearInterval(parada);
}

function exibirMensagens(){ 
    const chat = document.querySelector('.mensagens');
    
    chat.innerHTML = '';
    for(let i = 0; i < mens.length; i++){ 
        if (mens[i].type === "status"){   
            let template = `
                <div data-test="message" class="status"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> ${mens[i].text}</p></div>`; 
                
                chat.innerHTML = chat.innerHTML + template; 
        } else if (mens[i].type ==="message"){ 
            let template2 = `
                <div data-test="message" class="normais"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> para 
                <mark>${mens[i].to}</mark>: ${mens[i].text}</p></div>`; 
                
                chat.innerHTML = chat.innerHTML + template2;  
        } else if (mens[i].type ==="private_message" && (mens[i].from === nomeDoUsuario || mens[i].to === nomeDoUsuario)){ 
            let template3 = `
                <div data-test="message" class="reservadas"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> reservadamente para 
                <mark>${mens[i].to}</mark>: ${mens[i].text}</p></div>`; 
                
                chat.innerHTML = chat.innerHTML + template3; 
            } 
    document.querySelector(".mensagens").lastChild.scrollIntoView(true);
    }

} 

function buscarMensagensNoServidor(){ 
    
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mensagensChegaram); 
    promise.catch(deuErroAoPegarMensagens); 

}
function mensagensChegaram(answer){ 
    console.log('As mensagens chegaram com êxito!!'); 
    console.log(answer); 
    mens = answer.data; 
    
    exibirMensagens(); 
}

function deuErroAoPegarMensagens(error){ 
    console.log('Deu erro ao pergar as mensagens no servidor'); 
    console.log(error); 
}

function enviarMensagens(){

    let textoDaMensagem = document.querySelector('.texto').value;

    const mensagem = {
        from: nomeDoUsuario,
        to: "Todos",
        text: textoDaMensagem,
        type: "message"
    }

    const promessa2 = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages' , mensagem);

    promessa2.then(mensagemDigitadaChegou);
    promessa2.catch(deuRuimAoEnviar);
}

function mensagemDigitadaChegou(resposta){
    console.log('Sua mensagem digitada chegou');
    console.log(resposta);

    buscarMensagensNoServidor();
}

function deuRuimAoEnviar(erro){
    console.log('Sua mensagem digitada não chegou');
    console.log(erro);

    window.location.reload();
}
function abrirMenu(){
    const abrirMenu = document.querySelector('.menu-lateral');
    abrirMenu.classList.remove('escondido');

    buscarParticipantes();
}

function fecharMenu(){
    const fecharMenu = document.querySelector('.menu-lateral');
    fecharMenu.classList.add('escondido');
}

function buscarParticipantes(){
    const promessa3 = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    promessa3.then(participantesDoChat);
    promessa3.catch(erroAoBuscarParticipantes);
}

function participantesDoChat(resposta){
    console.log('Participantes do chat foram encontrados');
    console.log(resposta);

    participantes = resposta.data;

    exibirParticipantes();
    setInterval(exibirParticipantes, 10000);
}

function erroAoBuscarParticipantes(erro){
    console.log('Não foi possível encontrar os participantes');
    console.log(erro);
}

function exibirParticipantes(){
    const menu = document.querySelector('.participantes');

    for(let i = 0; i < participantes.length; i++){
        let template4 = `<div data-test="participant" onclick="exibirCheck(this)" class="usuario">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participantes[i].name}</p>
        <div data-test="check" class="escondido check"><ion-icon name="checkmark"></ion-icon></div></div>`;

        menu.innerHTML = menu.innerHTML + template4;
    }
    
}

function exibirCheck(valorClicado){
    const checkAnterior = document.querySelector('.participantes .escondido').lastChild;

    if(checkAnterior !== null){
        checkAnterior.classList.add('escondido');
    }

    valorClicado.lastChild.classList.remove('escondido');
}



