import { Catalog } from "../model/model.js"

class CatalogController {
    async create(req, res) {
        try {
            const { name } = req.body

            if (!name) {
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            const catalog = await Catalog.create({ name })

            return res.status(201).json({ catalog, message: "Каталог успешно создан" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllCatalog(req, res) {
        try {
            const catalogs = await Catalog.findAll()
            return res.status(200).json({ catalogs })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateCatalog(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body

            if (!id) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            if (!name) {
                return res.status(406).json({ message: "Не все поля заполнены" })
            }

            await Catalog.update({ name }, { where: { id } })

            return res.status(203).json({ message: "Каталог успешно обновлен" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteCatalog(req, res) {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            await Catalog.destroy({ where: { id } })

            return res.status(200).json({ message: "Каталог успешно удален" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllCatalogProducts(req, res) {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            const products = await Catalog.findByPk(id, {
                include: Product
            })

            return res.status(200).json({ products })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new CatalogController()