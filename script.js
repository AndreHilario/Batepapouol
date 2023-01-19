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
    console.log(answer);
}

function nomeDoUsuarioNaoChegou(error){

    const statusCode = error.response.status;
    console.log(error);
    if(statusCode === 400){
        alert("Este nome já está online");
        nomeDoUsuario = prompt("Digite seu nome");
    } else if(statusCode === 200){
        return;
    }
}
function exibirMensagens(){ 
    const chat = document.querySelector('.mensagens');
    for(let i = 0; i < mens.length; i++){ 
        if (mens[i].type === "status"){   
            let template = `
                <div class="status"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> ${mens[i].text}</p></div>`; 
                
                chat.innerHTML = chat.innerHTML + template; 
        } else if (mens[i].type ==="message"){ 
            let template2 = `
                <div class="normais"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> para 
                <mark>${mens[i].to}</mark>: ${mens[i].text}</p></div>`; 
                
                chat.innerHTML = chat.innerHTML + template2;  
        } else if (mens[i].type ==="private_message"){ 
            let template3 = `
                <div class="reservadas"><p><span>(${mens[i].time})</span> <mark>${mens[i].from}</mark> reservadamente para 
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
buscarMensagensNoServidor();



