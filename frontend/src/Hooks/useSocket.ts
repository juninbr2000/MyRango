import { useEffect, useRef } from "react";
import { socket } from '../services/Socket';

export function useSocket<T = any>(event: string, callback: (data: T) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (data: T) => savedCallback.current(data);

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event]);
}