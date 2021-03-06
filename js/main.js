/*
 * Resithemi
 * https://github.com/akchan/resithemi
 *
 * Copyright (c) 2016 Satoshi Funayama (akchan)
 * This software is released under the MIT License.
 */


// jQuery.noConflict();
jQuery(document).ready(function($) {
    // use strict mode
    'use strict';


    var $myContainers, results = [];
    var rtAttrs = {
        defaultOptions: {
            GA: {
                generationLimit: 300,
                crossover: {strict: false},
                mutation: {strict: false}
            }
        },
        order:  'rt-order',
        name:   'rt-department-name',
        ids: {
            state:                  '#state',
            score:                  '#score',
            canvasInput:            '#canvas_input',
            inputCsv:               '#inputCsv',
            addInitialSchedule:     '#addInitialSchedule',
            inputGenerationLimit:   '#inputGenerationLimit',
            canvasRunning:          '#canvas_running',
            resultBox:              '#result-box',
            runButton:              '#runButton',
            newestButton:           '#newestButton',
            prevButton:             '#prevButton',
            nextButton:             '#nextButton',
            generationCounter:      '#generationCounter'
        },
        cssBase: 'mix',
        departments: {
            '消化器内科': {short: '消内', css: 'rt-im-gastrointestine'},
            '循環器内科': {short: '循内', css: 'rt-im-circulation'},
            '呼吸器内科': {short: '呼内', css: 'rt-im-respiration'},
            '糖尿病・内分泌内科': {short: '分泌', css: 'rt-im-endocrine'},
            '腎臓内科': {short: '腎内', css: 'rt-im-nephrology'},
            '神経内科': {short: '神内', css: 'rt-im-neurology'},
            '血液・腫瘍内科': {short: '血内', css: 'rt-im-tumor'},
            '消化器外科': {short: '消外', css: 'rt-s-gastrointestine'},
            '乳腺・内分泌外科': {short: '内外', css: 'rt-s-endocrine'},
            '心臓血管外科': {short: '心外', css: 'rt-s-circulation'},
            '呼吸器外科': {short: '呼外', css: 'rt-s-respiration'},
            '小児外科': {short: '小外', css: 'rt-s-pediatrics'},
            '救急部・集中治療部': {short: '救急', css: 'rt-emergency'},
            '麻酔科': {short: '麻酔', css: 'rt-anesthesia'},
            '小児科': {short: '小児', css: 'rt-pediatrics'},
            '精神科': {short: '精神', css: 'rt-psychiatry'},
            '産科': {short: '産科', css: 'rt-obstetrics'},
            '婦人科': {short: '婦人', css: 'rt-gynecology'},
            '地域医療': {short: '地域', css: 'rt-regional'},
            '皮膚科': {short: '皮膚', css: 'rt-dermatology'},
            '形成外科': {short: '形成', css: 'rt-s-plasty'},
            '整形外科': {short: '整形', css: 'rt-orthopaedics'},
            '脳神経外科': {short: '脳外', css: 'rt-s-neurology'},
            '泌尿器科': {short: '泌尿', css: 'rt-urology'},
            '眼科': {short: '眼科', css: 'rt-ophthalmology'},
            '頭頸部・耳鼻咽喉科': {short: '耳鼻', css: 'rt-otolaryngology'},
            '放射線診断科': {short: '放診', css: 'rt-radiology'},
            '放射線治療科': {short: '放治', css: 'rt-radiotherapy'},
            '検査部': {short: '検査', css: 'rt-laboratory'},
            '病理診断科': {short: '病理', css: 'rt-pathology'}
        }
    };



    // Return new indices of each object in given oldArray. New indices
    // refer to the position where the object is in given newArray.
    //
    // Example:
    // 
    //   getNewIndexForOldArray(['a', 'a', 'b'], ['b', 'a', 'a'])
    //   // -> [1, 2, 0]
    // 
    var getNewIndexForOldArray = function(oldArray, newArray) {
        var hashTable = _.inject(newArray, function(hash, v, i) {
            hash[v] = hash[v] || [];
            hash[v].push(i);
            return hash;
        }, {});

        return _.map(oldArray, function(v) {
            return hashTable[v].shift();
        });
    };



    // Return string of number which is filled with zero base on given digit.
    // 
    // Example:
    //
    //    fillZero(17, 4) // -> '0017'
    //
    var fillZero = function(num, digit) {
        num = Number(num);
        if (! isFinite(num)) {
            return;
        }
        var str = String(num)
        while (str.length < digit) {
            str = '0' + str
        }
        return str;
    };



    // Sort schedule container according to given newSchedules array.
    //
    // Parameter:
    //
    //   * newSchedules: Array of some schedule array.
    //
    // Example:
    //
    //   * newSchedules: [
    //       ['麻酔科', '麻酔科', '麻酔科', '救急部・集中治療部', '救急部・集中治療部', '救急部・集中治療部'],
    //       ['麻酔科', '麻酔科', '麻酔科', '救急部・集中治療部', '救急部・集中治療部', '救急部・集中治療部'],
    //       ['循環器内科', '循環器内科', '循環器内科', '消化器内科', '消化器内科', '消化器内科'],
    //       ...
    //     ]
    //
    var updateGAContainer = function(newSchedules) {
        // Stop processing before $myContainers initializing finish.
        if (! $myContainers instanceof jQuery) {
            return;
        }

        var containers = _.map($myContainers.toArray(), function(container) {
                            return _.map($(container).children().toArray(), function(div) {
                                return $(div);
                            });
                        });

        var oldSchedules = _.map(containers, function(divs) {
                                return _.map(divs, function(div) {
                                    return div.attr(rtAttrs.name);
                                });
                            });

        var newIndexes = _.map(_.zip(oldSchedules, newSchedules), function(ary) {
                            var oldSchedule = ary[0],
                                newSchedule = ary[1];
                            return getNewIndexForOldArray(oldSchedule, newSchedule);
                        });

        _.each(_.zip(containers, newIndexes), function(ary) {
            var divs        = ary[0],
                newIndexes  = ary[1],
                digit       = divs.length.toString().length;

            _.each(_.zip(divs, newIndexes), function(ary) {
                var div         = ary[0],
                    newIndex    = ary[1];
                div.attr('data-' + rtAttrs.order, fillZero(newIndex, digit));
            });
        });
        $myContainers.mixItUp('sort', rtAttrs.order + ':asc');
    };



    // Update GAContainer according to generation number
    //
    var updateGAContainerWithGenerationNumber = function(number) {
        var n = Number(number) - 1;
        if (! (results[n] && results[n].bestChromosome)) { return false; }

        var newSchedule = _.map(results[n].bestChromosome, function(ary) {
            return ary[1];
        });
        updateGAContainer(newSchedule);
        return true;
    };



    // Make residentsArray from csv
    //
    var makeResidentsArrayFromCsv = function(csvString) {
        var lines   = csvString.split(/\r\n|\n/),
            line1   = lines[0].split(","),
            r       = Number(line1[0]),
            u       = Number(line1[1]);

        var residentsArray = _.map(lines.slice(1, 1 + r), function(line) {
                var tmp         = line.split(','),
                    name        = tmp[0],
                    schedule    = tmp.slice(1, 1 + u),
                    protectIds  = _.inject(tmp.slice(1 + u, 1 + 2 * u), function(memo, flg, i) {
                                    if (flg === '1') {
                                        memo.push(i);
                                    }
                                    return memo;
                                }, []);
                return [name, schedule, [], protectIds];
            });

        var userOptionsString = lines.slice(r + 1).join('\n');

        return [residentsArray, userOptionsString];
    };



    // Initialize GA container with given residentsArray.
    // 
    var initGAContainer = function(residentsArray) {
        var $resultBox = $(rtAttrs.ids.resultBox);

        $resultBox.html('');

        _.each(residentsArray, function(ary) {
            var name        = ary[0],
                schedule    = ary[1],
                $container  = $('<div class="container"></div>'),
                $line       = $('<div class="rt-line"></div>');

            $('<div class="rt-name">' + name + '</div>').appendTo($line);

            _.each(schedule, function(department, i) {
                var $department = $('<div></div>'),
                    shortName   = rtAttrs.departments[department] ? rtAttrs.departments[department].short : department,
                    css         = rtAttrs.departments[department] ? rtAttrs.departments[department].css : '';

                $department.attr(rtAttrs.name, department)
                           .attr('data-' + rtAttrs.order, i)
                           .text(shortName)
                           .addClass(rtAttrs.cssBase)
                           .addClass(css);

                $container.append($department);
            });

            $container.mixItUp();
            $container.appendTo($line);
            $line.appendTo($resultBox);
        });

        $myContainers = $('.container');
    };



    // Update fitness list according to generation number.
    // 
    var updateFitnessWithGenerationNumber = function(number) {
        var n = Number(number) - 1,
            n_fitness = 15;
        if (! (results[n] && results[n].fitness)) { return false; }

        var fitnesses = results[n].fitness;
        $(rtAttrs.ids.score).text(fitnesses.slice(0, n_fitness).join(', '));
    };



    // Getter and Setter of generation count.
    //
    var GAGenerationCounter = function(n) {
        var $generationCounter = $(rtAttrs.ids.generationCounter),
            prefix = 'generation';

        if (!arguments.length) {
            var matchResult = $generationCounter.val().match(/[0-9]+/);
            return matchResult ? Number(matchResult[0]) : 0;
        }

        n = Number(n);
        if (!isFinite(n)) {
            throw('GAGenerationCounter: The given argument should be finite.')
        }

        $generationCounter.val(prefix + ': ' + n);
    };



    // residentsArray = [
    //     [name, schedule, protectObjs, protectIds],
    //     ...
    // ]
    // 
    var runSolver = function() {
        var $canvasRunning      = $(rtAttrs.ids.canvasRunning),
            $canvasInput        = $(rtAttrs.ids.canvasInput),
            $runButton          = $(rtAttrs.ids.runButton),
            $stopButton         = $(rtAttrs.ids.stopButton),
            $generationNumber   = $(rtAttrs.ids.generationNumber),
            worker              = new Worker('js/worker.js'),
            flg_done            = false;


        $canvasInput.slideUp()
        .promise()
        .then(function() {
            GAGenerationCounter(0);

            var intervalID,
                clearIntervalID = function() {
                    clearInterval(intervalID);
                    intervalID = undefined;
                },
                changeGeneration = function(n) {
                    var variation = n;
                    return function() {
                        if (intervalID) {
                            clearIntervalID();
                        }
                        var n_old = GAGenerationCounter();
                        var n_new = n_old + variation;
                        if (0 <= n_new && n_new <= results.length) {
                            GAGenerationCounter(n_new);
                            updateGAContainerWithGenerationNumber(n_new);
                            updateFitnessWithGenerationNumber(n_new);
                        } else if (n_new > results.length) {
                            $(rtAttrs.ids.newestButton).click();
                        }
                    };
                },
                callbackInterval = 600,
                callbackEach = function() {
                    var n = GAGenerationCounter();
                    if (n < results.length) {
                        var n_latest = results.length;
                        GAGenerationCounter(n_latest);
                        updateGAContainerWithGenerationNumber(n_latest);
                        updateFitnessWithGenerationNumber(n_latest);
                    }
                    if (flg_done) {
                        $(rtAttrs.ids.state).text('done!');
                        alert('done!');
                        clearIntervalID();


                        // 論文検討用コード
                        var bestSchedule = results[results.length - 1].bestChromosome;
                        var tsv = _.chain(bestSchedule)
                                    .map(function(ary){
                                        var name     = ary[0],
                                            schedule = ary[1];
                                        return [name].concat(schedule).join('\t');
                                    }).value().join('\n');
                        $('#outputTSV').text(tsv).slideDown();
                        var fitnesses = _.map(results, function(obj) {
                            return Math.max.apply(null, obj.fitness);
                        });
                        $('body').append(fitnesses.join(','));
                        // ここまで


                        return true;
                    }
                };

            $(rtAttrs.ids.prevButton).click(changeGeneration(-1));
            $(rtAttrs.ids.nextButton).click(changeGeneration(+1));
            $(rtAttrs.ids.newestButton).click(function() {
                if (! intervalID) {
                    intervalID = setInterval(callbackEach,callbackInterval);
                }
            })


            // return new promise object and start to wait that 
            // slideDown has done.
            return $canvasRunning.slideDown().promise();
        })
        .then(function() {
            var options         = rtAttrs.defaultOptions,
                tmp             = makeResidentsArrayFromCsv($(rtAttrs.ids.inputCsv).val()),
                residentsArray  = tmp[0],
                options         = _.extend(options, {stringForUserOptions: tmp[1]});

            initGAContainer(residentsArray);

            worker.onmessage = function(messageEvent) {
                var recievedMessage = messageEvent.data;

                if (recievedMessage === 'done') { 
                    worker.terminate();
                    flg_done = true;
                    return;
                }

                results.push(recievedMessage);
            };

            var inputGenerationLimit = Number($(rtAttrs.ids.inputGenerationLimit).val());
            if (isFinite(inputGenerationLimit) && inputGenerationLimit > 0) {
                options.GA.generationLimit = inputGenerationLimit;
            }

            worker.postMessage({
                residentsArray: residentsArray,
                options: options
            });

            $(rtAttrs.ids.newestButton).click();
        });
        return;
    };



    // Initializing screen
    $(rtAttrs.ids.canvasRunning).hide();
    $(rtAttrs.ids.inputGenerationLimit).val(rtAttrs.defaultOptions.GA.generationLimit);
    $(rtAttrs.ids.runButton).click(runSolver);
});