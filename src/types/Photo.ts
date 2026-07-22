export type Photo = {
    id: number
    title: string
    image: string
    category: "digital" | "film"
    keywords: string[]
}