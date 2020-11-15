import React from "react";
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import './SignupOrLogin.scss';
import { Link } from 'react-router-dom'

export function SignupOrLogin(props) {
    return (
        <main className="signup-or-login-container flex align-center column">
        <motion.div
            className="motion-div"
            initial="out"
            exit="in"
            animate="in"
            variants={MotionService.getMotionStyle('pageVariants')}
            transition={MotionService.getMotionStyle('pageTransition')}
            style={{ width: "100%", height: "100%" }}
       >
          
                <div className="square top-square">
                    <Link className="signUp-link-in-sign-up-or-login flex align-center justify-center column" to="/signup">
                       <div className="signup-or-login-text">הרשמ/י</div> 
                       <i class="fas fa-user-edit"></i>
            </Link>
                </div>
                <div className="square bottom-square">
                    <Link className="login-link-in-sign-up-or-login flex align-center justify-center column" to="/login">
                       <div className="signup-or-login-text">התחבר/י</div> 
                       <i class="fas fa-sign-in-alt"></i>
            </Link>
                </div>
        </motion.div>
            </main>
    );
}
