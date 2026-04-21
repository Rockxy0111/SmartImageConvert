document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const statusText = document.getElementById('status');
    const resultArea = document.getElementById('result');
    const modeBtns = document.querySelectorAll('.mode-btn');
    let selectedFormat = 'image/webp';

    // 1. MODE SWITCHING
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFormat = btn.dataset.format;
        });
    });

    // 2. CLICK TO UPLOAD
    dropZone.addEventListener('click', () => fileInput.click());

    // 3. DRAG & DROP LOGIC (The missing part)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault(); // Stops browser from opening image in new tab
            e.stopPropagation();
        }, false);
    });

    // Visual Feedback
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('highlight');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('highlight');
        }, false);
    });

    // Handle Dropped Files
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Handle Selected Files
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 4. CORE PROCESSING ENGINE
    async function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }

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
    }

    // 5. OTHER UTILITIES (Base64 & Password)
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
