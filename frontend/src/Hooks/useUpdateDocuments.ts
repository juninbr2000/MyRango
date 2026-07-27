import { useEffect, useReducer, useState } from "react";
import type { Address } from "../types/AddressTypes";
import axios from "axios";

interface updateState {
  loading: boolean | null
  error: string | null
}

type updateAction =
  | { type: "LOADING" }
  | { type: "UPDATED_DOC"; payload: Address }
  | { type: "ERROR"; payload: string }


const initialState = {
  loading: null,
  error: null,
};

const updateReducer = (state: updateState, action: updateAction) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const URL = import.meta.env.VITE_API_URL

export const useUpdateDocument = (docCollection: string, token: string) => {
  const [response, dispatch] = useReducer(updateReducer, initialState);
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action: updateAction) => {
    if (!cancelled) dispatch(action);
  };

  const updateDocument = async (id: string, data: any) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const res = await axios.put(`${URL}${docCollection}/${id}`, data, {headers: {Authorization: token}} )

      return res
    } catch (error: any) {
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
      throw error
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, response };
};