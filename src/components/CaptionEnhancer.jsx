
import { useState } from 'react';
import axios from 'axios';
import './CaptionEnhancer.css'; // Import the CSS file for styling

const CaptionEnhancer = () => {
    const [originalCaption, setOriginalCaption] = useState('');
    const [enhancedCaption, setEnhancedCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State to manage chatbox visibility

    const enhanceCaption = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: "anthropic/claude-3-haiku",
                messages: [
                    {
                      role: "user",
                      content: [
                        {
                          type: "text",
                          text: `Modify the following sentence ensuring that personal information is not exposed: "${originalCaption}"`
                        }
                      ]
            }]


            }, {
                headers: {
                   'Authorization': `Bearer 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`, // Replace with your OpenRouter API key
                        'HTTP-Referer': 'https://loaclhost:3000', // Replace with your site URL
                        'X-Title': 'Social Media Privacy Handler', // Replace with your site name
                        'Content-Type': 'application/json'
                }
            });

            setEnhancedCaption(response.data.choices[0].message.content);
        } catch (err) {
            console.error("Error modifing caption:", err);
            setError("Error modifing caption. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chatbox ${isOpen ? 'open' : ''}`}>
            <button className="Caption-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✖' : '💬 Modify your captions'}
            </button>
            {isOpen && (
                <div className="chatbox-content">
                    <h4>Caption Modify</h4>
                    <textarea
                        className="caption-input"
                        value={originalCaption}
                        onChange={(e) => setOriginalCaption(e.target.value)}
                        placeholder="Enter your caption here"
                        rows="4"
                    />
                    <button className="enhance-button" onClick={enhanceCaption} disabled={loading}>
                        {loading ? 'Modifing...' : 'Modify Caption'}
                    </button>
                    {error && <p className="Caption-error-message">{error}</p>}
                    {enhancedCaption && (
                        <div className="enhanced-caption">
                            <h2>Modified Caption:</h2>
                            <p>{enhancedCaption}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaptionEnhancer;