
import React from 'react';

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path
            fillRule="evenodd"
            d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.888 3.868 4.28 1.154c.73.198 1.023 1.114.496 1.624l-3.1 3.023.732 4.262c.125.727-.636 1.284-1.29.932L10 15.41l-3.805 2.001c-.654.352-1.415-.205-1.29-.932l.732-4.262-3.1-3.023c-.527-.51-.234-1.426.496-1.624l4.28-1.154L9.132 2.884z"
            clipRule="evenodd"
        />
    </svg>
);

export const CardOfferIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v6a2 2 0 002 2h12a2 2 0 002-2V9zm-7 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);

export const EmiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
);
