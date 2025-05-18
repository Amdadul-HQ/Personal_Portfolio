import Navbar from "@/components/shared/Navbar";
import { TReactChildrenType } from "@/types/types";


const CommonLayout = ({children}:TReactChildrenType) => {
    return (
        <>
       <header>
       <Navbar/>
       </header>
            {children}
            <footer>
        {/* <Footer/> */}
        </footer>   
        </>
    )
}

export default CommonLayout;