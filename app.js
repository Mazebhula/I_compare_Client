document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pdf-upload-form');
    const statusDiv = document.getElementById('upload-status');
    const result1Div = document.getElementById('result1');
    const result2Div = document.getElementById('result2');

    if (form) {
        form.addEventListener('submit', async function (e) {
            result1Div.innerHTML = '';
            e.preventDefault();

            const pdf1 = document.getElementById('pdf1').files[0];
            const pdf2 = document.getElementById('pdf2').files[0];

            if (!pdf1 || !pdf2) {
                statusDiv.textContent = 'Please select both PDF files.';
                return;
            }

            const formData = new FormData();
            formData.append('file', pdf1);
            formData.append('file', pdf2);

            statusDiv.textContent = 'Uploading...';

            try {
                const response = await fetch('http://localhost:8080/extract-text', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Server error');
                }

                const text = await response.text();
                //const jsonObj = JSON.parse(text); // Assuming server now returns proper JSON

                result1Div.innerHTML = text ? `<p>${text}</p>` : '<p>No data</p>';
                //result2Div.innerHTML = jsonObj.pdf2 ? `<p>${jsonObj.pdf2}</p>` : '<p>No data</p>';
                statusDiv.textContent = 'Upload successful!';
            } catch (err) {
                statusDiv.textContent = 'Upload failed: ' + err.message;
                result1Div.innerHTML = '';
                result2Div.innerHTML = '';
            }
        });
    }

    // Chat functionality
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.textContent = "You: " + userMessage;
        userMsgDiv.style.fontWeight = "bold";
        chatMessages.appendChild(userMsgDiv);

        chatInput.value = "";

        // Send message to backend
        try {
            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const aiMsgDiv = document.createElement('div');
            if (data.status === "success") {
                const responseParts = (data.response || "").split("</think>");
                aiMsgDiv.textContent = "AI: " + (responseParts[1] ? responseParts[1].trim() : "No response");
            } else {
                aiMsgDiv.textContent = "AI Error: " + (data.message || "Unknown error");
                aiMsgDiv.style.color = "red";
            }
            chatMessages.appendChild(aiMsgDiv);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (err) {
            console.error("Raw response error:", err);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = "Error: " + err.message;
            errorDiv.style.color = "red";
            chatMessages.appendChild(errorDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
}
});