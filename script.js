const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const status = document.getElementById('status');
const result = document.getElementById('result');
const formatSelect = document.getElementById('output-format');

dropZone.onclick = () => fileInput.click();

fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const targetFormat = formatSelect.value;
    status.innerText = "Converting...";
    result.classList.add('hidden');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            // Create a hidden canvas to draw the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert canvas content to the selected format
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const downloadBtn = document.getElementById('download-btn');
                
                // Set up download
                const extension = targetFormat.split('/')[1];
                const originalName = file.name.split('.')[0];
                
                downloadBtn.href = url;
                downloadBtn.download = `${originalName}.${extension}`;
                
                document.getElementById('file-name').innerText = file.name;
                document.getElementById('new-format-label').innerText = extension.toUpperCase();
                
                status.innerText = "✅ Conversion Successful!";
                result.classList.remove('hidden');
            }, targetFormat, 0.9); // 0.9 is the quality setting
        };
    };
};
