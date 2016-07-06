var app = angular.module('app',[]);

app.controller('MainCtrl',function($scope, $http){

	$scope.songsLoadedArr = [];
	$scope.songCount = 0;

	$http.get('/api/albums')
	.then(function(response) {
		console.log('all albums ajax');
		$scope.allAlbums = [];
		response.data.forEach(function(album){

			$http.get('/api/albums/'+album.id)
			.then(function(al){
				console.log('albums ajax');
				var albumFromServer = al.data;
				albumFromServer.imageUrl = '/api/albums/' + albumFromServer.id + '/image';

				albumFromServer.songs.forEach(function(songObj, index){
					albumFromServer.songs[index].songIndex = $scope.songCount++;
					$scope.songsLoadedArr.push(songObj);
				});

				$scope.allAlbums.push(albumFromServer);
			})
			.catch(console.error.bind(console));

		});
	})
	.catch(console.error.bind(console));

	var audio = document.createElement('audio');

	audio.addEventListener('timeupdate', function () {
			$scope.progress = 100 * audio.currentTime / audio.duration;
			$scope.$digest();
	});

	$scope.playerControl = false;
	$scope.playStatus = false;

	// Play/pause functionality
	$scope.play = function(songIndex){

		var currSong = $scope.songsLoadedArr[songIndex];
		$scope.playerControl = true;

		// console.log('song index ', songIndex);
		// console.log('song ', currSong);
		if ($scope.currentSong !== currSong.songIndex) {
			console.log('new song');
			audio.src = '/api/songs/' + currSong.id + '/audio';
			audio.load();
			$scope.progress = 100 * audio.currentTime / audio.duration;
			audio.play();
			$scope.playStatus = true;
		} else if ($scope.playStatus === false && $scope.currentSong === currSong.songIndex) {
			console.log('continue song');
			audio.play();
			$scope.playStatus = true;
		} else {
			console.log('pause current');
			audio.pause();
			$scope.playStatus = false;
		}

		$scope.currentSong = songIndex;
		// console.log($scope.currentSong);
	}

	$scope.next = function(currentSongIndex){
		var nextIndex = (parseInt(currentSongIndex)+1);
		console.log(nextIndex);
		$scope.play(nextIndex);
	}

	$scope.previous = function(currentSongIndex){
		var prevIndex = (parseInt(currentSongIndex)-1);
		console.log(prevIndex);
		$scope.play(prevIndex);
	}
});

