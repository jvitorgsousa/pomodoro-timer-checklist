const express = require('express');
const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração da conexão com o meu MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'diddods0329',
    database: 'focatto_db'
};

// Função para conectar e testar
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conectado ao MySQL com sucesso!');
        return connection;
    } catch (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1);  
    }
}

const db = connectDB(); 

app.listen(3000, () => {
    console.log('Servidor backend rodando na porta 3000');
});

// Rota para CADASTRO
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    try {
        const connection = await db;
        // Hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Insere no Banco de Dados
        await connection.execute(
            'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedSenha]
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para LOGIN 
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }

    try {
        const connection = await db;
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        res.json({ message: 'Login bem-sucedido!', user: { id: user.id, nome: user.nome, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});
