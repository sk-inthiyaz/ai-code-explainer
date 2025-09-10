const express = require('express');
const router = express.Router();
const axios = require('axios');
const PracticeProblem = require('../models/PracticeProblem');
const { GEMINI_URL, API_KEY } = require('../config/geminiConfig');

// Generate 5 practice problems
router.post('/generate', async (req, res) => {
    console.log('[DEBUG] Entering /generate route handler');
    console.log('[DEBUG] Checking environment:', {
        hasApiKey: !!API_KEY,
        apiKeyLength: API_KEY ? API_KEY.length : 0,
        geminiUrl: GEMINI_URL
    });

    try {
        console.log('[DEBUG] Request body:', req.body);
        const { topic, difficulty } = req.body;

        const prompt = {
            contents: [{
                parts: [{
                    text: `Generate 5 unique coding problems with the following specifications:
                    Topic: ${topic}
                    Difficulty: ${difficulty}

                    Please provide the problems in this JSON format:
                    {
                        "problems": [
                            {
                                "id": "unique_id_1",
                                "title": "Problem title",
                                "description": "Detailed problem description",
                                "starterCode": "// Function signature and any helper code",
                                "testCases": [
                                    {
                                        "input": ["example input"],
                                        "expectedOutput": "expected output",
                                        "explanation": "Why this output is expected"
                                    }
                                ],
                                "constraints": ["constraint1", "constraint2"],
                                "hints": ["hint1", "hint2"],
                                "difficulty": "${difficulty}",
                                "topic": "${topic}"
                            }
                        ]
                    }

                    Ensure the problems are progressively challenging and cover different aspects of ${topic}.
                    For beginner: Focus on fundamental concepts
                    For medium: Include some optimization challenges
                    For advanced: Add complex algorithmic problems`
                }]
            }]
        };

        console.log('[DEBUG] Sending request to Gemini API:', {
            url: GEMINI_URL,
            promptLength: JSON.stringify(prompt).length
        });
        
        const response = await axios.post(GEMINI_URL, prompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('[DEBUG] Raw Gemini response received');
        
        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error('Unexpected response format from Gemini API');
        }

        // Remove markdown code block syntax and get the JSON content
        const jsonContent = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        console.log('[DEBUG] Cleaned JSON content');

        let problemsData;
        try {
            problemsData = JSON.parse(jsonContent);
            if (!problemsData.problems || !Array.isArray(problemsData.problems)) {
                throw new Error('Invalid response format: missing problems array');
            }
        } catch (parseError) {
            throw new Error(`Failed to parse response: ${parseError.message}`);
        }

        // Save problems to database
        const savedProblems = await Promise.all(
            problemsData.problems.map(async (problem) => {
                const newProblem = new PracticeProblem({
                    ...problem,
                    topic,
                    difficulty
                });
                return await newProblem.save();
            })
        );

        console.log('[DEBUG] Problems saved to database:', savedProblems.length);
        res.json({ problems: savedProblems });

    } catch (error) {
        console.error('Error generating problems:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.error?.message || error.message;
        const statusCode = error.response?.status || 500;
        
        res.status(statusCode).json({ 
            error: errorMessage,
            details: 'Failed to process the request. Please try again.',
            status: statusCode
        });
    }
});

// Analyze code and provide optimization suggestions
router.post('/analyze', async (req, res) => {
    try {
        const { code } = req.body;
        console.log('[DEBUG] Analyzing code:', code);

        const prompt = {
            contents: [{
                parts: [{
                    text: `You are a code analysis expert. Analyze this code and provide feedback in JSON format.

Code to analyze:
${code}

Provide your analysis in this exact JSON format:
{
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "suggestions": [
        "specific suggestion about the code",
        "another specific improvement suggestion"
    ],
    "explanation": "A detailed explanation of the code's performance and areas for improvement"
}`
                }]
            }]
        };

        console.log('[DEBUG] Sending request to Gemini API:', {
            url: GEMINI_URL,
            promptLength: JSON.stringify(prompt).length
        });
        
        const response = await axios.post(GEMINI_URL, prompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error('Unexpected response format from Gemini API');
        }

        const jsonContent = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        const analysis = JSON.parse(jsonContent);
        res.json(analysis);

    } catch (error) {
        console.error('[DEBUG] Error analyzing code:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        // Get detailed error information
        const errorDetails = error.response?.data?.error || error.message;
        const statusCode = error.response?.status || 500;

        res.status(statusCode).json({
            error: 'Failed to analyze the code',
            details: errorDetails,
            status: statusCode
        });
    }
});

module.exports = router;
