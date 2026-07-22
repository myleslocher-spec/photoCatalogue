import { useEffect, useState } from "react"
import "./BackgroundSlideshow.css"

const backgroundImages = [
    "/photos/home-backgrounds/background (1).jpg",
    "/photos/home-backgrounds/background (2).jpg",
    "/photos/home-backgrounds/background (3).jpg",
    "/photos/home-backgrounds/background (4).jpg",
    "/photos/home-backgrounds/background (5).jpg",
    "/photos/home-backgrounds/background (7).jpg",
    "/photos/home-backgrounds/background (8).jpg"
]

function BackgroundSlideshow() {
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((currentIndex) =>
                (currentIndex + 1) % backgroundImages.length
            )
        }, 6000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div
            className="background-slideshow"
            aria-hidden="true"
        >
            {backgroundImages.map((imagePath, index) => (
                <div
                    key={imagePath}
                    className={
                        index === activeIndex
                            ? "background-slide active"
                            : "background-slide"
                    }
                    style={{
                        backgroundImage: `url("${imagePath}")`
                    }}
                />
            ))}
        </div>
    )
}

export default BackgroundSlideshow