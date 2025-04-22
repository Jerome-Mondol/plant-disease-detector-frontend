async function main() {
    const preview = document.getElementById("preview-container");  // Get the preview image element
    preview.style.display = "block";  // Show the preview image initially
    const previewImg = document.getElementById("preview-img");
    const diseaseName = document.getElementById("disease-name");
    const confidence = document.getElementById("confidence");

    // Get the image file input element and get the file selected
    let image = document.getElementById("dropzone-file");
    let imageFile = image.files[0];  // Get the first file from the input

    if (!imageFile) {
        console.log("No image selected.");
        return; // Exit early if no image is selected
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];  // Get the base64 image string

        try {
            // Make the POST request to your own backend server (not Hugging Face directly)
            const response = await fetch("https://plant-disease-detector-backend.vercel.app/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ image: base64Image })  // Send the base64 image
            });

            // Check for a successful response
            if (!response.ok) {
                console.error("Error:", response.status, response.statusText);
                return;
            }

            // Parse the JSON response
            const result = await response.json();
            console.log(result);  // Log the result for inspection

            // Update UI with result
            diseaseName.innerText = `Disease: ${result[0].label || "Unknown Disease"}`;
            confidence.innerText = `Confidence: ${Math.min(Math.floor(result[0].score * 100), 100)}%`;


        } catch (error) {
            console.error("Error sending image:", error);  // Log any errors
        }
    };

    reader.readAsDataURL(imageFile);  // Convert the image file to base64

    showPreview();  // Show the preview of the image
}

function showPreview() {
    const previewImg = document.getElementById("preview-img");
    const image = document.getElementById("dropzone-file").files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        previewImg.src = e.target.result;  // Set the preview image source to the base64 string
    };

    if (image) {
        reader.readAsDataURL(image);  // Read the image file as a data URL
    }
}
