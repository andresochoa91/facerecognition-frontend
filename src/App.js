import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import "tachyons";
import Particles from 'react-particles-js';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'a5859fd113154c43a55a9bd841ca1987'
});

const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 120,
      }
    }
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signout",
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
    }
  }

  loadUser = (data) => {
    this.setState({ user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
      }
    })
  }

  onClickSign = (something) => {
    something === "signout"?
      this.setState({ route: "signout", imageURL: "" }):
      (something === "signin"?
        this.setState({ route: "signin" }):
        this.setState({ route: "signup" })) 
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("image");
    const widthImage = Number(image.width);
    const heightImage = Number(image.height);    

    return {
      topRow: clarifaiFace.top_row * heightImage,
      rightCol: widthImage - (clarifaiFace.right_col * widthImage),
      bottomRow: heightImage - (clarifaiFace.bottom_row * heightImage),
      leftCol: clarifaiFace.left_col * widthImage, 
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  } 

  onButtonSubmit = (event) => {
    this.setState({ imageURL: this.state.input })
      fetch('https://immense-sierra-90858.herokuapp.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })            
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://immense-sierra-90858.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })            
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count })
            )
          })
          .catch(console.log);
        }
          this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log("Error", err))
  }
 
  signInForm = () => {
    return(
      <div>
        <SignIn loadUser={this.loadUser} onClickSign={ this.onClickSign }/>
      </div>  
    );
  }

  signUpForm = () => {
    return(
      <div>
        <SignUp loadUser={ this.loadUser } onClickSign={ this.onClickSign }/>              
      </div>
    );
  }

  mainPage = () => {
    const { box, imageURL } = this.state;
    return(
      <div>
        <Navigation onClickSign={ this.onClickSign }/>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm onInputChange={ this.onInputChange } onButtonSubmit={ this.onButtonSubmit }/>
        <FaceRecognition box={ box }image={ imageURL }/>                  
      </div>
    )
  }

  render(){
    const { route } = this.state;
    return(
      <div style={{display: "flex", flexDirection: "column"}}>
        <div>
          <Particles className="particles" params={ particlesOption } />
          {
            route === "signin" ?
            this.mainPage() :
            (route === "signout"? this.signInForm(): this.signUpForm())    
          }
        </div>
      </div>
    )
  }
}

export default App;
