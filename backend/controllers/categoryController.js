import HttpStatus from "../enums/httpsStatus.js";
import categoryRepository from "../repositories/categoryRepository.js";

const addCategory = async (req, res) => {
    try {
        const category = req.body;
        const result = await categoryRepository.addCategory(category);

        if (result) {
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Category added successfully",
                data: result
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Failed to add category"
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error adding category"
        });
    }
}

const  getAllCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.getAllCategories();
        res.status(HttpStatus.OK).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving categories"
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await categoryRepository.deleteCategory(categoryId);

        if (result) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Category deleted successfully",
                data: result
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Failed to delete category"
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error deleting category"
        });
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = req.body;
        const result = await categoryRepository.updateCategory(categoryId, category);

        if (result) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Category updated successfully",
                data: result
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Failed to update category"
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating category"
        });
    }
}

export default {
    addCategory, getAllCategories, deleteCategory, updateCategory
};