import React from 'react';
import * as Icon from 'react-feather';

const icons = [
    {
        icon: <Icon.GitHub />,
        href: 'https://github.com/covid19india/covid19india-react',
        color: '#eff7ff',
        bgColor: '#000000',
        tooltip: 'Open sourced on Github'
    },
    {
        icon: <Icon.Database />,
        href: 'https://bit.ly/patientdb',
        color: '#33a667',
        bgColor: 'rgba(51,166,103,.19)',
        tooltip: 'crowdsourced patient database'
    },
    {
        icon: <Icon.MessageCircle />,
        href: 'https://bit.ly/covid19crowd',
        color: '#08c',
        bgColor: 'rgba(108,117,125,.0627451)',
        tooltip: 'Join telegram to collaborate'
    },
    {
        icon: <Icon.Twitter />,
        href: 'https://twitter.com/covid19indiaorg',
        color: 'rgba(0,123,255,.6)',
        bgColor: 'rgba(0,123,255,.0627451)',
        tooltip: 'Follow us on Twitter!'
    },
    {
        icon: <Icon.Instagram />,
        href: 'https://instagram.com/covid19indiaorg',
        color: '#fb5581',
        bgColor: '#fb558110',
        tooltip: 'Follow us on Instagram!'
    },
    {
        icon: <Icon.ThumbsUp />,
        href: 'https://www.fb.com/covid19indiaorg',
        color: '#4c75f2',
        bgColor: '#4c75f210',
        tooltip: 'Follow us on Facebook!'
    }
];
function Footer() {
    const onClick = (e) => {
        e.preventDefault();
    };
    return (
        <div className="footer-wrapper fadeInUp" style={{ animationDelay: '2s' }}>
            <div className="footer-obj">We Stand with everyone fighting on the frontlines</div>
            <div className="footer-social">
                {icons.map((icon, index) => (
                    <a
                        href={window.innerWidth <= 768 ? '#' : icon.href}
                        target="_blank"
                        onClick={window.innerWidth <= 768 && onClick}
                        rel="noopener noreferrer"
                        key={index}
                    >
                        <div className="tooltip" style={{ color: icon.color, backgroundColor: icon.bgColor }}>
                            <span>{icon.icon}</span>
                            <span
                                className={`tooltiptext tooltip${index}`}
                                style={{
                                    color: icon.color,
                                    backgroundColor: icon.bgColor,
                                    textDecoration: 'none'
                                }}
                                onClick={() => window.open(icon.href, '_blank')}
                                rel="noopener noreferrer"
                            >
                                {icon.tooltip}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Footer;
