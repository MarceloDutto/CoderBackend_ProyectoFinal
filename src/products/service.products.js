import fs from 'fs';
import __dirname from '../utils/dirname.utils.js';
import { productsDAO } from '../dao/factory.dao.js';
import productsDTO from "../DTOs/products.dto.js";

const pm = productsDAO;

export const getProducts = async (limit, page, query, sort) => {
    try {
        let filter = {};
        if(query !== null && query !== 'null') filter = { category: query };
        
        let sortingOptions = {};
        if(sort !== null && sort !== 'null') sortingOptions = { price: sort.toLowerCase() };
        
        const options = {
            limit,
            page,
            sort: sortingOptions
        };
       
        const response = await pm.getAll(filter, options);
        if(response.payload.length === 0) return {message: 'La base de datos no contiene productos', payload: {}};

        const mappedProducts = response.payload.map(doc => new productsDTO(doc));
        response.payload = mappedProducts;

        return {message: 'Productos encontrados', payload: response};
    } catch(error) {
        throw error;
    }
};

export const getProductById = async (pid) => {
    try {
        const data = await pm.getById(pid);
        if(Object.keys(data).length === 0) return {message: 'Producto no encontrado en la base de datos', payload: {}};
        const mappedData = new productsDTO(data);
        return {message: 'Producto encontrado en la base de datos', payload: mappedData};
    } catch(error) {
        throw error;
    }
};

export const createProduct = async (productInfo) => {
    try {
        const { code } = productInfo;
        const prodByCode = await pm.getByQuery({code: code});
        if(Object.keys(prodByCode).length !== 0) return {statusCode: 200, status: 'error', message: 'El producto ya se encuentra ingresado en la base de datos', payload: {}};

        const data = await pm.create(productInfo);
        const newProduct = new productsDTO(data);
        return {statusCode: 201, status: 'success', message: 'El producto fue ingresado correctamente a la base de datos', payload: newProduct};
    } catch(error) {
        throw error;
    }
};

export const updateProduct = async (pid, updates) => {
    try {
        const product = await pm.getById(pid);
        if(Object.keys(product).length === 0) return {status: 'error', message: 'Producto no encontrado en la base de datos', payload: {}};

        if(product.thumbnail.length > 0) {
            product.thumbnail.forEach(item => updates.thumbnail?.push(item))
        };

        Object.keys(updates).forEach(key => {
            if(updates[key] && updates[key] !== product[key]) product[key] = updates[key];
        });

        const data = await pm.update(pid, product);
        const updatedProduct = new productsDTO(data);
        const changes = new productsDTO(product);
        return {status: 'success', message: 'Producto actualizado', payload: {originalProduct: updatedProduct, update: changes}};
    } catch(error) {
        throw error;
    }
};

export const deleteProduct = async (pid) => {
    try {
        const product = await pm.getById(pid);
        if(Object.keys(product).length === 0) return {status: 'error', message: 'Producto no encontrado en la base de datos', payload: {}};

        // Delete image files related to the product
        if(product.thumbnail.length > 0) {
            product.thumbnail.forEach(path => {
                if(fs.existsSync(__dirname + `/public` + path)) {
                    fs.unlink(__dirname + `/public` + path, (error) => {
                        if(error) {
                            throw error;
                        }
                    })
                }
            })
        };

        const data = await pm.delete(pid);
        const deletedProduct = new productsDTO(data);
        return {status: 'success', message: 'Producto eliminado de la base de datos', payload: deletedProduct};
    } catch(error) {
        throw error;
    }
};

export const deleteAllProducts = async () => {
    try {
        // Delete all image files related to products
        const folderPath = __dirname + `/public/img/products`;
        fs.readdir(folderPath, (error, files) => {
            if(error) {
              throw error;
            }
          
            files.forEach(file => {
              const filePath = folderPath + '/' + file;
          
              fs.stat(filePath, (error, stats) => {
                if(error) {
                  throw error;
                }
          
                if(stats.isFile()) {
                  fs.unlink(filePath, (error) => {
                    if (error) {
                      throw error;
                    }
                  });
                }
              });
            });
          });

        const data = await pm.deleteAll();
        return {message: data};
    } catch(error) {
        throw error;
    }
};