import React from "react";
import { motion } from 'framer-motion'

const pageVariants = {
    in: {
        opacity: 1,
        x: 0
    },
    out: {
        opacity: 0,
        x: "50%"
    }
}

const pageTransition = {
    duration: 0.5,
    type: "spring",
    stiffness: 50
}

// export function Motion(props) {
//     return (
//         <motion.div
//             initial="out"
//             exit="in"
//             animate="in"
//             variants={pageVariants}
//             transition={pageTransition}
//             style={{ textAlign: 'center', width: '100%', height: '100%' }}
//      >
//          {props.htmlToRender}
//      </motion.div>
//     )
// }

export const Motion = () => (
    <motion.div
        initial="out"
        exit="in"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        style={{ textAlign: 'center', width: '100%', height: '100%' }}
    />
)