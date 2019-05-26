import React from 'react'
import PropTypes from 'prop-types';
// const App = () => <div>Hello React</div> ;

const App = ({ gists }) => (
    <ul>
        {gists.map(gist => (
            <li key={gist.id}>{gist.description}</li>
        ))}
    </ul>
);

App.propTypes = {
    gists:PropTypes.array
}




export default App;