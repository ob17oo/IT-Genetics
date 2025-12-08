"use client";
import { useProgress } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";

export default function SceneLoader() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(false);
  const hasShownRef = useRef(false);
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Когда загрузка начинается впервые
    if (active && !hasShownRef.current) {
      hasShownRef.current = true;
      setIsVisible(true);
    }

    // Когда загрузка завершена
    if (!active && progress === 100 && hasShownRef.current) {
      // Очищаем предыдущий таймер, если есть
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }

      // Небольшая задержка для плавного скрытия
      completionTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        hasShownRef.current = false;
      }, 300);
    }

    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
    };
  }, [active, progress]);

  // Не показываем лоадер, если он уже был показан и завершен
  if (!isVisible) {
    return null;
  }

  return (
    <section className="absolute z-50 inset-0 bg-gray-900">
      <div className="h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
        <span className="text-lg text-yellow-500">
          Загрузка: {Math.round(progress)}%
        </span>
        <div className="w-[50%] h-2 rounded-full bg-gray-700 overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
