import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields

        switch (true) {
            case !name:
                return res.json({ error: "Name is required" })

            case !description:
                return res.json({ error: "description is required" })

            case !price:
                return res.json({ error: "price is required" })

            case !category:
                return res.json({ error: "category is required" })

            case !quantity:
                return res.json({ error: "quantity is required" })

            case !brand:
                return res.json({ error: "brand is required" })
        }


        // const existingCategory = await Category.findOne({ name })
        // if (existingCategory) {
        //     return res.json({ error: "Already exists" })
        // }
        const product = await new Product({ ...req.fields }).save()
        res.json(product)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    try {

        const { name, description, price, category, quantity, brand } = req.fields

        switch (true) {
            case !name:
                return res.json({ error: "Name is required" })

            case !description:
                return res.json({ error: "description is required" })

            case !price:
                return res.json({ error: "price is required" })

            case !category:
                return res.json({ error: "category is required" })

            case !quantity:
                return res.json({ error: "quantity is required" })

            case !brand:
                return res.json({ error: "brand is required" })
        }

        const { productId } = req.params

        const product = await Product.findByIdAndUpdate(productId, { ...req.fields }, { new: true })
        await product.save()
        res.json(product)

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    console.log(productId)

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId)
        res.json(deletedProduct)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Server Error. Cannot delete product" })
    }

})

const getProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6
        const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {}

        const count = await Product.countDocuments({ ...keyword })
        const products = await Product.find({ ...keyword }).limit(pageSize)

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server Error" })
    }
})

const getProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Product.findById(productId)
        if (product) {
            return res.json(product)
        } else {
            res.status(404)
            throw new Error("Product not found")
        }
    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "Product not found" })
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate("category").limit(12).sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server Error" })
    }
})

const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.productId)

        if (product) {
            const alreadyReviewed = product.reviews.find(r => r.user._id.toString() === req.user._id.toString())

            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Prodcut already reviewed")
            }

            const review = {
                name: req.user.username,
                rating: +rating,
                comment,
                user: req.user._id
            }

            product.reviews.push(review)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, curr) => {
                return acc + curr.rating
            }, 0) / product.reviews.length

            await product.save()
            res.status(201).json({ message: "Review Added" })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

const fetchTopProducts = asyncHandler(async(req, res) => {
    try {
        const products = await Product.find({}).sort({rating: -1}).limit(4)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message);
    }
})

const fetchNewProducts = asyncHandler(async(req, res) => {
    try {
        const products = await Product.find({}).sort({createdAt: -1}).limit(5)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message);
    }
})

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts
}
