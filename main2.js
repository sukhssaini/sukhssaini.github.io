
var database_arr = []
var year_set = new Set()
var make_set = new Set()
var years = []
var makes = []
var model_dict = {}
var table = null;

var YEAR_ID = "years"
var MAKE_ID = "makes"
var MODEL_ID = "models"

var processor = function(e) {
    var arr = []
    arr.push(e.part_number)
    arr.push(e.name)
    arr.push(e.price)
    database_arr.push(arr)
}

var search_data_organizer = function () {
    database.forEach(function(product){
        var application = product.application;
        
        application.forEach(function(element){
            dic_check_update(element.year, element.make, element.model)
        })
    });
}

var dic_check_update = function(year, make, model) {

    if(!model_dict.hasOwnProperty(year)) {
       model_dict[year] = {} 
    }

    if(!model_dict[year].hasOwnProperty(make)) {
        model_dict[year][make] = []
    }
    
    model_dict[year][make].push(model)
}

var search_data_sorter = function() {
    search_data_organizer()
    years = Object.keys(model_dict);
    years.sort();
}

$(document).ready(function() {
    database.forEach(processor);
    
    add_options();

    table  = $('#example').DataTable({
        data : database_arr,
        pageLength :  50,
        "columnDefs": [ 
            {
                "render": function ( data, type, row ) {
                    return '<a href="./information.html?part_number='+ data +'">' + data + '</a>';
                },
                "targets": 0
            }
        ]
    });

} );

var add_options = function() {
    
    search_data_sorter()
    
    var year_select = getElementOrValue(YEAR_ID, false)
    var make_select = getElementOrValue(MAKE_ID, false)
    var model_select = getElementOrValue(MODEL_ID, false)

    var year_options = create_options(years)
    year_options.forEach(function(option){
        year_select.add(option, undefined)
    })

    year_select.onchange =  yearEvent;
    make_select.onchange =  makeEvent;
    model_select.onchange = process_data;
    model_select.onclick = process_data;

    dispatchEvent(year_select)
}

var yearEvent = function (ele) {
    var make_select = getElementOrValue(MAKE_ID, false)
    var value = event.srcElement.value;
    var makes = Object.keys(model_dict[value]);
    var make_options = create_options(makes)

    removeOptions(make_select)
    addOptions(make_select, make_options)
    dispatchEvent(make_select)
}

var makeEvent = function(ele) {

    var model_select = getElementOrValue(MODEL_ID, false)
    var year_value = getElementOrValue(YEAR_ID, true)
    var value = event.srcElement.value;
    var models = model_dict[year_value][value];
    var model_options = create_options(models)

    removeOptions(model_select)
    addOptions(model_select, model_options)
}

var process_data = function () {
    var year_select = document.getElementById('years')
    var make_select = document.getElementById('makes')
    var model_select = document.getElementById('models')
    find_parts(year_select.value, make_select.value, model_select.value);
}

var find_parts = function (year, make, model) {
    var info =  JSON.stringify({
        year : year,
        make : make,
        model : model
    })
    
    var elementList = []

    database.forEach(function (element) {
        var exists = false
        element.application.filter(function (app) {
            exists = (JSON.stringify(app) == info) || exists
        });
        if(exists) {
            elementList.push(element.part_number)
        }
    });

    elementList = elementList.join("|");
    elementList = elementList || "n/a";
    table.search(elementList, true, false).draw();
}

var getElementOrValue = function (id, value = false) {
    var element = document.getElementById(id);
    return value ? element.value : element;
}

var removeOptions = function (element) {
    while(element.options.length!=0) {
        element.remove(0, undefined);
    }
}

var addOptions = function (element, options) {

    options.forEach(function(option){
        element.add(option) 
    })

}

var create_options = function(elements) {
    
    var options = []
    elements.forEach(function(element){
        var option = document.createElement('option')
        option.text = element
        option.value = element
        options.push(option)
    })

    return options
}

var dispatchEvent = function (element, clickEvent = false) {
    element.dispatchEvent(new Event('change'));
}