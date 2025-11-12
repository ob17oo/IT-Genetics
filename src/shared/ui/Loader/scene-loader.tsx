import { useEffect, useState } from "react"

export default function SceneLoader(){
    const [showLoader, setShowLoader] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
        setShowLoader(false)
        
        }, 5000)
        return () => clearTimeout(timer)
    }, [])
    if(!showLoader) return null
    return( 
        <section className="absolute z-50 inset-0 bg-gray-900 w-screen h-screen">
            <section className="h-full flex flex-col justify-center items-center gap-6 bg-gray-900">
                <section>
                    <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
                    <span className="text-lg text-yellow-500">Идет загрузка игры...</span>
                </section>
                <section className="w-[50%] h-2 rounded-full bg-gray-700 mx-auto overflow-hidden">
                    <section className="h-full bg-yellow-500 animate-pulse"></section>
                </section>
            </section>
        </section>
    )
}