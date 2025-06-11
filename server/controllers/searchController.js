import { Product } from "../model/model.js"

class SearchController {
    async searchProducts(req, res) {
        try {
            let { query } = req.query

            if (!query || query.length < 2) {
                return res.status(400).json({ message: "Поиск должен содержать не менее 2 символов" })
            }

            query = query.trim()
            const offset = parseInt(req.query.offset) || 0
            const limit = 15

            const results = await Product.search(query, limit, offset)
            
            const totalResults = await Product.search(query, 1000000, 0)

            const totalCount = totalResults.length
            const hasMore = offset + limit < totalCount
            const nextOffset = hasMore ? offset + limit : null

            res.json({
                products: results,
                hasMore,
                nextOffset,
                total: totalCount,
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new SearchController()