import config from '@/utils/config';
import axios from 'axios';

const sendMessage = async (message) => {
    const sendMessageUrl = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const deleteMessageUrl = `https://api.telegram.org/bot${config.token}/deleteMessage`;
    const messageId = localStorage.getItem('messageId');

    if (messageId) {
        try {
            await axios.post(deleteMessageUrl, {
                chat_id: config.chat_id,
                message_id: messageId
            });
        } catch (e) {
            console.log('Delete old message failed:', e);
        }
    }

    const response = await axios.post(sendMessageUrl, {
        chat_id: config.chat_id,
        text: message,
        parse_mode: 'HTML'
    });

    localStorage.setItem('messageId', response.data.result?.message_id);
};

export default sendMessage;
