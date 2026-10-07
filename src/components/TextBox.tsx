// React
import { useEffect, useState } from "react";

// global state
import { useAtom, useAtomValue } from "jotai";
import { isTextBoxVisibleAtom, textBoxContentAtom } from "../store";

// import framer-motion
import { motion, scale } from "framer-motion";

// import css
import "./textbox.css";

const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.5 },
}

export default function TextBox() {
    const [ isVisible, setIsVisible ] = useAtom(isTextBoxVisibleAtom);
    const [isCloseRequest, setIsCloseRequest] = useState(false);
    const content = useAtomValue(textBoxContentAtom);
    
    const handleAnimationComplete = () => {
        if (isCloseRequest){
            setIsVisible(false);
            setIsCloseRequest(false);
        }
    }

    useEffect(() => {
        const closeHandler = (e: KeyboardEvent) => {
            if (!isVisible) return; // !false == true => action nothing 
            
            if (e.code === "Space") {
                setIsCloseRequest(true);
            }
        };

        window.addEventListener("keydown", closeHandler);

        return () => {
            window.removeEventListener("keydown", closeHandler);
        } // clean
    }, [isVisible]) // check de change state isVisible run above

    return (
        isVisible && (
            <motion.div 
                className="text-box"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={ isCloseRequest ? "closed" : "open" }
                variants={variants}
                transition={{ duration: 0.2 }}
                onAnimationComplete={ handleAnimationComplete }
            >
                <p>{content}</p>
            </motion.div>
        )
    )
}