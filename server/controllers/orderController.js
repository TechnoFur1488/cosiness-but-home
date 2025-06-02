import nodemailer from "nodemailer"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { CartProduct, Order, OrderItem, Product } from "../model/model.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "..", ".env") })

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})


class OrderController {
    async createOrder(req, res) {
        try {
            const { mail, name, adress, phone, delivery, pay } = req.body
            const sessionId = req.sessionId

            if (!sessionId) {
                return res.status(402).json({ message: "Корзина не найдена" })
            }

            if (!mail || !name || !adress || !phone || !delivery || !pay) {
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            const cartItem = await CartProduct.findAll({ where: { cartId: sessionId }, include: [Product] })

            if (!cartItem || cartItem.length === 0) {
                return res.status(404).json({ message: "Товары не найдены" })
            }

            const total = cartItem.reduce((sum, i) => sum + i.total, 0)

            const order = await Order.create({ mail, name, adress, phone, delivery, pay, total })

            for (const item of cartItem) {
                await OrderItem.create({ orderId: order.id, productId: item.product.id, quantity: item.quantity, price: item.total, discount: item.discount, productName: item.product.name, size: item.size })
            }

            await CartProduct.destroy({ where: { cartId: sessionId } })

            const fromClient = {
                from: mail,
                to: process.env.GMAIL_MAIL,
                subject: `У вас новый заказ`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${adress}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        ${cartItem.map(el => `
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <!-- Изображения товара -->
                            <div style="margin-bottom: 15px; text-align: center;">
                                ${el.product.img.map(img => `
                                    <img src="${img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                                `).join("")}
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${el.product.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${el.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${el.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                        `).join("")}
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
            }

            const fromAdmin = {
                from: `Уют под ногами <${process.env.GMAIL_MAIL}>`,
                to: mail,
                subject: "Спасибо за заказ",
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${adress}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        ${cartItem.map(el => `
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <!-- Изображения товара -->
                            <div style="margin-bottom: 15px; text-align: center;">
                                ${el.product.img.map(img => `
                                    <img src="${img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                                `).join("")}
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${el.product.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${el.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${el.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                        `).join("")}
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 0 0 10px 0;">Спасибо за ваш заказ!</p>
                        <p style="margin: 0;">Мы свяжемся с вами в ближайшее время.</p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
            }


            transporter.sendMail(fromClient, (err, info) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Письмо отправлено: " + info.messageId)
                }

                transporter.sendMail(fromAdmin, (err, info) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log("Письмо отправлено: " + info.messageId)
                    }
                })
            })

            return res.status(200).json({ message: "Заказ успешно создан" })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async createOrderOne(req, res) {
        try {
            const { mail, name, adress, phone, delivery, pay, size, quantity, policy } = req.body
            const { productId } = req.params

            if (!policy) {
                return res.status(400).json({ message: "Вы не согласились с политикой конфиденциальности" })
            }

            if (!productId) {
                return req.status(404).json({ message: "Такого товара не существует" })
            }

            const product = await Product.findByPk(productId)

            const [w, l] = size.split("x").map(Number)
            const squareMeters = w * l
            const price = (product.price * squareMeters) * quantity

            if (!mail || !name || !adress || !phone || !delivery || !pay || !size || !quantity) {
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            const order = await Order.create({ mail, name, adress, phone, delivery, pay, total: price, policy })

            const orderItem = await OrderItem.create({ orderId: order.id, productId: product.id, quantity: quantity, size: size, price: price, productName: product.name })


            const fromClient = {
                from: mail,
                to: process.env.GMAIL_MAIL,
                subject: `У вас новый заказ`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;"><a href="tel: ${phone}">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${adress}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <div style="margin-bottom: 15px; text-align: center;">
                                ${product.img.map(img => `
                                    <img src="${img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                                `).join("")}
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${product.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${orderItem.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${orderItem.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${orderItem.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                        
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${orderItem.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
            }

            const fromAdmin = {
                from: `Уют под ногами <${process.env.GMAIL_MAIL}>`,
                to: mail,
                subject: "Спасибо за заказ",
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;"><a href="tel: ${phone}">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${adress}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <!-- Изображения товара -->
                            <div style="margin-bottom: 15px; text-align: center;">
                                ${product.img.map(img => `
                                    <img src="${img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                                `).join("")}
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${product.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${orderItem.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${orderItem.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${orderItem.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${orderItem.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 0 0 10px 0;">Спасибо за ваш заказ!</p>
                        <p style="margin: 0;">Мы свяжемся с вами в ближайшее время.</p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
            }


            transporter.sendMail(fromClient, (err, info) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Письмо отправлено: " + info.messageId)
                }

                transporter.sendMail(fromAdmin, (err, info) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log("Письмо отправлено: " + info.messageId)
                    }
                })
            })

            return res.status(200).json({ orderItem, message: "Заказ успешно создан" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllOrder(req, res) {

        try {
            const allOrderItems = await Order.findAndCountAll({
                limit: 10,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: OrderItem
                    }
                ]
            })

            return res.status(200).json({ allOrderItems })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new OrderController() 