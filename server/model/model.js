import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {type: DataTypes.STRING, allowNull: false},
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" }
})

const Cart = sequelize.define("cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sessionId: {type: DataTypes.STRING, unique: true},
})

const Forever = sequelize.define("forever", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sessionId: {type: DataTypes.STRING, unique: true},
})

const CartProduct = sequelize.define("cart_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    total: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
})

const ForeverProduct = sequelize.define("forever_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mail: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    adress: { type: DataTypes.STRING, allowNull: false },
    phone: {type: DataTypes.STRING, allowNull: false},
    delivery: { type: DataTypes.STRING, allowNull: false },
    pay: { type: DataTypes.STRING, allowNull: false },
    policy: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    total: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
})

const Product = sequelize.define("product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    compound: { type: DataTypes.STRING, allowNull: false },
    warp: { type: DataTypes.STRING, allowNull: false },
    hight: { type: DataTypes.INTEGER, allowNull: false },
    hardness: { type: DataTypes.INTEGER, allowNull: false },
    size: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    description: { type: DataTypes.TEXT, allowNull: true }
})

const OrderItem = sequelize.define("order_item", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    price: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    productName: {type: DataTypes.STRING, allowNull: false},
    size:  {type: DataTypes.STRING, allowNull: false}
})

const Rating = sequelize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    gradeText: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    sessionId: {type: DataTypes.STRING, allowNull: false}
}, {
    indexes: [
        {
            unique: true,
            fields: ["sessionId", "productId"]
        }
    ]
})

const Catalog = sequelize.define("catalog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
})

// User.hasOne(Cart)
// Cart.belongsTo(User)

// User.hasOne(Forever)
// Forever.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Forever.hasMany(ForeverProduct)
ForeverProduct.belongsTo(Forever)

Product.hasOne(ForeverProduct)
ForeverProduct.belongsTo(Product)

Cart.hasMany(CartProduct)
CartProduct.belongsTo(Cart)

Product.hasOne(CartProduct)
CartProduct.belongsTo(Product)

Catalog.hasMany(Product)
Product.belongsTo(Catalog)

Product.hasMany(Rating, { onDelete: "CASCADE" })
Rating.belongsTo(Product)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)


export { User, Order, Cart, Forever, CartProduct, ForeverProduct, Product, Rating, Catalog, OrderItem }