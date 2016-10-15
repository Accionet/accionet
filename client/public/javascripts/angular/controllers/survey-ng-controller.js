controllers

    .controller('surveyController', function ($scope, $http, $window) {
        $scope.surveys = {};
        $scope.selectedSurvey = null;
        $scope.responses = {};

        $scope.data = [];
    // For creating an survey
        $scope.questions = [];
        $scope.title = '';

        $scope.error = null;
        $scope.success = null;

        $scope.MULTIPLE_CHOICE = 'multiple_choice';
        $scope.YES_NO = 'yes_no';
        $scope.NUMERIC = 'numeric';
        $scope.SHORT_ANSWER = 'short_answer';
        $scope.LONG_ANSWER = 'long_answer';

    // ORdering

        $scope.myOrderBy = 'title';


    // Get all surveys
        $scope.initializeSurveys = function (surveys, selectedSurvey, responses) {
            if (surveys)
                $scope.surveys = JSON.parse(surveys);
            if (selectedSurvey) {
                $scope.selectedSurvey = JSON.parse(selectedSurvey);
            }
            if (responses)
                $scope.responses = JSON.parse(responses);
            console.log($scope.surveys);
        };


    // toggle active in survey
        $scope.toggleIsActive = function (survey) {
            $http.put('/surveys/' + survey.id + '/toggleIsActive')
            .success(function (data) {
                locallyUpdateSurvey(data.survey);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        };

    // toggle active in survey
        $scope.delete = function (survey) {
            $http.delete('/surveys/' + survey.id + '/delete')
            .success(function (data) {
                console.log($scope.surveys);
                // data.survey
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        };

        function locallyUpdateSurvey(updated_survey) {
            if ($scope.selectedSurvey && $scope.selectedSurvey.id == updated_survey.id)
                $scope.selectedSurvey = updated_survey;
            for (let i = 0; i < $scope.surveys.length; i++) {
                if ($scope.surveys[i].id == updated_survey.id) {
                    $scope.surveys[i] = updated_survey;
                }
            }
        }

    // Create a new survey
        $scope.createSurvey = function () {
            addEnumerations();
            const survey = {
                user_id: 1,
                title: $scope.title,
                is_active: true,
                questions: $scope.questions,
            };
            if ($scope.validForm()) {
                console.log('valido');
                $http.post('/surveys/new', survey)
                .success(function (data) {
                    console.log('suc');
                    $window.location.href = '/surveys/all';
                })
                .error(function (error) {
                    console.log('Error: ' + error);
                });
            }
        };

    // updates a survey
        $scope.updateSurvey = function (survey) {
            if ($scope.validForm()) {
                $http.put('/surveys/' + $scope.selectedSurvey.id + '/edit', $scope.selectedSurvey)
                .success(function (data) {
                    survey = data.survey;
                })
                .error(function (error) {
                    console.log('Error: ' + error);
                });
            }
        };

        $scope.validForm = function () {
            let valid = true;
            $scope.error = '';
            if ($scope.title === '') {
                $scope.error += '- La encuesta debe tener un nombre \n';
                valid = false;
            }
            if ($scope.questions.length == 0) {
                $scope.error += '- La encuesta debe tener al menos una pregunta \n';
                valid = false;
            }
            for (let i = 0; i < $scope.questions.length; i++) {
                if (!$scope.questions[i].title || $scope.questions[i].title == '') {
                    $scope.error += `- La pregunta ${i + 1} debe tener un nombre \n`;
                    valid = false;
                }
                if ($scope.questions[i].options) {
                    for (let j = 0; j < $scope.questions[i].options.length; j++) {
                        if (!$scope.questions[i].options[j].statement || $scope.questions[i].options[j].statement == '') {
                            $scope.error += `- La alternativa ${j + 1} de la pregunta ${i + 1} debe tener un nombre \n`;
                            valid = false;
                        }
                    }
                }
            }

            return valid;
        };


        $scope.setSelectedSurvey = function (survey) {
            $scope.selectedSurvey = survey;
        };


    // FOR CREATING NEW survey

    // Add question to array. Recieves what type of question is
        $scope.addQuestion = function (myType) {
        // The question to be added
            let question;
        // Create the question depending on what type of question is
            switch (myType) {
            case $scope.MULTIPLE_CHOICE:
                question = createMultipleChoiceQuestion($scope.questions.length + 1);
                break;
            case $scope.YES_NO:
                question = createYesNoQuestion($scope.questions.length + 1);
                break;
            case $scope.NUMERIC:
                question = createNumericQuestion(q$scope.uestions.length + 1);
                break;
            case $scope.SHORT_ANSWER:
                question = createShortAnswerQuestion($scope.questions.length + 1);
                break;
            case $scope.LONG_ANSWER:
                question = createLongAnswerQuestion($scope.questions.length + 1);
                break;
            }
        // If the question is not null add it to questions
            if (question) {
                $scope.questions.push(question);
            }
        };

        $scope.deleteQuestion = function (question) {
            const i = $scope.questions.indexOf(question);
        // remove from i only 1
            $scope.questions.splice(i, 1);
        };

    // add a new option to 'option'
        $scope.addOption = function (question) {
        // push the new option
            question.options.push({
                value: '',
            });
        // questions[0].options[0] = "ME";
        };

    // Remove the option 'option' from question
        $scope.deleteOption = function (question, option) {
        // get the index to where to remove
            const i = question.options.indexOf(option);
        // remove from i only 1
            question.options.splice(i, 1);
        };


    // Order function

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.index = 0;
        $scope.getData = function (question) {
            if (question.type == 'multiple_choice') {
                $scope.index += 1;
                const data = [];
                const metrics = question.metrics;
                for (let i = 0; i < Object.keys(metrics).length; i++) {
                    const entry = {
                        label: `${Object.keys(metrics)[i]}) ${metrics[Object.keys(metrics)[i]].statement}`,
                        data: metrics[Object.keys(metrics)[i]].count,
                    };
                    data.push(entry);
                }
                return data;
            }
        };

    // ########################################
    // NOT SCOPE FUNCTIONS ###################
    // ########################################


        createMultipleChoiceQuestion = function (number) {
            question = {
                title: '',
                description: '',
                number,
                type: $scope.MULTIPLE_CHOICE,
                options: [{
                    statement: '',
                }, {
                    statement: '',
                }, {
                    statement: '',
                }, {
                    statement: '',
                }, ],
            };
            return question;
        };

        createYesNoQuestion = function (number) {
            question = {
                title: '',
                type: $scope.YES_NO,
                options: [{
                    value: 'Si',
                }, {
                    value: 'No',
                }],
            };
            return question;
        };

        createShortAnswerQuestion = function (number) {
            question = {
                title: '',
                type: $scope.SHORT_ANSWER,
                options: [],
            };
            return question;
        };

        createLongAnswerQuestion = function (number) {
            question = {
                title: '',
                type: $scope.LONG_ANSWER,
                options: [],
            };
            return question;
        };

        createNumericQuestion = function (number) {
            question = {
                title: '',
                type: $scope.NUMERIC,
                options: [],
            };
            return question;
        };

        createExistingQuestion = function (name, type, options) {
            question = {
                title: name,
                type,
                options,
            };
            return question;
        };

        addEnumerations = function () {
            for (let i = 0; i < $scope.questions.length; i++) {
                if ($scope.questions[i].options) {
                    for (let j = 0; j < $scope.questions[i].options.length; j++) {
                        $scope.questions[i].options[j].enumeration = String.fromCharCode(64 + parseInt(j + 1, 10));
                    }
                }
            }
        };
    })

// Filter for displaying the alternatives, it basically transform numbers to letter in this way: 0 = A, 1 = B and so on
// Code taken from http://stackoverflow.com/questions/22786483/angularjs-show-index-as-char answer from: Engineer
.filter('character', function () {
    return function (input) {
        return String.fromCharCode(64 + parseInt(input, 10));
    };
});
