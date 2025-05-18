import Navbar from "@/components/shared/Navbar";
import { TReactChildrenType } from "@/types/types";


const CommonLayout = ({children}:TReactChildrenType) => {
    return (
        <>
       <Navbar/>
        {children} 
        </>
    )
}

export default CommonLayout;