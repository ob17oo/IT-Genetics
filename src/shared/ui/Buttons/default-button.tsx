
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode,
}

export default function DefaultButton({children , ...props}: ButtonProps){
    return (
        <button {...props} className="w-[25vw] flex items-center gap-2 justify-center bg-transparent border border-yellow-500/30 text-yellow-200 text-xl py-6 rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:border-yellow-400/50">
            {children}
        </button>
    )
}