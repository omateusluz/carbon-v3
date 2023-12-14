require("dotenv").config();
const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

/** Sync */
function randomStringAsBase64Url(size) {
  return crypto.randomBytes(size).toString("base64url");
}

//Necessário para extrair os dados de Forms vindos de uma requisição POST
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Servidor na porta 3000');
});

const User = require('./model/User');
const Saldo = require('./model/Saldo');


//Requisicao com POST publica para autenticar usuário
app.post('/login', async (req,res) => {

    //extraindo os dados do formulário para criacao do usuario
    const {email, password} = req.body; 
    
    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '.', 'db', 'banco-dados-usuario.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    //verifica se existe usuario com email    
    for (let user of usuariosCadastrados){
        if(user.email === email){
            const passwordValidado = await bcrypt.compare(password, user.password);
            if(passwordValidado){ 
                
                const token = jwt.sign(user, process.env.TOKEN);

                return res.json({ "token" : token});
            }
            
            else
                return res.status(422).send(`Usuario ou senhas incorretas.`);
        }   
    }
    //Nesse ponto não existe usuario com email informado.
    return res.status(409).send(`Usuario com email ${email} não existe. Considere criar uma conta!`);

})

// Requisicao com POST publica para autenticar codigo de recuperacao
// e permitir recuperar e alterar senha
app.post('/recuperar', async (req,res) => {

    //extraindo os dados do formulário para criacao do usuario
    const {token, email, password} = req.body; 
    
    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '.', 'db', 'banco-dados-usuario.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    // Verifica se existe usuário com o último email armazenado
    for (let user of usuariosCadastrados){
        if(user.email === email){

            if(user.token === token) {
                // Atualiza a senha do usuário com a nova senha
                const salt = await bcrypt.genSalt(10);
                const novaSenhaCrypt = await bcrypt.hash(password, salt);
                user.password = novaSenhaCrypt;

                // Altera o token 
                user.token = randomStringAsBase64Url(11);
            
                // Salva as alterações no "banco"
                fs.writeFileSync(jsonPath, JSON.stringify(usuariosCadastrados, null, 2));
            
                return res.send('Senha alterada com sucesso!');
            }
        } 
    }

    // Usuário não encontrado
    return res.status(409).send(`Usuário não encontrado ou informação incorreta.`);

})

// Requisicao com PUT para autenticar codigo de recuperacao
// e permitir a alteração do email
app.put('/email', async (req,res) => {

    //extraindo os dados do formulário para criacao do usuario
    const {token, email, novoEmail, password} = req.body; 

    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '.', 'db', 'banco-dados-usuario.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    const jsonPathSaldo = path.join(__dirname, '.', 'db', 'banco-dados-saldos.json');
    const saldosCadastrados = JSON.parse(fs.readFileSync(jsonPathSaldo, { encoding: 'utf8', flag: 'r' }));

    for (let users of usuariosCadastrados){
        if(users.email === novoEmail){
            // Email ja utilizado. Impossivel alterar
            // Retornando o erro 409 para indicar conflito
            return res.status(409).send(`Usuario com email ${novoEmail} já existe.`);
        }
    }

    // Verifica se existe usuário com o último email armazenado
    for (let users of usuariosCadastrados){
        if(users.email === email){
            const passwordValidado = await bcrypt.compare(password, users.password);
            if(passwordValidado){
                if(users.token === token) {
                    // Atualiza o email do usuario com o novoEmail
                    users.email = novoEmail;
    
                    // Altera o token 
                    users.token = randomStringAsBase64Url(11);
                
                    // precisa alterar o email do saldo tambem
                    for (let emailSaldo of saldosCadastrados){
                        if(emailSaldo.email === email){

                            emailSaldo.email = novoEmail;
                        }
                    }

                    // Salva as alterações no "banco"
                    fs.writeFileSync(jsonPath, JSON.stringify(usuariosCadastrados, null, 2));
                    fs.writeFileSync(jsonPathSaldo,JSON.stringify(saldosCadastrados,null,2));

                    return res.send('Email alterado com sucesso!');
                }
            }
        } 
    }

    // Usuário não encontrado
    return res.status(409).send(`Usuário não encontrado ou informação incorreta.`);

})

//Requisicao com POST publica para criar usuário
app.post('/create', async (req,res) => {
    //extraindo os dados do formulário para criacao do usuario
    const {username, email, password} = req.body; 
    
    const jsonPath = path.join(__dirname, '.', 'db', 'banco-dados-usuario.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    const jsonPathSaldo = path.join(__dirname, '.', 'db', 'banco-dados-saldos.json');
    const saldosCadastrados = JSON.parse(fs.readFileSync(jsonPathSaldo, { encoding: 'utf8', flag: 'r' }));

    //verifica se já existe usuario com o email informado
    
    for (let users of usuariosCadastrados){
        if(users.email === email){
            //usuario já existe. Impossivel criar outro
            //Retornando o erro 409 para indicar conflito
            return res.status(409).send(`Usuario com email ${email} já existe.`);
        }   
    }
    //Deu certo. Vamos colocar o usuário no "banco"
    //Gerar um id incremental baseado na qt de users
    const id = usuariosCadastrados.length + 1;
    
    //gera um token único para cada usuário
    const token = randomStringAsBase64Url(11);

    //gerar uma senha cryptografada
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password,salt);

    //Criacao do user
    const user = new User(id, username, email, passwordCrypt, token);
    const saldo = new Saldo(email,0);

    //Salva user e saldo no banco
    usuariosCadastrados.push(user);
    saldosCadastrados.push(saldo);

    fs.writeFileSync(jsonPathSaldo,JSON.stringify(saldosCadastrados,null,2));
    fs.writeFileSync(jsonPath,JSON.stringify(usuariosCadastrados,null,2));
    res.send(`Tudo certo usuario criado com sucesso.`);
});

app.post('/verificar-email', (req, res) => {
    
});

// gambiarra aqui, deve ter uma forma mais inteligente
app.get('/verificador', verificaToken,  (req, res) => {

    const verificado = true;
    return res.json(verificado);

})

// Endpoint para obter informações de configurações com base no email do usuário
app.get('/configuracoes/:email', (req, res) => {
    const email = req.params.email;
  
    const jsonPath = path.join(__dirname, '.', 'db', 'banco-dados-usuario.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    const jsonPathSaldo = path.join(__dirname, '.', 'db', 'banco-dados-saldos.json');
    const saldosCadastrados = JSON.parse(fs.readFileSync(jsonPathSaldo, { encoding: 'utf8', flag: 'r' }));

    //verifica se já existe usuario com o email informado
    
    for (let users of usuariosCadastrados){
        if(users.email === email){

            for(let userSaldo of saldosCadastrados) {
                if(userSaldo.email === email) {
                    const usuarioConfiguracoes = {
                        token: users.token,
                        username: users.username,
                        email: users.email,
                        saldo: userSaldo.saldo
                    };
        
                    res.json(usuarioConfiguracoes);
                }
            }
            
        }  
    }

});

app.get('/disciplinas/:sigla', verificaToken, (req,res) => {

    //Abre o bd (aqui estamos simulando com arquivo) com as disciplinas
    //__dirname é o diretorio corrente onde esse arquivo esta executando
    const jsonPath = path.join(__dirname, '.', 'db', 'disciplinas.json');
    const disciplinas = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));
    
    const params = req.params;
    //buscar a disciplina
    for(let disciplina of disciplinas){
        if(params.sigla.toUpperCase()===disciplina.sigla){
            return res.json(disciplina);
        }
    }
    return res.status(403).send(`Sigla Não Encontrada!`);

})

function verificaToken(req,res,next) {

    const authHeaders = req.headers['authorization'];
    
    const token = authHeaders && authHeaders.split(' ')[1]
    //Bearer token

    if(token == null) return res.status(401).send('Acesso Negado');

    jwt.verify(token, process.env.TOKEN, (err) => {
        if(err) return res.status(403).send('Token Inválido/Expirado');
        next();
    })

}