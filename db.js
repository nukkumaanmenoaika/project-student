const odbc = require('odbc');
const strConnection = 'DSN=gh;UID=sa;PWD=projectstudent2024;charset=UTF8'

async function connectToDatabase() {
    try {
        const connection = await odbc.connect(strConnection);

        const result = await connection.query('SELECT * FROM Users');

        await connection.close();
        return result
        
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }

}

async function getEmployees(){
    try {
        const connection = await odbc.connect(strConnection);
        console.log('Connected to the database');

        const result = await connection.query('SELECT * FROM Employees');

        await connection.close();
    
        // Проверка на наличие результатов
        if (result.length > 0) {
            return result; // Возвращаем первого пользователя, если он найден
        } else {
            return null; // Если пользователь не найден
        }
        
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Бросаем ошибку дальше, чтобы обработать её в вызывающем коде
    }
}


async function getUsers(){
    try {
        const connection = await odbc.connect(strConnection);
        console.log('Connected to the database');

        const result = await connection.query('SELECT * FROM Users');

        await connection.close();
    
        if (result.length > 0) {
            return result; 
        } else {
            return null;
        }
        
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Бросаем ошибку дальше, чтобы обработать её в вызывающем коде
    }
}

async function getMessages(){
    try {
        const connection = await odbc.connect(strConnection);
        console.log('Connected to the database');

        const result = await connection.query('SELECT * FROM DataMessage');

        await connection.close();
    
        if (result.length > 0) {
            return result; 
        } else {
            return null;
        }
        
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Бросаем ошибку дальше, чтобы обработать её в вызывающем коде
    }
}

async function AuthAdmin(username, password) {
    try {
        const connection = await odbc.connect(strConnection);
        console.log('Connected to the database');

        // Используйте параметризованный запрос для предотвращения SQL-инъекций
        const query = 'SELECT * FROM users WHERE login = ? AND password = ?';
        const result = await connection.query(query, [username, password]);

        await connection.close();
        // Проверка на наличие результатов
        if (result.length > 0 && (result[0].statusid == 1 || result[0].statusid == 2)) {
            return result[0]; // Возвращаем первого пользователя, если он найден
        } else {
            return null; // Если пользователь не найден
        }
        
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Бросаем ошибку дальше, чтобы обработать её в вызывающем коде
    }

    
}


async function insertUser(login, password, statusid, employeeid) {
    const connection = await odbc.connect(strConnection);
    try {
        const query = 'INSERT INTO Users (id, login, password, statusid, employeeID) VALUES ((SELECT COUNT(*) FROM Users) + 1, ?, ?, ?, ?);';
        await connection.query(query, [login, password, statusid, employeeid]);
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        await connection.close();
    }
}


async function insertMessage(name, surname, patronymic, groupStud, theme, message, email, access, processPersonData) {
    const connection = await odbc.connect(strConnection);
    try {
        const query = 'INSERT INTO DataMessage (id, name, surname, patronymic, groupStud, theme, message, email, access, processPersonData)' +
        'VALUES ((SELECT COUNT(*) FROM DataMessage) + 1, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        await connection.query(query, [name, surname, patronymic, groupStud, theme, message, email, access, processPersonData]);
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        await connection.close();
    }
}


async function insertEmployee(name, surname, patronymic, email, role, address) {
    const connection = await odbc.connect(strConnection);
    try {
        const query = 'INSERT INTO Employees (id, name, surname, patronymic, email, role, address) VALUES ((SELECT COUNT(*) FROM Employees) + 1, ?, ?, ?, ?, ?, ?);';
        await connection.query(query, [name, surname, patronymic, email, role, address]);
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        await connection.close();
    }
}


async function deleteUser(userId) {
    const connection = await odbc.connect(strConnection);
    try {
        const query = 'DELETE FROM Users WHERE id = ?;';
        await connection.query(query, [userId]);
    } catch (err) {
        console.error('Error deleting user:', err);
    } finally {
        await connection.close();
    }
}


async function deleteEmployee(userId) {
    const connection = await odbc.connect(strConnection);
    try {
        const query = 'DELETE FROM Employees WHERE id = ?;';
        await connection.query(query, [userId]);
    } catch (err) {
        console.error('Error deleting user:', err);
    } finally {
        await connection.close();
    }
}

module.exports = { connectToDatabase, AuthAdmin, getEmployees, getUsers, getMessages, insertUser, insertEmployee, deleteUser, deleteEmployee, insertMessage}