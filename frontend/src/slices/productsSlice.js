import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false
    },
    reducers: {
        productsRequest(state, action) {
            return {
                loading: true
            }
        },
        productsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.count,
                resultPerPage: Number(action.payload.resultPerPage)
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        AdminProductsRequest(state, action) {
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products
            }
        },
        adminProductsFail(state, action) {
            return {
                loading: false,
                error: action.payload
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

export const { productsRequest,
    productsSuccess,
    productsFail,
    AdminProductsRequest,
    adminProductsSuccess,
    adminProductsFail,
    clearError } = productsSlice.actions
export default productsSlice.reducer
