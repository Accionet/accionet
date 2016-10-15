const User = require('../models/users');
const Place = require('../models/places');
const Surveys = require('../models/surveys');
const Response = require('../models/response');


// Admin
User.new((err, newUser) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        return err;
    }
    newUser.username = 'accionet';
    newUser.password = 'accionet159';
    newUser.email = 'antonio@accionet.cl';
    newUser.is_admin = true;
    newUser.is_active = true;

    User.save(newUser, (err_save, savedUser) => {
        if (err_save) {
            console.log(`ERROR: ${err}`);
            return err;
        }
        console.log(`${newUser.username} saved`);


        // Rango Entario Streetpark
        Surveys.new((err_surv, newSurvey) => {
            if (err_surv) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = savedUser.id;
            newSurvey.title = 'Rango Etario Streetpark';
            newSurvey.is_active = true;
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: '¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta',
                type: 'multiple_choice',
                number: 1,
                options: [{
                    statement: '10 años o menor',
                    enumeration: 'a',
                }, {
                    statement: 'Entre 10 y 15 años',
                    enumeration: 'b',
                }, {
                    statement: 'entre 16 y 20 años',
                    enumeration: 'c',
                }, {
                    statement: 'entre 21 y 25 años',
                    enumeration: 'd',
                }, {
                    statement: 'entre 26 y 30 años',
                    enumeration: 'e',
                }, {
                    statement: 'entre 31 y 40 años',
                    enumeration: 'f',
                }, {
                    statement: 'más de 40 años',
                    enumeration: 'g',
                }, {
                    statement: 'Ya he respondido esta pregunta',
                    enumeration: 'h',
                }],
            });
            newSurvey.questions.push({
                title: 'Eres hombre?',
                type: 'multiple_choice',
                number: 2,
                options: [{
                    statement: 'Si',
                    enumeration: 'a',
                }, {
                    statement: 'No',
                    enumeration: 'b',
                }, {
                    statement: 'No lo se',
                    enumeration: 'c',
                }],
            });
            newSurvey.questions.push({
                title: 'Que numero te gusta mas?',
                type: 'multiple_choice',
                number: 3,
                options: [{
                    statement: '1',
                    enumeration: 'a',
                }, {
                    statement: '2',
                    enumeration: 'b',
                }, {
                    statement: '3',
                    enumeration: 'c',
                }],
            });
            Surveys.save(newSurvey, (err_survey_save, savedSurvey) => {
                if (err_survey_save) {
                    console.log(err);
                    return err;
                }
                console.log(`survey ${savedSurvey.title} saved`);
                Surveys.findById(savedSurvey.id, (err_find_survey, populatedSurvey) => {
                    const RESPONSES = 200;
                    for (let i = 0; i < RESPONSES; i++) {
                        const resp = {
                            survey_id: populatedSurvey[0].id,
                            answers: [],
                            macaddress: Math.floor((Math.random() * 130)),
                        };
                        for (let j = 0; j < populatedSurvey[0].questions.length; j++) {
                            const amount = populatedSurvey[0].questions[j].options.length;
                            resp.answers.push({
                                question_id: populatedSurvey[0].questions[j].id,
                                answer_option_id: populatedSurvey[0].questions[j].options[Math.floor((Math.random() * amount))].id,
                            });
                        }
                        Response.save(resp, (err_resp_save) => {
                            if (err_resp_save) {
                                console.log(err);
                                return err;
                            }
                        });
                    }
                });
            });
        });

        // Otro
        Surveys.new((err_surv, newSurvey) => {
            if (err_surv) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = savedUser.id;
            newSurvey.title = 'Encuesta 2';
            newSurvey.is_active = true;
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: 'Pregunta 1',
                type: 'multiple_choice',
                number: 1,
                options: [{
                    statement: '10 años o menor',
                    enumeration: 'a',
                }, {
                    statement: 'Entre 10 y 15 años',
                    enumeration: 'b',
                }, {
                    statement: 'entre 16 y 20 años',
                    enumeration: 'c',
                }, {
                    statement: 'entre 21 y 25 años',
                    enumeration: 'd',
                }, {
                    statement: 'entre 26 y 30 años',
                    enumeration: 'e',
                }, {
                    statement: 'entre 31 y 40 años',
                    enumeration: 'f',
                }, {
                    statement: 'más de 40 años',
                    enumeration: 'g',
                }, {
                    statement: 'Ya he respondido esta pregunta',
                    enumeration: 'h',
                }],
            });
            newSurvey.questions.push({
                title: 'Eres hombre?',
                type: 'multiple_choice',
                number: 2,
                options: [{
                    statement: 'Si',
                    enumeration: 'a',
                }, {
                    statement: 'No',
                    enumeration: 'b',
                }, {
                    statement: 'No lo se',
                    enumeration: 'c',
                }],
            });

            newSurvey.questions.push({
                title: 'Hola?',
                type: 'multiple_choice',
                number: 2,
                options: [{
                    statement: 'hola',
                    enumeration: 'a',
                }, {
                    statement: 'Chao',
                    enumeration: 'b',
                }, {
                    statement: 'No lo se',
                    enumeration: 'c',
                }],
            });

            newSurvey.questions.push({
                title: 'Que nombre te gusta mas?',
                type: 'multiple_choice',
                number: 3,
                options: [{
                    statement: 'antonio',
                    enumeration: 'a',
                }, {
                    statement: 'antoni',
                    enumeration: 'b',
                }, {
                    statement: 'anton',
                    enumeration: 'c',
                }],
            });
            Surveys.save(newSurvey, (err_survey_save, savedSurvey) => {
                if (err_survey_save) {
                    console.log(err);
                    return err;
                }
                console.log(`survey ${savedSurvey.title} saved`);
                Surveys.findById(savedSurvey.id, (err_find_survey, populatedSurvey) => {
                    const RESPONSES = 200;
                    for (let i = 0; i < RESPONSES; i++) {
                        const resp = {
                            survey_id: populatedSurvey[0].id,
                            answers: [],
                            macaddress: Math.floor((Math.random() * 40)),

                        };
                        for (let j = 0; j < populatedSurvey[0].questions.length; j++) {
                            const amount = populatedSurvey[0].questions[j].options.length;
                            resp.answers.push({
                                question_id: populatedSurvey[0].questions[j].id,
                                answer_option_id: populatedSurvey[0].questions[j].options[Math.floor((Math.random() * amount))].id,
                            });
                        }
                        Response.save(resp, (err_resp_save) => {
                            if (err_resp_save) {
                                console.log(err);
                                return err;
                            }
                        });
                    }
                });
            });
        });

        Surveys.new((err_surv, newSurvey) => {
            if (err_surv) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = savedUser.id;
            newSurvey.title = 'Encuesta 3';
            newSurvey.is_active = true;
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: '¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta',
                type: 'multiple_choice',
                number: 1,
                options: [{
                    statement: '10 años o ',
                    enumeration: 'a',
                }, {
                    statement: 'Entre 10 y 15 años',
                    enumeration: 'b',
                }, {
                    statement: 'entre 16 y 20 años',
                    enumeration: 'c',
                }, {
                    statement: 'entre 21 y 25 años',
                    enumeration: 'd',
                }, {
                    statement: 'entre 26 y 30 años',
                    enumeration: 'e',
                }, {
                    statement: 'entre 31 y 40 años',
                    enumeration: 'f',
                }, {
                    statement: 'más de 40 años',
                    enumeration: 'g',
                }, {
                    statement: 'Ya he respondido esta pregunta',
                    enumeration: 'h',
                }],
            });
            newSurvey.questions.push({
                title: 'Eres hombre?',
                type: 'multiple_choice',
                number: 2,
                options: [{
                    statement: 'Si',
                    enumeration: 'a',
                }, {
                    statement: 'No',
                    enumeration: 'b',
                }, {
                    statement: 'No lo se',
                    enumeration: 'c',
                }],
            });


            Surveys.save(newSurvey, (err_survey_save, savedSurvey) => {
                if (err_survey_save) {
                    console.log(err);
                    return err;
                }
                console.log(`survey ${savedSurvey.title} saved`);
                Surveys.findById(savedSurvey.id, (err_find_survey, populatedSurvey) => {
                    const RESPONSES = 200;
                    for (let i = 0; i < RESPONSES; i++) {
                        const resp = {
                            survey_id: populatedSurvey[0].id,
                            answers: [],
                            macaddress: Math.floor((Math.random() * 18)),

                        };
                        for (let j = 0; j < populatedSurvey[0].questions.length; j++) {
                            const amount = populatedSurvey[0].questions[j].options.length;
                            resp.answers.push({
                                question_id: populatedSurvey[0].questions[j].id,
                                answer_option_id: populatedSurvey[0].questions[j].options[Math.floor((Math.random() * amount))].id,
                            });
                        }
                        Response.save(resp, (err_resp_save) => {
                            if (err_resp_save) {
                                console.log(err);
                                return err;
                            }
                        });
                    }
                });
            });
        });
    });
});

Place.new((err, newPlace) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        return err;
    }

    newPlace.name = 'Streetpark Las Condes';
    newPlace.description = 'El streetpark Las Condes es un parque público para hacer patinaje, skateboard, entre otros. Este parque reproduce los lugares más típicos de una ciudad que sean atractivos para los skaters. Este se encuentra ubicado en el parque araucano, colindando con Av. Manquehue Norte. Su cercanía con el Parque Arauco puede ser atractivos para marcas presentes en este mall ya que les puede servir para dirigir gente hacia sus tiendas.';
    newPlace.daily_visits = 500;
    newPlace.is_active = true;
    Place.save(newPlace, (err_save) => {
        if (err_save) {
            console.log(`ERROR: ${err}`);
            return err;
        }
        console.log(`${newPlace.name} saved`);
    });
});

Place.new((err, newPlace) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        return err;
    }

    newPlace.name = 'Barrio Franklin';
    newPlace.description = '';
    newPlace.daily_visits = 4500;
    newPlace.is_active = false;
    Place.save(newPlace, (err_saved) => {
        if (err_saved) {
            console.log(`ERROR: ${err}`);
            return err_saved;
        }
        console.log(`${newPlace.name} saved`);
    });
});
