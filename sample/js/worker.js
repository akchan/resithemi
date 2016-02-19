/*
 * Resithemi
 * https://github.com/akchan/resithemi
 *
 * Copyright (c) 2016 Satoshi Funayama (akchan)
 * This software is released under the MIT License.
 */



// use strict mode
'use strict';


// Library dependency
importScripts('lib/underscore.js');         // underscore.js
importScripts('genetic_algorithm.js');      // Classes for Genetic Algorithm


// Imports
try {
    var Options = {};
    importScripts('config.js');             // Configuration file
} catch (e) {
    console.log('No config.js file has been detected.');
}

var optionParser;
var setOptionParser = function(func) {
    optionParser = func;
    return true;
};
importScripts('option_parser.js');



// **************************************************
// * Code for WebWorker
// **************************************************
/*
    Format of messageObject for this WebWorker.
    {
        residentsArray: 
            [
                [name1, cours1, cours2, ...],
                [name2, cours1, cours2, ...],
                ...
            ],
        options: {
            GA: {
                // Options for genetic algorithm.
            },

            otherProperty: val 
            // Options for validators and evaluators.
            // These property except GA is available in global variable Options in
            // config.js file. It can be used for validator and evaluator in that file.
        }
    }
 */

onmessage = function(messageEvent) {
    var recievedMessage = messageEvent.data,
        residentsArray  = recievedMessage.residentsArray,
        OptionsGA       = recievedMessage.options.GA || {},
        solver          = new GA.Solver(residentsArray, OptionsGA);

    // Options = _.extend(Options, _.omit(recievedMessage.options, 'GA'));
    Options  = _.extend(Options, optionParser(recievedMessage.options.stringForUserOptions));

    solver.solve(_.pick(OptionsGA, 'generationLimit'), function(ecosystem) {
        var message = {
            bestChromosome: ecosystem.getBestChromosome().toArray({withName: true}),
            fitness: ecosystem.toFitnessArray()
        };
        postMessage(message);
    });

    postMessage('done');
    close();
};