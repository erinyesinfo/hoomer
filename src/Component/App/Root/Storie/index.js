import React from 'react';
import Draft from './Draft';
import Public from './Public';

const Storie = ({ id, story }) => {
    if (story.public) {
        return <Public key={story.key} id={id} story={story} />
    } else {
        return <Draft key={story.key} id={id} story={story} />
    };
};

export default Storie;
