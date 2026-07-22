import { useEffect, useState } from 'react'                 //imports two react functions, useState lets component remember a value between renders, useEffect lets component run code when it loads, ie requesting photo info from backend while loading for searching
import './App.css'                                          //include styling from app.css
import { Routes, Route, Link } from "react-router"          //imports routing components from react
import DigitalPage from "./pages/DigitalPage"
import FilmPage from "./pages/FilmPage"
import BackgroundSlideshow from "./components/BackgroundSlideshow"
import PhotoLightbox from "./components/PhotoLightbox"


type Photo = {                              //tells typescript what every photo object returned by backend should look like
    id: number
    title: string
    imagePath: string
    category: string                        //film or digital
    albumSlug: string                       //albumSlug == albumName basically, oak-island, 07-civic, etc.
    keywords: string[]
}


function App() {                            //creates main react component

     const [searchText, setSearchText] = useState("")    //typescript infers type string
     const [debouncedTerm, setDebouncedTerm] = useState('')
    const [photos, setPhotos] = useState<Photo[]>([])   //when state changes, react runs component and updates page with new info
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)


     useEffect(() => {
         const timer = setTimeout(() => {
            setDebouncedTerm(searchText)
         }, 500)

         return () => clearTimeout(timer)
     }, [searchText])                                           //runs effect whenever searchText changes, timer cancels and resets if searchText is changed in under 500ms

    useEffect(() => {
        async function loadPhotos() {                   //lets function use 'await', which pauses function until server responds, then stores response 
            try {
                const response = await fetch("/api/photos")     //sends get request to /api/photos on the backend, fetch uses GET if not method is specified

                if (!response.ok) {
                    throw new Error("Unable to load photos")
                }

                const data: Photo[] = await response.json()     //reads response from backend and converts into JS array of 'Photos'
                setPhotos(data)                                 //stores new array, runs App() again to update page with new photos
            } catch (error) {
                console.error(error)
            }
        }

        loadPhotos()                                        //actually calls the above function
    }, [])                                                  //[] is an empty dependency array to prevent effect from running after every render

    const allMatchingPhotos = debouncedTerm.trim() === ""               //uses debouncedTerm instead of searchText so array is not updated until the timer is finished
        ? []                                            //makes sure search is not empty, so can move forward with filtering photos. ? [] means value when condition is true, : ... is value when condition is false
        : photos.filter((photo) =>                  
            photo.keywords.some((keyword) =>            // checks at least one keyword matches
                keyword.toLowerCase().includes(debouncedTerm.trim().toLowerCase())
            )
        )                                         //creates new array matchingPhotos containing those whose keywords match search

    const displayedPhotos = allMatchingPhotos.slice(0, 50)
        
    return (                                        //<Routes> acts as container for routes, also React components must return the TSX it wants React to display
        <Routes>                                                                                  
            <Route
                path="/"                            //route for homepage
                element={
                    <>
                    <BackgroundSlideshow />
                    <div className="home-page-content">
                        <section id="center">
                            <div>
                                <h1>Myles Locher Photo Catalogue</h1>
                                <p className="page-description">
                                    Browse or Search Key Terms to Find a Variety of Photos Taken by Me
                                </p>
                            </div>

                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchText}
                                onChange={(event) => setSearchText(event.target.value)}             //runs wehenver input text changes, event in this case refers to <input>, takes current text and stores in searchText
                            />

                            {searchText.trim() !== "" && searchText !== debouncedTerm && (
                                <p>Searching...</p>
                            )}
                            
                            {/* This block loops through displayedPhotos and
                                displays them if debouncedTerm is not empty. */}
                            {debouncedTerm.trim() !== "" && (
                                <div className="search-results">

                                    <div className="results-counter">
                                        <p>
                                            {allMatchingPhotos.length === 0
                                                ? "Found 0 results"
                                                : allMatchingPhotos.length > 50
                                                    ? `Showing 50 of ${allMatchingPhotos.length} results`
                                                    : `Showing all ${allMatchingPhotos.length} results`
                                            }
                                        </p>
                                    </div>

                                    {/* .map() loops through displayedPhotos and
                                        creates a div containing an image for each photo. */}
                                    {displayedPhotos.map((photo) => (
                                        <div className="search-result" key={photo.id}>
                                            <img
                                                src={`/thumbnails/${photo.imagePath}`}
                                                alt={photo.title || `Photo ${photo.id}`}
                                                onClick={() => setSelectedPhoto(photo)}
                                            />
                                        </div>
                                    ))}

                                    </div>

                                )}

                                {selectedPhoto !== null && (
                                    <PhotoLightbox
                                        photo={selectedPhoto}
                                        onClose={() => setSelectedPhoto(null)}
                                    />
                                )}

                        </section>

                        <section id="browse-photos">
                            <div id="digital">
                                <Link to="/digital">                       
                                    <button type="button">
                                        Digital                               
                                    </button>
                                </Link>
                            </div>

                            <div id="film">
                                <Link to="/film">
                                    <button type="button">
                                        Film
                                    </button>
                                </Link>
                            </div>
                        </section>
                    </div>
                    </>
                }
            />
                                                                                    
            <Route path="/digital" element={<DigitalPage />} />                 
            <Route path="/film" element={<FilmPage />} />
        </Routes>
    )                                                                          //<route/> connects the url such as /digital to the DigitalPage file
}

export default App