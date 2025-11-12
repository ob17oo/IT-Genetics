'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SettingPage(){
    const router = useRouter()
    return(
        <section className="w-[90%] mx-auto mt-3 flex flex-col gap-6">
            <section>
                <button type="button" onClick={() => router.push('/')} className="text-yellow-500 flex items-center cursor-pointer">
                    <Image src="/static/arrow-left.svg" alt="backArrow" width={24} height={24} />
                    Назад
                </button>
            </section>
            <section>
                <h2 className="text-yellow-500 text-lg">Пока что нечего настраивать</h2>
            </section>
        </section>
    )
}