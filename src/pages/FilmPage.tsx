import { useEffect, useState } from "react"
import "./FilmPage.css"
import PhotoLightbox from "../components/PhotoLightbox"

type Photo = {
    id: number
    title: string
    imagePath: string
    category: string
    albumSlug: string
    keywords: string[]
}

function FilmPage() {
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
                photo.category === "film" &&
                photo.albumSlug === selectedAlbumSlug
        )
        : []

    return (
        <main className="film-page">
            <h1>Film Photos</h1>

            {selectedAlbum === null && (
                <div className="album-list">
                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("Fujifilm")}
                    >
                        Fujifilm
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("Portra 400")}
                    >
                        Portra 400
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("Colorplus 200")}
                    >
                        Colorplus 200
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedAlbum("Cinestill 800T")}
                    >
                        Cinestill 800T
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
                                    onClick={() => setSelectedPhoto(photo)}
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

export default FilmPage