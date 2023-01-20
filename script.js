let mens = [];

let nomeDoUsuario = prompt("Digite seu nome");

function enviarNomeDoUsuario(){

    const nome = {
        name: nomeDoUsuario
    };

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome );
    promessa.then(nomeDoUsuarioChegou);
    promessa.catch(nomeDoUsuarioNaoChegou);
}
enviarNomeDoUsuario();

function nomeDoUsuarioChegou(answer){

    console.log('Deu tudo certo, nome chegou!');
    buscarMensagensNoServidor();
    console.log(answer);

    
    setInterval(manterConexao, 5000);
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
    textoDaMensagem.value = '';
}

function mensagemDigitadaChegou(resposta){
    console.log('Sua mensagem digitada chegou');
    console.log(resposta);

    buscarMensagensNoServidor();
    exibirMensagens();


}

function deuRuimAoEnviar(erro){
    console.log('Sua mensagem digitada não chegou');
    console.log(erro);

    window.location.reload();
}



