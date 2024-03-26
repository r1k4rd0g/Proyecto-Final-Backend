import { faker } from '@faker-js/faker/locale/es';


export const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.hex({ min: 0, max: 65535 }),
        price: faker.commerce.price({ min: 1, max: 1000, precision: 0.01 }),
        stock: faker.number.binary({ min: 0, max: 65535 }),
        category: faker.commerce.department(),
        thumbnail: [faker.image.abstract()]
    };
};
