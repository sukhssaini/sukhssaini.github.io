(function(){

    var applicationarr = [];

    var getPartNumberFromQuery = function() {
        var params = (new URL(document.location)).searchParams;
        var partNumber = params.get('part_number');
        return partNumber;
    }

    var getElementOrValue = function (id, value = false) {
        var element = document.getElementById(id);
        return value ? element.value : element;
    }

    var setImage = function(partNumber){
        var link = "./images/{partNumber}.jpg";
        link = link.replace("{partNumber}", partNumber);
        var image = getElementOrValue("image");
        image.src = link;
    }


    var validatePartNumber = function(partNumber) {
            
            if (!partNumber || typeof(partNumber) != 'string') {
                console.log('part number not valid : ' + partNumber)
                return null;
            }
            
            partNumber = partNumber.toUpperCase();
            partNumber = partNumber.trim();
            return partNumber;
            
    }

    var selector = function(element) {
        return element.part_number == this;
    }
        
    var getPart = function (partNumber) {
            
            if(!validatePartNumber(partNumber)) {
                return null
            }
            
            if(!database.length) {
                console.log("no elements to look in")
                return null;
            }
            
            var result = database.filter(selector, partNumber)

            if (result.length > 1) {
                console.info("More than one part found")
                console.info(result)
            }

            return result[0];
    }

    var processor = function() {

        var partNumber = getPartNumberFromQuery();
        var part = getPart(partNumber);
        
        setImage(partNumber);

        console.log(part)

        if (part.application) {
            part.application.forEach(arrayOfObjectToArray);
        }
        
        displayInformation(part)

        $('#example').DataTable({
    
            data : applicationarr,
            pageLength :  50
        });
    }

    var arrayOfObjectToArray = function(e) {
        var arr = []
        arr.push(e.year)
        arr.push(e.make)
        arr.push(e.model)
        applicationarr.push(arr)
    }

    var displayInformation = function (part){
        var partNumber = document.getElementById("partNumber");
        var partName = document.getElementById("partName");
        var partPrice = document.getElementById("partPrice");
        var partComments = document.getElementById("partComments");

        partNumber.innerText = part.part_number
        partName.innerText = part.name
        partPrice.innerText = part.price
        partComments.innerHTML = part.comments.join("<br>")

        console.info(part.comments)

    }

    processor()
})()