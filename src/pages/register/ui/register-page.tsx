'use client'

import { SkillsType } from "@/shared/types/userType"
import DefaultInput from "@/shared/ui/Input/default-input"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"

export default function RegisterPage(){
    const { register } = useAuthStore()
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        surName: '',
        level: 'Стажер',
        dreamLevel: 'Team Lead',
        dream: '',
        specialization: 'FrontEnd'
    })

    const defaultSkills: SkillsType[] = [
        {
            type: 'Hard',
            name: 'JavaScript',
            level: 1
        } ,
        {
            type: 'Hard',
            name: 'HTML',
            level: 1
        } ,
        {
            type: 'Hard',
            name: 'CSS',
            level: 1
        } ,
        {
            type: 'Soft',
            name: 'Общительность',
            level: 1
        } ,
        {
            type: 'Soft',
            name: 'Упорство',
            level: 1
        }
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        register({
          ...formData,
          skills: defaultSkills
        });
        router.push('/login')
    }


    return (
      <section className="w-[90%] mx-auto py-6">
        <section className="w-[30%] mx-auto flex flex-col gap-6">
          <section className="">
            <h2 className="text-yellow-500 text-2xl">IT Genetics</h2>
          </section>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <section className="flex flex-col gap-3 w-full">
              <DefaultInput
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
                placeholder="Введите имя *"
              />
              <DefaultInput
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, surName: e.target.value })
                }
                value={formData.surName}
                placeholder="Введите фамилию *"
              />
            </section>
            <section className="w-full flex flex-col gap-3 border border-yellow-500/30 rounded-3xl p-6">
              <label className="text-yellow-200 text-lg">
                Ваша специализация *
              </label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                value={formData.specialization}
                className="w-full text-yellow-500 text-lg focus:outline-0"
              >
                <option className="text-yellow-500 text-lg" value="FrontEnd">
                  FrontEnd
                </option>
                <option className="text-yellow-500 text-lg" value="BackEnd">
                  BackEnd
                </option>
                <option className="text-yellow-500 text-lg" value="Design">
                  Design
                </option>
                <option className="text-yellow-500 text-lg" value="DevOps">
                  DevOps
                </option>
                <option className="text-yellow-500 text-lg" value="HR">
                  HR
                </option>
              </select>
            </section>
            <section className="flex flex-col gap-3 w-full">
              <label className="text-yellow-500 text-lg">
                Укажите вашу цель в IT
              </label>
              <textarea
                onChange={(e) =>
                  setFormData({ ...formData, dream: e.target.value })
                }
                value={formData.dream}
                className="border border-yellow-500/30 rounded-3xl text-yellow-200 p-3 w-full"
                rows={4}
                placeholder="Опишите цель..."
              />
            </section>
            <section className="flex gap-3">
              <section className="border border-yellow-500/30 rounded-3xl p-3 flex flex-col gap-3">
                <label className="text-yellow-200 text-lg">
                  Укажите ваш текущий грейд
                </label>
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  value={formData.level}
                  className="w-full text-yellow-500 text-lg focus:outline-0"
                >
                  <option value="Стажер">Стажер</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </section>
              <section className="border border-yellow-500/30 rounded-3xl p-3 flex flex-col gap-3">
                <label className="text-yellow-200 text-lg">
                  Укажите желаемый грейд
                </label>
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, dreamLevel: e.target.value })
                  }
                  value={formData.dreamLevel}
                  className="w-full text-yellow-500 text-lg focus:outline-0"
                >
                  <option value="Стажер">Стажер</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </section>
            </section>
            <section className="flex gap-3">
              <button
                className="w-full h-[60px] bg-yellow-500 text-yellow-200 text-lg rounded-3xl transition-all duration-300 ease-in-out hover:scale-105"
                type="submit"
              >
                Зарегистироваться
              </button>
            </section>
          </form>
        </section>
      </section>
    );
}