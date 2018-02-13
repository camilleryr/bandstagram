# Bandstagram

A instagram style mobile app allowing musicians to record and share performances with fans, and allowing fans to follow musicians and curate a playlist of their favorite tracks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This app, which was designed to run on ios devices, accesses the camera and microphone of an iPhone, so to be able to use these features, this needs to run on the Ionic Dev App available in the Apple App Store.

### Installing

Clone The Repo from github onto your local machine

You will need to install the Ionic CLI and Bower package managers to run this project -

```
install -g bower 
npm install -g bower
```
These commands may need to be run prefixed with sudo 

Once you have those installed globally navigate into the Bandstagram directory and install all of the neccessary dependencies

```
npm install
bower install
```

Follow any additional prompts to make sure your system has all of the required packages

## Deployment

To run the ionic dev app, make sure your development environment and phone are both connected to the same wifi, run the command

ionic serve -c

in terminal, open the Ionic Dev App on your phone and click the Bandstagram icon when it appears!  You should now be able to create an account and interact with they system.

## Built With

* Ionic 1
* AngularJS
* Firebase Realtime Database / Storage
* Facebook Authentication / Graph API
* Cordova Plugins

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Features

## Login or Register as a Fan or a Band
# Includes Facebook Login and Graph API implementation

When you first open Bandstagram, you will be presented with a view to login, register a new account, or login with your facebook account.  If you choose to register a new account, you will be prompted to select either a fan account or a band account.  Fan accounts have access to curating a list of bands to follow, and accesing all of their content.  Band accounts have access to creating new content to distribute to their fans.

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.41.09%20PM.png" width="250">

If you wish to create an account with an existing facebook page, you will be briefly redirected to facebook's authentication, and then brought back to the internal registration page where you will be asked once again to select a band or fan account.  Facebook has provided the Name and some basic info for the user - once you wish to save your account you will be prompted about having all of your favorited bands from facebook imported.  If selected, this calls the facebook graph api which returns the list of all of the users liked bands and compares it to the bands that have already created accounts on the app, and will pre populate your new account.

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.31.25%20PM.png" width="250">

##Band Account
#View Statistics / Add and Edit Content

Once logged into a band account, the user is presented with a view showing the statistics of their account including the total number of posts they have in the system, the number of followers, the total number of votes cast on their posts and the total sum of votes (with an up vote being +1 and a down vote being -1)

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.34.27%20PM.png" width="250">

The list view presents the user with all of the posts they have created with an affordance to edit or delete the content

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.34.40%20PM.png" width="250">

The add view allows the user to create a new recording to add to the system.  They are first presented with prompts to add basic title information as well as taking a photo (this utilizes the cordova plugins to access the native features of the phone to access the camera).  When the "Add A Recording" option is chosen, a modal opens up that allows access to the internal microphone to allow the user to record a musical performance, and gives them the option to play back the audio to review before accepting it.

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.34.51%20PM.png" width="250">

##Fan Account
#Create a list of followed bands / View an instagram style of cards and listen to the tracks / Curate a playlist of favorited tracks

When the user logs in as a fan, they are first presented with "HOME" view that is a chronological scroll of posts by bands that the user has decided to follow.  From this view the songs can be played over the phones internal speakers, a up or down vote can be cast on the track, and the track can be favorited and saved to the users playlist

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.32.18%20PM.png" width="250">

When the user navigates to the "SEARCH" view, the user is presented with a list of all of the bands that have registered accounts in the app with the ability to follow or unfollow, or bring up the detail view for one band.  The bands can be searched for, and filtered by followed, unfollowed.

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.31.41%20PM.png" width="250">
<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%204.32.43%20PM.png" width="250">

When the user navigates to the "FAVORITES" view, the user is presented with a list of all of the individual tracks they have previously selected (with the star icon in the upper right hand corner of the corresponding card).  From here here user can listen to this playlist, rearrange the songs by tapping and dragging, and removing any of the songs by toggling the delete icon in the upper left hand corner

<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.34.00%20PM.png" width="250">
<img src="https://github.com/camilleryr/bandstagram/blob/master/photos/Screen%20Shot%202018-02-13%20at%203.34.06%20PM.png" width="250">
