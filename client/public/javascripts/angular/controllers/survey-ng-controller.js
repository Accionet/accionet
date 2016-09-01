controllers

    .controller('surveyController', function($scope, $http) {

    $scope.surveys = {};
    $scope.selectedSurvey = null;

    // Get all surveys
    $scope.initializeSurveys = function(surveys, selectedSurvey) {

        if (surveys)
            $scope.surveys = JSON.parse(surveys);
        if (selectedSurvey)
            $scope.selectedSurvey = JSON.parse(selectedSurvey);

    };


    // Delete a survey
    $scope.toggleIsActive = function(survey) {

        $http.put('/surveys/' + survey.id + '/toggleIsActive')
            .success(function(data) {

                console.log();
                locallyUpdateSurvey(data.survey);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    function locallyUpdateSurvey(updated_survey) {
        if ($scope.selectedSurvey && $scope.selectedSurvey.id == updated_survey.id)
            $scope.selectedSurvey = updated_survey;
        for (var i = 0; i < $scope.surveys.length; i++) {
            if ($scope.surveys[i].id == updated_survey.id) {
                $scope.surveys[i] = updated_survey;
            }
        }
    }

    // Create a new survey
    $scope.createSurvey = function(survey) {

        if ($scope.validForm()) {
            $http.post('/surveys/new', $scope.selectedSurvey)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.surveys = data;
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    // updates a survey
    $scope.updateSurvey = function(survey) {
        console.log('update');

        if ($scope.validForm()) {
            $http.put('/surveys/' + $scope.selectedSurvey.id + '/edit', $scope.selectedSurvey)
                .success(function(data) {
                    survey = data.survey;
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        }
    };

    $scope.validForm = function() {
        return !($scope.form.$error.required || $scope.form.$error.maxlength || $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
    };


    $scope.setSelectedSurvey = function(survey) {
        $scope.selectedSurvey = survey;
    };


});
