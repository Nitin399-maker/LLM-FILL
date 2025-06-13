document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        sentenceInput: document.getElementById('sentenceInput'),
        processBtn: document.getElementById('processBtn'),
        interactiveSentence: document.getElementById('interactiveSentence'),
        predictionArea: document.getElementById('predictionArea'),
        loadingSpinner: document.getElementById('loadingSpinner'),
        probabilityTables: document.getElementById('probabilityTables'),
        apiKeyInput: document.getElementById('apiKey'),
        modelSelect: document.getElementById('modelSelect'),
    };

    const state = {
        currentSentence: [],
        originalSentence: [],
        selectedIndex: null,
        baseUrl: "https://openrouter.ai/api/v1/chat/completions"
    };
    
    elements.processBtn.addEventListener('click', processSentence);
    elements.sentenceInput.addEventListener('keydown', e => e.key === 'Enter' && processSentence());
    
    function processSentence() {
        const sentence = elements.sentenceInput.value.trim();
        if (!sentence) return;
        elements.predictionArea.classList.add('d-none');
        elements.probabilityTables.innerHTML = '';
        state.selectedIndex = null;
        state.currentSentence = tokenizeSentence(sentence);
        state.originalSentence = [...state.currentSentence];
        renderInteractiveSentence();
    }
    
    function tokenizeSentence(sentence) {
        return sentence.match(/\w+|[.,!?;:]/g) || [];
    }
    
    function renderInteractiveSentence() {
        elements.interactiveSentence.innerHTML = '';
        
        state.currentSentence.forEach((token, index) => {
            const isBlank = token === '____';
            const btn = document.createElement('button');
            
            btn.className = `btn btn-sm m-1 ${isBlank ? 'btn-danger rounded-pill px-3' : 'btn-outline-primary rounded'} shadow-sm`;
            btn.textContent = token;
            btn.addEventListener('click', () => handleTokenClick(index));
            
            elements.interactiveSentence.appendChild(btn);
        });
    }
    
    function handleTokenClick(index) {
        if (state.currentSentence[index] === '____') {
            state.currentSentence[index] = state.originalSentence[index];
            state.selectedIndex = null;
            elements.predictionArea.classList.add('d-none');
            elements.probabilityTables.innerHTML = '';
        } else {
            if (state.selectedIndex !== null) {
                state.currentSentence[state.selectedIndex] = state.originalSentence[state.selectedIndex];
            }
            
            state.selectedIndex = index;
            state.currentSentence[index] = '____';
            elements.predictionArea.classList.remove('d-none');
            elements.probabilityTables.innerHTML = '';
            getPrediction();
        }
        
        renderInteractiveSentence();
    }
    
    async function getPrediction() {
        const apiKey = elements.apiKeyInput.value.trim();
        
        elements.loadingSpinner.classList.remove('d-none');
        elements.probabilityTables.innerHTML = '';
        const prompt = state.currentSentence.join(' ');
        
        try {
            const response = await fetch(state.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: elements.modelSelect.value,
                    messages: [
                        {role: "system", content: "You are a language model assistant. Given a sentence with one blank (_______), return only the most likely word(s) to fill the blank. Limit output to 1 tokens. Include top 20 token logprobs. Do not return full sentences or explanations—only the predicted word."},
                        {role: "user", content: prompt}
                    ],
                    max_tokens: 1,
                    logprobs: true,
                    top_logprobs: 20,
                    temperature: 0,
                })
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data)

            const logprobsContent = data.choices[0].logprobs?.content;
            if (logprobsContent?.length > 0) {
                if (logprobsContent[0].top_logprobs?.length > 0) {
                    const topLogprobs = logprobsContent[0].top_logprobs.map(item => ({
                        token: item.token,
                        probability: Math.exp(item.logprob) * 100
                    }));
                    visualizeTokenProbabilities(topLogprobs);
                } 
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
           
        } finally {
            elements.loadingSpinner.classList.add('d-none');
        }
    }
    
    function visualizeTokenProbabilities(tokenArray) {
        elements.probabilityTables.innerHTML = '';
        tokenArray.sort((a, b) => b.probability - a.probability);
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-lg-10 col-md-12 mx-auto mb-4';
        const tableDiv = document.createElement('div');
        tableDiv.className = 'card p-3 border';
        let tableHTML = '<table class="table table-borderless">';

        for (let i = 0; i < Math.min(15, tokenArray.length); i += 3) {
            tableHTML += '<tr>';
            for (let j = 0; j < 3; j++) {
                const index = i + j;
                if (index < tokenArray.length) {
                    const item = tokenArray[index];
                    tableHTML += `
                        <td>
                            <div class="mb-2">
                                <span class="text-muted">${item.probability.toFixed(3)}%</span>
                                <span class="fw-bold"> ${item.token}</span>
                            </div>
                            <hr class="mt-0 mb-3">
                        </td>
                    `;
                } else {
                    tableHTML += '<td></td>';
                }
            }
            
            tableHTML += '</tr>';
        }
        
        tableHTML += '</table>';
        tableDiv.innerHTML = tableHTML;
        cardDiv.appendChild(tableDiv);
        elements.probabilityTables.appendChild(cardDiv);
    }
});