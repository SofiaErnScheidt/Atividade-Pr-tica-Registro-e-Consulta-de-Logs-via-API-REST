const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const express = require('express')
const { error } = require('console')

const app = express()
app.use(express.json())

//Registrar logs
function registrarLog(nomeAluno) {
    const id = uuidv4()
    const dataHora = new Date().toISOString()
    const mensagem = `${id}-${dataHora}-${nomeAluno}\n`

    fs.appendFileSync('logs.txt', mensagem)
    return id
};

//Adicionar log
app.post('/logs', (req, res) => {
    const { nome } = req.body
    if (!nome) {
        return res.status(400).json({ error: 'nome do aluno é obrigatório.'})
        }
    const id = registrarLog(nome)
    res.json({id, mensagem:'Log registrado com sucesso!'})
    });

//Consultar Log por ID
app.get('/logs/:id',(req,res)=>{
    const {id} = req.params
    const logs = fs.readFileSync('logs.txt','utf-8').slice('\n')

    const logEncontrado = logs.find(log => log.startsWith(id))
    if (logEncontrado){
        return res.json({mensagem: logEncontrado})
    }
    res.status(404).json({error: 'Log não encontrado'})
})


