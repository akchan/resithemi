/*
 * Resithemi
 * https://github.com/akchan/resithemi
 *
 * Copyright (c) 2016 Satoshi Funayama (akchan)
 * This software is released under the MIT License.
 */



// ************************************************************
// * Resident Rotation Problem Solver using Genetic Algorithm
// ************************************************************
var GA = (function() {
    var module = {
        GA: this,


        // [Gene Class]
        // This class represents a rotation schedule of a resident.
        //
        // Parmeters:
        //
        //   * name:            Name of this object.
        //   * scheduleArray:   Array of strings referring a department.
        //                      Each element is compared with '===' operator.
        //   * protectObjs:     Array of strings which refer to a department which should not be shuffled.
        //   * protectIds:      Array of numbers which refer to indices be protect in scheduleArray.
        //
        Gene: (function() {
            var klass = function(name, scheduleArray, protectObjs, protectIds) {
                var name            = name || '',
                    ary             = scheduleArray || [],
                    protectObjs     = protectObjs || [],
                    protectIds      = protectIds || [];

                this.name           = name;
                this._idsToProtect  = this._getIdsToProtect(ary, protectObjs, protectIds);
                this._ary           = _.reject(ary, function(v, i) {
                                        return _.contains(this._idsToProtect, i);
                                    }, this);
                this._initialSchedule   = ary;
                this._aryComponents     = _.inject(this._ary,
                    function(memo, v) {
                        var condition = _.any(memo, function(ary) { return ary[0] === v; });
                        if (! condition) {
                            var count = _.select(this._ary, function(x) { return x === v; });
                            memo.push([v, count]);
                        }
                        return memo;
                    }, [], this);
                this._size          = ary.length;
                this._hash          = this._getHash(this._size, this._idsToProtect);

                this._cacheFitness = false;
            }; 


            // Instance methods
            // 
            klass.prototype = {
                constructor: klass,


                // Gene#_getIdsToProtext(Array, Array, Array) -> Array
                // This method is written as private method.
                // 
                _getIdsToProtect: function(ary, protectObjs, protectIds) {
                    var idsToProtectA = protectIds;
                    var idsToProtectB = _.inject(ary, function(s, m, i) {
                        if (_.include(protectObjs, m)) { s.push(i); }
                        return s;
                    }, []);
                    return _.union(idsToProtectA, idsToProtectB);
                },


                // Gene#_getHash(Number, Array) -> Object
                // This method is written as private method.
                // 
                _getHash: function(size, idsToProtect) {
                    var k = 0;
                    var hash = {};
                    for (var i = 0; i < size; i++) {
                        if (_.include(idsToProtect, i)) {
                            hash[i] = false;
                        } else {
                            hash[i] = k;
                            k += 1;
                        }
                    }
                    return hash;
                },


                // Gene#dup() -> Gene
                // Copy this object and return it.
                // 
                dup: function() {
                    var copy = new this.constructor(this.name, this.toArray(), [], this._idsToProtect);
                    copy._initialSchedule = this._initialSchedule;
                    copy._cacheFitness = this._cacheFitness;
                    return copy;
                },


                // Gene#fitness() -> Number
                // Evaluate this gene using evaluators which have been defined with
                // Gene.add_evaluator().
                // Returned number includes how many schedules coincide with initial.
                // 
                fitness: function() {
                    if (this._cacheFitness != false) {
                        return this._cacheFitness;
                    }

                    this._cacheFitness = _.inject(this.evaluators, function(acc, ary) {
                                    var block   = ary[0],
                                        context = ary[1] || this,
                                        current = [].concat(this.toArray()),
                                        initial = [].concat(this._initialSchedule);
                                    return acc + block.call(context, this.name, current, initial);
                                }, 0, this);
                    return this._cacheFitness;
                },


                // Gene#mutate(Boolean) -> Boolean
                // Mutate this gene and return if mutation successed.
                // 
                // Parameter:
                // 
                //   * strict: If passed true, only genes which pass all validators will be returned. Default is true.
                //
                mutate: function(options) {
                    this._cacheFitness = false;
                    var options = options || {},
                        strict         = (options.strict === undefined ? true : options.strict),
                        before         = this._ary,
                        trialCount     = 0,
                        trialMax       = 1e4;

                    var iterator = function(ary) {
                                        var initializingWith = ary[0],
                                            size             = ary[1],
                                            resultArray      = Array(size);
                                        for (var i = size - 1; i >= 0 ; i--) {
                                            resultArray[i] = initializingWith;
                                        }
                                        return resultArray;
                                    };

                    do {
                        trialCount += 1;
                        this._ary = _.chain(this._aryComponents)
                                     .shuffle()
                                     .map(iterator)
                                     .flatten()
                                     .value();

                        if (trialCount >= trialMax) {
                            errorMessage = 'It was not able to mutate a gene under loop count restriction.';
                            console.log(this);
                            console.log(errorMessage);
                            this._ary = before;
                            break;
                        }
                    } while (strict && (!this.valid()  || _.isEqual(this._ary, before)) );

                    return this;
                },


                // Gene#toArray() -> Array
                // Return Array of current schedule.
                //
                toArray: function(option) {
                    var option = option || {},
                        size   = this._size,
                        array  = Array(size);

                    for (var i = 0; i < size; i++) {
                        var index        = this._hash[i],
                            notProtected = (_.isFinite(index) && index >= 0);
                        array[i] = (notProtected ? this._ary[index] : this._initialSchedule[i]);
                    }

                    if (option.withName) {
                        array = [this.name].concat([array]);
                    }

                    return array;
                },


                // Gene#valid() -> Boolean
                // Judge if this object is valid. Use Gene.add_validator() to add a validator.
                //
                valid: function() {
                    return _.all(this.validators, function(ary) {
                            var block = ary[0],
                                context = ary[1] || this,
                                current = [].concat(this.toArray()),
                                initial = [].concat(this._initialSchedule);
                            return block.call(context, this.name, current, initial);
                        }, this);
                }
            };



            // Add varidator to Gene class.
            // Given function should return boolean. Return true if the gene is valid.
            //
            klass.prototype.validators = [];
            klass.add_validator = function(block, context) {
                this.prototype.validators.push([block, context]);
                return true;
            };


            // Add evaluator to Gene class.
            // Given function should return Number which higher is better.
            //
            klass.prototype.evaluators = [];
            klass.add_evaluator = function(block, context) {
                this.prototype.evaluators.push([block, context]);
                return true;
            };


            return klass;
        })(),



        // [Chromosome Class]
        // This class represents a rotation schedule of all residents.
        //
        // Parameters:
        //
        //   * genesAry: Array of genes. Default is empty array.
        //   * geneMutationOdds: A mutation odds of each gene. Default is 0.12.
        //
        Chromosome: (function() {
            var klass = function(genesAry, geneMutationOdds) {
                this._genes            = genesAry || [];
                this._geneMutationOdds = geneMutationOdds || 0.12;
                this._cacheFitness     = false;
            };


            klass.prototype = {
                constructor: klass,


                // Chromosome#add_gene(Gene) -> this
                // Add a Gene object to this and return self.
                //
                add_gene: function(gene) {
                    this._cacheFitness = false;
                    this._genes.push(gene);
                    return this;
                },


                // Chromosome#crossWith(Chromosome, Number) -> Chromosome
                // Crossover this and other chromosome and return it using one point crossover.
                //
                // Parameters:
                //
                //   * other: A chromosome object crossing with this.
                //   * number: Index of crossover.
                //
                crossWith: function(other) {
                    var tmp = _.chain(_.range(1, this.size())).sample(2).sortBy().value(),
                        a   = tmp[0],
                        b   = tmp[1];

                    var A = _.map(this._genes.slice(0, a), function(gene) {
                                    return gene.dup();
                                }),
                        B = _.map(other._genes.slice(a, b), function(gene) {
                                    return gene.dup();
                                }),
                        C = _.map(other._genes.slice(b, other.size()), function(gene) {
                                    return gene.dup();
                                });
                    return new this.constructor(A.concat(B, C), this._geneMutationOdds);
                },


                // Chromosome#dup() -> Chromosome
                // Clone this and return it.
                //
                dup: function() {
                    var newGenes = _.map(this._genes, function(gene) { return gene.dup(); });
                    var copy     = new this.constructor(newGenes, this._geneMutationOdds);
                    copy._cacheFitness = this._cacheFitness;
                    return copy;
                },


                // Chromosome#fitness() -> Number
                // Evaluate this using validators and sum of each gene#fitness().
                //
                fitness: function() {
                    if (this._cacheFitness != false) {
                        return this._cacheFitness;
                    }

                    var genesScore = _.inject(this._genes, function(sum, gene) {
                                        return sum + gene.fitness();
                                    }, 0),
                        evaluatorsScore = _.inject(this.evaluators, function(sum, ary) {
                                            var block   = ary[0],
                                                context = ary[1] || this,
                                                genes   = this.toArray();
                                            return sum + block.call(context, genes);
                                        }, 0, this);
                    this._cacheFitness = genesScore + evaluatorsScore;
                    return this._cacheFitness;
                },


                // Chromosome#mutate(Object) -> Boolean
                //
                // Parameters:
                //
                //   * options: {
                //       geneMutationOdds: A mutation odds of each gene. This is same to
                //                         argument of constructor.
                //       strict: If true is passed, returns only a chromosome which
                //               pass all validators.
                //     }
                mutate: function(options) {
                    var options          = options || {},
                        geneMutationOdds = options.geneMutationOdds || this._geneMutationOdds,
                        strict           = (options.strict === undefined ? true : options.strict),
                        trialCount       = 0,
                        trialMax         = 1e3,
                        before           = this.dup();

                    this._cacheFitness   = false;
                    
                    do {
                        trialCount += 1;
                        if (trialCount >= trialMax) {
                            errorMessage = 'It was not able to mutate a gene under loop count restriction.';
                            console.log(errorMessage);
                            beforeArray = before.toArray();
                            _.map(this._genes, function(gene, i) {
                                return beforeArray[i];
                            });
                            return false;
                        }

                        _.each(this._genes, function(gene) {
                            if (Math.random() <= geneMutationOdds) {
                                gene.mutate();
                            }
                        });
                    } while (strict && ! this.valid());
                    return true;
                },


                size: function() {
                    return this._genes.length;
                },


                toArray: function(option) {
                    return _.map(this._genes, function(gene) {
                        return gene.toArray(option);
                    });
                },


                // Chromosome#valid() -> Boolean
                // Check whether this chromosome is valid using validators.
                valid: function() {
                    var a = _.all(this.validators, function(ary) {
                                var block = ary[0],
                                    context = ary[1] || this,
                                    genes = this.toArray();
                                return block.call(context, genes);
                            }, this);
                    return a;
                }
            };


            // Add a validator to the Chromosome class. The first argument, the block should
            // be a function which take two arguments.
            //
            // Parameters:
            //
            //   * genes: Array of each gene's schedule.
            //   * this: this chromosome.
            //
            // The return value of block should be boolean. If a chromosome is valid,
            // then the function should be return true.
            // 
            klass.prototype.validators = [];
            klass.add_validator = function(block, context) {
                this.prototype.validators.push([block, context]);
                return true;
            };


            // Add evaluator to Chromosome class.
            // The given block should be a function which returns a Number. The Number means more better,
            // if it gets more higher. The function will take two arguments.
            //
            // Parameters:
            //
            //  * genes: Array of each gene's schedule.
            //  * this:  this chromosome.
            //
            klass.prototype.evaluators = [];
            klass.add_evaluator = function(block, context) {
                this.prototype.evaluators.push([block, context]);
                return true;
            };


            return klass;
        })(),



        // [Ecosystem Class]
        // This class represents a set of chromosomes (one schedule).
        // 
        // Parameter:
        //
        //   * options: {
        //       capacity:                the capacity of this ecosystem.
        //       chromosomeMutationOdds:  mutation odds of chromosomes.
        //       crossoverEntryRatio:     ratio of chromosomes which will crossover each other.
        //       crossoverOdds:           crossover odds of chromosomes which were selected with chrossoverEntryRatio.
        //     }
        Ecosystem: (function() {
            var klass = function(options) {
                var opts                     = options || {};

                this._capacity               = opts.capacity || 100;
                this._chromosomeMutationOdds = opts.chromosomeMutationOdds || 0.8;
                this._crossoverEntryRatio    = opts.crossoverEntryRatio || 0.20;
                this._crossoverOdds          = opts.crossoverOdds || 1.0;
                this._chromosomes            = [];
            };


            // Instance methods
            //
            klass.prototype = {
                constructor: klass,


                // Ecosystem#add_chromosome(Chromosome) -> undefined
                //
                add_chromosome: function(chromosome) {
                    this._chromosomes.push(chromosome);
                },


                // Ecosystem#crossover(Object) -> Number
                // 
                // Paramter:
                //
                //   * options: {
                //       n: number of chromosomes which exist after crossover.
                //       strict: if get rid of chromosomes which is lethal.
                //     }
                //
                crossover: function(options) {
                    var options   = options || {},
                        strict = (options.strict === undefined ? false : options.strict);

                    var n_entry = _.min([this._capacity * this._crossoverEntryRatio, this._chromosomes.length]),
                        n       = options.n || (2 * this._capacity - n_entry);
                    this._chromosomes = _.sortBy(this._chromosomes, function(chromosome) {
                        return chromosome.fitness();
                    }).slice(-1 * n_entry, this._chromosomes.length);

                    for (var i = 0; i < n; i++) {
                        var candidate;
                        if (Math.random() <= this._crossoverOdds) {
                            var count = 0;
                            do {
                                var tmp = _.sample(this._chromosomes, 2);
                                var a = tmp[0], b = tmp[1];
                                candidate = a.crossWith(b);
                                if (count > 1e2) {
                                    candidate = a;
                                    throw new Error('Something wrong with crossover');
                                }
                            } while (strict && ! candidate.valid());
                        } else {
                            candidate = _.sample(this._chromosomes).dup();
                        }
                        this._chromosomes.push(candidate);
                    }
                    return n;
                },



                // Ecosystem#getBestChromosome() -> Chromosome
                // Return a best chromosome.
                //
                getBestChromosome: function() {
                    return this.getBestChromosomes()[0];
                },


                // Ecosystem#getBestChromosomes() -> Array
                // Return best chromosomes base on each of fitness.
                //
                getBestChromosomes: function() {
                    var chromosomesWithFitness = _.map(this._chromosomes, function(chromosome) {
                                                    return [chromosome, chromosome.fitness()];
                                                });
                    var maxFitness = _.max(chromosomesWithFitness, function(ary) {
                                        return ary[1];
                                    })[1];
                    var bestChromosomes = _.chain(chromosomesWithFitness)
                                            .select(function(ary) {
                                                return ary[1] === maxFitness;
                                            })
                                            .map(function(ary) {
                                                return ary[0];
                                            })
                                            .value();
                    return bestChromosomes;
                },


                size: function() {
                    return this._chromosomes.length;
                },


                // Ecosystem#mutation(Number) -> Number
                // Raise mutation and return number of mutated chromosomes.
                // 
                // Parameter:
                //
                // * chromosomeMutationOdds: Odds of mutation.
                //
                mutation: function(options) {
                    var options = options || {},
                        chromosomeMutationOdds = options.chromosomeMutationOdds || this._chromosomeMutationOdds,
                        count = 0;
                    _.each(this._chromosomes, function(chromosome) {
                        if (Math.random() <= chromosomeMutationOdds) {
                            chromosome.mutate();
                            count += 1;
                        }
                    });
                    return count;
                },


                // Ecosystem#selection(Object) -> self
                // Excute selection
                //
                // Parameter:
                //
                //   * options: {
                //       strict:    select from not lethal chromosomes.
                //       selector:  function to select
                //       context:   context of function above
                //     }
                selection: function(options) {
                    if (this._chromosomes.length === 0) {
                        throw new Error('Ecosystem is empty.');
                    }
                    var options = options || {},
                        strict = (options.strict === undefined ? true : options.strict);

                    if (strict) {
                        this._chromosomes = _.select(this._chromosomes, function(chromosome) {
                            return chromosome.valid();
                        });
                    }
                    if (this._capacity < this._chromosomes.length) {
                        this._chromosomes = _.sortBy(this._chromosomes, function(chromosome) {
                                                return chromosome.fitness();
                                            })
                                            .slice(-1 * this._capacity, this._chromosomes.length);
                    }

                    return this;
                },


                // Ecosystem#toFitnessArray() -> Array
                // Return array of fitnesses of chromosomes.
                //
                toFitnessArray: function() {
                    return _.chain(this._chromosomes)
                            .map(function(chromosome) { return chromosome.fitness(); })
                            .sortBy(function(fitness) { return 1.0 / fitness; })
                            .value();
                }
            };

            return klass;
        })(),



        // Solver Class
        //
        // Parameters:
        //
        //   * residentsArray: [
        //       [name, [schedule array], [objects to protect], [ids to protect] ], ...
        //     ]
        //   * opts: {
        //       options for construct new ecosystem instance
        //     }
        Solver: (function() {
            var klass = function(residentsArray, opts) {
                this._residentsArray = residentsArray;
                this._options = opts || {};
                this._initEcosystem(this._options);
            };


            klass.prototype = {
                constructor: klass, 


                // Private method
                // Solver#_initEcosystem(Object) -> undefined
                // Initialize ecosystem and define this._ecosystem.
                //
                // Parameter:
                //
                //   * options: {
                //       addInitialSchedule: Boolean. Default: false
                //     }
                //
                _initEcosystem: function(options) {
                    var options = _.defaults(options || {}, {addInitialSchedule: true}),
                        chromosome = new GA.Chromosome([], this._options.geneMutationOdds);
                    _.each(this._residentsArray, function(ary, i) {
                        var name        = ary[0],
                            schedule    = ary[1],
                            protectObjs = ary[2],
                            protectIds  = ary[3];

                        if (0 === schedule.length) {
                            throw new Error('An initial schedule of a resident is empty.');
                        }

                        var gene = new GA.Gene(name, schedule, protectObjs, protectIds);
                        chromosome.add_gene(gene);
                    });

                    var ecosystem = new GA.Ecosystem(this._options);

                    if (options.addInitialSchedule) {
                        ecosystem.add_chromosome(chromosome.dup());
                    }

                    for (var i = ecosystem._capacity - 1; i >= 0; i--) { 
                        var newChromosome = chromosome.dup();
                        newChromosome.mutate({geneMutationOdds: 1.0});
                        ecosystem.add_chromosome(newChromosome);
                    }
                    this._ecosystem = ecosystem;
                    return this;
                },


                // Solver#solve() -> Array
                // Solve the problem using the ecosystem object.
                //
                // Parameters:
                //
                //   * options: {generationLimit: Number}
                //   * callbackEachSample: function(ecosystem) {
                //       var array = ecosystem.toFitnessArray();
                //       console.log(array);
                //     }
                //
                solve: function(options, callback) {
                    var opts = options || {},
                        generationLimit = Number(opts.generationLimit) || 1;
                    for (var i = generationLimit - 1; i >= 0; i--) {
                        this._ecosystem.selection();

                        if (this._ecosystem.size() === 0) {
                            throw new Error('The ecosystem is empty!');
                        }

                        callback && callback.call(this, this._ecosystem);
                        this._ecosystem.crossover(this._options.crossover);
                        this._ecosystem.mutation(this._options.mutation);
                    }
                    this._ecosystem.selection();
                    return this._ecosystem.getBestChromosomes();
                }
            };


            return klass;
        })()
    };

    return module;
})();