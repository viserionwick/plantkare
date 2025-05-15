"use client"

const LOADING: React.FC = () => {
    return (
        <div className="p-Home--statusSection--loading skeletonLoading c-Section">
            <span className="number" />
            <span className="text" />
        </div>
    )
}

export default LOADING;