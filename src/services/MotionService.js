export default {
    getMotionStyle
}

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

    const pageTransition = {
        duration: 0.5,
        type: "spring",
        stiffness: 50
    }
    if (style === 'pageVariants') return pageVariants
    else return pageTransition
}