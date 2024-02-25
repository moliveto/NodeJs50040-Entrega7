const App = require("./app");
const BaseRoute = require("./routes/base.routes");
import ProductsRoutes from './routes/products.routes.js';
import CartsRoutes from './routes/carts.routes.js';
import MessageRoutes from './routes/mensajes.routes.js';

const app = new App([new BaseRoute(), new ProductsRoutes(), new CartsRoutes(), new MessageRoutes()]);

app.listen();