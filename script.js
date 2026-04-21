document.addEventListener('DOMContentLoaded', () => {
    // --- IMAGE CONVERTER LOGIC ---
    let selectedFormat = 'image/webp';
    const modeBtns = document.querySelectorAll('.mode-btn');
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const statusText = document.getElementById('status');
    const resultArea = document.getElementById('result');

    // Handle Mode Switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFormat = btn.dataset.format;
        });
    });

    // Make the entire drop-zone clickable
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File Input Logic
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        statusText.innerText = "⚡ Processing locally...";
        resultArea.classList.add('hidden');

        const options = {
            maxSizeMB: 2,
            useWebWorker: true,
            fileType: selectedFormat
        };

        try {
            const compressedBlob = await imageCompression(file, options);
            const url = URL.createObjectURL(compressedBlob);
            const ext = selectedFormat.split('/')[1];
            
            statusText.innerText = "✅ Conversion Complete!";
            document.getElementById('new-name').innerText = file.name.split('.')[0] + '.' + ext;
            
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.href = url;
            downloadBtn.download = `toolhub_${file.name.split('.')[0]}.${ext}`;
            
            resultArea.classList.remove('hidden');
        } catch (err) {
            statusText.innerText = "❌ Error during conversion.";
            console.error(err);
        }
    });

    // --- BASE64 ENCODER ---
    const b64Input = document.getElementById('b64-input');
    const copyBtn = document.getElementById('copy-b64');

    b64Input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(reader.result);
                copyBtn.innerText = "COPIED!";
                setTimeout(() => copyBtn.innerText = "Copy Base64", 2000);
            };
        };
        reader.readAsDataURL(file);
    });

    // --- PASSWORD GENERATOR ---
    const genBtn = document.getElementById('gen-pass-btn');
    const passOutput = document.getElementById('pass-output');

    if (genBtn) {
        genBtn.addEventListener('click', () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < 16; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            passOutput.value = pass;
        });
    }
});
