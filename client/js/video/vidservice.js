var url = require('url');
var fs = require('fs');
var lazy = require("lazy");

angular.module('floatie.services.video', [])
.service('VideoService', function ($rootScope, $location, $q) {

  this.file = [];
  this.player;

  this.playVideo = function (player) {
    var evt = arguments[1];
    var videoUrl = evt.dataTransfer.getData("URL");
    console.log(videoUrl);
    //if videoUrl is not undefined, assuming the user dropped a video
    if (videoUrl !== '') {
      this.player = player;
      //save a reference to this
      var self = this;
      //use apply to "force" angular to do the digest process
      $rootScope.$apply(function () {
        self.file.length = 0;
      });
      //get the url and play the video
      var videoId = url.parse(videoUrl).query.split('=')[1];
      console.log(videoId);
      player.loadVideoById({videoId: videoId});
    }else {
      this.file.length = 0;
      this.loadFile(evt);
    }
  };

  this.addEventListeners = function (element, player) {
    //add event listener to play video or read file when dragging to drop zone
    element[0].parentElement.ondragenter = this.playVideo.bind(this, player);
    dropZone.ondragenter = this.playVideo.bind(this, player);
  };
  //mover el event listener al controller
  //agregar variable al service para el arreglo
  this.loadFile = function () {
    if (this.player !== undefined) this.player.stopVideo();
    this.file.length = 0;
    var evt = arguments[0];
    var path = evt.dataTransfer.files[0].path;
    var self = this;
    new lazy(fs.createReadStream(path))
         .lines
         .forEach(function(line){
            $rootScope.$apply(function () {
              console.log(line.toString());
              self.file.push(line.toString());
            });
          });
  };

});
