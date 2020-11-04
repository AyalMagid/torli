import React from "react";
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import './SignupOrLogin.scss';
import { Link } from 'react-router-dom'

export function SignupOrLogin(props) {
    return (
        <motion.div
            className="motion-div"
            initial="out"
            exit="in"
            animate="in"
            variants={MotionService.getMotionStyle('pageVariants')}
            transition={MotionService.getMotionStyle('pageTransition')}
        >
            <main className="signup-or-login-container flex align-center justify-center column">
                <div className="square top-square">
                    <Link className="signUp-link flex align-center justify-center column" to="/signup">
                       <div className="signup-or-login-text">הרשמ/י</div> 
                       <i class="fas fa-user-edit"></i>
            </Link>
                </div>
                <div className="square bottom-square">
                    <Link className="login-link flex align-center justify-center column" to="/login">
                       <div className="signup-or-login-text">התחבר/י</div> 
                       <i class="fas fa-sign-in-alt"></i>
            </Link>
                </div>
            </main>
        </motion.div>
    );
}
