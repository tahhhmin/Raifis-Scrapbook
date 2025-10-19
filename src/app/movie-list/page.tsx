import React from 'react'
import styles from './page.module.css'
import MovieList from '@/components/MovieList'

export default function page() {
    return (
        <main>
            <h1>Movie List</h1>
            <MovieList />
        </main>
    )
}