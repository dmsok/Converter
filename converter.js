/* Конвертор на Node.js*/

var util = require('util'),
    objpath = require('object-path'),
    libxmljs = require('libxmljs'),
    traverse = require('traverse'),
    Saxmlp = require('saxmlp'),
    jso2xml = require('jso2xml'),
    dicset = require('dicset');

var log = function(){};
module.exports.debug = function(){
    log = require('log');
    var fs = require('fs');
    var ErrorHandler = require('errh');
    var rexstat = require('rex-stat');
    var run = {file: {}};

    run.func = importFn;
    //run.file.name = 'bn-ex.txt'; // import
    //run.file.name = 'bn-ex-2.txt'; // import
    run.file.name = 'bn-ex-3.txt'; // import

    //run.func = exportFn;
    //run.file.name = 'rex-single.xml'; // export
    //run.file.name = 'rex-1000-2.xml'; // export
    //run.file.name = 'rex-example.xml'; // export
    //run.file.name = 'rex.xml'; // export много стройки
    //run.file.name = 'rex-1000-3.xml'; // export

    run.file.to = '[0].data';
    run.cb_this = null;
    run.data = [
        {
            //filter: [rub5Export],
            //filter: [rub1Export, rub2Export, rub3Export, rub4Export],
            //filter: [rub8Export, rub9Export, rub10Export],
            //filter: [rub12Export],
            //filter: [rub15Export, rub16Export, rub17Export, rub18Export],
            //filter: [rub20Export, rub21Export, rub23Export, rub24Export, rub25Export],
            //filter: [rub26Export, rub27Export],
            //filter: [rub28Export, rub29Export, rub30Export, rub31Export],
            
            //filter: [rub1Import, rub2Import, rub3Import, rub4Import],
            //filter: [rub8Import],
            //filter: [rub20Import, rub21Import, rub23Import, rub24Import, rub25Import],
            //filter: [rub26Import, rub27Import],
            
            config: {dicfile: './convert/bn-text/bn.dic'},
            log: logFn,
            error: new ErrorHandler('bn-text', 'convert'),
            stat: new rexstat(),
            currency: {rate: function(){}, to: function(){}, from: function(){}}
        },
        function(error, result){
            if (result.from == 'rex'){
                log('RESULTS Count: ' + result.data.length, 'RESULT Error: ' + result.errors.errors.length, result);
                //fs.writeFileSync('debug.txt', result.data.map(function(e){return e.contents}).join('\n'), {encoding: 'utf-8'});
                fs.writeFileSync('bn-ex.txt', result.data.map(function(e){return e.contents}).join('\n'), {encoding: 'utf-8'});
                log.end();
                //console.log(results.errors);
            }
            else {
                log('RESULTS Count: ' + results.length, 'RESULT Error: ' + result.errors.errors.length, result);
                //fs.writeFileSync('debug.txt', result.data, {encoding: 'utf-8'});
                fs.writeFileSync('bn-im.txt', result.data, {encoding: 'utf-8'});
                log.end();
                //console.log(results.errors);
            }
        }
    ];
    log.config.hold = true;
    log.config.out = {html: false, debug: true, script: true};
    log.debug.apply(run, arguments);

    /*function logFn(){};
    logFn.progress = function(){};
    logFn.error = function(){};
    logFn.info = function(){};*/
    function logFn(){console.log.apply(console, Array.prototype.slice.call(arguments, 0))}
    logFn.error = logFn;
    logFn.alert = logFn;
    logFn.info = logFn;
    logFn.debug = logFn;
    logFn.progress = logFn;

};

module.exports.export = exportFn;
module.exports.import = importFn;
module.exports.validate = function(task, callback){callback()};

var expres = {}, results = []; //, errors = [], rex_doc;

/*
    В массиве rubrics определяются условия, которым должен удовлетворять объект (order), чтобы
    попасть в эту рубрику, и обработчик для объектов этой рубрики.
    Каждый элемент - это объект с двумя полями: match и handler.
    match - это массив условий, каждое условие - это объект с двумя полями: path и match.
        path - путь к полю объекта
        match - значение, которое должно храниться в поле объекта. match может быть:
            - функцией - в этом случае условие истинно, когда функция вернула true.
                Функции передаются два аргумента: объект (order) и значение поля
            - регулярным выражением - в этом случае условие истинно, если значение
                поля удовлетворяет выражению
            - строкой, числом и т.д. В этом случае идёт проверка на равенство (нестрогая проверка ==)
    Объект должен удовлетворять всем условиям из массива match. Поиск идёт до первого совпадения.
*/

var rubrics = [
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.location.0.country.0.$.id", match: /[^1]/ }, // за рубежом
        ],
        handler: rub33Export,
        file: 'zr.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 1 }, // квартира
            { path: "estate.0.house.0.ready_status.0.$.id", match: /1|2/ }, // в строящихся домах
            { path: "estate.0.location.0.region.0.$.id", match: 7800000000000 }, // СПб
        ],
        handler: rub5Export,
        file: 'ned.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 1 }, // квартира
            { path: "estate.0.location.0.region.0.$.id", match: 7800000000000 }, // СПб
        ],
        handler: rub1Export,
        file: 'zhil.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 1 }, // квартира
            { path: "estate.0.location.0.region.0.$.id", match: 4700000000000 }, // Лен. область
        ],
        handler: rub2Export,
        file: 'zhil.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 2 }, // комната
            { path: "estate.0.location.0.region.0.$.id", match: 7800000000000 }, // СПб
        ],
        handler: rub3Export,
        file: 'zhil.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 2 }, // комната
            { path: "estate.0.location.0.region.0.$.id", match: 4700000000000 }, // Лен. область
        ],
        handler: rub4Export,
        file: 'zhil.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 1 }, // покупка
            { path: "estate.0.object.0.$.id", match: /1|2/ }, // квартира или комната
        ],
        handler: rub6Export,
        file: 'zhil.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 5 }, // таунхаус
        ],
        handler: rub7Export,
        file: 'kmz.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 6 }, // коттедж
            { path: "estate.0.house.0.elite", match: function(order, v){var r = false; traverse(v).forEach(function(x){if (typeof x == 'string'){r = true}}); return r} }, // элитные
        ],
        handler: rub7Export,
        file: 'kmz.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: /3|4|6/ }, // дом, дача, коттедж
            //{ path: "estate.0.location.0.region.0.$.id", match: 4700000000000 }, // Лен. область
        ],
        handler: rub8Export,
        file: 'zdd.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 7 }, // земельных участков
            { path: "estate.0.type.0.$.id", match: 2 }, // загородных
            { path: "estate.0.location.0.region.0.$.id", match: 4700000000000 }, // Лен. область
        ],
        handler: rub9Export,
        file: 'zdd.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 1 }, // покупка
            { path: "estate.0.object.0.$.id", match: /3|4|5|6|7/ }, // дом, дача, таунхаус, коттедж, участок
            { path: "estate.0.location.0.region.0.$.id", match: 4700000000000 }, // Лен. область
        ],
        handler: rub10Export,
        file: 'zdd.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 8 }, // коммерческая недвижимость
            { path: "estate.0.house.0.ready_status.0.$.id", match: /1|2/ }, // в строящихся домах
            { path: "estate.0.location.0.region.0.$.id", match: /7800000000000|4700000000000/ }, // СПб и Лен. область
        ],
        handler: rub11Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 8 }, // коммерческая недвижимость
            { path: "estate.0.commerce.0.purpose.0.$.id", match: /1|2|5|6|7/ },
            { path: "estate.0.location.0.region.0.$.id", match: /7800000000000|4700000000000/ }, // СПб и Лен. область
        ],
        handler: rub12Export, // 12 - для офисов; 13 - сфера услуг; 14 - различного назначения
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 8 }, // производственно-складских помещений
            { path: "estate.0.commerce.0.purpose.0.$.id", match: /3|4/ },
            { path: "estate.0.location.0.region.0.$.id", match: /7800000000000|4700000000000/ }, // СПб и Лен. область
        ],
        handler: rub15Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 9 }, // отдельно стоящих зданий
            { path: "estate.0.location.0.region.0.$.id", match: /7800000000000|4700000000000/ }, // СПб и Лен. область
        ],
        handler: rub16Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 7 }, // земельных участков
            { path: "estate.0.type.0.$.id", match: 3 }, // коммерческая
            { path: "estate.0.location.0.region.0.$.id", match: /7800000000000|4700000000000/ }, // СПб и Лен. область
        ],
        handler: rub17Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: /1|3/ }, // покупка, съём
            { path: "estate.0.object.0.$.id", match: /8|9/ }, // коммерческой недвижимости, отдельно стоящих зданий
        ],
        handler: rub18Export, // 18 - покупка; 19 - съём
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: 8 }, // коммерческая недвижимость
            { path: "estate.0.commerce.0.purpose.0.$.id", match: 6 }, // офис
        ],
        handler: rub20Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: 8 }, // коммерческая недвижимость
            { path: "estate.0.commerce.0.purpose.0.$.id", match: /1|2|5|7/ },
        ],
        handler: rub21Export, // 21 - сфера услуг; 22 - различного назначения
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: 8 }, // производственно-складских помещений
            { path: "estate.0.commerce.0.purpose.0.$.id", match: /3|4/ },
        ],
        handler: rub23Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: 9 }, // отдельно стоящих зданий
        ],
        handler: rub24Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: 7 }, // земельных участков
            { path: "estate.0.type.0.$.id", match: 3 }, // коммерческая
        ],
        handler: rub25Export,
        file: 'kn.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 4 }, // сдача в аренду
            { path: "estate.0.object.0.$.id", match: /1|2|3|4|5|6/ }, // квартира или комната
        ],
        handler: rub26Export,
        file: 'ard.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 3 }, // съём
            { path: "estate.0.object.0.$.id", match: /1|2|3|4|5|6/ }, // квартира или комната
        ],
        handler: rub27Export,
        file: 'ard.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: /1|2/ }, // квартира или комната
        ],
        handler: rub28Export,
        file: 'rr.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: /3|4|5|6/ }, // дом, дача, таунхаус, коттедж
        ],
        handler: rub29Export,
        file: 'rr.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: 2 }, // продажа
            { path: "estate.0.object.0.$.id", match: 7 }, // земельных участков
        ],
        handler: rub30Export,
        file: 'rr.txt'
    },
    {
        match: [
            { path: "type.0.$.id", match: /2|4/ }, // продажа
            { path: "estate.0.object.0.$.id", match: /8|9/ }, // коммерческая недвижимость
        ],
        handler: rub31Export, // 32 - аренда
        file: 'kn.txt'
    },
    {
        match: [
            { path: 0, match: 'продажа' }, // продажа
            { path: 1, match: /\d+ккв/ }, // квартира
            { path: 2, match: 'Область' }, // Лен. область
        ],
        handler: rub2Import
    },
    {
        match: [
            { path: 0, match: 'продажа' }, // продажа
            { path: 1, match: /\d+ккв/ }, // квартира
        ],
        handler: rub1Import
    },
    {
        match: [
            { path: 0, match: 'продажа' }, // продажа
            { path: 1, match: 'комн' }, // комната
            { path: 2, match: 'Область' }, // Лен. область
        ],
        handler: rub4Import
    },
    {
        match: [
            { path: 0, match: 'продажа' }, // продажа
            { path: 1, match: 'комн' }, // комната
        ],
        handler: rub3Import
    },
    {
        match: [
            { path: 0, match: function(order, v){if (typeof dicset.reverse('district', v) == 'object'){return true}} }, // продажа квартир в строящихся домах
        ],
        handler: rub5Import
    },
    {
        match: [
            { path: 0, match: 'покупка' }, // покупка
            { path: 1, match: /\d+\sккв|\d*\s*комнат/ }, // квартира или комната
        ],
        handler: rub6Import
    },
    {
        match: [
            { path: 0, match: 'кмз' }, // продажа таунхаус
        ],
        handler: rub7Import
    },
    {
        match: [
            { path: 0, match: 'зд' }, // продажа загородной недвижимости
        ],
        handler: rub8Import
    },
    {
        match: [
            { path: 0, match: 'уч' }, // продажа загородной недвижимости
        ],
        handler: rub9Import
    },
    {
        match: [
            { path: 0, match: 'покупка' }, // покупка загородной недвижимости
        ],
        handler: rub10Import
    },
    {
        match: [
            { path: 0, match: 'кн' }, // продажа коммерческой недвижимости
        ],
        handler: rub11Import
    },
    {
        match: [
            { path: 0, match: /ко|км|кр/ }, // продажа офисов, сфера услуг, различного назначения
        ],
        handler: rub12Import
    },
    {
        match: [
            { path: 0, match: 'кс' }, // продажа производственно-складских помещений
        ],
        handler: rub15Import
    },
    {
        match: [
            { path: 0, match: 'кз' }, // продажа отдельно стоящих зданий
        ],
        handler: rub16Import
    },
    {
        match: [
            { path: 0, match: 'ку' }, // продажа коммерческих участков
        ],
        handler: rub17Import
    },
    {
        match: [
            { path: 0, match: /кю|кя/ }, // покупка или съём коммерческой недвижимости
        ],
        handler: rub18Import
    },
    {
        match: [
            { path: 0, match: 'КО' }, // сдача в аренду офисов
        ],
        handler: rub20Import
    },
    {
        match: [
            { path: 0, match: /КМ|КР/ }, // сдача в аренду - сфера услуг и различного назначения
        ],
        handler: rub21Import
    },
    {
        match: [
            { path: 0, match: 'КС' }, // сдача в аренду производственно-складских помещений
        ],
        handler: rub23Import
    },
    {
        match: [
            { path: 0, match: 'КЗ' }, // сдача в аренду отдельно стоящих зданий
        ],
        handler: rub24Import
    },
    {
        match: [
            { path: 0, match: 'КУ' }, // сдача в аренду участков
        ],
        handler: rub25Import
    },
    {
        match: [
            { path: 0, match: 'сдам' }, // сдача в аренду квартир и комнат
        ],
        handler: rub26Import
    },
    {
        match: [
            { path: 0, match: 'сниму' }, // съём квартир и комнат
        ],
        handler: rub27Import
    },
    {
        match: [
            { path: 0, match: 'рк999' }, // продажа квартир и комнат в других регионах
        ],
        handler: rub28Import
    },
    {
        match: [
            { path: 0, match: 'рд' }, // продажа загородных домов в других регионах
        ],
        handler: rub29Import
    },
    {
        match: [
            { path: 0, match: 'ру' }, // продажа загородных участков в других регионах
        ],
        handler: rub30Import
    },
    {
        match: [
            { path: 0, match: /рк|РК/ }, // продажа или аренда коммерческой недвижимости в других регионах ???? не тот индекс
        ],
        handler: rub31Import
    }
];

/*
    XML-парсер, способный разбирать XML кусками
    Создаёт структуру, подобную тому, что возвращает xml2js, для каждого объекта (order)
    Вызывает функцию exportOrder для каждого объекта
    По окончании потока данных вызывает колбэк, передаёт в него глобальные переменные
    results и errors. Массив results перед этим соединяется через '\n' в строку.
*/

function exportFn(task, callback) {

    var xmlp = new Saxmlp(task.data, { xml2js: { explicitCharkey: true } }),
        cnt = 0, ecnt = 0;
    dicset = new dicset(task.config.dicfile, true);

    xmlp.error(function(err) { task.log.error('Error parsing input XML', msg); });

    xmlp.on('//orders/order', function(xml) {
        var order = xml.order,
            bn = exportOrder(task, order);
        cnt += 1;
        if (bn) {
            ecnt += 1;
            task.stat.ok(order);
        } else {
            task.stat.fail(order);
        }
        if (cnt % 100 === 0) {
            task.log.progress("processed", cnt, "orders, exported", ecnt, "of them");
        }
    });

    xmlp.end(function() {
        var res = Object.keys(expres).map(function(e) {
            return {
                type: 'file',
                name: e,
                contents: expres[e].map(function(x) { return x.replace('\n', ''); }).join('\n')
            }
        });
        callback(null, {
            data: res,
            from: 'rex',
            to: task.format,
            /*errors: errors.length && task.error.merge(errors)
                                        .mangle('task', task.format)
                                        .mangle('ns', 'convert')
                                        .mangle('level', 10),*/
            errors: task.error,
            meta: null
        });
    })

    xmlp.parse();
}

function tag(attrs) {
    var tg = { $: {} };
    attrs.map(function(e) { tg.$[ e[0] ] = e[3]; });
    return tg;
}

function findRubric(task, order) {
    var rub, m, i, j, v, found;
    for (i in rubrics) {
        found = true;
        rub = rubrics[i];
        rub.idx = i;
        for (j in rub.match) {
            m = rub.match[j];
            v = objpath.get(order, m.path);
            if (m.match.constructor === Function) {
                found = found && m.match(order, v);
            } else if (m.match.constructor === RegExp) {
                found = found && m.match.test(v);
            } else {
                found = found && m.match == v;
            }
            if (!found) { break; }
        }
        if (found) {
            if (task.filter){if (task.filter.some(function(v){return v == rub.handler})){return rub} else {return undefined}}
            else {return rub}
        }
    }
}

function exportOrder(task, order) {
    traverse(order).forEach(function(x){if (typeof x == 'string'){this.update(x.trim())}});
    var id = objpath.get(order, "$.id"),
        rub = findRubric(task, order),
        fields;
    if (!rub) {
        task.error.fatal(id, "Couldn't determine rubric for order");
        return false;
    }
    fields = rub.handler(task, order);
    if (fields && fields.result.length && ! fields.fatal) {
        if (!expres[rub.file]) { expres[rub.file] = []; }
        expres[rub.file].push(fields.result.join(';'));
        return true;
    } else {
        task.error.fatal(id, "Missing a required fields: " + fields.message.join(", ") + ";");
        return false;
    }
}

/* ============================================================================================================================================================================== */

function importFn(task, callback){

    dicset = new dicset(task.config.dicfile, {
        callback: function(dic, id){
            if (dic == 'price_unit'){
                this.def = {};
                this.settings.xml2js = false;
            }
            else {
                this.def = id;
                this.settings.xml2js = true;
            }
        }
    });
    //rex_doc = new libxmljs.Document();
    //rex_doc.node('root').node('orders');
    var orders = [], order;
    if (typeof task.data == 'string'){orders = task.data.split(/\r?\n/)}
    else if (util.isArray(task.data)){task.data.forEach(function(x){if (x && x.contents && (typeof x.contents == 'string')){x.contents.split(/\r?\n/).forEach(function(y){orders.push(y)})}})}
    else {task.error.fatal("Wrong task.data type")}
    for (var i = 0; i < orders.length; i++){
        order = orders[i].replace(/;$/, '').split(';');
        importOrder(task, order, i + 1);
    }
    callback(null, {
        data: '<?xml version="1.0" encoding="UTF-8"?>\n<root rev="1.0">\n<orders>\n' + results.join('\n') + '\n</orders>\n</root>',
        from: task.format,
        to: 'rex',
        errors: task.error,
        meta: null
    });

}

function importOrder(task, order, id){
    id = id || -1;
    var rub = findRubric(task, order),
        fields;
    if (!rub) {
        task.error.fatal(id, "Couldn't determine rubric for order");
        return false;
    }
    fields = rub.handler(task, order);
    if (fields && ! fields.fatal) {
        results.push(fields.result);
        return true;
    }
    else if (! fields){}
    else {
        task.error.fatal(id, "Missing a required fields: " + fields.message.join(", ") + ";");
        return false;
    }
}

/*
    Дальше идут обработчики конкретных рубрик.
    Сопоставление обработчиков и объектов производится функцией findRubric.
    Условия, которым должен удовлетворять объект, чтобы попасть в рубрику,
    задаются в массиве rubrics выше.
*/

/*
    рубрика: продажа квартир в Санкт-Петербурге
    Возвращает массив полей, необходимых для рубрики.
    Если какое-то поле нужно оставить незаполненным, в него можно просто ничего не записывать (как здесь с полем res[2])
*/

function buildEndEx(task, order){
    var quar, year;
    if (objpath.get(order, "estate.0.house.0.ready_status.0.$.id") == 2){return 'госком.'}
    if (objpath.get(order, "estate.0.house.0.ready_status.0.$.id") == 3){return 'сдан'}
    quar = objpath.get(order, "estate.0.house.0.build_quarter.0._") || Math.floor((String(objpath.get(order, "estate.0.house.0.build_date.0._")).split(/\D/)[1] - 1)/3) + 1;
    if (quar == 1){quar = 'I'}
    else if (quar == 2){quar = 'II'}
    else if (quar == 3){quar = 'III'}
    else if (quar == 4){quar = 'IV'}
    else {return}
    year = objpath.get(order, "estate.0.house.0.build_year.0._") || String(objpath.get(order, "estate.0.house.0.build_date.0._")).split(/\D/)[2];
    if (! year){return}
    if (year.length > 2){year = year.substring(2)}
    return quar + ' кв. ' + year;
}

function getPriceEx(task, order, kof){
    var cur, pr, ret = [];
    if (! kof){kof = 0.001}
    cur = objpath.get(order, "price.0.full.0.$.currency") || 'RUR';
    pr = objpath.get(order, "price.0.full.0._");
    if (cur == 'RUR'){
        ret[0] = Math.round(pr * kof);
    }
    else {
        ret[0] = Math.round(task.currency.from(cur, pr) * kof);
        ret[2] = Math.round(pr * kof);
        ret[3] = cur;
    }
    if (kof == 1){ret[1] = 'р'}
    else if (kof == 0.001){ret[1] = 'тыс. р.'}
    else {ret[1] = ''}
    return ret;
/*return [task.currency.from(cur, pr), pr, cur]*/
}

function rub1Export(task, order){

    var res = [], dic, t1;

    res[0] = 'продажа';
    res[1] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + 'ккв';
    res[2] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[5] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[6] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    if (res[8] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[8] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    res[9] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[10] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[11] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[12] = objpath.get(order, "owner.0.company.0._");
    res[13] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[14] = pr[0];
    res[15] = pr[1];
    if (dic = objpath.get(order, "mortgage.0.term")){res[16] = dic.map(function(v){return dicset.lookup('additional_terms', v.$.id).$id})}
    res[17] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[18] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'комнатность'")}
    if (! res[2]) {err_f = true; err_m.push("'район города'")}
    if (! res[3]) {err_f = true; err_m.push("'адрес'")}
    if (! res[8]) {err_f = true; err_m.push("'метро'")}
    if (! res[12]){err_f = true; err_m.push("'агенство'")}
    if (! res[13]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[14]){err_f = true; err_m.push("'цена'")}
    if (! res[15]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub2Export(task, order){

    var res = [], dic, t1;

    res[0] = 'продажа';
    res[1] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + 'ккв';
    res[2] = 'Область';
    res[3] = dicset.lookup('area', objpath.get(order, "estate.0.location.0.area.0.$.id")).$id;
    res[4] = objpath.get(order, "estate.0.location.0.string.0._");
    res[5] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[6] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[8] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    if (res[9] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[9] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    if (dic = objpath.get(order, "estate.0.transport.0.railway.0.station.0._")){res[9] = res[9] ? res[9] + ', ' + dic : dic}
    res[10] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[11] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[12] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[13] = objpath.get(order, "owner.0.company.0._");
    res[14] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[15] = pr[0];
    res[16] = pr[1];
    if (dic = objpath.get(order, "mortgage.0.term")){res[17] = dic.map(function(v){return dicset.lookup('additional_terms', v.$.id).$id})}
    res[18] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[19] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'комнатность'")}
    if (! res[2]) {err_f = true; err_m.push("'регион'")}
    if (! res[3]) {err_f = true; err_m.push("'район области'")}
    if (! res[4]) {err_f = true; err_m.push("'адрес'")}
    if (! res[13]){err_f = true; err_m.push("'агенство'")}
    if (! res[14]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[15]){err_f = true; err_m.push("'цена'")}
    if (! res[16]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub3Export(task, order){

    var res = [], dic, t1;

    res[0] = 'продажа';
    res[1] = 'комн';
    res[2] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[3] = objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._") || 1;
    res[4] = objpath.get(order, "estate.0.location.0.string.0._");
    res[5] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[6] = res[3] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    res[8] = (objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") || '') + '/' + (objpath.get(order, "rent.0.tenants.0._") || '') + '/' + (objpath.get(order, "rent.0.neighbors.0._") || '');
    if (res[9] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[9] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    res[10] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[11] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[12] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[13] = objpath.get(order, "owner.0.company.0._");
    res[14] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[15] = pr[0];
    res[16] = pr[1];
    res[17] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[18] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'объект'")}
    if (! res[2]) {err_f = true; err_m.push("'район города'")}
    if (! res[3]) {err_f = true; err_m.push("'кол-во продаваемых комнат'")}
    if (! res[4]) {err_f = true; err_m.push("'адрес'")}
    if (! res[9]) {err_f = true; err_m.push("'метро'")}
    if (! res[13]){err_f = true; err_m.push("'агенство'")}
    if (! res[14]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[15]){err_f = true; err_m.push("'цена'")}
    if (! res[16]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub4Export(task, order){

    var res = [], dic, t1;

    res[0] = 'продажа';
    res[1] = 'комн';
    res[2] = 'Область';
    res[3] = objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._") || 1;
    res[4] = dicset.lookup('area', objpath.get(order, "estate.0.location.0.area.0.$.id")).$id;
    res[5] = objpath.get(order, "estate.0.location.0.string.0._");
    res[6] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[7] = res[3] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[8] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    res[9] = (objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") || '') + '/' + (objpath.get(order, "rent.0.tenants.0._") || '') + '/' + (objpath.get(order, "rent.0.neighbors.0._") || '');
    if (res[10] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[10] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    if (dic = objpath.get(order, "estate.0.transport.0.railway.0.station.0._")){res[10] = res[10] ? res[10] + ', ' + dic : dic}
    res[11] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[12] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[13] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[14] = objpath.get(order, "owner.0.company.0._");
    res[15] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[16] = pr[0];
    res[17] = pr[1];
    res[18] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[19] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'объект'")}
    if (! res[2]) {err_f = true; err_m.push("'регион'")}
    if (! res[3]) {err_f = true; err_m.push("'кол-во продаваемых комнат'")}
    if (! res[4]) {err_f = true; err_m.push("'район области'")}
    if (! res[5]) {err_f = true; err_m.push("'адрес'")}
    if (! res[14]){err_f = true; err_m.push("'агенство'")}
    if (! res[15]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[16]){err_f = true; err_m.push("'цена'")}
    if (! res[17]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub5Export(task, order){

    var res = [], dic, t1;

    res[0] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[1] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._");
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[4] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[5] = res[1] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[6] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    if (res[7] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[7] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    res[8] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[9] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[10] = objpath.get(order, "owner.0.company.0._");
    res[11] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[12] = pr[0];
    res[13] = pr[1];
    if (dic = objpath.get(order, "mortgage.0.term")){res[14] = dic.map(function(v){return dicset.lookup('additional_terms', v.$.id).$id})}
    res[15] = buildEndEx(task, order);
    res[16] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[17] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'район города'")}
    if (! res[1]) {err_f = true; err_m.push("'кол-во комнат'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[7]) {err_f = true; err_m.push("'метро'")}
    if (! res[10]){err_f = true; err_m.push("'агенство'")}
    if (! res[11]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[12]){err_f = true; err_m.push("'цена'")}
    if (! res[13]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub6Export(task, order){

    var res = [], dic, t1;

    res[0] = 'покупка';
    if (objpath.get(order, "estate.0.object.0.$.id") == 1){res[1] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + ' ккв'}
    else {
        dic = objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._");
        if (! dic){res[1] = 'комната'}
        else if (dic == 1){res[1] = 'комната'}
        else {res[1] = dic + ' комнаты'}
    }
    res[2] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id || '';
    if (dic = objpath.get(order, "estate.0.location.0.string.0._")){res[2] = res[2] ? res[2] + ', ' + dic : dic}
    res[3] = objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[4] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    res[5] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 52) : '';
    res[6] = objpath.get(order, "owner.0.company.0._");
    res[7] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[8] = pr[0];
    res[9] = pr[1];
    res[10] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'объект'")}
    if (! res[6]){err_f = true; err_m.push("'агенство'")}
    if (! res[7]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[8]){err_f = true; err_m.push("'цена'")}
    if (! res[9]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub7Export(task, order){

    var res = [], dic, t1;

    res[0] = 'кмз';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._");
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[5] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[6] = res[2] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    if (res[8] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[8] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    res[9] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[10] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[11] = objpath.get(order, "owner.0.company.0._");
    res[12] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[13] = pr[0];
    res[14] = pr[1];
    if (dic = objpath.get(order, "mortgage.0.term")){res[15] = dic.map(function(v){return dicset.lookup('additional_terms', v.$.id).$id})}
    res[16] = buildEndEx(task, order); // ????????????
    res[17] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 25) : '';
    res[18] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'кол-во комнат'")}
    if (! res[3]) {err_f = true; err_m.push("'адрес'")}
    if (! res[8]) {err_f = true; err_m.push("'метро'")}
    if (! res[11]){err_f = true; err_m.push("'агенство'")}
    if (! res[12]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[13]){err_f = true; err_m.push("'цена'")}
    if (! res[14]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub8Export(task, order){

    var res = [], dic, t1;

    res[0] = 'зд';
    res[1] = dicset.lookup('area', objpath.get(order, "estate.0.location.0.area.0.$.id")).$id;
    res[2] = dicset.lookup('object_type', objpath.get(order, "estate.0.object.0.$.id")).$id;
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = objpath.get(order, "estate.0.plot.0.space.0._") / 100;
    res[6] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.storey.0.total.0._");
    res[8] = dicset.lookup('house_type', objpath.get(order, "estate.0.house.0.type.0.$.id")).$id;
    res[9] = objpath.get(order, "estate.0.facilities.0.heating.0.$.id") ? '+' : '-';
    res[10] = objpath.get(order, "estate.0.facilities.0.electricity.0._") === 'true' ? '+' : '-';
    res[11] = objpath.get(order, "estate.0.facilities.0.water.0._") === 'true' ? '+' : '-';
    res[12] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 40) : '';
    var pr = getPriceEx(task, order);
    res[13] = pr[0];
    res[14] = pr[1];
    res[15] = objpath.get(order, "owner.0.company.0._");
    res[16] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[17] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район'")}
    if (! res[2]) {err_f = true; err_m.push("'объект'")}
    if (! res[3]) {err_f = true; err_m.push("'нас. пункт'")}
    if (! res[13]){err_f = true; err_m.push("'цена'")}
    if (! res[14]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[15]){err_f = true; err_m.push("'агенство'")}
    if (! res[16]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub9Export(task, order){

    var res = [], dic, t1;

    res[0] = 'уч';
    res[1] = dicset.lookup('area', objpath.get(order, "estate.0.location.0.area.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.plot.0.space.0._") / 100;
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    var pr = getPriceEx(task, order);
    res[6] = pr[0];
    res[7] = pr[1];
    res[8] = objpath.get(order, "owner.0.company.0._");
    res[9] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[10] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район'")}
    if (! res[2]) {err_f = true; err_m.push("'нас. пункт'")}
    if (! res[6]){err_f = true; err_m.push("'цена'")}
    if (! res[7]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[8]){err_f = true; err_m.push("'агенство'")}
    if (! res[9]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub10Export(task, order){

    var res = [], dic, t1;

    res[0] = 'покупка';
    res[1] = dicset.lookup('object_type', objpath.get(order, "estate.0.object.0.$.id")).$id;
    res[2] = dicset.lookup('area', objpath.get(order, "estate.0.location.0.area.0.$.id")).$id || '';
    if (dic = objpath.get(order, "estate.0.location.0.string.0._")){res[2] = res[2] ? res[2] + ', ' + dic : dic}
    res[3] = objpath.get(order, "estate.0.plot.0.space.0._") / 100;
    res[4] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 83) : '';
    var pr = getPriceEx(task, order);
    res[5] = pr[0];
    res[6] = pr[1];
    res[7] = objpath.get(order, "owner.0.company.0._");
    res[8] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[9] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'объект'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[5]){err_f = true; err_m.push("'цена'")}
    if (! res[6]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[7]){err_f = true; err_m.push("'агенство'")}
    if (! res[8]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub11Export(task, order){

    var res = [], dic, t1;

    res[0] = 'кн';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.actual.0._");
    //res[5] вход
    //res[6] состояние
    res[7] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    res[8] = buildEndEx(task, order);
    var pr = getPriceEx(task, order);
    res[9] = pr[0];
    res[10] = pr[1];
    res[11] = objpath.get(order, "owner.0.company.0._");
    res[12] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[13] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[9]){err_f = true; err_m.push("'цена'")}
    if (! res[10]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[11]){err_f = true; err_m.push("'агенство'")}
    if (! res[12]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub12Export(task, order){

    var res = [], dic, t1;

    dic = objpath.get(order, "estate.0.commerce.0.purpose.0.$.id");
    if (dic == 6){res[0] = 'ко'}
    else if (dic == 5){res[0] = 'км'}
    else {res[0] = 'кр'}
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.actual.0._");
    //res[5] вход
    //res[6] состояние
    res[7] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 60) : '';
    var pr = getPriceEx(task, order);
    res[8] = pr[0];
    res[9] = pr[1];
    res[10] = objpath.get(order, "owner.0.company.0._");
    res[11] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[12] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[8]){err_f = true; err_m.push("'цена'")}
    if (! res[9]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[10]){err_f = true; err_m.push("'агенство'")}
    if (! res[11]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub15Export(task, order){

    var res = [], dic, t1;

    res[0] = 'кс';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    //res[4] подъезд
    res[5] = objpath.get(order, "estate.0.flat.0.height.0._");
    //res[6] состояние
    res[7] = objpath.get(order, "estate.0.facilities.0.electricity.0._") === 'true' ? '+' : '-';
    res[8] = objpath.get(order, "estate.0.facilities.0.water.0._") === 'true' ? '+' : '-';
    res[9] = objpath.get(order, "estate.0.facilities.0.heating.0.$.id") ? '+' : '-';
    res[10] = objpath.get(order, "estate.0.facilities.0.sewer.0.$.id") ? '+' : '-';
    res[11] = objpath.get(order, "estate.0.plot.0.space.0._");
    res[12] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 45) : '';
    var pr = getPriceEx(task, order);
    res[13] = pr[0];
    res[14] = pr[1];
    res[15] = objpath.get(order, "owner.0.company.0._");
    res[16] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[17] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[13]){err_f = true; err_m.push("'цена'")}
    if (! res[14]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[15]){err_f = true; err_m.push("'агенство'")}
    if (! res[16]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub16Export(task, order){

    var res = [], dic, t1;

    res[0] = 'кз';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.total.0._");
    //res[5] состояние
    res[6] = objpath.get(order, "estate.0.commerce.0.phonelines.0._") ? '+' : '-'; // ??? коммуникации
    res[7] = objpath.get(order, "estate.0.plot.0.space.0._");
    res[8] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 65) : '';
    var pr = getPriceEx(task, order);
    res[9] = pr[0];
    res[10] = pr[1];
    res[11] = objpath.get(order, "owner.0.company.0._");
    res[12] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[13] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[9]){err_f = true; err_m.push("'цена'")}
    if (! res[10]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[11]){err_f = true; err_m.push("'агенство'")}
    if (! res[12]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub17Export(task, order){

    var res = [], dic, t1;

    res[0] = 'ку';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.plot.0.space.0._") + ' кв. м.'; // ??? или commerce.space
    //res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 80) : '';
    var pr = getPriceEx(task, order);
    res[6] = pr[0];
    res[7] = pr[1];
    res[8] = objpath.get(order, "owner.0.company.0._");
    res[9] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[10] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]) {err_f = true; err_m.push("'район города'")}
    if (! res[2]) {err_f = true; err_m.push("'адрес'")}
    if (! res[6]){err_f = true; err_m.push("'цена'")}
    if (! res[7]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[8]){err_f = true; err_m.push("'агенство'")}
    if (! res[9]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub18Export(task, order){

    var res = [], dic, t1;

    if (objpath.get(order, "type.0.$.id" == 1)){res[0] = 'кю'}
    else {res[0] = 'кя'}
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id || '';
    if (dic = objpath.get(order, "estate.0.location.0.string.0._")){res[1] = res[1] ? res[1] + ', ' + dic : dic}
    res[2] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[3] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 72) : '';
    var pr = getPriceEx(task, order);
    res[4] = pr[0];
    res[5] = pr[1];
    res[6] = objpath.get(order, "owner.0.company.0._");
    res[7] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[8] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[4]){err_f = true; err_m.push("'цена'")}
    if (! res[5]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[6]){err_f = true; err_m.push("'агенство'")}
    if (! res[7]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub20Export(task, order){

    var res = [], dic, t1;

    res[0] = 'КО';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.actual.0._");
    //res[5] вход
    //res[6] состояние
    res[7] = objpath.get(order, "estate.0.commerce.0.phonelines.0._");
    res[8] = objpath.get(order, "estate.0.facilities.0.parking.0._") === 'true' ? '+' : '-';
    res[9] = objpath.get(order, "estate.0.facilities.0.guard.0._") === 'true' ? '+' : '-';
    res[10] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    var pr = getPriceEx(task, order);
    res[11] = pr[0];
    res[12] = pr[1];
    res[13] = objpath.get(order, "owner.0.company.0._");
    res[14] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[15] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'район города'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[11]){err_f = true; err_m.push("'цена'")}
    if (! res[12]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[13]){err_f = true; err_m.push("'агенство'")}
    if (! res[14]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub21Export(task, order){

    var res = [], dic, t1;

    dic = objpath.get(order, "estate.0.commerce.0.purpose.0.$.id");
    if (dic == 5){res[0] = 'КМ'}
    else {res[0] = 'КР'}
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.actual.0._");
    //res[5] вход
    //res[6] состояние
    res[7] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    var pr = getPriceEx(task, order);
    res[8] = pr[0];
    res[9] = pr[1];
    res[10] = objpath.get(order, "owner.0.company.0._");
    res[11] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[12] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'район города'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[8]){err_f = true; err_m.push("'цена'")}
    if (! res[9]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[10]){err_f = true; err_m.push("'агенство'")}
    if (! res[11]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub23Export(task, order){

    var res = [], dic, t1;

    res[0] = 'КС';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    //res[4] подъезд
    res[5] = objpath.get(order, "estate.0.flat.0.height.0._");
    //res[6] состояние
    res[7] = objpath.get(order, "estate.0.facilities.0.electricity.0._") === 'true' ? '+' : '-';
    res[8] = objpath.get(order, "estate.0.facilities.0.water.0._") === 'true' ? '+' : '-';
    res[9] = objpath.get(order, "estate.0.facilities.0.heating.0.$.id") ? '+' : '-';
    res[10] = objpath.get(order, "estate.0.facilities.0.sewer.0.$.id") ? '+' : '-';
    res[11] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    var pr = getPriceEx(task, order);
    res[12] = pr[0];
    res[13] = pr[1];
    res[14] = objpath.get(order, "owner.0.company.0._");
    res[15] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[16] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'район города'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[12]){err_f = true; err_m.push("'цена'")}
    if (! res[13]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[14]){err_f = true; err_m.push("'агенство'")}
    if (! res[15]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub24Export(task, order){

    var res = [], dic, t1;

    res[0] = 'КЗ';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.total.0._");
    //res[5] состояние
    res[6] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 70) : '';
    var pr = getPriceEx(task, order);
    res[7] = pr[0];
    res[8] = pr[1];
    res[9] = objpath.get(order, "owner.0.company.0._");
    res[10] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[11] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'район города'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[7]){err_f = true; err_m.push("'цена'")}
    if (! res[8]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[9]){err_f = true; err_m.push("'агенство'")}
    if (! res[10]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub25Export(task, order){

    var res = [], dic, t1;

    res[0] = 'КУ';
    res[1] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.plot.0.space.0._") + ' кв. м.'; // ??? или commerce.space
    //res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 80) : '';
    var pr = getPriceEx(task, order);
    res[6] = pr[0];
    res[7] = pr[1];
    res[8] = objpath.get(order, "owner.0.company.0._");
    res[9] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[10] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'район города'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[6]){err_f = true; err_m.push("'цена'")}
    if (! res[7]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[8]){err_f = true; err_m.push("'агенство'")}
    if (! res[9]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub26Export(task, order){

    var res = [], dic, t1;

    res[0] = 'сдам';
    if (objpath.get(order, "estate.0.house.0.elite") || objpath.get(order, "estate.0.flat.0.elite")){res[1] = 'Э'}
    else if (objpath.get(order, "rent.0.short.0._") === 'true'){res[1] = 'С'}
    //else if (objpath.get(order, "estate.0.location.0.region.0.$.id") == 4700000000000){res[1] = 'З'}
    else if (objpath.get(order, "estate.0.object.0.$.id").toString().search(/3|4|5|6/) != -1){res[1] = 'З'}
    else {res[1] = 'М'}
    if (objpath.get(order, "estate.0.object.0.$.id") == 1){res[2] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + 'ккв'}
    else if (objpath.get(order, "estate.0.object.0.$.id") == 2){res[2] = (objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._") || '1') + 'к/' + (objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") || '')}
    else if (objpath.get(order, "estate.0.object.0.$.id").toString().search(/3|4|5/) != -1){res[2] = 'дом'}
    else {res[2] = 'ктж'}
    if (objpath.get(order, "estate.0.location.0.region.0.$.id") == 4700000000000){res[3] = 'Область'}
    else {res[3] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id}
    res[4] = objpath.get(order, "estate.0.location.0.string.0._");
    res[5] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[6] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[7] = res[2].split(/ккв|к\//)[0] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[8] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    res[9] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[10] = objpath.get(order, "estate.0.facilities.0.furniture.0._") === 'true' ? '+' : '-';
    res[11] = objpath.get(order, "estate.0.facilities.0.fridge.0._") === 'true' ? '+' : '-';
    res[12] = objpath.get(order, "estate.0.facilities.0.washmachine.0._") === 'true' ? '+' : '-';
    if (res[13] = dicset.lookup('metro_station', objpath.get(order, "estate.0.transport.0.metro.0.station.0.$.id")).$id){
        if (dic = objpath.get(order, "estate.0.transport.0.metro.0.time.0._")){
            res[13] += ' ' + dic + ' ' + (dicset.lookup('after_transport', objpath.get(order, "estate.0.transport.0.metro.0.type.0.$.id")).$id || 'пеш.');
        }
    }
    var pr = getPriceEx(task, order, 1);
    res[14] = pr[0];
    res[15] = pr[1];
    if (! (res[16] = +objpath.get(order, "rent.0.term.0._"))){res[16] = objpath.get(order, "rent.0.short.0._") === 'true' ? '' : 'дл'}
    res[17] = objpath.get(order, "owner.0.company.0._");
    res[18] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[19] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 45) : '';
    res[20] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'раздел'")}
    if (! res[2]){err_f = true; err_m.push("'объект'")}
    if (! res[3]){err_f = true; err_m.push("'район'")}
    if (! res[4]){err_f = true; err_m.push("'адрес'")}
    if (! res[13]){err_f = true; err_m.push("'метро'")}
    if (! res[14]){err_f = true; err_m.push("'цена'")}
    if (! res[15]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[17]){err_f = true; err_m.push("'агенство'")}
    if (! res[18]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub27Export(task, order){

    var res = [], dic, t1;

    res[0] = 'сниму';
    if (objpath.get(order, "estate.0.house.0.elite") || objpath.get(order, "estate.0.flat.0.elite")){res[1] = 'Э'}
    else if (objpath.get(order, "rent.0.short.0._") === 'true'){res[1] = 'С'}
    //else if (objpath.get(order, "estate.0.location.0.region.0.$.id") == 4700000000000){res[1] = 'З'}
    else if (objpath.get(order, "estate.0.object.0.$.id").toString().search(/3|4|5|6/) != -1){res[1] = 'З'}
    else {res[1] = 'М'}
    if (objpath.get(order, "estate.0.object.0.$.id") == 1){res[2] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + 'ккв'}
    else if (objpath.get(order, "estate.0.object.0.$.id") == 2){res[2] = (objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._") || '1') + 'комн'}
    else if (objpath.get(order, "estate.0.object.0.$.id").toString().search(/3|4|5/) != -1){res[2] = 'дом'}
    else {res[2] = 'ктж'}
    res[3] = dicset.lookup('district', objpath.get(order, "estate.0.location.0.district.0.$.id")).$id;
    res[4] = objpath.get(order, "estate.0.location.0.string.0._");
    res[5] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[6] = objpath.get(order, "estate.0.facilities.0.furniture.0._") === 'true' ? '+' : '-';
    res[7] = objpath.get(order, "estate.0.facilities.0.fridge.0._") === 'true' ? '+' : '-';
    res[8] = objpath.get(order, "estate.0.facilities.0.washmachine.0._") === 'true' ? '+' : '-';
    var pr = getPriceEx(task, order, 1);
    res[9] = pr[0];
    res[10] = pr[1];
    if (! (res[11] = +objpath.get(order, "rent.0.term.0._"))){res[11] = objpath.get(order, "rent.0.short.0._") === 'true' ? '' : 'дл'}
    res[12] = objpath.get(order, "owner.0.company.0._");
    res[13] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[14] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 55) : '';
    res[15] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'раздел'")}
    if (! res[2]){err_f = true; err_m.push("'объект'")}
    if (! res[3]){err_f = true; err_m.push("'район'")}
    if (! res[9]){err_f = true; err_m.push("'цена'")}
    if (! res[10]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[12]){err_f = true; err_m.push("'агенство'")}
    if (! res[13]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub28Export(task, order){

    var res = [], dic, t1;

    res[0] = 'рк';
    if (objpath.get(order, "estate.0.object.0.$.id") == 1){res[1] = objpath.get(order, "estate.0.flat.0.rooms.0.total.0._") + 'ккв'}
    else if (objpath.get(order, "estate.0.object.0.$.id") == 2){res[1] = (objpath.get(order, "estate.0.flat.0.rooms.0.actual.0._") || '1') + 'комн'}
    res[2] = objpath.get(order, "estate.0.location.0.region.0._"); // ????????? регион - справочник fias
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[5] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[6] = res[1].split(/\D/)[0] < 5 ? objpath.get(order, "estate.0.flat.0.space.0.desc.0._") || objpath.get(order, "estate.0.flat.0.space.0.living.0._") : objpath.get(order, "estate.0.flat.0.space.0.living.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.space.0.kitchen.0._");
    res[8] = objpath.get(order, "estate.0.facilities.0.phone.0._") === 'true' ? '+' : '-';
    res[9] = dicset.lookup('house_series', objpath.get(order, "estate.0.house.0.series.0.$.id")).$id;
    res[10] = dicset.lookup('bath_type', objpath.get(order, "estate.0.facilities.0.bath.0.$.id")).$id;
    res[11] = objpath.get(order, "owner.0.company.0._");
    res[12] = objpath.get(order, "owner.0.agent.0.phone.0._");
    var pr = getPriceEx(task, order);
    res[13] = pr[0];
    res[14] = pr[1];
    res[15] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 40) : '';
    res[16] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'объект'")}
    if (! res[2]){err_f = true; err_m.push("'регион'")}
    if (! res[3]){err_f = true; err_m.push("'адрес'")}
    if (! res[11]){err_f = true; err_m.push("'агенство'")}
    if (! res[12]){err_f = true; err_m.push("'конт. телефон'")}
    if (! res[13]){err_f = true; err_m.push("'цена'")}
    if (! res[14]){err_f = true; err_m.push("'единицы измерения цены'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub29Export(task, order){

    var res = [], dic, t1;

    res[0] = 'рд';
    res[1] = dicset.lookup('object_type', objpath.get(order, "estate.0.object.0.$.id")).$id;
    res[2] = objpath.get(order, "estate.0.location.0.region.0._");
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = objpath.get(order, "estate.0.plot.0.space.0._") / 100;
    res[6] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[7] = objpath.get(order, "estate.0.flat.0.storey.0.total.0._");
    res[8] = dicset.lookup('house_type', objpath.get(order, "estate.0.house.0.type.0.$.id")).$id;
    res[9] = objpath.get(order, "estate.0.facilities.0.heating.0.$.id") ? '+' : '-';
    res[10] = objpath.get(order, "estate.0.facilities.0.electricity.0._") === 'true' ? '+' : '-';
    res[11] = objpath.get(order, "estate.0.facilities.0.water.0._") === 'true' ? '+' : '-';
    res[12] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 48) : '';
    var pr = getPriceEx(task, order);
    res[13] = pr[0];
    res[14] = pr[1];
    res[15] = objpath.get(order, "owner.0.company.0._");
    res[16] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[17] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'объект'")}
    if (! res[2]){err_f = true; err_m.push("'регион'")}
    if (! res[3]){err_f = true; err_m.push("'адрес'")}
    if (! res[13]){err_f = true; err_m.push("'цена'")}
    if (! res[14]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[15]){err_f = true; err_m.push("'агенство'")}
    if (! res[16]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub30Export(task, order){

    var res = [], dic, t1;

    res[0] = 'ру';
    res[1] = objpath.get(order, "estate.0.location.0.region.0._");
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.plot.0.space.0._") / 100;
    res[4] = dicset.lookup('plot_purpose_type', objpath.get(order, "estate.0.plot.0.purpose.0.$.id")).$id;
    res[5] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 60) : '';
    var pr = getPriceEx(task, order);
    res[6] = pr[0];
    res[7] = pr[1];
    res[8] = objpath.get(order, "owner.0.company.0._");
    res[9] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[10] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'регион'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[6]){err_f = true; err_m.push("'цена'")}
    if (! res[7]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[8]){err_f = true; err_m.push("'агенство'")}
    if (! res[9]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub31Export(task, order){

    var res = [], dic, t1;

    dic = objpath.get(order, "type.0.$.id");
    if (dic == 2){res[0] = 'рк'} // ????????? не тот индекс
    else {res[0] = 'РК'}
    res[1] = objpath.get(order, "estate.0.location.0.region.0._");
    res[2] = objpath.get(order, "estate.0.location.0.string.0._");
    res[3] = objpath.get(order, "estate.0.commerce.0.space.0.total.0._");
    res[4] = objpath.get(order, "estate.0.commerce.0.storey.0.actual.0._");
    //res[5] вход
    //res[6] состояние
    res[7] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 50) : '';
    var pr = getPriceEx(task, order);
    res[8] = pr[0];
    res[9] = pr[1];
    res[10] = objpath.get(order, "owner.0.company.0._");
    res[11] = objpath.get(order, "owner.0.agent.0.phone.0._");
    res[12] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'регион'")}
    if (! res[2]){err_f = true; err_m.push("'адрес'")}
    if (! res[8]){err_f = true; err_m.push("'цена'")}
    if (! res[9]){err_f = true; err_m.push("'единицы измерения цены'")}
    if (! res[10]){err_f = true; err_m.push("'агенство'")}
    if (! res[11]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function rub33Export(task, order){

    var res = [], dic, t1;

    res[0] = 'зр';
    res[1] = objpath.get(order, "estate.0.location.0.country.0._");
    res[2] = dicset.lookup('object_type', objpath.get(order, "estate.0.object.0.$.id")).$id;
    res[3] = objpath.get(order, "estate.0.location.0.string.0._");
    res[4] = (objpath.get(order, "estate.0.flat.0.storey.0.actual.0._") || '') + '/' + (objpath.get(order, "estate.0.flat.0.storey.0.total.0._") || '');
    res[5] = objpath.get(order, "estate.0.flat.0.space.0.total.0._");
    res[6] = (dic = (objpath.get(order, "estate.0.desc.0.short.0._") || objpath.get(order, "estate.0.desc.0.text.0._"))) ? dic.replace(/\r?\n/, ' ').substring(0, 40) : '';
    var pr = getPriceEx(task, order);
    res[7] = pr[0];
    res[8] = pr[2];
    res[9] = pr[3];
    res[10] = objpath.get(order, "owner.0.company.0._");
    res[11] = objpath.get(order, "owner.0.agent.0.phone.0._");
    //res[12] язык общения
    res[13] = (dic = objpath.get(order, "meta.0.highlight.0._")) ? ((dic == 1) ? '*' : (dic  == 2) ? '+' : '') : '';

    var err_f = false, err_m = [];
    if (! res[0]) {err_f = true; err_m.push("'идентификатор'")}
    if (! res[1]){err_f = true; err_m.push("'страна'")}
    if (! res[2]){err_f = true; err_m.push("'тип объекта'")}
    if (! res[3]){err_f = true; err_m.push("'адрес'")}
    if (! res[7]){err_f = true; err_m.push("'цена, тыс. р.'")}
    if (! res[10]){err_f = true; err_m.push("'агенство'")}
    if (! res[11]){err_f = true; err_m.push("'конт. телефон'")}
    //if (err_m.length){errors.push({ id: order.$.id, error: "Missing a required fields: " + err_m.join(", ") + ";"})}
    //if (err_f){return false}

    return {result: res, fatal: err_f, message: err_m};
}

function buildEndIm(ready){
    if (! ready || ready == 'сдан'){return [{$: {id: 3}}]}
    else if (ready == 'госком.'){return [{$: {id: 2}}]}
    return [{$: {id: 1}}];
}

function getMetroIm(metro){
    if (! metro){return [null]}
    var m = metro.match(/(\D*)(\d*)(.*)/);
    if (! m){return [null, metro]}
    m = m.map(function(x){return x.trim()});
    m[1] = dicset.reverse('metro_station', m[1]);
    if (typeof m[1] != 'object'){return [null, metro]}
    m[3] = dicset.reverse('after_transport', m[3]);
    return m;
}

function getPriceIm(price, unit){
    var p = price * dicset.reverse('price_unit', unit).$id;
    if (! p){return [price + ' ' + unit, '']}
    else {return [p, 'RUR']}
}

function cdata(x) {
    if (typeof x === 'undefined') { return; }
    return x && x.toString && x.toString().length ? '<![CDATA[' + x + ']]>' : x;
}

function rubImport(task, order, jso){
    traverse(jso).forEach(function(x){if (typeof x == 'string'){this.update(x.trim())}});
    var metro = getMetroIm(jso.metro),
        price = getPriceIm(jso.price, jso.price_unit),
        ready = buildEndIm(jso.ready),
        res = {
            type: {$: {id: jso.type}},
            price: {full: {$: {currency: price[1]}, _: price[0]}},
            rent: {
                short: jso.rent_short,
                term: jso.rent_term,
                tenants: jso.rent_tenants,
                neighbors: jso.rent_neighbors
            },
            owner: {
                agent: {phone: cdata(jso.phone)},
                company: jso.company
            },
            mortgage: {term: dicset.reverse('additional_terms', jso.mortgage)},
            estate: {
                location: {
                    string: cdata(jso.address),
                    country: {$: {id: 1}, _: 'Россия'},
                    region: dicset.reverse('region', jso.region),
                    area: dicset.reverse('area', jso.area),
                    city: jso.region == 1 ? dicset.reverse('region', jso.region) : null,
                    district: dicset.reverse('district', jso.district)
                },
                type: {$: {id: jso.estate_type}},
                object: typeof jso.object == 'number' ? {$: {id: jso.object}} : dicset.reverse('object_type', jso.object),
                desc: {text: cdata(jso.desc_text)},
                house: {
                    type: dicset.reverse('house_type', jso.house_type),
                    series: dicset.reverse('house_series', jso.house_series),
                    ready_status: ready[0]
                },
                flat: {
                    space: {
                        total: jso.space_total,
                        living: jso.space_living,
                        kitchen: jso.space_kitchen,
                        desc: cdata(jso.space_desc)
                    },
                    height: jso.height,
                    rooms: {
                        actual: jso.rooms_actual,
                        total: jso.rooms_total
                    },
                    storey: {
                        actual: jso.storey_actual,
                        total: jso.storey_total
                    }
                },
                plot: {
                    purpose: dicset.reverse('plot_purpose_type', jso.plot_purpose),
                    space: jso.plot_space
                },
                commerce: {
                    purpose: {$: {id: jso.commerce_purpose}},
                    space: {total: jso.commerce_space_total},
                    storey: {
                        actual: jso.commerce_storey_actual,
                        total: jso.commerce_storey_total
                    },
                    phonelines: jso.phonelines == '+' ? 1 : (jso.phonelines > 0 ? jso.phonelines: null)
                },
                transport: {
                    metro: {
                        station: metro[1],
                        time: metro[2],
                        type: metro[3]
                    }
                },
                facilities: {
                    bath: dicset.reverse('bath_type', jso.f_bath),
                    sewer: jso.sewer == '+' ? {$: {id: 1}} : null,
                    heating: jso.heating == '+' ? {$: {id: 1}} : null,
                    water: jso.water == '+' ? true : null,
                    electricity: jso.electricity == '+' ? true : null,
                    fridge: jso.fridge == '+' ? true : null,
                    washmachine: jso.washmachine == '+' ? true : null,
                    parking: jso.parking == '+' ? true : null,
                    phone: jso.f_phone == '+' ? true : null,
                    guard: jso.guard == '+' ? true : null,
                    furniture: jso.furniture == '+' ? true : null
                }
            },
            meta: {highlight: jso.highlight == '*' ? 1 : (jso.highlight == '+' ? 2 : null)}
        }

    res = traverse(res).map(function(x){
        if (typeof x === 'undefined' || x === null || x == ''){return this.remove()}
        if (x === true){this.update('true')}
        if (x === false){this.update('false')}
    });
    for (var i = 0; i < 5; i++){res = traverse(res).map(function(x){if (typeof x === 'object' && Object.keys(x).length == 0){ return this.remove()}})}

    /*var ok = true;
    // skip order if mandatory fields are not filled
    if (! res.type.$.id) { ok = false; task.error.fatal(oid, "Missing deal type"); }
    if (! res.estate.type.$.id) { ok = false; task.error.fatal(oid, "Missing estate type"); }
    if (! res.estate.object.$.id) { ok = false; task.error.fatal(oid, "Missing object type"); }
    if (res.estate.commerce && ! res.estate.commerce.purpose.$.id) { ok = false; task.error.fatal(oid, "Missing commercial purpose"); }

    // add order to statistics; do it here because on the upper level there will be no order in case of failure.
    // convert it to XML before because order here is not in xml2js syntax (see comments at https://github.com/vne/rex-format/tree/master/rex-cli)
    var xml = jso2xml({ order: res }, true);
    ok ? task.stat.ok(xml) : task.stat.fail(xml);

    return ok ? xml : undefined;*/

    var err_f = false, err_m = [];
    if (! (res.type && res.type.$ && res.type.$.id)){err_f = true; err_m.push("'deal type'")}
    if (! (res.estate && res.estate.type && res.estate.type.$ && res.estate.type.$.id)){err_f = true; err_m.push("'estate type'")}
    if (! (res.estate && res.estate.object && res.estate.object.$ && res.estate.object.$.id)){err_f = true; err_m.push("'object type'")}
    if (res.estate && res.estate.commerce && ! (res.estate.commerce.purpose && res.estate.commerce.purpose.$ && res.estate.commerce.purpose.$.id)){err_f = true; err_m.push("'commercial purpose'")}

    var xml = jso2xml({ order: res }, true);
    err_f ? task.stat.fail(xml) : task.stat.ok(xml);

    return {result: xml, fatal: err_f, message: err_m};
}

function _rub1Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('type').attr({id: 1});
    rex_order.get('estate').node('object').attr({id: 1});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    if (order[1]){rex_order.get('estate').get('flat').node('rooms').node('total', order[1].split(/\D/)[0])}
    if (order[2]){rex_order.get('estate').get('location').node('district', order[2]).attr({id: dicset.reverse('district', order[2]).$id})}
    if (order[3]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[3] + ']]>')}
    if (order[4]){rex_order.get('estate').get('flat').node('storey').node('actual', order[4].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[4].split('/')[1])}
    if (order[5]){rex_order.get('estate').get('flat').get('space').node('total', order[5])}
    if (order[6]){rex_order.get('estate').get('flat').get('space').node('living', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[7])}
    if (order[8]){
        t1 = order[8].match(/(\D*)(\d*)(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('transport').get('metro').node('station', t1[1].trim()).attr({id: dicset.reverse('metro_station', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('transport').get('metro').node('time', t1[2])}
        if (t1 && t1[3]){rex_order.get('estate').get('transport').get('metro').node('type', t1[3].trim())}//.attr({id: dicset.reverse('after_transport', t1[3].trim()).$id})}
    }
    if (order[9]){}
    if (order[10]){rex_order.get('estate').node('house').node('series', order[10]).attr({id: dicset.reverse('house_series', order[10]).$id})}
    if (order[11]){rex_order.get('estate').node('facilities').node('bath', order[11]).attr({id: dicset.reverse('bath_type', order[11]).$id})}
    if (order[12]){rex_order.get('owner').node('company', order[12])}//.attr({id: dicset.reverse('company', order[12]).$id})}
    if (order[13]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[13] + ']]>')}
    if (order[14]){rex_order.node('price').node('full', order[14])} // ? перевод единиц измерения

    return true;
}

function rub1Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 1,
        region: 1,

        rooms_total: order[1].split(/\D/)[0],
        district: order[2],
        address: order[3],
        storey_actual: order[4].split('/')[0],
        storey_total: order[4].split('/')[1],
        space_total: order[5],
        space_living: order[6].search(/[^\d\.]/) != -1 ? null : order[6],
        space_desc: order[6],
        space_kitchen: order[7],
        metro: order[8],
        f_phone: order[9],
        house_series: order[10],
        f_bath: order[11],
        company: order[12],
        phone: order[13],
        price: order[14],
        price_unit: order[15],
        mortgage: order[16],
        desc_text: order[17],
        highlight: order[18]
    };
    return rubImport(task, order, jso);
}

function _rub2Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 1});
    rex_order.get('estate').node('location').node('region').attr({id: 4700000000000});
    rex_order.get('estate').node('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    if (order[1]){rex_order.get('estate').get('flat').node('rooms').node('total', order[1].split(/\D/)[0])}
    if (order[3]){rex_order.get('estate').get('location').node('area', order[3]).attr({id: dicset.reverse('area', order[3]).$id})}
    if (order[4]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[4] + ']]>')}
    if (order[5]){rex_order.get('estate').get('flat').node('storey').node('actual', order[5].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[5].split('/')[1])}
    if (order[6]){rex_order.get('estate').get('flat').get('space').node('total', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('living', order[7])}
    if (order[8]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[8])}
    if (order[9]){
        t1 = order[9].match(/(\D*)(\d*)([^,]*),?(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('transport').get('metro').node('station', t1[1].trim()).attr({id: dicset.reverse('metro_station', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('transport').get('metro').node('time', t1[2])}
        if (t1 && t1[3]){rex_order.get('estate').get('transport').get('metro').node('type', t1[3].trim())}//.attr({id: dicset.reverse('after_transport', t1[3].trim()).$id})}
        if (t1 && t1[4]){rex_order.get('estate').get('transport').node('railway').node('station', t1[4].trim())}
    }
    if (order[10]){}
    if (order[11]){rex_order.get('estate').node('house').node('series', order[11]).attr({id: dicset.reverse('house_series', order[11]).$id})}
    if (order[12]){rex_order.get('estate').node('facilities').node('bath', order[12]).attr({id: dicset.reverse('bath_type', order[12]).$id})}
    if (order[13]){rex_order.get('owner').node('company', order[13])}//.attr({id: dicset.reverse('company', order[13]).$id})}
    if (order[14]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[14] + ']]>')}
    if (order[15]){rex_order.node('price').node('full', order[15])}

    return true;
}

function rub2Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 1,
        region: 2,

        rooms_total: order[1].split(/\D/)[0],
        area: order[3],
        address: order[4],
        storey_actual: order[5].split('/')[0],
        storey_total: order[5].split('/')[1],
        space_total: order[6],
        space_living: order[7].search(/[^\d\.]/) != -1 ? null : order[7],
        space_desc: order[7],
        space_kitchen: order[8],
        metro: order[9],
        f_phone: order[10],
        house_series: order[11],
        f_bath: order[12],
        company: order[13],
        phone: order[14],
        price: order[15],
        price_unit: order[16],
        mortgage: order[17],
        desc_text: order[18],
        highlight: order[19]
    };
    return rubImport(task, order, jso);
}

function _rub3Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 2});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    if (order[2]){rex_order.get('estate').get('location').node('district', order[2]).attr({id: dicset.reverse('district', order[2]).$id})}
    if (order[3]){rex_order.get('estate').get('flat').node('rooms').node('actual', order[3])}
    if (order[4]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[4] + ']]>')}
    if (order[5]){rex_order.get('estate').get('flat').node('storey').node('actual', order[5].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[5].split('/')[1])}
    if (order[6]){rex_order.get('estate').get('flat').get('space').node('living', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[7])}
    //if (order[8]){rex_order.get('estate').get('flat').get('space').node('total', order[8])}
    if (order[9]){
        t1 = order[9].match(/(\D*)(\d*)(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('transport').get('metro').node('station', t1[1].trim()).attr({id: dicset.reverse('metro_station', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('transport').get('metro').node('time', t1[2])}
        if (t1 && t1[3]){rex_order.get('estate').get('transport').get('metro').node('type', t1[3].trim())}//.attr({id: dicset.reverse('after_transport', t1[3].trim()).$id})}
    }
    if (order[10]){}
    if (order[11]){rex_order.get('estate').node('house').node('series', order[11]).attr({id: dicset.reverse('house_series', order[11]).$id})}
    if (order[12]){rex_order.get('estate').node('facilities').node('bath', order[12]).attr({id: dicset.reverse('bath_type', order[12]).$id})}
    if (order[13]){rex_order.get('owner').node('company', order[13])}//.attr({id: dicset.reverse('company', order[13]).$id})}
    if (order[14]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[14] + ']]>')}
    if (order[15]){rex_order.node('price').node('full', order[15])}

    return true;
}

function rub3Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 2,
        region: 1,

        district: order[2],
        rooms_actual: order[3],
        address: order[4],
        storey_actual: order[5].split('/')[0],
        storey_total: order[5].split('/')[1],
        space_living: order[6].search(/[^\d\.]/) != -1 ? null : order[6],
        space_desc: order[6],
        space_kitchen: order[7],
// !!!
        metro: order[9],
        f_phone: order[10],
        house_series: order[11],
        f_bath: order[12],
        company: order[13],
        phone: order[14],
        price: order[15],
        price_unit: order[16],
        desc_text: order[17],
        highlight: order[18]
    };
    return rubImport(task, order, jso);
}

function _rub4Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 2});
    rex_order.get('estate').node('location').node('region').attr({id: 4700000000000});
    rex_order.get('estate').node('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    if (order[3]){rex_order.get('estate').get('flat').node('rooms').node('actual', order[3])}
    if (order[4]){rex_order.get('estate').get('location').node('area', order[4]).attr({id: dicset.reverse('area', order[4]).$id})}
    if (order[5]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[5] + ']]>')}
    if (order[6]){rex_order.get('estate').get('flat').node('storey').node('actual', order[6].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[6].split('/')[1])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('living', order[7])}
    if (order[8]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[8])}
    //if (order[9]){rex_order.get('estate').get('flat').get('space').node('total', order[9])}
    if (order[10]){
        t1 = order[10].match(/(\D*)(\d*)([^,]*),?(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('transport').get('metro').node('station', t1[1].trim()).attr({id: dicset.reverse('metro_station', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('transport').get('metro').node('time', t1[2])}
        if (t1 && t1[3]){rex_order.get('estate').get('transport').get('metro').node('type', t1[3].trim())}//.attr({id: dicset.reverse('after_transport', t1[3].trim()).$id})}
        if (t1 && t1[4]){rex_order.get('estate').get('transport').node('railway').node('station', t1[4].trim())}
    }
    if (order[11]){}
    if (order[12]){rex_order.get('estate').node('house').node('series', order[12]).attr({id: dicset.reverse('house_series', order[12]).$id})}
    if (order[13]){rex_order.get('estate').node('facilities').node('bath', order[13]).attr({id: dicset.reverse('bath_type', order[13]).$id})}
    if (order[14]){rex_order.get('owner').node('company', order[14])}//.attr({id: dicset.reverse('company', order[13]).$id})}
    if (order[15]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[15] + ']]>')}
    if (order[16]){rex_order.node('price').node('full', order[16])}

    return true;
}

function rub4Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 2,
        region: 2,

        rooms_actual: order[3],
        area: order[4],
        address: order[5],
        storey_actual: order[6].split('/')[0],
        storey_total: order[6].split('/')[1],
        space_living: order[7].search(/[^\d\.]/) != -1 ? null : order[7],
        space_desc: order[7],
        space_kitchen: order[8],
// !!!
        metro: order[10],
        f_phone: order[11],
        house_series: order[12],
        f_bath: order[13],
        company: order[14],
        phone: order[15],
        price: order[16],
        price_unit: order[17],
        desc_text: order[18],
        highlight: order[19]
    };
    return rubImport(task, order, jso);
}

function rub5Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 1,
        region: 1,

        district: order[0],
        rooms_total: order[1],
        address: order[2],
        storey_actual: order[3].split('/')[0],
        storey_total: order[3].split('/')[1],
        space_total: order[4],
        space_living: order[5].search(/[^\d\.]/) != -1 ? null : order[5],
        space_desc: order[5],
        space_kitchen: order[6],
        metro: order[7],
        house_series: order[8],
        f_bath: order[9],
        company: order[10],
        phone: order[11],
        price: order[12],
        price_unit: order[13],
        mortgage: order[14],
        ready: order[15] || 1,
        desc_text: order[16],
        highlight: order[17]
    };
    return rubImport(task, order, jso);
}

function _rub6Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'покупка').attr({id: 1});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 1});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('space');
    //rex_order.get('estate').node('transport').node('metro');
    if (order[1]){
        t1 = order[1].split(' ');
        if (t1.length == 1){
            rex_order.get('estate').get('object').attr({id: 2});
            rex_order.get('estate').get('flat').node('rooms').node('actual', '1');
        }
        else if (t1[1] && t1[1] == 'ккв'){rex_order.get('estate').get('flat').node('rooms').node('total', t1[0].trim())}
        else {
            rex_order.get('estate').get('object').attr({id: 2});
            rex_order.get('estate').get('flat').node('rooms').node('actual', t1[0].trim());
        }
    }
    if (order[2]){
        t1 = order[2].match(/([^,]*),?(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('location').node('district', t1[1].trim()).attr({id: dicset.reverse('district', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + t1[2].trim() + ']]>')}
    }
    if (order[3]){rex_order.get('estate').get('flat').get('space').node('living', order[3])}
    if (order[4]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[4])}
    if (order[5]){}
    if (order[6]){rex_order.get('owner').node('company', order[6])}//.attr({id: dicset.reverse('company', order[12]).$id})}
    if (order[7]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[7] + ']]>')}
    if (order[8]){rex_order.node('price').node('full', order[8])}

    return true;
}

function rub6Import(task, order){
    var jso = {
        type: 1,
        estate_type: 1,
        region: 1,

        space_living: order[3].search(/[^\d\.]/) != -1 ? null : order[3],
        space_desc: order[3],
        space_kitchen: order[4],
        desc_text: order[5],
        company: order[6],
        phone: order[7],
        price: order[8],
        price_unit: order[9],
        highlight: order[10]
    };
    var t1;
    if (order[1]){
        t1 = order[1].split(' ');
        if (t1.length == 1){jso.object = 2; jso.rooms_actual = 1;}
        else if (t1[1] && t1[1] == 'ккв'){jso.object = 1; jso.rooms_total = t1[0];}
        else {jso.object = 2; jso.rooms_actual = t1[0];}
    }
    if (order[2]){
        t1 = order[2].match(/([^,]*),?(.*)/);
        if (t1 && t1[1]){jso.district = t1[1];}
        if (t1 && t1[2]){jso.address = t1[2];}
    }
    return rubImport(task, order, jso);
}

function rub7Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,
        object: 5,
        region: 1,

        district: order[1],
        rooms_total: order[2],
        address: order[3],
        storey_actual: order[4].split('/')[0],
        storey_total: order[4].split('/')[1],
        space_total: order[5],
        space_living: order[6].search(/[^\d\.]/) != -1 ? null : order[6],
        space_desc: order[6],
        space_kitchen: order[7],
        metro: order[8],
        house_series: order[9],
        f_bath: order[10],
        company: order[11],
        phone: order[12],
        price: order[13],
        price_unit: order[14],
        mortgage: order[15],
        ready: order[16],
        desc_text: order[17],
        highlight: order[18]
    };
    return rubImport(task, order, jso);
}

function _rub8Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object')//.attr({id: 1}); ?????????
    rex_order.get('estate').node('location').node('region').attr({id: 4700000000000});
    rex_order.get('estate').node('house');
    rex_order.get('estate').node('flat');
    rex_order.get('estate').node('plot');
    rex_order.get('estate').node('facilities');
    if (order[1]){rex_order.get('estate').get('location').node('area', order[1]).attr({id: dicset.reverse('area', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('object').text(order[2])}
    if (order[3]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[3] + ']]>')}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){rex_order.get('estate').get('plot').node('space', (order[5] * 100).toString())}
    if (order[6]){rex_order.get('estate').get('flat').node('space').node('total', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').node('storey').node('total', order[7])}
    if (order[8]){rex_order.get('estate').get('house').node('type', order[8]).attr({id: dicset.reverse('house_type', order[8]).$id})}
    if (order[9] == '+'){rex_order.get('estate').get('facilities').node('heating', 'true')}// .attr({id: }) ????????????
    if (order[10] == '+'){rex_order.get('estate').get('facilities').node('electricity', 'true')}
    if (order[11] == '+'){rex_order.get('estate').get('facilities').node('water', 'true')}
    if (order[12]){}
    if (order[13]){rex_order.node('price').node('full', order[13])}
    if (order[14]){}
    if (order[15]){rex_order.get('owner').node('company', order[15])}
    if (order[16]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[16] + ']]>')}

    return true;
}

function rub8Import(task, order){
    var jso = {
        type: 2,
        estate_type: 2,
        region: 2,

        area: order[1],
        object: order[2],
        address: order[3],
        plot_purpose: order[4],
        plot_space: order[5] * 100,
        space_total: order[6],
        storey_total: order[7],
        house_type: order[8],
        heating: order[9],
        electricity: order[10],
        water: order[11],
        desc_text: order[12],
        price: order[13],
        price_unit: order[14],
        company: order[15],
        phone: order[16],
        highlight: order[17]
    };
    return rubImport(task, order, jso);
}

function _rub9Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 7});
    rex_order.get('estate').node('location').node('region').attr({id: 4700000000000});
    rex_order.get('estate').node('plot');
    if (order[1]){rex_order.get('estate').get('location').node('area', order[1]).attr({id: dicset.reverse('area', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('plot').node('space', (order[3] * 100).toString())}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){}
    if (order[6]){rex_order.node('price').node('full', order[6])}
    if (order[7]){}
    if (order[8]){rex_order.get('owner').node('company', order[8])}
    if (order[9]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[9] + ']]>')}

    return true;
}

function rub9Import(task, order){
    var jso = {
        type: 2,
        estate_type: 2,
        object: 7,
        region: 2,

        area: order[1],
        address: order[2],
        plot_space: order[3] * 100,
        plot_purpose: order[4],
        desc_text: order[5],
        price: order[6],
        price_unit: order[7],
        company: order[8],
        phone: order[9],
        highlight: order[10]
    };
    return rubImport(task, order, jso);
}

function rub10Import(task, order){
    var jso = {
        type: 1,
        estate_type: 2,
        region: 2,

        object: order[1],
        address: order[2],
        plot_space: order[3] * 100,
        desc_text: order[4],
        price: order[5],
        price_unit: order[6],
        company: order[7],
        phone: order[8],
        highlight: order[9]
    };
    return rubImport(task, order, jso);
}

function _rub11Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8}); // ??? или 9
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('actual', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){}
    if (order[8]){}
    if (order[9]){rex_order.node('price').node('full', order[9])}
    if (order[10]){}
    if (order[11]){rex_order.get('owner').node('company', order[11])}
    if (order[12]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[12] + ']]>')}

    return true;
}

function rub11Import(task, order){
    var jso = {
        type: 2,
        estate_type: 3,
        object: 8,
        region: 1,
        commerce_purpose: 7,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_actual: order[4],
        // вход: order[5],
        // состояние: order[6],
        desc_text: order[7],
        ready: order[8],
        price: order[9],
        price_unit: order[10],
        company: order[11],
        phone: order[12],
        highlight: order[13]
    };
    return rubImport(task, order, jso);
}

function _rub12Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8}); // ??? или 9
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[0] == 'ко'){rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 6})}
    else if (order[0] == 'км'){rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 5})}
    else {rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 7})}
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('actual', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){}
    if (order[8]){rex_order.node('price').node('full', order[8])}
    if (order[9]){}
    if (order[10]){rex_order.get('owner').node('company', order[10])}
    if (order[11]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[11] + ']]>')}

    return true;
}

function rub12Import(task, order){
    var jso = {
        type: 2,
        estate_type: 3,
        object: 8,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_actual: order[4],
        // вход: order[5],
        // состояние: order[6],
        desc_text: order[7],
        price: order[8],
        price_unit: order[9],
        company: order[10],
        phone: order[11],
        highlight: order[12]
    };
    if (order[0] == 'ко'){jso.commerce_purpose = 6}
    else if (order[0] == 'км'){jso.commerce_purpose = 5}
    else {jso.commerce_purpose = 7}
    return rubImport(task, order, jso);
}

function _rub15Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8}); // ??? или 9
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce').node('purpose', order[0]).attr({id: 3});
    rex_order.get('estate').node('facilities');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){}
    if (order[5]){rex_order.get('estate').node('flat').node('height', order[5])}
    if (order[6]){}
    if (order[7] == '+'){rex_order.get('estate').get('facilities').node('electricity', 'true')}
    if (order[8] == '+'){rex_order.get('estate').get('facilities').node('water', 'true')}
    if (order[9] == '+'){rex_order.get('estate').get('facilities').node('heating', 'true')}// .attr({id: }) ????????????
    if (order[10] == '+'){rex_order.get('estate').get('facilities').node('sewer', 'true')}// .attr({id: }) ????????????
    if (order[11]){rex_order.get('estate').node('plot').node('space', order[11])}
    if (order[12]){}
    if (order[13]){rex_order.node('price').node('full', order[13])}
    if (order[14]){}
    if (order[15]){rex_order.get('owner').node('company', order[15])}
    if (order[16]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[16] + ']]>')}

    return true;
}

function rub15Import(task, order){
    var jso = {
        type: 2,
        estate_type: 3,
        object: 8,
        commerce_purpose: 3,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        // подъезд: order[4],
        height: order[5],
        // состояние: order[6],
        electricity: order[7],
        water: order[8],
        heating: order[9],
        sewer: order[10],
        plot_space: order[11],
        desc_text: order[12],
        price: order[13],
        price_unit: order[14],
        company: order[15],
        phone: order[16],
        highlight: order[17]
    };
    return rubImport(task, order, jso);
}

function _rub16Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 9});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('total', order[4])}
    if (order[5]){}
    if (order[6] == '+'){rex_order.get('estate').get('commerce').node('phonelines', 'true')} // ??????????
    if (order[7]){rex_order.get('estate').node('plot').node('space', order[7])}
    if (order[8]){}
    if (order[9]){rex_order.node('price').node('full', order[9])}
    if (order[10]){}
    if (order[11]){rex_order.get('owner').node('company', order[11])}
    if (order[12]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[12] + ']]>')}

    return true;
}

function rub16Import(task, order){
    var jso = {
        type: 2,
        estate_type: 3,
        object: 9,
        commerce_purpose: 7,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_total: order[4],
        // состояние: order[5],
        phonelines: order[6],
        plot_space: order[7],
        desc_text: order[8],
        price: order[9],
        price_unit: order[10],
        company: order[11],
        phone: order[12],
        highlight: order[13]
    };
    return rubImport(task, order, jso);
}

function _rub17Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('type').attr({id: 3});
    rex_order.get('estate').node('object').attr({id: 7});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('plot');
    //rex_order.get('estate').node('commerce');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('plot').node('space', order[3].split(/\D/)[0])} // ??? или commerce.space + перевод единиц измерения
    //if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){}
    if (order[6]){rex_order.node('price').node('full', order[6])}
    if (order[7]){}
    if (order[8]){rex_order.get('owner').node('company', order[8])}
    if (order[9]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[9] + ']]>')}

    return true;
}

function rub17Import(task, order){
    var jso = {
        type: 2,
        estate_type: 3,
        object: 7,
        commerce_purpose: 7,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        plot_purpose: order[4],
        desc_text: order[5],
        price: order[6],
        price_unit: order[7],
        company: order[8],
        phone: order[9],
        highlight: order[10]
    };
    return rubImport(task, order, jso);
}

function rub18Import(task, order){
    var jso = {
        estate_type: 3,
        object: 8,
        commerce_purpose: 7,
        region: 1,

        address: order[1],
        commerce_space_total: order[2],
        desc_text: order[3],
        price: order[4],
        price_unit: order[5],
        company: order[6],
        phone: order[7],
        highlight: order[8]
    };
    if (order[0] == 'кю'){jso.type = 1}
    else {jso.type = 3}
    return rubImport(task, order, jso);
}

function _rub20Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[0]){rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 6})}
    /*else if (order[0] == 'км'){rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 5})}
    else {rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 7})}*/
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('actual', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){rex_order.get('estate').get('commerce').node('phonelines', order[7])}
    if (order[8]){}
    if (order[9]){}
    if (order[10]){}
    if (order[11]){rex_order.node('price').node('full', order[11]); rex_order.get('price').node('rent_period', 'месяц')}
    if (order[12]){}
    if (order[13]){rex_order.get('owner').node('company', order[13])}
    if (order[14]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[14] + ']]>')}

    return true;
}

function rub20Import(task, order){
    var jso = {
        type: 4,
        estate_type: 3,
        object: 8,
        commerce_purpose: 6,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_actual: order[4],
        // вход: order[5],
        // состояние: order[6],
        phonelines: order[7],
        parking: order[8],
        guard: order[9],
        desc_text: order[10],
        price: order[11],
        price_unit: order[12],
        company: order[13],
        phone: order[14],
        highlight: order[15]
    };
    return rubImport(task, order, jso);
}

function _rub21Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[0] == 'КМ'){rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 5})}
    else {rex_order.get('estate').get('commerce').node('purpose', order[0]).attr({id: 7})}
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('actual', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){}
    if (order[8]){rex_order.node('price').node('full', order[8]); rex_order.get('price').node('rent_period', 'месяц')}
    if (order[9]){}
    if (order[10]){rex_order.get('owner').node('company', order[10])}
    if (order[11]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[11] + ']]>')}

    return true;
}

function rub21Import(task, order){
    var jso = {
        type: 4,
        estate_type: 3,
        object: 8,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_actual: order[4],
        // вход: order[5],
        // состояние: order[6],
        desc_text: order[7],
        price: order[8],
        price_unit: order[9],
        company: order[10],
        phone: order[11],
        highlight: order[12]
    };
    if (order[0] == 'КМ'){jso.commerce_purpose = 5}
    else {jso.commerce_purpose = 7}
    return rubImport(task, order, jso);
}

function _rub23Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce').node('purpose', order[0]).attr({id: 3});
    rex_order.get('estate').node('facilities');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){}
    if (order[5]){rex_order.get('estate').node('flat').node('height', order[5])}
    if (order[6]){}
    if (order[7] == '+'){rex_order.get('estate').get('facilities').node('electricity', 'true')}
    if (order[8] == '+'){rex_order.get('estate').get('facilities').node('water', 'true')}
    if (order[9] == '+'){rex_order.get('estate').get('facilities').node('heating', 'true')}// .attr({id: }) ????????????
    if (order[10] == '+'){rex_order.get('estate').get('facilities').node('sewer', 'true')}// .attr({id: }) ????????????
    if (order[11]){}
    if (order[12]){rex_order.node('price').node('full', order[12])}
    if (order[13]){}
    if (order[14]){rex_order.get('owner').node('company', order[14])}
    if (order[15]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[15] + ']]>')}

    return true;
}

function rub23Import(task, order){
    var jso = {
        type: 4,
        estate_type: 3,
        object: 8,
        commerce_purpose: 3,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        // подъезд: order[4],
        height: order[5],
        // состояние: order[6],
        electricity: order[7],
        water: order[8],
        heating: order[9],
        sewer: order[10],
        desc_text: order[11],
        price: order[12],
        price_unit: order[13],
        company: order[14],
        phone: order[15],
        highlight: order[16]
    };
    return rubImport(task, order, jso);
}

function _rub24Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 9});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('total', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){rex_order.node('price').node('full', order[7])}
    if (order[8]){}
    if (order[9]){rex_order.get('owner').node('company', order[9])}
    if (order[10]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[10] + ']]>')}

    return true;
}

function rub24Import(task, order){
    var jso = {
        type: 4,
        estate_type: 3,
        object: 9,
        commerce_purpose: 7,
        region: 1,

        district: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_total: order[4],
        // состояние: order[5],
        desc_text: order[6],
        price: order[7],
        price_unit: order[8],
        company: order[9],
        phone: order[10],
        highlight: order[11]
    };
    return rubImport(task, order, jso);
}

function _rub25Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('type').attr({id: 3});
    rex_order.get('estate').node('object').attr({id: 7});
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('plot');
    //rex_order.get('estate').node('commerce');
    if (order[1]){rex_order.get('estate').get('location').node('district', order[1]).attr({id: dicset.reverse('district', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('plot').node('space', order[3].split(/\D/)[0])} // ??? или commerce.space + перевод единиц измерения
    //if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){}
    if (order[6]){rex_order.node('price').node('full', order[6])}
    if (order[7]){}
    if (order[8]){rex_order.get('owner').node('company', order[8])}
    if (order[9]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[9] + ']]>')}

    return true;
}

function rub25Import(task, order){
    var jso = {
        type: 4,
        estate_type: 3,
        object: 7,
        commerce_purpose: 7,
        region: 1,

        district: order[1],
        address: order[2],
        plot_space: order[3],
        plot_purpose: order[4],
        desc_text: order[5],
        price: order[6],
        price_unit: order[7],
        company: order[8],
        phone: order[9],
        highlight: order[10]
    };
    return rubImport(task, order, jso);
}

function _rub26Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 4});
    rex_order.node('owner');
    rex_order.node('estate').node('object');
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('rooms');
    rex_order.get('estate').get('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    rex_order.get('estate').node('facilities');
    if (order[1]){}
    if (order[2]){
        if (order[2].search(/ккв$/) != -1){
            rex_order.get('estate').get('object').attr({id: 1});
            rex_order.get('estate').get('flat').get('rooms').node('total', order[2].split(/\D/)[0])
        }
        else if (order[2].search(/к\//) != -1){
            rex_order.get('estate').get('object').attr({id: 2});
            rex_order.get('estate').get('flat').get('rooms').node('actual', order[2].split(/к\//)[0])
            rex_order.get('estate').get('flat').get('rooms').node('total', order[2].split(/к\//)[1])
        }
        else if (order[2] == 'дом'){rex_order.get('estate').get('object').attr({id: 3})} // ???????
        else {rex_order.get('estate').get('object').attr({id: 6})}
    }
    if (order[3]){rex_order.get('estate').get('location').node('district', order[3]).attr({id: dicset.reverse('district', order[3]).$id})}
    if (order[4]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[4] + ']]>')}
    if (order[5]){rex_order.get('estate').get('flat').node('storey').node('actual', order[5].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[5].split('/')[1])}
    if (order[6]){rex_order.get('estate').get('flat').get('space').node('total', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('living', order[7])}
    if (order[8]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[8])}
    if (order[9]){}
    if (order[10]){}
    if (order[11] == '+'){rex_order.get('estate').get('facilities').node('fridge', 'true')}
    if (order[12] == '+'){rex_order.get('estate').get('facilities').node('washmachine', 'true')}
    if (order[13]){
        t1 = order[13].match(/(\D*)(\d*)(.*)/);
        if (t1 && t1[1]){rex_order.get('estate').get('transport').get('metro').node('station', t1[1].trim()).attr({id: dicset.reverse('metro_station', t1[1].trim()).$id})}
        if (t1 && t1[2]){rex_order.get('estate').get('transport').get('metro').node('time', t1[2])}
        if (t1 && t1[3]){rex_order.get('estate').get('transport').get('metro').node('type', t1[3].trim())}//.attr({id: dicset.reverse('after_transport', t1[3].trim()).$id})}
    }
    if (order[14]){rex_order.node('price').node('full', order[14])}
    if (order[15]){}
    if (+order[16]){rex_order.node('rent').node('term', order[16])} // ??????????
    if (order[17]){rex_order.get('owner').node('company', order[17])}
    if (order[18]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[18] + ']]>')}

    return true;
}

function rub26Import(task, order){
    var jso = {
        type: 4,
        estate_type: 1,
        region: 1,

// : order[1],
        district: order[3],
        address: order[4],
        storey_actual: order[5].split('/')[0],
        storey_total: order[5].split('/')[1],
        space_total: order[6],
        space_living: order[7].search(/[^\d\.]/) != -1 ? null : order[7],
        space_desc: order[7],
        space_kitchen: order[8],
        f_phone: order[9],
        furniture: order[10],
        fridge: order[11],
        washmachine: order[12],
        metro: order[13],
        price: order[14],
        price_unit: order[15],
// : order[16],
        company: order[17],
        phone: order[18],
        desc_text: order[19],
        highlight: order[20]
    };
    if (order[2].search(/ккв$/) != -1){
        jso.object = 1;
        jso.rooms_total = order[2].split(/\D/)[0];
    }
    else if (order[2].search(/к\//) != -1){
        jso.object = 2;
        jso.rooms_actual = order[2].split(/к\//)[0];
        jso.rooms_total = order[2].split(/к\//)[1];
    }
    else if (order[2] == 'дом'){jso.object = 3}
    else {jso.object = 6}
    return rubImport(task, order, jso);
}

function _rub27Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 3});
    rex_order.node('owner');
    rex_order.node('estate').node('object');
    rex_order.get('estate').node('location').node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('rooms');
    rex_order.get('estate').node('facilities');
    if (order[1]){}
    if (order[2]){
        if (order[2].search(/ккв$/) != -1){
            rex_order.get('estate').get('object').attr({id: 1});
            rex_order.get('estate').get('flat').get('rooms').node('total', order[2].split(/\D/)[0])
        }
        else if (order[2].search('комн') != -1){
            rex_order.get('estate').get('object').attr({id: 2});
            rex_order.get('estate').get('flat').get('rooms').node('actual', order[2].split(/\D/)[0])
        }
        else if (order[2] == 'дом'){rex_order.get('estate').get('object').attr({id: 3})} // ???????
        else {rex_order.get('estate').get('object').attr({id: 6})}
    }
    if (order[3]){rex_order.get('estate').get('location').node('district', order[3]).attr({id: dicset.reverse('district', order[3]).$id})}
    if (order[4]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[4] + ']]>')}
    if (order[5]){}
    if (order[6]){}
    if (order[7] == '+'){rex_order.get('estate').get('facilities').node('fridge', 'true')}
    if (order[8] == '+'){rex_order.get('estate').get('facilities').node('washmachine', 'true')}
    if (order[9]){rex_order.node('price').node('full', order[9])}
    if (order[10]){}
    if (+order[11]){rex_order.node('rent').node('term', order[11])} // ??????????
    if (order[12]){rex_order.get('owner').node('company', order[12])}
    if (order[13]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[13] + ']]>')}

    return true;
}

function rub27Import(task, order){
    var jso = {
        type: 3,
        estate_type: 1,
        region: 1,

// : order[1],
        district: order[3],
        address: order[4],
        f_phone: order[5],
        furniture: order[6],
        fridge: order[7],
        washmachine: order[8],
        price: order[9],
        price_unit: order[10],
// : order[11],
        company: order[12],
        phone: order[13],
        desc_text: order[14],
        highlight: order[15]
    };
    if (order[2].search(/ккв$/) != -1){
        jso.object = 1;
        jso.rooms_total = order[2].split(/\D/)[0];
    }
    else if (order[2].search(/комн$/) != -1){
        jso.object = 2;
        jso.rooms_actual = order[2].split(/\D/)[0];
    }
    else if (order[2] == 'дом'){jso.object = 3}
    else {jso.object = 6}
    return rubImport(task, order, jso);
}

function _rub28Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object');
    rex_order.get('estate').node('location');//.node('region').attr({id: 7800000000000});
    rex_order.get('estate').node('flat').node('rooms');
    rex_order.get('estate').get('flat').node('space');
    rex_order.get('estate').node('transport').node('metro');
    rex_order.get('estate').node('facilities');
    if (order[0]){}
    if (order[1]){
        if (order[1].search(/ккв$/) != -1){
            rex_order.get('estate').get('object').attr({id: 1});
            rex_order.get('estate').get('flat').get('rooms').node('total', order[1].split(/\D/)[0])
        }
        else if (order[1].search(/комн$/) != -1){
            rex_order.get('estate').get('object').attr({id: 2});
            rex_order.get('estate').get('flat').get('rooms').node('actual', order[1].split(/\D/)[0])
            //rex_order.get('estate').get('flat').get('rooms').node('total', order[1].split(/\D/)[1])
        }
    }
    //if (order[2]){rex_order.get('estate').get('location').node('district', order[2]).attr({id: dicset.reverse('district', order[2]).$id})}
    if (order[3]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[3] + ']]>')}
    if (order[4]){rex_order.get('estate').get('flat').node('storey').node('actual', order[4].split('/')[0]); rex_order.get('estate').get('flat').get('storey').node('total', order[4].split('/')[1])}
    if (order[5]){rex_order.get('estate').get('flat').get('space').node('total', order[5])}
    if (order[6]){rex_order.get('estate').get('flat').get('space').node('living', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').get('space').node('kitchen', order[7])}
    if (order[8]){}
    if (order[9]){rex_order.get('estate').node('house').node('series', order[9]).attr({id: dicset.reverse('house_series', order[9]).$id})}
    if (order[10]){rex_order.get('estate').node('facilities').node('bath', order[10]).attr({id: dicset.reverse('bath_type', order[10]).$id})}
    if (order[11]){rex_order.get('owner').node('company', order[11])}
    if (order[12]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[12] + ']]>')}
    if (order[13]){rex_order.node('price').node('full', order[13])}

    return true;
}

function rub28Import(task, order){
    var jso = {
        type: 2,
        estate_type: 1,

        region: order[2],
        address: order[3],
        storey_actual: order[4].split('/')[0],
        storey_total: order[4].split('/')[1],
        space_total: order[5],
        space_living: order[6].search(/[^\d\.]/) != -1 ? null : order[6],
        space_desc: order[6],
        space_kitchen: order[7],
        f_phone: order[8],
        house_series: order[9],
        f_bath: order[10],
        company: order[11],
        phone: order[12],
        price: order[13],
        price_unit: order[14],
        desc_text: order[15],
        highlight: order[16]
    };
    if (order[1].search(/ккв$/) != -1){
        jso.object = 1;
        jso.rooms_total = order[1].split(/\D/)[0];
    }
    else if (order[1].search(/комн$/) != -1){
        jso.object = 2;
        jso.rooms_actual = order[1].split(/\D/)[0];
    }
    return rubImport(task, order, jso);
}

function _rub29Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object')//.attr({id: 1}); ?????????
    rex_order.get('estate').node('location').node('region')//.attr({id: 4700000000000});
    rex_order.get('estate').node('house');
    rex_order.get('estate').node('flat');
    rex_order.get('estate').node('plot');
    rex_order.get('estate').node('facilities');
    if (order[1]){rex_order.get('estate').get('object').text(order[1])}
    if (order[2]){rex_order.get('estate').get('location').node('area', order[2]).attr({id: dicset.reverse('area', order[2]).$id})}
    if (order[3]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[3] + ']]>')}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){rex_order.get('estate').get('plot').node('space', (order[5] * 100).toString())}
    if (order[6]){rex_order.get('estate').get('flat').node('space').node('total', order[6])}
    if (order[7]){rex_order.get('estate').get('flat').node('storey').node('total', order[7])}
    if (order[8]){rex_order.get('estate').get('house').node('type', order[8]).attr({id: dicset.reverse('house_type', order[8]).$id})}
    if (order[9] == '+'){rex_order.get('estate').get('facilities').node('heating', 'true')}// .attr({id: }) ????????????
    if (order[10] == '+'){rex_order.get('estate').get('facilities').node('electricity', 'true')}
    if (order[11] == '+'){rex_order.get('estate').get('facilities').node('water', 'true')}
    if (order[12]){}
    if (order[13]){rex_order.node('price').node('full', order[13])}
    if (order[14]){}
    if (order[15]){rex_order.get('owner').node('company', order[15])}
    if (order[16]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[16] + ']]>')}

    return true;
}

function rub29Import(task, order){
    var jso = {
        type: 2,
        estate_type: 2,

        object: order[1],
        region: order[2],
        address: order[3],
        plot_purpose: order[4],
        plot_space: order[5] * 100,
        space_total: order[6],
        storey_total: order[7],
        house_type: order[8],
        heating: order[9],
        electricity: order[10],
        water: order[11],
        desc_text: order[12],
        price: order[13],
        price_unit: order[14],
        company: order[15],
        phone: order[16],
        highlight: order[17]
    };
    return rubImport(task, order, jso);
}

function _rub30Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type', 'продажа').attr({id: 2});
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 7});
    rex_order.get('estate').node('location').node('region')//.attr({id: 4700000000000});
    rex_order.get('estate').node('plot');
    if (order[1]){rex_order.get('estate').get('location').node('area', order[1]).attr({id: dicset.reverse('area', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('plot').node('space', (order[3] * 100).toString())}
    if (order[4]){rex_order.get('estate').get('plot').node('purpose', order[4]).attr({id: dicset.reverse('plot_purpose_type', order[4]).$id})}
    if (order[5]){}
    if (order[6]){rex_order.node('price').node('full', order[6])}
    if (order[7]){}
    if (order[8]){rex_order.get('owner').node('company', order[8])}
    if (order[9]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[9] + ']]>')}

    return true;
}

function rub30Import(task, order){
    var jso = {
        type: 2,
        estate_type: 2,
        object: 7,

        region: order[1],
        address: order[2],
        plot_space: order[3] * 100,
        plot_purpose: order[4],
        desc_text: order[5],
        price: order[6],
        price_unit: order[7],
        company: order[8],
        phone: order[9],
        highlight: order[10]
    };
    return rubImport(task, order, jso);
}

function _rub31Import(task, order){

    var dic, t1;
    var rex_order = rex_doc.get('orders').node('order');

    rex_order.node('type');
    rex_order.node('owner');
    rex_order.node('estate').node('object').attr({id: 8}); // ??? или 9
    rex_order.get('estate').node('location').node('region')//.attr({id: 7800000000000});
    rex_order.get('estate').node('commerce');
    if (order[0] == 'рк'){rex_order.get('type').attr({id: 2})} // ???????? не тот индекс
    else {rex_order.get('type').attr({id: 4})}
    if (order[1]){rex_order.get('estate').get('location').node('area', order[1]).attr({id: dicset.reverse('area', order[1]).$id})}
    if (order[2]){rex_order.get('estate').get('location').node('string', '<![CDATA[' + order[2] + ']]>')}
    if (order[3]){rex_order.get('estate').get('commerce').node('space').node('total', order[3])}
    if (order[4]){rex_order.get('estate').get('commerce').node('storey').node('actual', order[4])}
    if (order[5]){}
    if (order[6]){}
    if (order[7]){}
    if (order[8]){rex_order.node('price').node('full', order[8])}
    if (order[9]){}
    if (order[10]){rex_order.get('owner').node('company', order[10])}
    if (order[11]){rex_order.get('owner').node('agent').node('phone', '<![CDATA[' + order[11] + ']]>')}

    return true;
}

function rub31Import(task, order){
    var jso = {
        estate_type: 3,
        object: 8,
        commerce_purpose: 7,

        region: order[1],
        address: order[2],
        commerce_space_total: order[3],
        commerce_storey_actual: order[4],
        // вход: order[5],
        // состояние: order[6],
        desc_text: order[7],
        price: order[8],
        price_unit: order[9],
        company: order[10],
        phone: order[11],
        highlight: order[12]
    };
    if (order[0] == 'рк'){jso.type = 2}
    else {jso.type = 4}
    return rubImport(task, order, jso);
}

function rub33Import(task, order){
}