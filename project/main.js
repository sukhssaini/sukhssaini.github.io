
var database_arr = []
var year_set = new Set()
var make_set = new Set()
var years = []
var makes = []
var model_dict = {}
var table = null;

var processor = function(e) {
    var arr = []
    arr.push(e.part_number)
    arr.push(e.name)
    arr.push(e.price)
    database_arr.push(arr)
}

var search_data_organizer2 = function () {
    database.forEach(function(product){
        var application = product.application;
        
        application.forEach(function(element){
            dic_check_update2(element.year, element.make, element.model)
        })
    });
}

var dic_check_update2 = function(year, make, model) {

    
    if(!model_dict.hasOwnProperty(year)) {
       model_dict[year] = {} 
    }

    if(!model_dict[year].hasOwnProperty(make)) {
        model_dict[year][make] = []
    }
    
    model_dict[year][make].push(model)
}



var search_data_organizer = function() {

    database.forEach(function(product){
        var application = product.application;
        
        application.forEach(function(element){
            year_set.add(element.year)
            make_set.add(element.make)
            dic_check_update(element.make, element.model)
        })
    });

}

var search_data_sorter = function() {
    search_data_organizer()
    years = [...year_set];
    // models = [...model_set]
    makes = [...make_set]

    // sorting data
    years.sort();
    // models.sort();
    makes.sort();

}

$(document).ready(function() {
    database.forEach(processor);
    
    add_options();

    table  = $('#example').DataTable({
        data : database_arr,
        pageLength :  50,
        "columnDefs": [ 
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return '<a href="./information.html?part_number='+ data +'">' + data + '</a>';
                },
                "targets": 0
            }
        ]
    });

} );


var dic_check_update = function(name, value) {

    // check if the array doesn't exists create array
    if(!model_dict.hasOwnProperty(name)) {
       model_dict[name] = [] 
    }
    
    if (model_dict[name].indexOf(value) < 0) {
        model_dict[name].push(value)
    }


}

var add_options = function() {
    
    search_data_sorter()
    

    var year_select = document.getElementById('years')
    var make_select = document.getElementById('makes')
    var model_select = document.getElementById('models')



    var year_options = create_options(years)
    var make_options = create_options(makes)


    year_options.forEach(function(option){
        year_select.add(option, undefined)
    })

    make_options.forEach(function(option){
        make_select.add(option, undefined)
    })

    appendEventToMakes(make_select);
    model_select.onchange = process_data;

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

var appendEventToMakes = function(ele) {

    ele.onchange = function (event) {

        var model_select = document.getElementById('models');

        while(model_select.options.length!=0) {
            model_select.remove(0, undefined);
        }

        var value = event.srcElement.value;
        var models = model_dict[value];


        var model_options = create_options(models)
        model_options.forEach(function(option){
            model_select.add(option) 
        })
    }
}

var process_data = function () {
    var year_select = document.getElementById('years')
    var make_select = document.getElementById('makes')
    var model_select = document.getElementById('models')

    console.log(year_select.value)
    console.log(model_select.value)
    console.log(make_select.value)

    find_parts(year_select.value, make_select.value, model_select.value);
}

var find_parts = function (year, make, model) {
    var info =  JSON.stringify({
        year : year,
        make : make,
        model : model
    })

    console.log(info)

    var a = []

    database.forEach(function (element) {
        var exists = false
        element.application.filter(function (app) {
            exists = (JSON.stringify(app) == info) || exists
        });
        if(exists) {
            a.push(element.part_number)
        }
    });

    console.log(a)

    a = a.join("|");

    a = a || "n/a";

    table.search(a, true, false).draw();

}