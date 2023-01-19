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


