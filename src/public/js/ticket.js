const emailButton = document.querySelector("#mail-button");
const userEmail = emailButton.getAttribute("user");
const ticketId = emailButton.getAttribute("ticket-id");

emailButton.addEventListener('click', e => {
    e.preventDefault();

    const url = `/api/users/email/user/${userEmail}/ticket/${ticketId}`;
    const method = 'GET';
    const headers = {};

    fetch(url, {
        method,
        headers
    })
    .then(response =>  response.json())
    .then(data => {
        console.log(data)
    });
});