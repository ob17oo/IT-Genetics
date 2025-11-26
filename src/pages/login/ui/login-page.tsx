"use client";
import DefaultInput from "@/shared/ui/Input/default-input";
import { useAuthStore } from "@/widgets/store/auth-store";
import { useMissionStore } from '@/widgets/store/mission-store'
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

export default function LoginPage() {
  const { login } = useAuthStore();
  const  { resetCookie } = useMissionStore()
  const router = useRouter();
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: "",
    surName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    if (formData.name.trim() && formData.surName.trim()) {
      login(formData.name, formData.surName);
    }
    
    try {
      login(formData.name, formData.surName); // ← Только имя и фамилия
      router.push("/game");
      resetCookie()
      
    } catch (err) {
      if(err instanceof Error){
        setError(err.message)
      } else {
        setError('Произошла ошибка')
      }
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[30%] flex flex-col items-center gap-6 p-6 border border-yellow-500/30 rounded-3xl"
      >
        <section className="flex items-center gap-3">
          <section className="relative w-[70px] h-[70px] bg-yellow-500 rounded-2xl flex items-center justify-center ">
            <Image
              src="static/logotype.svg"
              alt="logotype"
              width={36}
              height={36}
            />
          </section>
          <h2 className="text-lg text-yellow-500">
            Добро пожаловать в IT Generics
          </h2>
        </section>
        <section className="flex flex-col gap-3 w-full">
          <DefaultInput
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            value={formData.name}
            placeholder="Введите имя"
          />
          <DefaultInput
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, surName: e.target.value })
            }
            value={formData.surName}
            placeholder="Введите фамилию"
          />
        </section>
        <section className="w-full flex flex-col gap-3">
          <button
            type="submit"
            className="text-yellow-200 text-lg bg-yellow-500 rounded-3xl h-[60px] w-full transition-all duration-300 ease-in-out hover:scale-105 "
          >
            Войти
          </button>
          <button
            onClick={() => router.push("/register")}
            type="button"
            className="text-yellow-200 text-lg border border-yellow-500/30 rounded-3xl h-[60px] w-full transition-all duration-300 ease-in-out hover:scale-105"
          >
            Зарегистироваться
          </button>
        </section>
      </form>
    </section>
  );
}
