const axios = require('axios');
const { GEMINI_URL } = require('../config/geminiConfig');

async function callGeminiAPI(prompt) {
    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

module.exports = {
    callGeminiAPI
};
