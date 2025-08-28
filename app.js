document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pdf-upload-form');
    const statusDiv = document.getElementById('upload-status');
    const result1Div = document.getElementById('result1');
    const result2Div = document.getElementById('result2');

    if (form) {
        form.addEventListener('submit', async function (e) {
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
});