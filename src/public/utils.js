const backButton = document.getElementById('backButton')





backButton.onclick = (e) => {
    e.preventDefault();
    window.location.href = '/productlist'; // Dirige al usuario a la vista de productlist
};