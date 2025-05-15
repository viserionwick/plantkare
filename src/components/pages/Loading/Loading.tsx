"use client"

type PROPS = {
    style?: any;
}

const LOADING: React.FC<PROPS> = ({ style }) => {
    return (
        <div className="skeletonLoading skeleton" style={style} />
    )
}

export default LOADING;