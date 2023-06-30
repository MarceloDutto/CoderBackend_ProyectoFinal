import { fakerES_MX as faker } from '@faker-js/faker';


export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        code: faker.string.uuid(),
        price: faker.commerce.price({min:5000, max: 45000}),
        thumbnail: [faker.image.url()],
        stock: faker.number.int({max: 50}),
        owner: faker.internet.email()
    }
};