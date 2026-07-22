import { useEffect, useState } from "react"
import "./DigitalPage.css"
import PhotoLightbox from "../components/PhotoLightbox"

type Photo = {
    id: number
    title: string
    imagePath: string
    category: string
    albumSlug: string
    keywords: string[]
}

function DigitalPage() {
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

    useEffect(() => {
        async function loadPhotos() {
            try {
                const response = await fetch("/api/photos")

                if (!response.ok) {
                    throw new Error("Unable to load photos")
                }

                const data: Photo[] = await response.json()
                setPhotos(data)
            } catch (error) {
                console.error(error)
            }
        }

        loadPhotos()
    }, [])

    const selectedAlbumSlug = selectedAlbum
        ?.toLowerCase()                                 
        .replace(/\s+/g, "-")                               //turns selected album name lowercase and replaces spaces with hyphens if not null/undefined

    const albumPhotos = selectedAlbum
        ? photos.filter(
            (photo) =>
                photo.category === "digital" &&
                photo.albumSlug === selectedAlbumSlug
        )
        : []

    return (
        <main className="digital-page">
            <h1>Digital Photos</h1>

            {selectedAlbum === null && (
                <div className="album-list">
                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("Oak Island")}
                    >
                        Oak Island
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("07 Civic")}
                    >
                        07 Civic
                    </button>
                </div>
            )}

            {selectedAlbum !== null && (
                <>
                    <button
                        type="button"
                        onClick={() => setSelectedAlbum(null)}
                    >
                        Back to Albums
                    </button>

                    <h2>{selectedAlbum}</h2>

                    <div className="photo-grid">
                        {albumPhotos.map((photo) => (
                            <div className="photo-card" key={photo.id}>
                                <img
                                    src={`/thumbnails/${photo.imagePath}`}
                                    alt={
                                        photo.title ||
                                        `${selectedAlbum} photo ${photo.id}`
                                    }
                                    onClick={() => setSelectedPhoto(photo) }
                                />
                            </div>
                        ))}
                    </div>

                    {selectedPhoto !== null && (
                        <PhotoLightbox
                            photo={selectedPhoto}
                            onClose={() => setSelectedPhoto(null)}
                        />
                    )}

                </>
            )}
        </main>
    )
}

export default DigitalPage