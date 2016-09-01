controllers

    .controller('surveyController', function($scope, $http) {




    // Create a new place
    $scope.respondSurvey = function() {
        response = {
            survey_id: 1,
            answers: [{
                question_id: 1,
                answer_text: "hola"
            }, {
                question_id: 3,
                answer_option_id: 1
            }]
        };
        console.log(response);
        $http.post('/survey/' +  response.survey_id + '/response', response)
            .success(function(data) {
              console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };


});
