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
                productsCount:action.payload.count,
                resultPerPage:Number(action.payload.resultPerPage)
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        }
    }
})

export const { productsRequest, productsSuccess, productsFail } = productsSlice.actions
export default productsSlice.reducer
