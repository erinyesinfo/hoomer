import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// root page
import Stories from './App/Root';
// Header
import Header from './App/Header';

// Pages
import Profile from './App/Pages/Profile';
import Settings from './App/Pages/Settings';
import CreateStory from './App/Pages/Create story';
import Story from './App/Pages/Story';
import StorySettings from './App/Pages/Story-settings';
import Search from './App/Pages/Search';
import NotFound from './App/Pages/NotFound';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { update: false };
  };
  updateHeader = () => this.setState({ update: true });
  render() {
    return (
      <BrowserRouter>
        <Route render={routerProps => 
          <Header {...routerProps} update={this.state.update} />} />
        <Switch>

          <Route path={['/', '/public']} exact render={routerProps => 
            <Stories {...routerProps} />} />

            {/* Search page */}
          <Route path="/search" exact render={routerProps => 
            <Search {...routerProps} />} />

          {/* Profile page */}
          <Route path='/me/profile' exact render={routerProps => 
            <Profile {...routerProps} updateHeader={this.updateHeader} />} />

          {/* Settings page */}
          <Route path='/me/settings' exact render={routerProps => 
            <Settings {...routerProps} updateHeader={this.updateHeader} />} />
          
          {/* Public story */}
          <Route path='/@:username/:postID' exact render={routerProps => 
            <Story {...routerProps} />} />
          {/* Public story settings */}
          <Route path='/p/:postID/settings' exact render={routerProps => 
            <StorySettings {...routerProps} />} />
          
          {/* Create and Edit story */}
          <Route path={['/new-story', '/p/:title/edit']} exact render={routerProps => 
            <CreateStory {...routerProps} />} />
          
          { /* 404 page */ }
          <Route render={routerProps => <NotFound {...routerProps} />} />
          
        </Switch>
      </BrowserRouter>
    );
  };
};

export default App;
