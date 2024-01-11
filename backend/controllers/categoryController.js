import Category from "../models/categoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.json({ error: "Name is required" })
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.json({ error: "Already exists" })
        }
        const category = await new Category({ name }).save()
        res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body
        const { categoryId } = req.params

        const category = await Category.findOne({ _id: categoryId })
        if (!category) {
            return res.status(404).json({ "error": "Category not found" })
        }

        category.name = name
        const updatedCategory = await category.save()
        res.json(updatedCategory)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params

    try {
        const deletedCategory = await Category.findByIdAndDelete({ _id: categoryId })
        return res.json({ deletedCategory })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Server Error. Cannot delete category" })
    }

})

const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({})
        return res.json(categories)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    try {
        // const category = await Category.findOne({ _id: categoryId })
        // return res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
})

export { createCategory, updateCategory, deleteCategory, getCategories, getCategory }