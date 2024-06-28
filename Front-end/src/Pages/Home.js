import React from 'react'

import About from '../Components/About.js'
import Footer from '../Components/Footer.js'
import ImageSlider from '../Components/ImageSlider.js'
import RecommendedBooks from '../Components/RecommendedBooks.js'
import RecentAddedBooks from '../Components/RecentAddedBooks.js'
import ReservedBooks from '../Components/ReservedBooks.js'
import Stats from '../Components/Stats.js'

function Home() {
    return (
        <div id='home'>
            <About />
            <ImageSlider />
            <Stats />
            <RecentAddedBooks />
            <RecommendedBooks />
            <ReservedBooks />
            <Footer />
        </div>
    )
}

export default Home
