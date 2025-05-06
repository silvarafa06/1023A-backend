

////22.13.16

// /*find 

// criar uma função que retorna verdadeirop quando é o meu 
// elemento buscado quando nao for, retorne

// const v = [1,2,3,4,5,6,6]
// function callbacks(x:number){
//     if(x==6){
//        return true
//     }
//     else{
//         return false
//     }
// }
// let result = v.find(callbacks)

// console.log(result)

// import { forEachChild } from "typescript";

// const v = [1,2,3,4,5,6,6]
// function callbacks(x:number){
//         return x<2
// }
// let result = v.filter(callbacks)

// console.log(result)

// type Pessoa = {
//     id: number;
//     nome: string;
//     cpf: number; 
//     idade?: string; 
// };

// const pessoas: Pessoa[] = [
//     {
//         id: 1,
//         nome: "ted",
//         cpf: 123,
//         idade: "7 anos"
//     },
//     {
//         id: 2,
//         nome: "sidy",
//         cpf: 345
//     },
//     {
//         id: 3,
//         nome: "apollo",
//         cpf: 567,
//         idade: "2 anos"
//     },
//     {
//         id: 4,
//         nome: "marrie",
//         cpf: 789
//     }, 
//     {
//         id: 5,
//         nome: "fiote",
//         cpf: 100,
//         idade: "6 meses"
//     }
// ];

// const p = pessoas.find((x)=>x.id==2);
// console.log(p)

// /* assincronidae -> nnao sincronizado -> paralelo 
// nao ficar esperando algo que demore enquanto voce 
// pode fazer outrar coisas

// exemplo: enquanto esperamso o banco responder algo.
// podemos realizar ago com javascript.

// promessas
// é um tipo de objeto do javascript que é o retono de 
// uma funçao que nao é sincrona.
// esse objeto chamado de promise quando a funçaçõ termina :
// ele pode estar nos dois casos:
// resolve -> quando a função executou corretamente.
// reject -> quando algo deu errado
// */

// /*function demora():Promise<string>{
//     let promise = new Promise<string>((resolve,reject)=>{
//     setTimeout(
//         function(){
//             if(Math.random()<0.5){
//                 resolve("dados!")
//             }
//             else{
//                 reject("Ma Hoy, mas nao funciona né!")
//             }
//         },
//         800
//     )
//  });
//  return promise
// }
// console.log("executa algo antes")
// const resultado = demora()
// resultado
// .then((resultadoEspera)=>{console.log(resultadoEspera)})
// .catch((resultadoEspera)=>{console.log("Catch "+resultadoEspera)})
// console.log("executa algo depois") 

// //.then        => entao    
// // .catch       =>capturar

// /* await async
// 2017 javascript trouxe esse novo conceito de awaIT E async 
// await > é pra voce ficar esperando algo que é assincrono(async)
// nao podemos ultilizar await sem ser em uma funcao assincrona (async)
// */

// async function aux(){
//     try{
//         const resultado = await demora()
//     console.log("Resultado await: "+resultado)
//     }
//     catch(erro){
//         console.log("ERRO TRY/CATCH: "+erro)
//     }
// }
// aux()

//import { ConnectionOptions } from "mysql2";


import fastify from 'fastify';
import cors from '@fastify/cors';
import mysql from 'mysql2/promise';

const app = fastify();
app.register(cors);

const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "ListarTarefas",
    port: 3306
};

app.get('/', async (request, reply) => {
    reply.send("API Tarefas funcionando!");
});

app.get('/tarefas', async (request, reply) => {
    try {
        const conn = await mysql.createConnection(config);
        const [dados] = await conn.query("SELECT * FROM tarefas");
        reply.status(200).send(dados);
    } catch (erro: any) {
        tratarErroMySQL(erro, reply);
    }
});


// Função para citar os erros 
function tratarErroMySQL(erro: any, reply: any) {
    if (erro.code === 'ECONNREFUSED') {
        console.log("ERRO: LIGUE O LARAGÃO => Conexão Recusada");
        reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO => Conexão Recusada" });
    } else if (erro.code === 'ER_BAD_DB_ERROR') {
        console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO");
        reply.status(400).send({ mensagem: "ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO" });
    } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO");
        reply.status(400).send({ mensagem: "ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO" });
    } else if (erro.code === 'ER_NO_SUCH_TABLE') {
        console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY");
        reply.status(400).send({ mensagem: "ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY" });
    } else if (erro.code === 'ER_PARSE_ERROR') {
        console.log("ERRO: Você tem um erro de escrita em sua QUERY (verifique vírgulas, parênteses, nomes...)");
        reply.status(400).send({ mensagem: "ERRO: Você tem um erro de escrita em sua QUERY (verifique vírgulas, parênteses, nomes...)" });
    } else {
        console.log("ERRO DESCONHECIDO:", erro);
        reply.status(500).send({ mensagem: "ERRO: NÃO IDENTIFICADO" });
    }
}

app.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});