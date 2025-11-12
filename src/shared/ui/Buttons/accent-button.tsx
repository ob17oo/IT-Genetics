interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function AccentButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-[25vw] flex items-center justify-center gap-2 text-white text-xl py-6 rounded-2xl bg-yellow-500 transition-all duration-300 ease-in-out hover:scale-105"
    >
      {children}
    </button>
  );
}
