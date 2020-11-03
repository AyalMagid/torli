export default {
    getMotionStyle
}

// textAlign: 'center'

function getMotionStyle(style) {
    // style motion div
    const pageVariants = {
        in: {
            opacity: 1,
            x: "0"
        },
        out: {
            opacity: 0,
            x: "50%"
        }
    }
    const pageVariantsWithTextAlign = {
        in: {
            opacity: 1,
            x: "0",
            textAlign: 'center'
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
    if (style === 'pageVariants') return pageVariants
    else if(style === 'pageTransition') return pageTransition
    else return pageVariantsWithTextAlign
}