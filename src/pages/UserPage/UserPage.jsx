import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { motion } from 'framer-motion'
import './UserPage.scss';

// motion div style
const pageVariants={
    in:{
        opacity: 1 ,
        x:0,
        textAlign: 'center'
    },
    out:{
        opacity: 0,
        x:"50%"
    }
}

const pageTransition={
    duration:0.5,
    type:"spring",
    stiffness:50
}



export function _UserPage(props) {


    return (
       <>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
                style={{width:"100%"}}
            >
               <main>
                 user page
               </main>
            </motion.div>
        </>
    );
}

function mapStateProps(state) {
    return {
      
    }
}

const mapDispatchToProps = {
 
}

export const UserPage = connect(mapStateProps, mapDispatchToProps)(_UserPage)
