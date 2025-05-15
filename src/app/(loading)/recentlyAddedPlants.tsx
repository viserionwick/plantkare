"use client"

const LOADING: React.FC = () => {
    return (
        <div className="p-Home--recentPlants__list--loading skeletonLoading">
            <div className="cards">
                <span className="card" />
                <span className="card" />
                <span className="card" />
            </div>
            <span className="button" />
        </div>
    )
}

export default LOADING;