import fs, { existsSync, promises, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    };

    getAll = async (filter, options) => {
        try {
            if(!existsSync(this.path)) {
                return {};
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            const dataJSON = JSON.parse(data);

            let products = Object.keys(filter).length === 0 ? dataJSON : dataJSON.filter(prod => prod.category === filter.category);

            const totalPages = Math.ceil(products.length / options.limit);
            const page = options.page;
            const offsetStart = (page - 1) * options.limit;
            const OffsetEnd = offsetStart + options.limit;
            this.products = products.slice(offsetStart, OffsetEnd);
            const prevPage = page - 1 < 1? null : page - 1;
            const nextPage = page + 1 > totalPages? null : page + 1;

            /*const query = filter.category ? filter.category : null;
            const sort = Object.keys(options.sort).length === 0 ? null : options.sort; */

            const response = {
                status: 'success',
                payload: this.products,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage: !!prevPage,
                hasNextPage: !!nextPage,
                prevLink: `?limit=${options.limit}&page=${prevPage}`,
                nextLink: `?limit=${options.limit}&page=${nextPage}`
            };

            return response;
        } catch(error) {
            throw error;
        }
    };

    getById = async (pid) => {
        try {
            if(!existsSync(this.path)) {
                return {};
            };

            const stats = await promises.stat(this.path);

            if(stats.size === 0) {
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const prodById = this.products.find(prod => prod.id === pid);
            return prodById ? prodById : {};
        } catch(error) {
            throw error;
        }
    }

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
            this.products = JSON.parse(data);
    
            const queryName = Object.keys(query)[0];
            const queryValue = query[queryName];
            
            const prodById = this.products.find(prod => prod[queryName] === queryValue);
            return prodById ? prodById : {};  
        } catch(error) {
            throw error;  
        }
    };

    create = async (productInfo) => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.products = JSON.parse(data);
                } else {
                    this.products = [];
                }
            } else {
                this.products = [];
            }

            let id;
            let unique = false;
            while(!unique) {
                id = uuidv4();
                unique = !this.products.some(prod => prod.id === id);
            };

            const newProduct = {
                id,
                ...productInfo
            };

            this.products.push(newProduct);
            const productsStr = JSON.stringify(this.products, null, 2);
            writeFile(this.path, productsStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newProduct;
        } catch(error) {
            throw error;
        }
    };

    update = async (pid, updates) => {
        try {
            if(existsSync(this.path)) {
                const stats = await promises.stat(this.path);
                if(stats.size !== 0) {
                    
                    const data = await promises.readFile(this.path, 'utf-8');
                    this.products = JSON.parse(data);
                } else {
                    this.products = [];
                }
            } else {
                this.products = [];
            }
            
            const indexById = this.products.findIndex(prod => prod.id === pid);
            const product = this.products[indexById];
            this.products[indexById] = updates;
    
            const productsStr = JSON.stringify(this.products, null, 2);
            writeFile(this.path, productsStr, error => {
                if(error) {
                    throw error;
                }
            });
            
            return product;
        } catch(error) {
            throw error;
        }
    };

    delete = async (pid) => {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);

            const indexById = this.products.findIndex(prod => prod.id === pid);
            const product = this.products[indexById];

            this.products.splice(indexById, 1);

            const productsStr = JSON.stringify(this.products, null, 2);
            writeFile(this.path, productsStr, error => {
                if(error) {
                    throw error;
                };
            });
            return product;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            if(!existsSync(this.path)) return 'No existe el archivo';

            this.products = [];
            const productsStr = JSON.stringify(this.products, null, 2);
            writeFile(this.path, productsStr, error => {
                if(error) {
                    throw error;
                }
            });
            return 'Todos los productos fueron eliminados';
        } catch(error) {
            throw error;
        }
    }
};

export default ProductManager;