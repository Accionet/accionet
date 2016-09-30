controllers

    .controller('surveyController', function($scope, $http) {

    $scope.surveys = {};
    $scope.selectedSurvey = null;
    $scope.responses = {};

    //For creating an survey
    $scope.questions = [];
    $scope.title = "";

    $scope.error = null;
    $scope.success = null;

    $scope.MULTIPLE_CHOICE = 'multipleChoice';
    $scope.YES_NO = "yesNo";
    $scope.NUMERIC = "numeric";
    $scope.SHORT_ANSWER = "shortAnswer";
    $scope.LONG_ANSWER = "longAnswer";

    // Get all surveys
    $scope.initializeSurveys = function(surveys, selectedSurvey, responses) {

        if (surveys)
            $scope.surveys = JSON.parse(surveys);
        if (selectedSurvey)
            $scope.selectedSurvey = JSON.parse(selectedSurvey);
        if (responses)
            $scope.responses = JSON.parse(responses);

    };


    // Delete a survey
    $scope.toggleIsActive = function(survey) {

        $http.put('/surveys/' + survey.id + '/toggleIsActive')
            .success(function(data) {
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

      console.log($scope.questions);
        // if ($scope.validForm()) {
        //     $http.post('/surveys/new', $scope.selectedSurvey)
        //         .success(function(data) {
        //             $scope.formData = {};
        //             $scope.surveys = data;
        //         })
        //         .error(function(error) {
        //             console.log('Error: ' + error);
        //         });
        // }
    };

    // updates a survey
    $scope.updateSurvey = function(survey) {

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


    //FOR CREATING NEW survey

    //Add question to array. Recieves what type of question is
    $scope.addQuestion = function(myType) {
        //The question to be added
        var question;
        //Create the question depending on what type of question is
        switch (myType) {
            case $scope.MULTIPLE_CHOICE:
                question = createMultipleChoiceQuestion();
                break;
            case $scope.YES_NO:
                question = createYesNoQuestion();
                break;
            case $scope.NUMERIC:
                question = createNumericQuestion();
                break;
            case $scope.SHORT_ANSWER:
                question = createShortAnswerQuestion();
                break;
            case $scope.LONG_ANSWER:
                question = createLongAnswerQuestion();
                break;
        }
        //If the question is not null add it to questions
        if (question) {
            $scope.questions.push(question);
        }
    };

    $scope.deleteQuestion = function(question) {
        var i = $scope.questions.indexOf(question);
        //remove from i only 1
        $scope.questions.splice(i, 1);
    };

    //add a new choice to 'choice'
    $scope.addChoice = function(question) {
        // push the new choice
        question.choices.push({
            value: ""
        });
        //questions[0].choices[0] = "ME";
    };

    //Remove the choice 'choice' from question
    $scope.deleteChoice = function(question, choice) {
        //get the index to where to remove
        var i = question.choices.indexOf(choice);
        //remove from i only 1
        question.choices.splice(i, 1);
    };

    //########################################
    // NOT SCOPE FUNCTIONS ###################
    //########################################


    createMultipleChoiceQuestion = function() {
        question = {
            questionName: "",
            type: $scope.MULTIPLE_CHOICE,
            choices: [{
                value: ""
            }, {
                value: ""
            }, {
                value: ""
            }, {
                value: ""
            }]
        };
        return question;
    };

    createYesNoQuestion = function() {
        question = {
            questionName: '',
            type: $scope.YES_NO,
            choices: [{
                value: "Si"
            }, {
                value: "No"
            }]
        };
        return question;
    };

    createShortAnswerQuestion = function() {
        question = {
            questionName: '',
            type: $scope.SHORT_ANSWER,
            choices: []
        };
        return question;
    };

    createLongAnswerQuestion = function() {
        question = {
            questionName: '',
            type: $scope.LONG_ANSWER,
            choices: []
        };
        return question;
    };

    createNumericQuestion = function() {
        question = {
            questionName: '',
            type: $scope.NUMERIC,
            choices: []
        };
        return question;
    };

    createExistingQuestion = function(name, type, choices) {
        question = {
            questionName: name,
            type: type,
            choices: choices
        };
        return question;
    };
})

//Filter for displaying the alternatives, it basically transform numbers to letter in this way: 0 = A, 1 = B and so on
//Code taken from http://stackoverflow.com/questions/22786483/angularjs-show-index-as-char answer from: Engineer
.filter('character', function() {
    return function(input) {
        return String.fromCharCode(64 + parseInt(input, 10));
    };
});
