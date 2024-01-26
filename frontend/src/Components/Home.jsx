import React from 'react';
import PostList from './PostList';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <div className="container-fluid">
     <Navbar/>
      <div className="row">
        <div className="col-md-2">
        </div>
        <div className="col-md-8">
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
