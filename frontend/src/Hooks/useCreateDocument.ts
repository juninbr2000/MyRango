import axios, { AxiosError } from "axios"
import { useState } from "react"


const URL = import.meta.env.VITE_API_URL

export const useCreateDocument = (doc: string, token: string) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    const createDoc = async (data: any) => {
        setError(null)
        setLoading(true)

        try{
            const res = await axios.post(`${URL}${doc}`, data, {headers: {Authorization: token}})

            return res
        } catch (err){
            const axiosError = err as AxiosError<{ error: string }>;
            console.error(err);
            setError(
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Erro desconhecido"
            );
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        createDoc
    }
}