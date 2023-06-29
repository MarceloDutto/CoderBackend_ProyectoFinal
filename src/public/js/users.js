//document selectors
const usersContainer = document.querySelector(".users-container");

// product managment functions
let users = [];
const getUsers = async () => {
    users = [];
    const url = '/api/users'
    const headers = {
        'Content-Type': 'application/json'
    }
    const method = 'GET';
    
    fetch(url, {
        method,
        headers
    })
    .then(response => response.json())
    .then(data => {
        if(data.payload.length > 0) {
            data.payload.forEach(element => {
                users.push(element);
            });
        }
        console.log(users);
        showUsers();
    })
    .catch(error => console.log(error))
};

const showUsers = async () => {
    if(users.length === 0) {
        usersContainer.innerHTML = `<p class="error-text">No se han encontrado usuarios</p>`;
        return;
    }

    users.forEach(user => {
        let buttontext = 'Hacer Premium'
        let buttonStyle = 'background-color: rgba(0, 128, 49, 0.774);'
        if(user.role === 'premium') {
            buttontext = 'Revocar Premium' 
            buttonStyle = 'background-color: rgba(255, 187, 0, 0.795);'
        };
        let row = document.createElement("div");
        row.classList.add("userRow");
        row.innerHTML =  
        `<div class="user-avatar">
            <img src="${user.avatar}" alt="">
        </div>
        <div class="user-info">
            <p class="user-data">${user.fullname}</p>
            <p class="user-data">${user.email}</p>
            <p class="user-data">Categoría: ${user.role}</p>
        </div>
        <div class="actions">
            <button class="button change-role" style="${buttonStyle}" data-user-id="${user.id}">${buttontext}</button>
            <button class="button delete-user red" data-user-id="${user.id}">Eliminar usuario</button>
        </div>`
        usersContainer.appendChild(row);
    });

    const btnChangeRole = document.querySelectorAll(".change-role");
    btnChangeRole.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const userId = btn.getAttribute('data-user-id');
            while(usersContainer.hasChildNodes()) {
                usersContainer.removeChild(usersContainer.firstChild);
            };
            changeRole(userId);
        });
    });
    
    const btnDeleteUser = document.querySelectorAll(".delete-user");
    btnDeleteUser.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const userId = btn.getAttribute('data-user-id');
            while(usersContainer.hasChildNodes()) {
                usersContainer.removeChild(usersContainer.firstChild);
            };
            deleteUser(userId);
        });
     });
};

const changeRole = async (id) => {
const url = '/api/users/premium/' + id;
const headers = {};
const method = 'GET';

fetch(url, {
    headers,
    method
})
.then(response => response.json())
.then(data => {
    console.log(data.message);
    getUsers();
})
.catch(error => console.log(error))
};


const deleteUser = async (id) => {
    const url = '/api/users/' + id;
const headers = {};
const method = 'DELETE';

fetch(url, {
    headers,
    method
})
.then(response => response.json())
.then(data => {
    console.log(data.message);
    getUsers();
})
.catch(error => console.log(error))
}

//main functionality runtime
getUsers();

