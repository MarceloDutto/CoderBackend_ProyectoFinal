import fs, { existsSync, promises, writeFile }  from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UserManager {
    constructor (path) {
        this.users = [];
        this.path = path;
    };

    getAll = async () => {
        try {
            if(!existsSync(this.path)) {
                return [];
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return [];
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data);
            return this.users;
        } catch(error) {
            throw error;
        }
    };
    
    getById = async (uid) => {
        try {
            if(!existsSync(this.path)) {
                return {};
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data);
            const userById = this.users.find(user => user.id === uid);
            return userById ? userById : {};
        } catch(error) {
            throw error;
        }
    };

    getByQuery = async (query) => {
        try {
            if(!existsSync(this.path)) {
                return {};
            };
    
            const stats = await promises.stat(this.path);
    
            if(stats.size === 0) {
                return {};
            };
    
            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data);

            const queryName = Object.keys(query)[0];
            const queryValue = query[queryName];

            const userById = this.users.find(user => user[queryName] === queryValue);
            return userById ? userById : {}; 
        } catch(error) {
            throw error;
        }
    };

    create = async (userInfo) => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.users = JSON.parse(data);
                } else {
                    this.users = [];
                };
            } else {
                this.users = [];
            };

            let id;
            let unique = false;
            while(!unique) {
                id = uuidv4();
                unique = !this.users.some(prod => prod.id === id);
            };

            const newUser = {
                id,
                ...userInfo,
                documents : []
            };

            this.users.push(newUser);
            const usersStr = JSON.stringify(this.users, null, 2);
            writeFile(this.path, usersStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newUser
        } catch(error) {
            throw error;
        }
    };

    update = async (uid, updates) => {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data);

            const indexById = this.users.findIndex(user => user.id === uid);
            const user = this.users[indexById];
            this.users[indexById] = updates;
    
            const usersStr = JSON.stringify(this.users, null, 2);
            writeFile(this.path, usersStr, error => {
                if(error) {
                    throw error;
                }
            });
            
            return user;
        } catch(error) {
            throw error;
        }
    };

    delete = async (uid) => {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data);

            const indexById = this.users.findIndex(user => user.id === uid);
            const user = this.users[indexById];

            this.users.splice(indexById, 1);

            const usersStr = JSON.stringify(this.users, null, 2);
            writeFile(this.path, usersStr, error => {
                if(error) {
                    throw error;
                };
            });
            return user;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            if(!existsSync(this.path)) return 'No existe el archivo';

            this.users = [];
            const usersStr = JSON.stringify(this.users, null, 2);
            writeFile(this.path, usersStr, error => {
                if(error) {
                    throw error;
                };
            });
            return 'Todos los productos fueron eliminados';
        } catch(error) {
            throw error;
        }
    };
};

export default UserManager;