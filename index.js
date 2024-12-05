const http = require('http')
const fs = require('fs')
const express = require('express')
const session = require('express-session');
const {connectToDatabase, AuthAdmin, getEmployees, getUsers, getMessages, insertUser,
    insertEmployee,
    deleteEmployee,
    deleteUser,
    insertMessage
} = require('./db');

const { sendmail
} = require('./mail');


const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(express.json())

app.use(session({
    secret: 'fdafsfshfh54353dasdakjdla42342', // Замените на ваш секретный ключ
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Установите true, если используете HTTPS
}));


const PORT = 3000





app.get('/', (req, res) => {
    res.render('index')
})


app.post('/check-message', (req, res) => {
    sendmail(req.body)
})

app.post("/check-form", async (req, res) => {
    const { name, surname, patronymic, groupStud, theme, message, email, access, processPersonData } = req.body;
    console.log(name, surname, patronymic, groupStud, theme, message, email, access, processPersonData)
    try {
        await insertMessage(name, surname, patronymic, groupStud, theme, message, email, access, processPersonData);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error adding user' });
    }   
})




app.delete('/delete-employee/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await deleteEmployee(userId);
        const employeesDB = await getEmployees()
        const usersDB = await getUsers()
        res.status(200).json({ message: `Сотрудник успешно удален`, employees: employeesDB, users: usersDB});
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

app.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await deleteUser(userId);
        const employeesDB = await getEmployees()
        const usersDB = await getUsers()
        res.status(200).json({ message: `Пользователь успешно удален`, users: usersDB, employees: employeesDB});
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});


app.post("/add-employee", async (req, res) => {
    const { name, surname, patronymic, email, role, address } = req.body;
    console.log(name, surname, patronymic, email, role, address)
    try {
        await insertEmployee(name, surname, patronymic, email, role, address);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error adding user' });
    }
    const employeesDB = await getEmployees()
    const usersDB = await getUsers()
    res.json({employees: employeesDB, users: usersDB})
})


app.post("/add-user", async (req, res) => {
    const { login, password, statusid, employeeID } = req.body;
    console.log(login, password, statusid, employeeID)
    try {
        await insertUser(login, password, statusid, employeeID);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error adding user' });
    }
    const employeesDB = await getEmployees()
    const usersDB = await getUsers()
    res.json({users: usersDB, employees: employeesDB})

})


app.get('/admin', (req, res) => {
    res.redirect("authorization");
})


app.get('/authorization', (req, res) => {
    res.render("authorization");
})

app.get('/admin-panel', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/authorization');
    }
    const employeesDB = await getEmployees()
    const usersDB = await getUsers()
    const messageDB = await getMessages()
    
    res.render('admin-panel', { user: req.session.user, employees: employeesDB, userEmployee: usersDB, studMessage: messageDB});
});

app.post('/check-admin', async (req, res) => {
    // const { username, password } = req.body;
    
    // try {
    //     let result = await AuthAdmin(username, password);
    //     if (result != null) {
    //         req.session.user = result; // Сохраняем пользователя в сессии
    //         return res.render('admin-panel');
    //     } else {
    //         res.render('authorization', { error: 'Неверное имя пользователя или пароль.' });
    //     }

    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Ошибка подключения к базе данных.');
    // }
    const { username, password } = req.body;
    try {
        let result = await AuthAdmin(username, password);
        if (result != null) {
            req.session.user = result; // Сохраняем пользователя в сессии
           
            return res.json({ success: true, redirectUrl: '/admin-panel'});                
        } else {
            return res.status(401).json({ success: false, error: 'Неверное имя пользователя или пароль.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Ошибка подключения к базе данных.');
    }
})


        
// Выход из системы
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});



app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started: http://localhost:${PORT}`)
})


