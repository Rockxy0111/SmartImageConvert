// --- IMAGE CONVERTER LOGIC ---
let selectedFormat = 'image/webp';
const modeBtns = document.querySelectorAll('.mode-btn');

modeBtns.forEach(btn => {
    btn.onclick = () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.dataset.format;
    };
});

document.getElementById('file-input').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = { maxSizeMB: 1, useWebWorker: true, fileType: selectedFormat };
    try {
        const compressedBlob = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedBlob);
        const ext = selectedFormat.split('/')[1];
        
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('new-name').innerText = file.name.split('.')[0] + '.' + ext;
        document.getElementById('download-btn').href = url;
        document.getElementById('download-btn').download = `toolhub_${file.name.split('.')[0]}.${ext}`;
    } catch (err) { console.error(err); }
};

// --- WORD COUNTER ---
document.getElementById('word-input').oninput = (e) => {
    const val = e.target.value.trim();
    const words = val ? val.split(/\s+/).length : 0;
    document.getElementById('w-count').innerText = words;
    document.getElementById('r-time').innerText = Math.ceil(words / 200);
};

// --- BASE64 ENCODER ---
document.getElementById('b64-input').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
        navigator.clipboard.writeText(reader.result);
        alert("Base64 string copied to clipboard!");
    };
    reader.readAsDataURL(e.target.files[0]);
};

// --- PASSWORD GENERATOR ---
document.getElementById('gen-pass').onclick = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('pass-output').value = pass;
};
