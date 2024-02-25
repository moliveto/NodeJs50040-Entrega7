import fs from 'fs';
import __dirname from "../utils.js";


export async function getAllProductsFromJson() {
    const productsData = [];

    const jsonData = fs.readFileSync(__dirname + '/data/products.json', 'utf-8');
    const products = JSON.parse(jsonData);

    productsData.push(...products);

    return productsData;
}