import { useState } from 'react';
const useLoading = (initialValue: boolean = false) => {

  const [loading, setLoading] = useState(initialValue)

  const startLoading = () => {
    setLoading(true)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  const withLoading = (func: Function) => {
    return async (args: any) => {
      try {
        setLoading(true)
        await func(args)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
  }

  return { loading, startLoading, stopLoading, withLoading };

}

export default useLoading;
