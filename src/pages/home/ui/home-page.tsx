'use client'
import AccentButton from "@/shared/ui/Buttons/accent-button";
import DefaultButton from "@/shared/ui/Buttons/default-button";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function HomePage() {
    const router = useRouter()
    return (
        <section className="min-w-screen min-h-screen flex flex-col gap-6 items-center justify-center">
            <section className="flex flex-col gap-3 items-center">
                <section className="flex items-center justify-center p-5 bg-yellow-500 rounded-2xl">
                    <Image src="/static/logotype.svg" alt="logotype" width={36} height={36}/>
                </section>
                <section className="flex flex-col gap-2 items-center">
                    <h1 className="text-white text-2xl">IT Genetics</h1>
                    <span className="text-white/50 w-[30vw] text-left">IT Genetics — собери своего идеального разработчика!</span>
                </section>
            </section>
            <section className="flex flex-col gap-3">
                <AccentButton  type="button" onClick={() => router.push('/game')}>
                    <Image src="static/Play.svg" alt="Play" width={26} height={26} /> 
                    Играть
                </AccentButton>
                <DefaultButton  type="button" onClick={() => router.push('/setting')}>
                    <Image src="static/Setting.svg" alt="Setting" width={24} height={24} />
                    Настройки
                </DefaultButton>
                <DefaultButton  type="button" onClick={() => router.push("/about")}>
                    <Image src="static/Info.svg" alt="Info" width={24} height={24} />
                    O нас
                </DefaultButton>
            </section>
    </section>
  );
}