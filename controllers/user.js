import { json } from "express"



export const getUsers =(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500),json({
            message:"faild to get users"
        })
    }
}
export const updateUser =(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500),json({
            message:"faild to upadte user"
        })
    }
}
export const deleteUser =(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500),json({
            message:"faild to delete user"
        })
    }
}
