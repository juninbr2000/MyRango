import axios, { AxiosError } from "axios"
import { useState } from "react"

const URL = import.meta.env.VITE_API_URL

export const useDeleteDocuments = (doc: string, token?: string) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null| string>(null)

    const delectDoc = async (id: string) => {
        setError(null)
        setLoading(true)

        try{
            const res = await axios.delete(`${URL}${doc}/${id}`, {headers: {Authorization: token}})

            console.log(res)
        } catch (error) {
            const axiosError = error as AxiosError<{ error: string }>;
            console.error(error);
            setError(
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Erro desconhecido"
            );
        }
        finally{
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        delectDoc
    }

}