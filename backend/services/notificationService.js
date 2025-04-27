const axios = require('axios');

// Function to send Telegram notification
const sendDeviceApprovalNotification = async (user, fingerprint) => {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN; // Your bot token from BotFather
    const chatId = process.env.TELEGRAM_CHAT_ID; // The chat ID where you want to send the message

    const message = `
        A new device has been registered by user ${user.fullName} (${user.email}).
        Device Fingerprint: ${fingerprint}
        Please log into the admin panel to review and approve this device.
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        });
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Error sending Telegram message:', error.message);
    }
};

module.exports = { sendDeviceApprovalNotification };
