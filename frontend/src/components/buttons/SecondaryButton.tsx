import {ReactNode} from 'react'


export const SecondaryButton =({children,onClick, size= 'small'}:{
    children: ReactNode,
    onClick: ()=> void,
    size?: "big"| "small"
})=>{
    return <div onClick={onClick} className={`${size === "small"? "text-sm" : "text-xl"}
       ${size === "small" ? "px-8 py-2" : "px-10 py-3"} cursor-pointer hover:shadow-lg  bg-purple-700 text-white rounded-full text-center justify-center flex-col`}>
            {children}
        </div>
    }