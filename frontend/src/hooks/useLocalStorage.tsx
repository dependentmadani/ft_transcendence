import { useEffect, useState } from "react"

const PREFIX = 'YO'

export const useLocalStorage(key, initialValue): any {
    const prefixedkey = PREFIX + key
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedkey)
        if (jsonValue)
            return JSON.parse(jsonValue)
        if (typeof(initialValue) === 'function')
            return initialValue()
        else
            return initialValue
    })

    useEffect(() => {
        localStorage.setItem(prefixedkey, JSON.stringify(value))
    }, [prefixedkey, value])

    return (
        [value, setValue]
    )
}
