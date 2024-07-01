import React from 'react';
import './Footer.css';

// import TwitterIcon from '@material-ui/icons/Twitter';
// import LinkedInIcon from '@material-ui/icons/LinkedIn';
// import TelegramIcon from '@material-ui/icons/Telegram';
// import InstagramIcon from '@material-ui/icons/Instagram';

function Footer() {
    return (
        <div className='footer'>
            <div>
                <div className='footer-data'>
                    <div className="contact-details">
                        <h1>Contact Us</h1>
                        <p>Librarian</p>
                        <p>VGU</p>
                        <p>Yen Ngoc-10421115</p>
                        <p>Team 5</p>
                        <p>Vietnam</p>
                        <p><b>Email:</b>10421115@gmail.com</p>
                    </div>
                    {/* <div className='usefull-links'>
                        <h1>Usefull Links</h1>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                    </div> */}
                    <div className='librarian-details'>
                        <h1>Librarian</h1>
                        <p>Name</p>
                        <p>Education</p>
                        <p>Contact: +84 chillz</p>
                    </div>
                </div>
                {/* <div className="contact-social" >
                    <a href='#home' className='social-icon'><TwitterIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} /></a>
                    <a href='#home' className='social-icon'><LinkedInIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} /></a>
                    <a href='#home' className='social-icon'><TelegramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} /></a>
                    <a href='#home' className='social-icon'><InstagramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} /></a>
                </div> */}
            </div>
        </div>
    )
}

export default Footer