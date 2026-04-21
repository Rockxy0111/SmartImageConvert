// --- IMAGE CONVERTER LOGIC ---
let selectedFormat = 'image/webp';
const modeBtns = document.querySelectorAll('.mode-btn');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const statusText = document.getElementById('status');
const resultArea = document.getElementById('result');

// Mode Switcher
modeBtns.forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.dataset.format;
    };
});

// Click to Upload
dropZone.onclick = () => fileInput.click();

fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    statusText.innerText = "⚡ Processing locally...";
    resultArea.classList.add('hidden');

    const options = {
        maxSizeMB: 1.5,
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
};

// --- BASE64 ENCODER ---
document.getElementById('b64-input').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
        const copyBtn = document.getElementById('copy-b64');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(reader.result);
            copyBtn.innerText = "COPIED!";
            setTimeout(() => copyBtn.innerText = "Copy Base64 String", 2000);
        };
    };
    reader.readAsDataURL(file);
};

// --- PASSWORD GENERATOR ---
document.getElementById('gen-pass').onclick = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('pass-output').value = pass;
};
