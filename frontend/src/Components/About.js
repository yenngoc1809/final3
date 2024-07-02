import React from 'react'
import './About.css'

function About() {
    return (
        <div className='about-box'>
            <h2 className="about-title">About the Library</h2>
            <div className="about-data">
                <div className="about-img">
                    <img src="https://static.vecteezy.com/system/resources/previews/008/424/172/non_2x/bookshelf-with-business-books-shelf-with-books-about-finance-marketing-management-strategy-goals-time-management-team-work-banner-for-library-book-store-illustration-in-flat-style-vector.jpg" alt="" />



                </div>

                <div>
                    <p className="about-text">
                        Libraries are vital centers of knowledge, and our university team project aims to enhance our library's accessibility and usability through a new digital platform.<br />
                        <br />
                        Our project features an online catalog that allows students and faculty to easily search for and access materials. Users can filter searches by author, title, subject, and publication date, streamlining the process of finding resources.<br />
                        <br />
                        Digital borrowing is another key aspect, enabling users to check out e-books and other digital resources from any location. This convenience supports students who may be off-campus.<br />
                        <br />
                        Your suggestions for improvement are always welcome!<br />
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
