// Select the necessary elements
const nextButton = document.getElementById("next-button");
const nameInput = document.querySelector('input[name="ClientName"]');
const emailInput = document.querySelector('input[name="Email"]');
const phoneInput = document.querySelector('input[name="PhoneNumber"]');
const classInput = document.querySelector('input[name="Class"]');
const submitButton = document.getElementById("submit-button");
const quoteInput = document.querySelector('input[name="Quote"]');

// Function to check if all required fields are filled
function checkForms() {
    if (nameInput.value.trim() !== '' &&
        emailInput.value.trim() !== '' &&
        phoneInput.value.trim() !== '' &&
        classInput.value.trim() !== '') {
        nextButton.style.display = 'inline-grid';
    } else {
        nextButton.style.display = 'none';
    }
}

// Function to check if the quote input is filled
function checkQuoteForm() {
    if (quoteInput.value.trim() !== '') {
        submitButton.style.display = 'inline-grid';
    } else {
        submitButton.style.display = 'none';
    }
}

// Attach event listeners for keyup events on each input field
nameInput.addEventListener('keyup', checkForms);
emailInput.addEventListener('keyup', checkForms);
phoneInput.addEventListener('keyup', checkForms);
classInput.addEventListener('keyup', checkForms);
quoteInput.addEventListener('keyup', checkQuoteForm);

// Initially hide the buttons
nextButton.style.display = 'none';
submitButton.style.display = 'none';

// Event listener for the next button
nextButton.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("personal-details-form").style.display = "none";
    document.getElementById("quote-form").style.display = "grid";
});

// Event listener for the quote form submission
document.getElementById("quote-form").addEventListener("submit", function (e) {
    e.preventDefault(); 
    document.getElementById("message").textContent = "Submitting..";
    document.getElementById("message").style.marginTop = "10px";
    document.getElementById("message").style.color = "white";
    document.getElementById("message").style.display = "block";
    submitButton.disabled = true;

    // Collect the form data
    var personalFormData = new FormData(document.getElementById("personal-details-form"));
    var quoteFormData = new FormData(this);

    var keyValuePairs = [];
    for (var pair of personalFormData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
    }
    for (var pair of quoteFormData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
    }

    var formDataString = keyValuePairs.join("&");

    // Send a POST request to your Google Apps Script
    fetch(
        "https://script.google.com/macros/s/AKfycbyjoeF4D-zXGUe7KzrDLyixMsiTBR_SyDV1GB3ytuuIn-r_B-gGktNm3xwzWrVMPWX73w/exec",
        {
            redirect: "follow",
            method: "POST",
            body: formDataString,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        }
    )
        .then(function (response) {
            if (response.ok) {
                return response.text(); // Expecting plain text response
            } else {
                throw new Error("Failed to submit the form.");
            }
        })
        .then(function (data) {
            document.getElementById("message").textContent = "Data submitted successfully!";
            document.getElementById("message").style.marginTop = "10px";
            document.getElementById("message").style.backgroundColor = "green";
            document.getElementById("message").style.color = "beige";
            submitButton.disabled = false;
            document.getElementById("personal-details-form").reset();
            document.getElementById("quote-form").reset();

            setTimeout(function () {
                document.getElementById("message").textContent = "";
                document.getElementById("message").style.display = "none";
                document.getElementById("personal-details-form").style.display = "grid";
                document.getElementById("quote-form").style.display = "none";
                nextButton.style.display = 'none'; // Reset the next button visibility
                submitButton.style.display = 'none'; // Reset the submit button visibility
            }, 2600);
        })
        .catch(function (error) {
            console.error(error);
            document.getElementById("message").textContent = "An error occurred while submitting the form.";
            document.getElementById("message").style.display = "block";
            submitButton.disabled = false;
        });
});
