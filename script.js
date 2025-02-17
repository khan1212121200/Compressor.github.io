document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const imageInput = document.getElementById('imageInput');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const deleteBtn = document.getElementById('deleteBtn');
    const compressBtn = document.getElementById('compressBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');

    // Upload button click handler
    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // File input change handler
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    originalImage.src = event.target.result;
                    originalImage.style.display = 'block';
                    deleteBtn.style.display = 'block';
                    compressBtn.style.display = 'block';
                    displayImageInfo(file, originalInfo);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
            }
        }
    });

    // Delete button click handler
    deleteBtn.addEventListener('click', () => {
        originalImage.src = '';
        originalImage.style.display = 'none';
        compressedImage.src = '';
        compressedImage.style.display = 'none';
        deleteBtn.style.display = 'none';
        compressBtn.style.display = 'none';
        downloadBtn.style.display = 'none';
        imageInput.value = '';
        originalInfo.textContent = '';
        compressedInfo.textContent = '';
    });

    // Quality slider input handler
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });

    // Compress button click handler
    compressBtn.addEventListener('click', () => {
        if (!originalImage.src) return;

        const quality = qualitySlider.value / 100;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let width = originalImage.naturalWidth;
        let height = originalImage.naturalHeight;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Compress and display image
        canvas.toBlob(
            (blob) => {
                const url = URL.createObjectURL(blob);
                compressedImage.src = url;
                compressedImage.style.display = 'block';
                downloadBtn.style.display = 'block';
                displayImageInfo(blob, compressedInfo);
            },
            'image/jpeg',
            quality
        );
    });

    // Download button click handler
    downloadBtn.addEventListener('click', () => {
        if (!navigator.onLine) {
            alert('Internet connection is required to download the image.');
            return;
        }

        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedImage.src;
        link.click();
    });

    // Helper function to display image information
    function displayImageInfo(file, element) {
        const size = file.size / 1024; // Convert to KB
        element.textContent = `Size: ${size.toFixed(2)} KB`;
    }
});
