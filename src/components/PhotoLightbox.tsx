import "./PhotoLightbox.css"

type PhotoForLightbox = {
    id: number
    title: string
    imagePath: string
}

type PhotoLightboxProps = {
    photo: PhotoForLightbox
    onClose: () => void
}

function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
    return (
        <div className="photo-lightbox" onClick={onClose}>
            <button
                className="lightbox-close"
                type="button"
                onClick={onClose}
            >
                ×
            </button>

            <img
                className="lightbox-image"
                src={`/photos/${photo.imagePath}`}
                alt={photo.title || `Photo ${photo.id}`}
                onClick={(event) => event.stopPropagation()}
            />
        </div>
    )
}

export default PhotoLightbox