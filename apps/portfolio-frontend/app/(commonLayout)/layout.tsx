import Navbar from "@/components/shared/Navbar";
import AiChat from "@/components/common/aiChat";
import { TReactChildrenType } from "@/types/types";


const CommonLayout = ({children}:TReactChildrenType) => {
    return (
        <>
       <Navbar/>
        {children}
        <AiChat/>
        </>
    )
}

export default CommonLayout;