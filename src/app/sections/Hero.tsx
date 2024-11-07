'use client';

import React from 'react';
import './hero.css';
import HeroBtn from '../components/HeroBtn';

export default function Hero() {
    return (
        <section id="hero" className="d-flex align-items-center">
            <div
                className="container position-relative text-center text-lg-start"
                data-aos="zoom-in"
                data-aos-delay="100"
            >
                <div className="row">
                    <div className="col-lg-8">
                        <h1>Welcome to TimeLock</h1>
                        <h2>Moment Frozen in time</h2>
                        <div className="btns">
                            <HeroBtn name="Seal your memory" target="/login"/>
                        </div>
                    </div>
                    <div
                        className="col-lg-4 d-flex align-items-center justify-content-center position-relative"
                        data-aos="zoom-in"
                        data-aos-delays="200"
                    >  

                    </div>
                </div>
            </div>
        </section>
    );
}
