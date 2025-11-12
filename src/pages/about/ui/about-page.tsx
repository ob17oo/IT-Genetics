'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AboutPage(){
    const router = useRouter()
    return(
        <section className="w-[90%] mx-auto flex flex-col gap-6 mt-3">
            <section>
                <button type="button" onClick={() => router.push('/')} className="text-yellow-500 flex items-center cursor-pointer">
                    <Image src="/static/arrow-left.svg" alt="backArrow" width={24} height={24} />
                    Назад
                </button>
            </section>
            <section className="flex flex-col gap-3 items-center">
                <section className="flex items-center justify-center p-5 bg-yellow-500 rounded-2xl">
                    <Image src="/static/logotype.svg" alt="logotype" width={36} height={36}/>
                </section>
                <section className="flex flex-col gap-2 items-center">
                    <h1 className="text-white text-2xl">IT Genetics</h1>
                    <span className="text-white/50 w-[30vw] text-left">IT Genetics — собери своего идеального разработчика!</span>
                </section>
             </section>
             <section className="w-full grid grid-cols-2 gap-6">
                <section className="flex flex-col items-start gap-3 p-6 bg-transparent rounded-3xl border border-yellow-500/30 transition-all duration-300 ease-in-out hover:scale-105">
                    <section className="flex items-center justify-center p-4 bg-yellow-500 rounded-3xl">
                        <Image width={36} height={36} src="/static/Target.svg" alt="Target" />
                    </section>
                    <h2 className="text-yellow-200 text-[18px]">Цель игры</h2>
                    <p className="text-[14px] text-yellow-300/70">Собирайте элементы разработчика: Hard Skills, Soft Skills и черты личности, чтобы создавать специалистов различных IT-направлений.</p>
                </section>
                <section className="flex flex-col items-start gap-3 p-6 bg-transparent rounded-3xl border border-yellow-500/30 transition-all duration-300 ease-in-out hover:scale-105">
                    <section className="flex items-center justify-center p-4 bg-yellow-500 rounded-3xl">
                        <Image width={36} height={36} src="/static/Stairs.svg" alt="Stairs" />
                    </section>
                    <h2 className="text-yellow-200 text-[18px]">Развитие</h2>
                    <p className="text-[14px] text-yellow-300/70">Начните как интерн и пройдите путь до опытного специалиста, открывая новые уровни и возможности на каждом этапе.</p>
                </section>
                <section className="flex flex-col items-start gap-3 p-6 bg-transparent rounded-3xl border border-yellow-500/30 transition-all duration-300 ease-in-out hover:scale-105">
                    <section className="flex items-center justify-center p-4 bg-yellow-500 rounded-3xl">
                        <Image width={36} height={36} src="/static/Profile.svg" alt="Profile" />
                    </section>
                    <h2 className="text-yellow-200 text-[18px]">Специализация</h2>
                    <p className="text-[14px] text-yellow-300/70">Создавайте веб-разработчиков, мобильных разработчиков, DevOps инженеров и других специалистов IT-индустрии.</p>
                </section>
                <section className="flex flex-col items-start gap-3 p-6 bg-transparent rounded-3xl border border-yellow-500/30 transition-all duration-300 ease-in-out hover:scale-105">
                    <section className="flex items-center justify-center p-4 bg-yellow-500 rounded-3xl">
                        <Image width={36} height={36} src="/static/DNA.svg" alt="DNA" />
                    </section>
                    <h2 className="text-yellow-200 text-[18px]">Крафтинг</h2>
                    <p className="text-[14px] text-yellow-300/70">Каждый специалист требует уникального набора навыков и качеств. Собирайте правильные комбинации для создания идеального работника.</p>
                </section>
             </section>
             <section className="border border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105">
                <p className="text-lg text-yellow-300/70"><span className="text-yellow-200">IT GENETICS</span> — инновационный симулятор карьерного роста в IT. Анализируйте компоненты успешного разработчика, экспериментируйте со skill-сетами и изучайте реальные карьерные траектории. 
                    Обучение через геймификацию для будущих IT-специалистов.</p>
             </section>
        </section>
    )
}