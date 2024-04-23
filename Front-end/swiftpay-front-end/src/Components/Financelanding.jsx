import React from 'react';
import './Flanding.css'

const content = [
  { title: "Let's Get to Know One Another", image: 'https://images.unsplash.com/photo-1597487389339-5591e52de66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=80&w=1200' },
  { title: "Some Stuff I Need to Get Off My Chest", image: 'https://images.unsplash.com/photo-1597201424013-0e06a7018fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=80&w=1200' },
  { title: "Call Me, Maybe", image: 'https://images.unsplash.com/photo-1543408458-baf63378be13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=80&w=1200' }
];

function DatingIpsum() {
    return (
        <div>
            <header className="header">
                <h1 className="page-title">CSS position sticky parallax effect</h1>
            </header>
            <main className="main">
                {content.map((item, index) => (
                    <section key={index} className="section">
                        <figure className="image-container">
                            <img src={item.image} alt={item.title} />
                        </figure>
                        <article className="content">
                            <h2 className="section-title">{item.title}</h2>
                            <span className="byline">Content provided by <a href="https://laurenhallden.com/datingipsum/" target="_blank" rel="noreferrer">the online dating ipsum generator →</a></span>
                            <p>If I make fun of you, it's because I like you...</p>
                            {/* Add additional content paragraphs as necessary */}
                        </article>
                    </section>
                ))}
            </main>
            <footer className="footer">
                Fin.
            </footer>
        </div>
    );
}

export default DatingIpsum;
