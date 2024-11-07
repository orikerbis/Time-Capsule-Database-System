import React from 'react';
import Link from 'next/link';
import './heroBtn.css';

export default function HeroBtn({ name, target }: { name: string, target: string }) {
    
    const handleScrollTo = (section: string) => {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Link href={`/${target}`} className={`btn-hero animated fadeInUp scrollto ${name.includes('book') ? 'ms-4' : ''}`}>
            {name}
        </Link>
    );
}

