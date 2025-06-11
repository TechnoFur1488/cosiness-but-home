import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" }
})

const Cart = sequelize.define("cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sessionId: { type: DataTypes.STRING, unique: true, allowNull: false },
}, {
    indexes: [
        {
            unique: true,
            fields: ["sessionId"]
        }
    ]
})

const Forever = sequelize.define("forever", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sessionId: { type: DataTypes.STRING, unique: true, allowNull: false },
}, {
    indexes: [
        {
            unique: true,
            fields: ["sessionId"]
        }
    ]
})

const ForeverProduct = sequelize.define("forever_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    foreverId: { type: DataTypes.STRING, allowNull: false }
})

const CartProduct = sequelize.define("cart_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    totalDiscount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    cartId: { type: DataTypes.STRING, allowNull: false }
})

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mail: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    adress: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    delivery: { type: DataTypes.STRING, allowNull: false },
    pay: { type: DataTypes.STRING, allowNull: false },
    policy: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
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
    description: { type: DataTypes.TEXT, allowNull: true },
    from: { type: DataTypes.STRING, allowNull: true }
}, {
    indexes: [
        {
            name: "product_search_idx",
            fields: [sequelize.literal("unaccent(name)")],
            using: "GIN",
            operator: "gin_trgm_ops"
        },
        {
            name: "product_description_idx",
            fields: [sequelize.literal("unaccent(description)")],
            using: "GIN",
            operator: "gin_trgm_ops"
        }
    ]
})

Product.search = async function (query, limit, offset) {
    const cleanQuery = query.trim()
    const terms = cleanQuery.split(/\s+/)

    const wordConditions = terms.map((term, i) =>
        `unaccent(name) ILIKE unaccent(:term${i})`
    ).join(' AND ')

    const replacements = {
        fullQuery: `%${cleanQuery}%`,
        query: cleanQuery,
        limit,
        offset
    }

    terms.forEach((term, i) => {
        replacements[`term${i}`] = `%${term}%`;
    })

    return await sequelize.query(
        `SELECT * FROM "products"
        WHERE 
            -- Точное совпадение фразы
            unaccent(name) ILIKE unaccent(:fullQuery)
            
            -- ИЛИ поиск по отдельным словам
            ${wordConditions ? `OR (${wordConditions})` : ''}
                
            -- ИЛИ нечёткий поиск
            OR similarity(unaccent(name), unaccent(:query)) > 
                CASE 
                    WHEN length(:query) < 5 THEN 0.05
                    ELSE 0.1 
                END
        ORDER BY
            -- Приоритет у точных совпадений
            CASE 
                WHEN unaccent(name) ILIKE unaccent(:fullQuery) THEN 1
                ELSE 0 
            END DESC,
            -- Затем по степени схожести
            similarity(unaccent(name), unaccent(:query)) DESC
        LIMIT :limit OFFSET :offset`,
        {
            replacements,
            model: Product,
            mapToModel: true
        }
    )
}

const OrderItem = sequelize.define("order_item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    productName: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false }
})

const Rating = sequelize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    gradeText: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    sessionId: { type: DataTypes.STRING, allowNull: false }
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
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
}, {
    indexes: [
        { fields: ["id"] }
    ]
})

// User.hasOne(Cart)
// Cart.belongsTo(User)

// User.hasOne(Forever)
// Forever.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Forever.hasMany(ForeverProduct, { foreignKey: 'foreverId', sourceKey: 'sessionId' })
ForeverProduct.belongsTo(Forever, { foreignKey: 'foreverId', targetKey: 'sessionId' })

Product.hasOne(ForeverProduct, { onDelete: "CASCADE" })
ForeverProduct.belongsTo(Product)

Cart.hasMany(CartProduct, { foreignKey: 'cartId', sourceKey: 'sessionId' })
CartProduct.belongsTo(Cart, { foreignKey: 'cartId', sourceKey: 'sessionId' })

Product.hasOne(CartProduct, { onDelete: "CASCADE" })
CartProduct.belongsTo(Product)

Catalog.hasMany(Product, { onDelete: "CASCADE", as: "Products" })
Product.belongsTo(Catalog)

Product.hasMany(Rating, { onDelete: "CASCADE", foreignKey: 'productId', as: 'Ratings' })
Rating.belongsTo(Product)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)


export { User, Order, Cart, Forever, CartProduct, ForeverProduct, Product, Rating, Catalog, OrderItem }