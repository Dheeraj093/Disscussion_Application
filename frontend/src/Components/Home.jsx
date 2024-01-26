import React from 'react';
import PostList from './PostList';
import Navbar from './Navbar';

const HomePage = () => {
  const rowStyle = {
    backgroundColor: '#ffe4b5', 
    padding: '20px', 
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row" style={rowStyle}>
        {/* <div className="col-md-2">
        </div> */}
        <div className="col-md-15">
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
