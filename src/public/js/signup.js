const form = document.querySelector("#signupForm");
const notification = document.querySelector('#notif');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    
    const url = '/api/users';
    const headers = {}
    const method = 'POST'; 
    const body = data
        
    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.status !== 'success') {
            notification.innerHTML = `<p class="p-notification" id="notification-text">${data.message? data.message : data.error}</p>`
            notification.style.visibility = 'visible';
        } else {
            notification.innerHTML = `<p class="p-notification" id="notification-text">${data.message}. <br> Click <a href="/login"> aqui</a> para iniciar sesión.</p>`
            notification.style.visibility = 'visible';
        }
    })
    .catch(error => console.log(error))
});