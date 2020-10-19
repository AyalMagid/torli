import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion'
import './SignupOrLogin.scss';
import { Link } from 'react-router-dom'



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


export function SignupOrLogin(props) {





    return (
        <motion.div
            className="motion-div"
            initial="out"
            exit="in"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
        >
            <main className="signup-or-login-container flex align-center justify-center column">
                <div className="square top-square">
                    <Link className="signUp-link flex align-center justify-center " to="/signup">
                       <div>הרשמ/י</div> 
            </Link>
                </div>
                <div className="square bottom-square">
                    <Link className="login-link flex align-center justify-center" to="/login">
                       <div>התחבר/י</div> 
            </Link>
                </div>
            </main>
        </motion.div>
    );
}
