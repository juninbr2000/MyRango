import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { UserData, loginData, UserResponse } from "../types/userTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthentication = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState(false);

  function checkIfIsCancelled() {
    if (cancelled){
      return true;
    }
  }

  const createUser = async (data: UserData): Promise<UserResponse | void> => {
    if (checkIfIsCancelled()) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const res = await axios.post<UserResponse>(
        `${API_URL}user/register`, 
        data
      )
      
      console.log(res.data)
      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      console.error(axiosError);
      
      setError(
        axiosError.response?.data?.error || axiosError.message || "Erro desconhecido"
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  const login = async (data: loginData) => {
    checkIfIsCancelled()
    
    setError(null)
    setLoading(true)
    
    try{
      const res = await axios.post(`${API_URL}user/login`, data)
      
      console.log(res.data)
      return res.data
    } catch ( err ){
      const axiosError = err as AxiosError<{ error: string }>;
      console.error(axiosError);
      
      setError(
        axiosError.response?.data?.error || axiosError.message || "Erro desconhecido"
      );
    } finally {
      setLoading(false)
    }
  }
  
  const logout = () => {
    localStorage.removeItem("user")
  }

  useEffect(() => {
    return () => setCancelled(true);
  }, []);
  
  return {
    loading,
    error,
    createUser,
    login,
    logout
  };
};