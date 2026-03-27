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

//CADASTRO
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

//LOGIN
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

    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tarefa: currentTask, tempo_focado: 25 }) // ou tempo real
    });

    // Criar uma nova tarefa
    app.post('/tasks', async (req, res) => {
        const { title, description } = req.body;
        const userId = req.user?.id; // assumindo que você tem autenticação com JWT ou session

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });
        if (!title) return res.status(400).json({ error: 'Título é obrigatório' });

        try {
            const connection = await createDBConnection();
            const [result] = await connection.execute(
                'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
                [userId, title, description || null]
            );
            res.status(201).json({ id: result.insertId, message: 'Tarefa criada' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar tarefa' });
        }
    });

    // Listar tarefas do usuário
    app.get('/tasks', async (req, res) => {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        try {
            const connection = await createDBConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            );
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao listar tarefas' });
        }
    });

    // Iniciar sessão Pomodoro (quando usuário clica em "Iniciar foco" com tarefa selecionada)
    app.post('/pomodoro/start', async (req, res) => {
        const { task_id, duration_minutes, type = 'focus' } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        try {
            const connection = await createDBConnection();
            const [result] = await connection.execute(
                'INSERT INTO pomodoro_sessions (user_id, task_id, duration_minutes, type) VALUES (?, ?, ?, ?)',
                [userId, task_id || null, duration_minutes, type]
            );
            res.json({ session_id: result.insertId, message: 'Sessão iniciada' });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao iniciar sessão' });
        }
    });

    // Finalizar sessão (quando timer acaba ou usuário para)
    app.put('/pomodoro/:session_id/end', async (req, res) => {
        const { session_id } = req.params;
        const { actual_duration_seconds, completed, notes } = req.body;
        const userId = req.user?.id;

        try {
            const connection = await createDBConnection();
            await connection.execute(
                'UPDATE pomodoro_sessions SET ended_at = NOW(), actual_duration_seconds = ?, completed = ?, notes = ? WHERE id = ? AND user_id = ?',
                [actual_duration_seconds, completed ? 1 : 0, notes || null, session_id, userId]
            );
            res.json({ message: 'Sessão finalizada' });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao finalizar sessão' });
        }
    });
});
