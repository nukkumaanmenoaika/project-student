const nodemailer = require('nodemailer');

// Создание транспортера
let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru', // адрес SMTP-сервера
    port: 465, // порт (обычно 587 для TLS)
    secure: true, // true для 465, false для других портов
    auth: {
        user: 'misha_bro@list.ru', // ваш email
        pass: 'MrVrsWG35xuJ9jNyuHZ5' // ваш пароль
    }
});

// Определение параметров письма
let mailOptions = {
    from: 'TOP Академия', // адрес отправителя
    to: 'recipient@example.com', // список получателей
    subject: 'Тема письма', // тема письма
    text: 'Это текстовое сообщение', // текстовое содержимое
};

// Отправка письма


function sendmail(mes){
    mailOptions.to = mes.email
    mailOptions.text = mes.message
    mailOptions.subject = mes.theme
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Ошибка при отправке:', error);
        }
        console.log('Сообщение отправлено: %s', info.messageId);
    });
}

module.exports = { sendmail }