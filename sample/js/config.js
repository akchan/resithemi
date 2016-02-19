/*
 * Configuration file
 * 
 * Validators and evaluators can be defined in this file.
 * Underscore.js library can be used.
 */



// ************************************************************
// * Open Class
// ************************************************************

// Array#findIndex(Function, context) -> Number
// 
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = Array.prototype.findIndex;
}



// Array#findReverseIndex(Function, context) -> Number
// 
// ex)
// 
// [1,1,1,3,3,7,7].findReverseIndex(function(n){return n === 3 }) -> 4
// 
if (!Array.prototype.findReverseIndex) {
    Array.prototype.findReverseIndex = function(predicate) {
        var length = this.length;
        var index = [].concat(this).reverse().findIndex(predicate, arguments[1]);

        if (index != -1) {
            return length - 1 - index;
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = Array.prototype.findReverseIndex;
}



// ************************************************************
// * Defaults of options
// ************************************************************
Options = {
    upperLimits: {
        '消化器内科': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        '循環器内科': [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        '呼吸器内科': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        '糖尿病・内分泌内科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '腎臓内科': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        '神経内科': [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        '血液・腫瘍内科': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        '消化器外科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '乳腺・内分泌外科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '心臓血管外科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '呼吸器外科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '小児外科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '救急部・集中治療部': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '麻酔科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '小児科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '精神科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '産科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '婦人科': [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        '地域医療': [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        '皮膚科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '形成外科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '整形外科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '脳神経外科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '泌尿器科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '眼科': [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        '頭頸部・耳鼻咽喉科': [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        '放射線診断科': [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        '放射線治療科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '検査部': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '病理診断科': [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    },

    reservedResidents: {
        '消化器内科': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '循環器内科': [2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '呼吸器内科': [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '糖尿病・内分泌内科': [2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        '腎臓内科': [1, 1, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1],
        '神経内科': [2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0],
        '血液・腫瘍内科': [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0],
        '消化器外科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1],
        '乳腺・内分泌外科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '心臓血管外科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '呼吸器外科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '小児外科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '救急部・集中治療部': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '麻酔科': [1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 2, 2],
        '小児科': [3, 3, 1, 1, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3],
        '精神科': [1, 1, 3, 3, 4, 4, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 3, 3, 6, 6, 4, 4, 3, 3],
        '産科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        '婦人科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        '地域医療': [2, 2, 1, 1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 4, 4, 3, 3, 2, 2, 0, 0],
        '皮膚科': [1, 1, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0],
        '形成外科': [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        '整形外科': [0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        '脳神経外科': [2, 2, 3, 3, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3],
        '泌尿器科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '眼科': [1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1],
        '頭頸部・耳鼻咽喉科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '放射線診断科': [3, 3, 3, 3, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3],
        '放射線治療科': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '検査部': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        '病理診断科': [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2]
    },

    setsOfDepartments: [
        ['消化器内科'],
        ['循環器内科', '呼吸器内科'],
        ['糖尿病・内分泌内科'],
        ['腎臓内科'],
        ['神経内科'],
        ['血液・腫瘍内科'],
        ['消化器外科'],
        ['乳腺・内分泌外科'],
        ['心臓血管外科'],
        ['呼吸器外科'],
        ['小児外科'],
        ['救急部・集中治療部'],
        ['麻酔科'],
        ['小児科'],
        ['精神科'],
        ['産科'],
        ['婦人科'],
        ['地域医療'],
        ['皮膚科'],
        ['形成外科'],
        ['整形外科'],
        ['脳神経外科'],
        ['泌尿器科'],
        ['眼科'],
        ['頭頸部・耳鼻咽喉科'],
        ['検査部'],
        ['病理診断科'],
        ['放射線診断科'],
        ['放射線治療科']
    ],

    setsOfDepartmentsForVariance: [
        ['消化器内科'],
        ['循環器内科', '呼吸器内科'],
        ['循環器内科'],
        ['呼吸器内科'],
        ['糖尿病・内分泌内科'],
        ['腎臓内科'],
        ['神経内科'],
        ['血液・腫瘍内科'],
        ['消化器外科'],
        ['乳腺・内分泌外科'],
        ['心臓血管外科'],
        ['呼吸器外科'],
        ['小児外科'],
        ['救急部・集中治療部'],
        ['麻酔科'],
        ['小児科'],
        ['精神科'],
        ['産科'],
        ['婦人科'],
        ['地域医療'],
        ['皮膚科'],
        ['形成外科'],
        ['整形外科'],
        ['脳神経外科'],
        ['泌尿器科'],
        ['眼科'],
        ['頭頸部・耳鼻咽喉科'],
        ['検査部'],
        ['病理診断科'],
        ['放射線診断科'],
        ['放射線治療科']
    ],

    setsOfDepartmentsForFragmentCheck: [
        ['循環器内科', '呼吸器内科'],
        ['糖尿病・内分泌内科', '腎臓内科'],
        ['消化器外科', '乳腺・内分泌外科'],
        ['心臓血管外科', '呼吸器外科', '小児外科'],
        ['麻酔科'],
        ['産科', '婦人科']
    ],

    coefficientOfVariance: 0.5
};



// Prohibit rotation fragmentation.
// 
GA.Gene.add_validator(function(name, currentSchedule, initialSchedule) {
    var protectedArray = [].concat(currentSchedule);
    _.each(this._idsToProtect, function(i) {
        protectedArray[i] = false;
    });

    return _.chain(protectedArray)
            .uniq().compact()
            .all(function(department) {
                var first_i = protectedArray.indexOf(department),
                    last_i  = protectedArray.lastIndexOf(department),
                    count   = _.select(protectedArray, function(d) {
                        return d === department;
                    }).length;
                return count == last_i - first_i + 1;
            }).value();
});



// Rotators who rotate department of gynecology should rotate
// obstetrics before gynecology.
// 
GA.Gene.add_validator(function(name, currentSchedule, initialSchedule) {
    var lastIndexOfObstetrics = currentSchedule.findReverseIndex(
        function(department) {
            return department === '産科';
        });
    var firstIndexOfGynecology = (function() {
        var i = currentSchedule.findIndex(function(department) {
            return department === '婦人科';
        });
        return i === -1 ? currentSchedule.length : i;
    })();
    return lastIndexOfObstetrics < firstIndexOfGynecology;
});



// More satifcation of residents' hope is better.
// 
GA.Gene.add_evaluator(function(name, currentSchedule, initialSchedule) {
    var satisfaction_score = _.chain(currentSchedule)
                .zip(initialSchedule)
                .inject(function(sum, ary) {
                    return sum + (ary[0] === ary[1] ? 1 : 0);
                }, 0)
                .value();
    return satisfaction_score;
});



// Some department belonging to same section should be rotated continously.
// 
GA.Gene.add_evaluator(function(name, currentSchedule, initialSchedule) {
    var score = 0;
    _.each(Options.setsOfDepartmentsForFragmentCheck, function(departments) {
        var iterator = function(department) {
            return _.contains(departments, department);
        };

        var count = _.select(currentSchedule, iterator).length;
        if (count === 0) { return 'next'; }

        var first_i = currentSchedule.findIndex(iterator),
            last_i  = currentSchedule.findReverseIndex(iterator);
        if (count !== last_i - first_i + 1) {
            score += 1;
        }
    });
    return -1 * score * currentSchedule.length * 100;
});



// Residents of each departments should be less variance and
// be less than upper limit.
// 
GA.Chromosome.add_evaluator(function(genes) {
    var length = genes[0].length,
        sumObject = {};

    // Sum up rotators of each department and rotation unit.
    _.each(genes, function(gene) {
        _.each(gene, function(department, i) {
            if (! sumObject[department]) {
                var ary = Array(length);
                for (var k = 0; k < length; k++) {
                    ary[k] = 0;
                }
                sumObject[department] = ary;
            }
            sumObject[department][i] += 1;
        });
    });

    _.each(sumObject, function(array, department) {
        var reservedResidents = Options.reservedResidents[department];
        if (! reservedResidents) {
            return 'next';
        }
        sumObject[department] = _.chain(array)
                                .zip(reservedResidents)
                                .map(function(ary) {
                                    return ary[0] + ary[1];
                                }).value();
    });


    // Rotators of each department should be less than limit.
    var violationCount = _.inject(sumObject,
        function(sum, schedule, department) {
            var departmentViolationCount = _.chain(schedule)
                                            .zip(Options.upperLimits[department])
                                            .inject(function(sum, ary) {
                                                var residents = ary[0],
                                                    limit     = ary[1];
                                                return sum + _.max([residents - limit, 0]);
                                            }, 0)
                                            .value();
            return sum + departmentViolationCount;
        }, 0);
    var violationScore = violationCount * -1 * length * 10;


    // Rotator variance of each department should be less.
    var variance = _.inject(Options.setsOfDepartmentsForVariance,
        function(sum, departments) {
            var tmp_ary = _.zip.apply(_,
                    _.chain(departments)
                    .map(function(department) {
                        return sumObject[department];
                    })
                    .compact()
                    .value()
                );
            var length = tmp_ary.length;
            if (length === 0) {
                return sum;
            }
            var schedule = _.map(tmp_ary, function(ary) {
                return _.inject(ary, function(s, m) {
                    return s + m;
                });
            });

            var average = _.inject(schedule, function(s, m) {
                return s + m;
            }) / length;
            var variance = _.inject(schedule, function(s, m) {
                return s + Math.pow(average - m, 2)
            }, 0) / length;

            return sum + variance;
        }, 0);
    var varianceScore = Math.round(variance * -1 * Options.coefficientOfVariance * 10);

    return violationScore + varianceScore;
});