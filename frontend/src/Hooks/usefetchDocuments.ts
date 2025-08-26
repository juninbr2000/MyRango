import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"


const URL = import.meta.env.VITE_API_URL

export const useFetchDocuments = <T>(doc: string, uid?: string, token?: string) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [document, setDocument] = useState<T | null>(null)

    useEffect(() => {

        async function loadData() {
            
            setLoading(true)

            try{
                const config = token ? {headers: {Authorization: token}} : {} 
                const url = uid ? `${URL}${doc}/${uid}` : `${URL}${doc}/`

                const resp = await axios.get(url, config)

                setDocument(resp.data)
                console.log(resp.data)

            } catch (err) {
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

        loadData()
    }, [doc, uid, token])

    return {
        loading,
        error,
        document,
    }
}