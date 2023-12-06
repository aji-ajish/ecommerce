import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        product: {},
        isReviewSubmitted: false,
        isProductCreated: false,
    },
    reducers: {
        productRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        productSuccess(state, action) {
            return {
                ...state,
                loading: false,
                product: action.payload.product
            }
        },
        productFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        createReviewRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        createReviewSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isReviewSubmitted: true
            }
        },
        createReviewFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearReviewSubmitted(state, action) {
            return {
                ...state,
                isReviewSubmitted: false
            }
        },
        newProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        newProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductCreated: true
            }
        },
        newProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
                isProductCreated: false
            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false
            }
        },
        clearProduct(state, action) {
            return {
                ...state,
                product: {}
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        }
    }
})

export const { productRequest,
    productSuccess,
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    clearReviewSubmitted,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    clearProductCreated,
    clearProduct,
    clearError } = productSlice.actions
export default productSlice.reducer
